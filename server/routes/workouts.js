const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/workouts
 * @desc    Save a completed workout
 * @access  Private
 */
router.post(
  '/',
  protect,
  [
    body('type').isIn(['A', 'B', 'C']).withMessage('Workout type must be A, B, or C'),
    body('timestamp').optional().isISO8601().withMessage('Invalid date format'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { type, timestamp } = req.body;

      // Create workout object
      const workoutData = {
        type,
        timestamp: timestamp || new Date(),
      };

      // Add to user's workouts
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $push: { workouts: workoutData } },
        { new: true }
      ).select('workouts');

      res.status(201).json({
        success: true,
        workout: workoutData,
        workouts: user.workouts,
      });
    } catch (error) {
      console.error('Save workout error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error saving workout',
      });
    }
  }
);

/**
 * @route   GET /api/workouts
 * @desc    Get all user workouts
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('workouts');
    
    // Sort workouts by timestamp (most recent first)
    const workouts = [...user.workouts].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    res.json({
      success: true,
      workouts,
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching workouts',
    });
  }
});

/**
 * @route   GET /api/workouts/stats
 * @desc    Get workout statistics
 * @access  Private
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('workouts');
    
    // Calculate workout statistics
    const stats = {
      total: user.workouts.length,
      A: user.workouts.filter(w => w.type === 'A').length,
      B: user.workouts.filter(w => w.type === 'B').length,
      C: user.workouts.filter(w => w.type === 'C').length,
    };
    
    // Calculate weekly stats
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    
    const thisWeek = user.workouts.filter(w => 
      new Date(w.timestamp) >= startOfWeek
    ).length;
    
    const lastWeek = user.workouts.filter(w => 
      new Date(w.timestamp) >= startOfLastWeek && 
      new Date(w.timestamp) < startOfWeek
    ).length;
    
    stats.thisWeek = thisWeek;
    stats.lastWeek = lastWeek;
    
    // Calculate streak
    const workoutDays = {};
    user.workouts.forEach(workout => {
      const workoutDate = new Date(workout.timestamp);
      workoutDate.setHours(0, 0, 0, 0);
      const dateKey = workoutDate.toISOString().split('T')[0];
      workoutDays[dateKey] = true;
    });
    
    const sortedDays = Object.keys(workoutDays).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    let currentStreak = 0;
    if (sortedDays.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayKey = today.toISOString().split('T')[0];
      const yesterdayKey = new Date(today.getTime() - 86400000).toISOString().split('T')[0];
      
      // Check if most recent workout was today or yesterday to maintain streak
      if (sortedDays[0] === todayKey || sortedDays[0] === yesterdayKey) {
        currentStreak = 1;
        // Count consecutive days
        for (let i = 1; i < sortedDays.length; i++) {
          const currentDay = new Date(sortedDays[i-1]);
          const prevDay = new Date(sortedDays[i]);
          
          const diffTime = currentDay.getTime() - prevDay.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          
          if (diffDays <= 2) { // Allow for 1 day gap
            currentStreak++;
          } else {
            break;
          }
        }
      } else {
        currentStreak = 1; // Streak is just 1 if latest workout wasn't recent
      }
    }
    
    stats.currentStreak = currentStreak;
    
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get workout stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching workout statistics',
    });
  }
});

module.exports = router; 
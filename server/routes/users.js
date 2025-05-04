const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Measurement = require('../models/Measurement');

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', auth, async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      recoveryNotes,
      reminders,
      trainingPhase,
      weight,
      weightUnit,
      height,
      heightUnit,
      measurements,
      measurementUnit,
      isOnboardingComplete
    } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (recoveryNotes !== undefined) profileFields.recoveryNotes = recoveryNotes;
    if (reminders !== undefined) profileFields.reminders = reminders;
    if (trainingPhase) profileFields.trainingPhase = trainingPhase;
    if (weight !== undefined) profileFields.weight = weight;
    if (weightUnit) profileFields.weightUnit = weightUnit;
    if (height !== undefined) profileFields.height = height;
    if (heightUnit) profileFields.heightUnit = heightUnit;
    if (measurements) profileFields.measurements = measurements;
    if (measurementUnit) profileFields.measurementUnit = measurementUnit;
    if (isOnboardingComplete !== undefined) profileFields.isOnboardingComplete = isOnboardingComplete;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true } // Return the updated document
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/users/measurements
 * @desc    Add measurement history
 * @access  Private
 */
router.post('/measurements', auth, async (req, res) => {
  try {
    const { measurements, weight, weightUnit, measurementUnit } = req.body;

    const newMeasurement = new Measurement({
      user: req.user.id,
      measurements,
      weight,
      weightUnit,
      measurementUnit
    });

    const measurement = await newMeasurement.save();
    res.status(201).json(measurement);
  } catch (error) {
    console.error('Add measurement error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/users/measurements
 * @desc    Get all measurements for a user
 * @access  Private
 */
router.get('/measurements', auth, async (req, res) => {
  try {
    const measurements = await Measurement.find({ user: req.user.id }).sort({ date: -1 });
    res.json(measurements);
  } catch (error) {
    console.error('Get measurements error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
import React, { useState, useEffect } from 'react';

// Helper function to format timestamp
const formatTimestamp = (isoString) => {
  if (!isoString) return 'Invalid Date';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid Date';
  }
};

// Helper to get day name
const getDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Get weeks for grouping workouts
const getWeekStart = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  const diff = date.getDate() - day;
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

// Format week range for display
const formatWeekRange = (weekStart) => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const options = { month: 'short', day: 'numeric' };
  return `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
};

function Progress() {
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'stats'
  const [workoutStats, setWorkoutStats] = useState({ A: 0, B: 0, C: 0, total: 0 });
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const storedWorkouts = JSON.parse(localStorage.getItem('workoutsDone') || '[]');
    // Sort workouts by timestamp, most recent first
    storedWorkouts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setCompletedWorkouts(storedWorkouts);
    
    // Calculate stats
    const stats = storedWorkouts.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + 1;
      acc.total++;
      return acc;
    }, { A: 0, B: 0, C: 0, total: 0 });
    setWorkoutStats(stats);
    
    // Group by week for chart
    const weekGroups = {};
    storedWorkouts.forEach(workout => {
      const weekStart = getWeekStart(workout.timestamp);
      const weekKey = weekStart.toISOString();
      
      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = {
          weekStart,
          workouts: { A: 0, B: 0, C: 0, total: 0 }
        };
      }
      
      weekGroups[weekKey].workouts[workout.type]++;
      weekGroups[weekKey].workouts.total++;
    });
    
    // Convert to array and sort by date
    const weeklyDataArray = Object.values(weekGroups);
    weeklyDataArray.sort((a, b) => b.weekStart - a.weekStart);
    setWeeklyData(weeklyDataArray.slice(0, 4)); // Show last 4 weeks
  }, []);
  
  // Calculate streak
  const calculateStreak = () => {
    if (completedWorkouts.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get unique days with workouts
    const workoutDays = {};
    completedWorkouts.forEach(workout => {
      const workoutDate = new Date(workout.timestamp);
      workoutDate.setHours(0, 0, 0, 0);
      const dateKey = workoutDate.toISOString().split('T')[0];
      workoutDays[dateKey] = true;
    });
    
    const sortedDays = Object.keys(workoutDays).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    if (sortedDays.length === 0) return 0;
    
    // Check if most recent workout was today
    const mostRecentDay = new Date(sortedDays[0]);
    const todayKey = today.toISOString().split('T')[0];
    const yesterdayKey = new Date(today.getTime() - 86400000).toISOString().split('T')[0];
    
    // If most recent workout wasn't today or yesterday, streak is 1
    if (sortedDays[0] !== todayKey && sortedDays[0] !== yesterdayKey) {
      return 1;
    }
    
    // Count consecutive days
    let currentStreak = 1;
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
    
    return currentStreak;
  };

  return (
    <div className="p-4 bg-brand-beige min-h-full">
      <h1 className="text-2xl font-bold text-brand-pink-dark mb-4">Progress Tracking</h1>
      
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-pink-600">{workoutStats.total}</div>
          <div className="text-sm text-gray-500">Total Workouts</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-pink-600">{calculateStreak()}</div>
          <div className="text-sm text-gray-500">Day Streak</div>
        </div>
      </div>
      
      {/* Workout Type Breakdown */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Workout Breakdown</h2>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Workout A</span>
          <span className="text-sm font-medium text-gray-700">{workoutStats.A}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(workoutStats.A / Math.max(workoutStats.total, 1)) * 100}%` }}></div>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Workout B</span>
          <span className="text-sm font-medium text-gray-700">{workoutStats.B}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(workoutStats.B / Math.max(workoutStats.total, 1)) * 100}%` }}></div>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Workout C</span>
          <span className="text-sm font-medium text-gray-700">{workoutStats.C}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(workoutStats.C / Math.max(workoutStats.total, 1)) * 100}%` }}></div>
        </div>
      </div>
      
      {/* Weekly Progress Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Weekly Progress</h2>
        {weeklyData.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No weekly data available yet</p>
        ) : (
          <div className="space-y-3">
            {weeklyData.map((week, index) => (
              <div key={index} className="border-b pb-2 last:border-b-0">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {formatWeekRange(week.weekStart)}
                </p>
                <div className="flex h-8 w-full rounded-md overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${(week.workouts.A / Math.max(week.workouts.total, 1)) * 100}%` }}></div>
                  <div className="bg-green-500 h-full" style={{ width: `${(week.workouts.B / Math.max(week.workouts.total, 1)) * 100}%` }}></div>
                  <div className="bg-purple-500 h-full" style={{ width: `${(week.workouts.C / Math.max(week.workouts.total, 1)) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Total: {week.workouts.total}</span>
                  <div className="flex gap-2">
                    <span className="text-blue-600">A: {week.workouts.A}</span>
                    <span className="text-green-600">B: {week.workouts.B}</span>
                    <span className="text-purple-600">C: {week.workouts.C}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workout History */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Workouts</h2>
        {completedWorkouts.length === 0 ? (
          <div className="text-center text-gray-600 p-4">
            <p>No workouts completed yet.</p>
            <p>Start your fitness journey today!</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {completedWorkouts.slice(0, 10).map((workout, index) => (
              <li key={index} className="border-b last:border-b-0 pb-2 flex justify-between items-center">
                <div>
                  <span className={`font-semibold ${
                    workout.type === 'A' ? 'text-blue-600' : 
                    workout.type === 'B' ? 'text-green-600' : 'text-purple-600'
                  }`}>
                    Workout {workout.type}
                  </span>
                  <div className="text-xs text-gray-500">
                    {getDayName(workout.timestamp)}
                  </div>
                </div>
                <span className="text-xs text-gray-700">
                  {formatTimestamp(workout.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Progress; 
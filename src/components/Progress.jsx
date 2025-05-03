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

function Progress() {
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  useEffect(() => {
    const storedWorkouts = JSON.parse(localStorage.getItem('workoutsDone') || '[]');
    // Sort workouts by timestamp, most recent first
    storedWorkouts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setCompletedWorkouts(storedWorkouts);
  }, []);

  return (
    <div className="p-6 bg-brand-beige min-h-full">
      <h1 className="text-2xl font-bold text-brand-pink-dark mb-6">Workout History</h1>

      {completedWorkouts.length === 0 ? (
        <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow">
          <p>No workouts completed yet.</p>
          <p>Keep up the great work!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {completedWorkouts.map((workout, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <span className={`font-semibold ${workout.type === 'A' ? 'text-blue-600' : workout.type === 'B' ? 'text-green-600' : 'text-purple-600'}`}>
                  Workout {workout.type}
                </span>
                <span className="text-sm text-gray-500 block">Completed</span>
              </div>
              <span className="text-sm text-gray-700">{formatTimestamp(workout.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Progress; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [profile, setProfile] = useState({ name: 'User' });
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [todaysWorkoutType, setTodaysWorkoutType] = useState('A');

  useEffect(() => {
    // Load profile data
    const storedProfile = JSON.parse(localStorage.getItem('profile') || '{}');
    setProfile(storedProfile);

    // Load completed workouts
    const storedWorkouts = JSON.parse(localStorage.getItem('workoutsDone') || '[]');
    setCompletedWorkouts(storedWorkouts);

    // Determine today's workout based on the last completed one
    if (storedWorkouts.length > 0) {
      const lastWorkout = storedWorkouts[storedWorkouts.length - 1];
      if (lastWorkout.type === 'A') {
        setTodaysWorkoutType('B');
      } else if (lastWorkout.type === 'B') {
        setTodaysWorkoutType('C');
      } else { // Last was C, cycle back to A
        setTodaysWorkoutType('A');
      }
    } else {
      setTodaysWorkoutType('A'); // Default to A if no workouts done yet
    }
  }, []);

  // Calculate weekly progress (simple count for now, could be more sophisticated)
  // This counts total completed workouts, not just within the current week yet.
  const weeklyProgress = completedWorkouts.length % 3; // Simple modulo for demo
  // A more robust approach would filter workouts by date within the current week.
  const totalCompleted = completedWorkouts.length;

  const workoutDetails = {
    A: { name: 'Lower Body', path: '/workouts/a' },
    B: { name: 'Upper Body', path: '/workouts/b' },
    C: { name: 'Core & Mobility', path: '/workouts/c' },
  };

  const currentWorkout = workoutDetails[todaysWorkoutType];

  return (
    <div className="p-6 bg-brand-beige min-h-full">
      <h1 className="text-3xl font-bold text-brand-pink-dark mb-4">Hello, {profile.name}!</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Today's Workout: {currentWorkout.name}</h2>
        <p className="text-gray-600 mb-4">
          Time to focus on your {currentWorkout.name.toLowerCase()}. Ready to start?
        </p>
        <Link to={currentWorkout.path} className="btn-pink inline-block">
          Start Workout {todaysWorkoutType}
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Progress</h2>
        <p className="text-gray-600 mb-2">You've completed {totalCompleted} workout{totalCompleted !== 1 ? 's' : ''} in total.</p>
        <p className="text-gray-600 mb-4">Workouts This Cycle: {weeklyProgress} of 3</p>
        <div className="w-full bg-brand-gray rounded-full h-2.5 mb-4">
          <div 
            className="bg-brand-pink-dark h-2.5 rounded-full" 
            style={{ width: `${(weeklyProgress / 3) * 100}%` }}
          ></div>
        </div>
        {/* Link to view full progress could go here */} 
        <Link to="/progress" className="text-brand-pink-dark hover:underline">
          View Full History
        </Link>
      </div>
    </div>
  );
}

export default Home; 
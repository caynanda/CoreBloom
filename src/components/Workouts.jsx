import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function Workouts() {
  const location = useLocation();

  // Check if the current path is exactly "/workouts" (not /workouts/a, etc.)
  const showList = location.pathname === '/workouts';

  return (
    <div className="p-6 bg-brand-beige min-h-full">
      {showList ? (
        <>
          <h1 className="text-2xl font-bold text-brand-pink-dark mb-6">Choose Your Workout</h1>
          <div className="space-y-4">
            <Link 
              to="a" 
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-800">Workout A: Lower Body</h2>
              <p className="text-sm text-gray-600">Focus on squats, lunges, glutes.</p>
            </Link>
            <Link 
              to="b" 
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-800">Workout B: Upper Body</h2>
              <p className="text-sm text-gray-600">Focus on rows, presses, arms.</p>
            </Link>
            <Link 
              to="c" 
              className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200"
            >
              <h2 className="text-lg font-semibold text-gray-800">Workout C: Core & Mobility</h2>
              <p className="text-sm text-gray-600">Focus on plank, stability, stretches.</p>
            </Link>
          </div>
        </>
      ) : (
        // When on /workouts/a, /workouts/b, or /workouts/c, render the specific workout component
        <Outlet />
      )}
    </div>
  );
}

export default Workouts; 
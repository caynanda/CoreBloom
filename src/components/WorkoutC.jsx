import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const exercisesC = [
  { name: "Plank", instructions: "Hold plank on elbows and toes.", setsReps: "3 x 30s" },
  { name: "Bird Dog", instructions: "Extend opposite arm and leg, hold.", setsReps: "3 x 10 each side" },
  { name: "Dead Bug", instructions: "Lower arm and leg, switch.", setsReps: "3 x 10 each side" },
  { name: "Cat-Cow Stretch", instructions: "Alternate arch and round back.", setsReps: "3 x 10" },
  { name: "Child's Pose", instructions: "Sit on heels, stretch forward.", setsReps: "3 x 30s" }
];

export function WorkoutC() {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const ex = exercisesC[index];

  const next = () => index < exercisesC.length - 1 && setIndex(i => i + 1);
  const back = () => index > 0 && setIndex(i => i - 1);
  const complete = () => {
    const prev = JSON.parse(localStorage.getItem('workoutsDone') || '[]');
    prev.push({ type: 'C', timestamp: new Date().toISOString() });
    localStorage.setItem('workoutsDone', JSON.stringify(prev));
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="p-4 text-center">
        <div className="text-pink-600 text-xl mb-4">Great job! 🎉</div>
        <RouterLink to="/" className="btn-pink">Back Home</RouterLink>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold text-pink-700 mb-2">Workout C – Step {index + 1} of {exercisesC.length}</h1>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">{ex.name}</h2>
      <p className="text-sm text-gray-600 mb-4">{ex.setsReps}</p>
      <div className="w-full h-32 bg-pink-50 rounded mb-4 flex items-center justify-center text-pink-300">[Exercise Media]</div>
      <p className="text-gray-700 mb-6">{ex.instructions}</p>
      <div className="flex justify-center gap-4">
        {index > 0 && <button onClick={back} className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300">Back</button>}
        {index < exercisesC.length - 1 ? (
          <button onClick={next} className="btn-pink px-6 py-2">Next</button>
        ) : (
          <button onClick={complete} className="btn-pink px-6 py-2">Mark Complete</button>
        )}
      </div>
    </div>
  );
} 
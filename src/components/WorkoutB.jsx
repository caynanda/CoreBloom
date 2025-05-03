import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const exercisesB = [
  { 
    name: "Resistance Band Rows", 
    instructions: "Anchor band low, pull handles, squeeze blades.", 
    setsReps: "3 x 12",
    image: "/exercises/band-rows.jpg"
  },
  { 
    name: "Banded Chest Press", 
    instructions: "Anchor band behind chest, press forward, return.", 
    setsReps: "3 x 12",
    image: "/exercises/band-chest-press.jpg"
  },
  { 
    name: "Overhead Press", 
    instructions: "Hold at shoulders, press overhead, lower.", 
    setsReps: "3 x 10",
    image: "/exercises/overhead-press.jpg"
  },
  { 
    name: "Bicep Curls", 
    instructions: "Curl dumbbells/band to shoulders, lower.", 
    setsReps: "3 x 12",
    image: "/exercises/bicep-curls.jpg"
  },
  { 
    name: "Tricep Extensions", 
    instructions: "Anchor band overhead, extend arms up.", 
    setsReps: "3 x 12",
    image: "/exercises/tricep-extensions.jpg"
  }
];

export function WorkoutB() {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const ex = exercisesB[index];

  const next = () => index < exercisesB.length - 1 && setIndex(i => i + 1);
  const back = () => index > 0 && setIndex(i => i - 1);
  const complete = () => {
    const prev = JSON.parse(localStorage.getItem('workoutsDone') || '[]');
    prev.push({ type: 'B', timestamp: new Date().toISOString() });
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
      <h1 className="text-xl font-bold text-pink-700 mb-2">Workout B – Step {index + 1} of {exercisesB.length}</h1>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">{ex.name}</h2>
      <p className="text-sm text-gray-600 mb-4">{ex.setsReps}</p>
      <div className="w-full h-48 bg-pink-50 rounded mb-4 flex items-center justify-center overflow-hidden">
        {ex.image ? (
          <img 
            src={ex.image} 
            alt={ex.name} 
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/CoreBloom-logo.jpg";
            }}
          />
        ) : (
          <div className="text-pink-300">[Exercise Image Not Available]</div>
        )}
      </div>
      <p className="text-gray-700 mb-6">{ex.instructions}</p>
      <div className="flex justify-center gap-4">
        {index > 0 && <button onClick={back} className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300">Back</button>}
        {index < exercisesB.length - 1 ? (
          <button onClick={next} className="btn-pink px-6 py-2">Next</button>
        ) : (
          <button onClick={complete} className="btn-pink px-6 py-2">Mark Complete</button>
        )}
      </div>
    </div>
  );
} 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExerciseTimer } from './ExerciseTimer';

const exercisesA = [
  { 
    name: "Bodyweight Squats", 
    instructions: "Stand with feet shoulder-width, squat down, then up.", 
    setsReps: "3 x 15",
    image: "/exercises/bodyweight-squats.jpg",
    isTimed: false
  },
  { 
    name: "Glute Bridges", 
    instructions: "Lie back, lift hips by squeezing glutes, lower.", 
    setsReps: "3 x 12",
    image: "/exercises/glute-bridges.jpg",
    isTimed: false
  },
  { 
    name: "Reverse Lunges", 
    instructions: "Step back, lower knee, return; alternate.", 
    setsReps: "3 x 10 each leg",
    image: "/exercises/reverse-lunges.jpg",
    isTimed: false
  },
  { 
    name: "Wall Sit", 
    instructions: "Lean back against wall, knees 90°, hold.", 
    setsReps: "3 x 30s",
    image: "/exercises/wall-sit.jpg",
    isTimed: true,
    duration: 30
  },
  { 
    name: "Standing Calf Raises", 
    instructions: "Rise onto toes, lower.", 
    setsReps: "3 x 15",
    image: "/exercises/calf-raises.jpg",
    isTimed: false
  }
];

export function WorkoutA() {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const ex = exercisesA[index];
  const totalSets = parseInt(ex.setsReps.split('x')[0].trim());

  const next = () => {
    if (index < exercisesA.length - 1) {
      setIndex(i => i + 1);
      setCurrentSet(1);
    }
  };
  
  const back = () => {
    if (index > 0) {
      setIndex(i => i - 1);
      setCurrentSet(1);
    }
  };
  
  const nextSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet(s => s + 1);
    } else {
      next();
    }
  };

  const complete = () => {
    const prev = JSON.parse(localStorage.getItem('workoutsDone') || '[]');
    prev.push({ type: 'A', timestamp: new Date().toISOString() });
    localStorage.setItem('workoutsDone', JSON.stringify(prev));
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="p-4 text-center">
        <div className="text-pink-600 text-xl mb-4">Great job! 🎉</div>
        <Link to="/" className="btn-pink">Back Home</Link>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold text-pink-700 mb-2">Workout A – Step {index + 1} of {exercisesA.length}</h1>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">{ex.name}</h2>
      <p className="text-sm text-gray-600 mb-1">{ex.setsReps}</p>
      <p className="text-sm font-medium text-pink-600 mb-4">Set {currentSet} of {totalSets}</p>
      
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
      
      <p className="text-gray-700 mb-4">{ex.instructions}</p>
      
      {ex.isTimed && (
        <ExerciseTimer 
          duration={ex.duration} 
          onComplete={nextSet} 
        />
      )}
      
      <div className="flex justify-center gap-4">
        {index > 0 && <button onClick={back} className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300">Back</button>}
        
        {index < exercisesA.length - 1 || currentSet < totalSets ? (
          <button 
            onClick={nextSet} 
            className="btn-pink px-6 py-2"
          >
            {currentSet < totalSets ? 'Next Set' : 'Next Exercise'}
          </button>
        ) : (
          <button onClick={complete} className="btn-pink px-6 py-2">Mark Complete</button>
        )}
      </div>
    </div>
  );
} 
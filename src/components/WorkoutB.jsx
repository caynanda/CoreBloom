import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ExerciseTimer from './ExerciseTimer';

const exercisesB = [
  { 
    name: "Resistance Band Rows", 
    instructions: "Anchor band low, pull handles, squeeze blades.", 
    setsReps: "3 x 12",
    image: "/exercises/band-rows.jpg",
    isTimed: false
  },
  { 
    name: "Banded Chest Press", 
    instructions: "Anchor band behind chest, press forward, return.", 
    setsReps: "3 x 12",
    image: "/exercises/band-chest-press.jpg",
    isTimed: false
  },
  { 
    name: "Overhead Press", 
    instructions: "Hold at shoulders, press overhead, lower.", 
    setsReps: "3 x 10",
    image: "/exercises/overhead-press.jpg",
    isTimed: false
  },
  { 
    name: "Bicep Curls", 
    instructions: "Curl dumbbells/band to shoulders, lower.", 
    setsReps: "3 x 12",
    image: "/exercises/bicep-curls.jpg",
    isTimed: false
  },
  { 
    name: "Tricep Extensions", 
    instructions: "Anchor band overhead, extend arms up.", 
    setsReps: "3 x 12",
    image: "/exercises/tricep-extensions.jpg",
    isTimed: false
  }
];

export function WorkoutB() {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const ex = exercisesB[index];
  const totalSets = parseInt(ex.setsReps.split('x')[0].trim());

  const next = () => {
    if (index < exercisesB.length - 1) {
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
    // Save to standard localStorage
    const prev = JSON.parse(localStorage.getItem('workoutsDone') || '[]');
    prev.push({ type: 'B', timestamp: new Date().toISOString() });
    localStorage.setItem('workoutsDone', JSON.stringify(prev));
    
    // Also save to user-specific storage
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      const userWorkouts = JSON.parse(localStorage.getItem(`workoutsDone_${currentUser}`) || '[]');
      userWorkouts.push({ type: 'B', timestamp: new Date().toISOString() });
      localStorage.setItem(`workoutsDone_${currentUser}`, JSON.stringify(userWorkouts));
    }
    
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="p-4 text-center">
        <div className="text-blossom text-xl mb-4">Great job! 🎉</div>
        <RouterLink to="/" className="btn-pink">Back Home</RouterLink>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold text-blossom mb-2">Workout B – Step {index + 1} of {exercisesB.length}</h1>
      <h2 className="text-lg font-semibold text-soft-gray mb-1">{ex.name}</h2>
      <p className="text-sm text-soft-gray mb-1">{ex.setsReps}</p>
      
      <div className="w-full h-48 bg-petal-pink bg-opacity-30 rounded mb-4 flex items-center justify-center overflow-hidden">
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
          <div className="text-petal-pink">[Exercise Image Not Available]</div>
        )}
      </div>
      
      <p className="text-soft-gray mb-4">{ex.instructions}</p>
      
      {ex.isTimed && (
        <ExerciseTimer 
          duration={ex.duration} 
          onComplete={nextSet}
          currentSet={currentSet}
          totalSets={totalSets}
        />
      )}
      
      <div className="flex justify-center gap-4">
        {index > 0 && <button onClick={back} className="bg-warm-neutral px-4 py-2 rounded-xl hover:bg-warm-neutral hover:bg-opacity-70">Back</button>}
        
        {index < exercisesB.length - 1 || currentSet < totalSets ? (
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
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ExerciseTimer } from './ExerciseTimer';

const exercisesC = [
  { 
    name: "Plank", 
    instructions: "Hold plank on elbows and toes.", 
    setsReps: "3 x 30s",
    image: "/exercises/plank.jpg",
    isTimed: true,
    duration: 30
  },
  { 
    name: "Bird Dog", 
    instructions: "Extend opposite arm and leg, hold.", 
    setsReps: "3 x 10 each side",
    image: "/exercises/bird-dog.jpg",
    isTimed: false
  },
  { 
    name: "Dead Bug", 
    instructions: "Lower arm and leg, switch.", 
    setsReps: "3 x 10 each side",
    image: "/exercises/dead-bug.jpg",
    isTimed: false
  },
  { 
    name: "Cat-Cow Stretch", 
    instructions: "Alternate arch and round back.", 
    setsReps: "3 x 10",
    image: "/exercises/cat-cow.jpg",
    isTimed: false
  },
  { 
    name: "Child's Pose", 
    instructions: "Sit on heels, stretch forward.", 
    setsReps: "3 x 30s",
    image: "/exercises/childs-pose.jpg",
    isTimed: true,
    duration: 30
  }
];

export function WorkoutC() {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const ex = exercisesC[index];
  const totalSets = parseInt(ex.setsReps.split('x')[0].trim());

  const next = () => {
    if (index < exercisesC.length - 1) {
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
    prev.push({ type: 'C', timestamp: new Date().toISOString() });
    localStorage.setItem('workoutsDone', JSON.stringify(prev));
    
    // Also save to user-specific storage
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
      const userWorkouts = JSON.parse(localStorage.getItem(`workoutsDone_${currentUser}`) || '[]');
      userWorkouts.push({ type: 'C', timestamp: new Date().toISOString() });
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
      <h1 className="text-xl font-bold text-blossom mb-2">Workout C – Step {index + 1} of {exercisesC.length}</h1>
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
        
        {index < exercisesC.length - 1 || currentSet < totalSets ? (
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
import React, { useState, useEffect, useRef } from 'react';

export function ExerciseTimer({ duration = 30, onComplete, currentSet = 1, totalSets = 1 }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete && onComplete();
    }
  }, [timeLeft, onComplete]);

  const startTimer = () => {
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(duration);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-2 mb-4">
      <div className="text-2xl font-semibold text-blossom mb-2">
        {formatTime(timeLeft)}
      </div>
      <div className="text-sm text-soft-gray mb-2">
        Set {currentSet} of {totalSets}
      </div>
      <div className="flex justify-center gap-2">
        {!isActive ? (
          <button 
            onClick={startTimer}
            className="bg-petal-pink text-black px-4 py-1 rounded-lg hover:bg-blossom hover:text-white"
          >
            {timeLeft === duration ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button 
            onClick={pauseTimer}
            className="bg-soft-gray text-white px-4 py-1 rounded-lg hover:opacity-80"
          >
            Pause
          </button>
        )}
        <button 
          onClick={resetTimer}
          className="bg-mint-green text-black px-4 py-1 rounded-lg hover:opacity-80"
        >
          Reset
        </button>
      </div>
      <div className="w-full bg-warm-neutral h-2 rounded-full mt-2">
        <div 
          className="bg-blossom h-2 rounded-full transition-all duration-300" 
          style={{ width: `${(timeLeft / duration) * 100}%` }}
        />
      </div>
    </div>
  );
} 
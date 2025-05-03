import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Array of motivational messages for the message of the day
const motivationalMessages = [
  "Small steps every day lead to big results over time.",
  "You're stronger than you think. Keep going!",
  "Today's workout is tomorrow's strength.",
  "Your postpartum journey is unique. Honor your progress.",
  "Consistency beats intensity. Show up for yourself today.",
  "Every workout is a step toward becoming the strongest version of you.",
  "Progress isn't always visible, but it's always happening.",
  "Your body created life. Now you're rebuilding your strength. Amazing!",
  "Celebrate small victories. They add up to big transformations.",
  "Self-care isn't selfish, it's necessary. You deserve this time.",
  "Motherhood and strength go hand in hand.",
  "Listen to your body, but don't be afraid to challenge it.",
  "Your health is an investment, not an expense.",
  "The journey of a thousand miles begins with a single step.",
  "You don't have to be perfect to be amazing."
];

// Helper to get nice date format
const formatDate = () => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

// Helper for calculating streak
const calculateStreak = (workouts) => {
  if (workouts.length === 0) return 0;
  
  const workoutDays = {};
  workouts.forEach(workout => {
    const workoutDate = new Date(workout.timestamp);
    workoutDate.setHours(0, 0, 0, 0);
    const dateKey = workoutDate.toISOString().split('T')[0];
    workoutDays[dateKey] = true;
  });
  
  const sortedDays = Object.keys(workoutDays).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  if (sortedDays.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = today.toISOString().split('T')[0];
  const yesterdayKey = new Date(today.getTime() - 86400000).toISOString().split('T')[0];
  
  if (sortedDays[0] !== todayKey && sortedDays[0] !== yesterdayKey) {
    return 1;
  }
  
  let currentStreak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const currentDay = new Date(sortedDays[i-1]);
    const prevDay = new Date(sortedDays[i]);
    
    const diffTime = currentDay.getTime() - prevDay.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays <= 2) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return currentStreak;
};

function Home() {
  const [profile, setProfile] = useState({ name: 'User' });
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [todaysWorkoutType, setTodaysWorkoutType] = useState('A');
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastWeekWorkouts, setLastWeekWorkouts] = useState(0);
  const [thisWeekWorkouts, setThisWeekWorkouts] = useState(0);
  const [showPersonalQuote, setShowPersonalQuote] = useState(false);
  const [personalQuote, setPersonalQuote] = useState("");

  useEffect(() => {
    // Load profile data
    const storedProfile = JSON.parse(localStorage.getItem('profile') || '{}');
    setProfile(storedProfile);

    // Set message of the day - either based on date or random
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setMessage(motivationalMessages[randomIndex]);

    // Load completed workouts
    const storedWorkouts = JSON.parse(localStorage.getItem('workoutsDone') || '[]');
    setCompletedWorkouts(storedWorkouts);

    // Calculate streak
    const currentStreak = calculateStreak(storedWorkouts);
    setStreak(currentStreak);
    
    // Best streak (this would typically be stored)
    const storedBestStreak = parseInt(localStorage.getItem('bestStreak') || '0');
    if (currentStreak > storedBestStreak) {
      localStorage.setItem('bestStreak', currentStreak.toString());
      setBestStreak(currentStreak);
    } else {
      setBestStreak(storedBestStreak);
    }

    // Calculate weekly data
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    
    const thisWeek = storedWorkouts.filter(workout => 
      new Date(workout.timestamp) >= startOfWeek
    ).length;
    
    const lastWeek = storedWorkouts.filter(workout => 
      new Date(workout.timestamp) >= startOfLastWeek && 
      new Date(workout.timestamp) < startOfWeek
    ).length;
    
    setThisWeekWorkouts(thisWeek);
    setLastWeekWorkouts(lastWeek);

    // Get personal quote if exists
    const savedQuote = localStorage.getItem('personalQuote');
    if (savedQuote) {
      setPersonalQuote(savedQuote);
      setShowPersonalQuote(true);
    }

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

  // Calculate weekly progress
  const weeklyProgress = completedWorkouts.length % 3; // Simple modulo for demo
  const totalCompleted = completedWorkouts.length;

  const workoutDetails = {
    A: { name: 'Lower Body', path: '/workouts/a' },
    B: { name: 'Upper Body', path: '/workouts/b' },
    C: { name: 'Core & Mobility', path: '/workouts/c' },
  };

  const currentWorkout = workoutDetails[todaysWorkoutType];

  const saveQuote = () => {
    localStorage.setItem('personalQuote', personalQuote);
    setShowPersonalQuote(true);
  };

  return (
    <div className="p-4 bg-brand-beige min-h-full">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-brand-pink-dark">Hello, {profile.name}!</h1>
          <div className="text-sm text-gray-500">{formatDate()}</div>
        </div>
        
        {/* Message of the Day */}
        <div className="mt-3 text-gray-700 italic border-l-4 border-pink-300 pl-3 py-1">
          {message}
        </div>
        
        {/* Personal Motivation Quote */}
        {showPersonalQuote ? (
          <div className="mt-3 text-sm text-gray-700 bg-pink-50 p-2 rounded relative">
            <p>"{personalQuote}"</p>
            <button 
              onClick={() => setShowPersonalQuote(false)}
              className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
            >
              ✏️
            </button>
          </div>
        ) : (
          <div className="mt-3 flex text-sm">
            <input
              type="text"
              placeholder="Add your personal mantra or goal..."
              value={personalQuote}
              onChange={(e) => setPersonalQuote(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg text-sm"
              maxLength={100}
            />
            <button 
              onClick={saveQuote}
              className="bg-pink-500 text-white px-3 rounded-r-lg"
            >
              Save
            </button>
          </div>
        )}
      </div>
      
      {/* Streak and Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-pink-600">{streak}</div>
          <div className="text-sm text-gray-500">Current Streak</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-pink-600">{bestStreak}</div>
          <div className="text-sm text-gray-500">Best Streak</div>
        </div>
      </div>
      
      {/* Today's Workout */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Today's Workout: {currentWorkout.name}</h2>
        <p className="text-gray-600 mb-3">
          Time to focus on your {currentWorkout.name.toLowerCase()}. Ready to start?
        </p>
        <Link to={currentWorkout.path} className="btn-pink inline-block">
          Start Workout {todaysWorkoutType}
        </Link>
      </div>

      {/* Weekly Progress Comparison */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Weekly Progress</h2>
        
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-500">This Week</span>
          <span className="text-xs font-medium">{thisWeekWorkouts} workouts</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full mb-3">
          <div className="bg-pink-500 h-3 rounded-full" style={{ width: `${Math.min(thisWeekWorkouts / 4 * 100, 100)}%` }}></div>
        </div>
        
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-500">Last Week</span>
          <span className="text-xs font-medium">{lastWeekWorkouts} workouts</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full mb-3">
          <div className="bg-pink-300 h-3 rounded-full" style={{ width: `${Math.min(lastWeekWorkouts / 4 * 100, 100)}%` }}></div>
        </div>
        
        <div className="text-center text-sm mt-3">
          {thisWeekWorkouts > lastWeekWorkouts ? (
            <div className="text-green-600">
              🎉 You're ahead of last week's pace! Keep it up!
            </div>
          ) : thisWeekWorkouts < lastWeekWorkouts ? (
            <div className="text-amber-600">
              Let's get back on track this week!
            </div>
          ) : (
            <div className="text-blue-600">
              You're right on pace with last week!
            </div>
          )}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Overall Progress</h2>
        <p className="text-gray-600 mb-2">You've completed {totalCompleted} workout{totalCompleted !== 1 ? 's' : ''} in total.</p>
        <p className="text-gray-600 mb-3">Workouts This Cycle: {weeklyProgress} of 3</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-brand-pink-dark h-2.5 rounded-full" 
            style={{ width: `${(weeklyProgress / 3) * 100}%` }}
          ></div>
        </div>
        <Link to="/progress" className="text-brand-pink-dark hover:underline">
          View Full History
        </Link>
      </div>
    </div>
  );
}

export default Home; 
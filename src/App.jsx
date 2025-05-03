import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, NavLink, Outlet } from 'react-router-dom';
import { Home as HomeIcon, BarChart3, User, Dumbbell } from 'lucide-react';

// Import Components
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import Workouts from './components/Workouts';
import Progress from './components/Progress';
import Profile from './components/Profile';
import { WorkoutA } from './components/WorkoutA';
import { WorkoutB } from './components/WorkoutB';
import { WorkoutC } from './components/WorkoutC';


function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const location = useLocation();

  useEffect(() => {
    // Debug localStorage
    console.log("ALL LOCAL STORAGE:", { ...localStorage });
    
    // Check localStorage for onboarding status
    const profileData = localStorage.getItem('profile');
    const onboardingFlag = localStorage.getItem('isOnboardingComplete');
    
    console.log("PROFILE DATA:", profileData);
    console.log("ONBOARDING FLAG:", onboardingFlag);
    
    // Consider onboarding complete if either indicator is present
    if (profileData || onboardingFlag === 'true') {
      console.log("SETTING ONBOARDING COMPLETE TO TRUE");
      setIsOnboardingComplete(true);
    } else {
      console.log("NO PROFILE DATA OR ONBOARDING FLAG FOUND");
    }
    
    setIsLoading(false);
  }, []);

  // Don't show tab bar during onboarding or workout steps
  const showTabBar = isOnboardingComplete && 
                     !location.pathname.startsWith('/onboarding') && 
                     !location.pathname.startsWith('/workouts/a') && 
                     !location.pathname.startsWith('/workouts/b') && 
                     !location.pathname.startsWith('/workouts/c');

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-beige">
      <main className={`flex-grow ${showTabBar ? 'mb-16' : ''}`}> 
        <Routes>
          {!isOnboardingComplete ? (
            <>
              <Route path="/onboarding/*" element={<Onboarding />} />
              <Route path="*" element={<Navigate to="/onboarding" replace />} /> 
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} /> 
              <Route path="/workouts" element={<Workouts />}>
                 <Route path="a" element={<WorkoutA />} />
                 <Route path="b" element={<WorkoutB />} />
                 <Route path="c" element={<WorkoutC />} />
              </Route>
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} /> 
            </>
          )}
        </Routes>
      </main>

      {showTabBar && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-gray flex justify-around items-center h-16 z-10">
          <NavLink to="/" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>
            <HomeIcon size={24} />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          <NavLink to="/workouts" className={({ isActive }) => `tab-link ${isActive || location.pathname.startsWith('/workouts/') ? 'active' : ''}`}>
            <Dumbbell size={24} />
            <span className="text-xs mt-1">Workouts</span>
          </NavLink>
          <NavLink to="/progress" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>
            <BarChart3 size={24} />
            <span className="text-xs mt-1">Progress</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </NavLink>
        </nav>
      )} 
    </div>
  );
}

export default App; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const onboardingSteps = [
  {
    title: "Welcome to CoreBloom!",
    content: "Your postpartum journey to strength starts here. Let's get you set up.",
    showInput: false,
  },
  {
    title: "How It Works",
    content: "We offer 3 workouts (A, B, C) focusing on lower body, upper body, and core/mobility. Do them in order, listen to your body, and rest when needed.",
    showInput: false,
  },
  {
    title: "Safety First",
    content: "Always consult your doctor before starting. Stop if you feel pain. We use bands, a 10lb dumbbell, and optional barbell plates – modify as needed.",
    showInput: false,
  },
  {
    title: "Your Profile",
    content: "Let's personalize your experience.",
    showInput: true,
  },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [recoveryNotes, setRecoveryNotes] = useState('');
  const navigate = useNavigate();

  const currentStep = onboardingSteps[step];

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(s => s + 1);
    } else {
      // Final step: Save profile and navigate
      if (name.trim() === '') {
        // Basic validation: Ensure name is entered
        alert('Please enter your name.');
        return;
      }
      
      console.log("Saving profile data...");
      const profileData = {
        name: name.trim(),
        recoveryNotes: recoveryNotes.trim(),
        // Add other default profile settings if needed
        reminders: false, // Example default
        trainingPhase: 'Phase 1', // Example default
      };
      
      try {
        localStorage.setItem('profile', JSON.stringify(profileData));
        console.log("Profile saved successfully:", profileData);
        
        // Also set a separate onboarding flag as a backup
        localStorage.setItem('isOnboardingComplete', 'true');
        console.log("isOnboardingComplete flag set to true");
        
        // Force a reload to ensure App.js useEffect runs again with new localStorage
        // This helps in case the redirect alone doesn't trigger the useEffect
        window.location.href = '/';
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        alert("There was an error saving your profile. Please try again.");
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-brand-beige text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold text-brand-pink-dark mb-4">{currentStep.title}</h2>
        <p className="text-gray-700 mb-6">{currentStep.content}</p>

        {currentStep.showInput && (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-left">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="recoveryNotes" className="block text-sm font-medium text-gray-700 mb-1 text-left">Recovery Notes (Optional)</label>
              <textarea
                id="recoveryNotes"
                value={recoveryNotes}
                onChange={(e) => setRecoveryNotes(e.target.value)}
                className="input-field h-24"
                placeholder="e.g., C-section recovery, diastasis recti concerns..."
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          {step > 0 ? (
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
              Back
            </button>
          ) : <div /> /* Placeholder to keep alignment */} 

          <button onClick={handleNext} className="btn-pink">
            {step === onboardingSteps.length - 1 ? 'Finish Setup' : 'Next'}
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {onboardingSteps.map((_, index) => (
            <span
              key={index}
              className={`block w-2.5 h-2.5 rounded-full ${index === step ? 'bg-brand-pink-dark' : 'bg-brand-gray'}`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Onboarding; 
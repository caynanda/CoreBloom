import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState({ 
    name: '', 
    recoveryNotes: '', 
    reminders: false, 
    trainingPhase: 'Phase 1' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load profile data from localStorage
    const storedProfile = JSON.parse(localStorage.getItem('profile') || '{}');
    // Merge with defaults to ensure all fields are present
    setProfile(prev => ({ ...prev, ...storedProfile }));
    setIsLoading(false);
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (profile.name.trim() === '') {
      alert('Name cannot be empty.');
      return;
    }
    localStorage.setItem('profile', JSON.stringify(profile));
    setIsEditing(false);
    // Optional: Show a success message
    alert('Profile updated successfully!'); 
  };

  const handleCancel = () => {
    // Reload data from storage to discard changes
    const storedProfile = JSON.parse(localStorage.getItem('profile') || '{}');
    setProfile(prev => ({ ...prev, ...storedProfile }));
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <div className="p-6 bg-brand-beige min-h-full">
      <h1 className="text-2xl font-bold text-brand-pink-dark mb-6">Your Profile</h1>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            className="input-field" 
            readOnly={!isEditing}
            required
          />
        </div>

        <div>
          <label htmlFor="recoveryNotes" className="block text-sm font-medium text-gray-700 mb-1">Recovery Notes</label>
          <textarea
            id="recoveryNotes"
            name="recoveryNotes"
            value={profile.recoveryNotes}
            onChange={handleInputChange}
            className="input-field h-24" 
            readOnly={!isEditing}
            placeholder={isEditing ? "Any specific recovery details..." : "N/A"}
          />
        </div>

        {/* Example: Training Phase (Read-only for now, could be editable) */}
        <div>
          <label htmlFor="trainingPhase" className="block text-sm font-medium text-gray-700 mb-1">Current Training Phase</label>
          <input
            type="text"
            id="trainingPhase"
            name="trainingPhase"
            value={profile.trainingPhase}
            className="input-field bg-gray-100" // Style as read-only
            readOnly 
          />
        </div>

        {/* Example: Reminders Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="reminders"
            name="reminders"
            checked={profile.reminders}
            onChange={handleInputChange}
            className="h-4 w-4 text-brand-pink-dark focus:ring-brand-pink-dark border-gray-300 rounded disabled:opacity-50"
            disabled={!isEditing}
          />
          <label htmlFor="reminders" className="ml-2 block text-sm text-gray-900">
            Enable Workout Reminders (Feature coming soon!)
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {isEditing ? (
            <>
              <button 
                type="button" 
                onClick={handleCancel} 
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="btn-pink">
                Save Changes
              </button>
            </>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="btn-pink"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
       {/* Optional: Add a Logout or Reset Data button */}
        {/* <div className="mt-8 text-center">
             <button onClick={() => { localStorage.clear(); navigate('/onboarding'); }} className="text-red-600 hover:underline">Reset App Data & Logout</button>
           </div> */} 
    </div>
  );
}

export default Profile; 
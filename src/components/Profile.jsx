import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { getCurrentUser, logoutUser } from '../firebase/auth';
// import { getUserProfile, updateUserProfile, saveMeasurementHistory } from '../firebase/user';
import { fetchUserProfile, updateUserProfile, saveMeasurement, logoutUser } from '../services/api'; // Import API functions

function Profile() {
  const [profile, setProfile] = useState({ 
    name: '', 
    recoveryNotes: '', 
    reminders: false, 
    trainingPhase: 'Phase 1',
    weight: '',
    weightUnit: 'kg',
    height: '',
    heightUnit: 'cm',
    measurements: {
      arms: '',
      chest: '',
      waist: '',
      hips: '',
      thighs: ''
    },
    measurementUnit: 'cm'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [measurementHistory, setMeasurementHistory] = useState([]);
  const [hasMeasurements, setHasMeasurements] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true); // Set loading true at the start
      setError(''); // Clear previous errors
      try {
        const profileData = await fetchUserProfile(); 
        if (profileData) {
          setProfile(prevProfile => ({ // Merge fetched data with defaults
            ...prevProfile, // Keep default structure
            ...profileData, // Overwrite with fetched data
            measurements: { // Ensure measurements object exists and merge
              ...prevProfile.measurements,
              ...(profileData.measurements || {})
            }
          }));
          
          // Check if user has any measurements
          const hasAnyMeasurement = profileData.measurements && Object.values(profileData.measurements).some(m => m && m !== '');
          setHasMeasurements(hasAnyMeasurement || (profileData.weight && profileData.weight !== ''));
          
          // In a real implementation, you would fetch measurement history:
          // const history = await fetchMeasurementHistory();
          // setMeasurementHistory(history);
        } else {
          // Handle case where profile doesn't exist yet (e.g., new user)
          console.log("No profile data found on backend.");
          // Keep default profile state
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err.message || 'Failed to load profile data');
        // If profile fetch fails (e.g., 401 Unauthorized), redirect to login
        if (err.response?.status === 401) {
          logoutUser(); // Clear local token
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMeasurementChange = (event) => {
    const { name, value } = event.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      measurements: {
        ...prevProfile.measurements,
        [name]: value
      }
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (profile.name.trim() === '') {
      setError('Name cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      // Prepare data to send (only send relevant fields)
      const profileToUpdate = { ...profile }; 

      // Save profile data via API
      await updateUserProfile(profileToUpdate); 

      // Save measurement history if measurements are provided
      const hasMeasurements = Object.values(profile.measurements).some(m => m && m !== '');
      if (hasMeasurements) {
        // Prepare measurement data (ensure numbers are numbers)
        const measurementData = {
          measurements: { ...profile.measurements },
          weight: profile.weight ? parseFloat(profile.weight) : null,
          weightUnit: profile.weightUnit,
          measurementUnit: profile.measurementUnit
        };
        // Remove null/empty measurement fields before sending if needed
        Object.keys(measurementData.measurements).forEach(key => {
          if (!measurementData.measurements[key]) {
              delete measurementData.measurements[key];
          }
        });
        await saveMeasurement(measurementData); 
      }

      setIsEditing(false);
      alert('Profile updated successfully!'); 
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile data');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    
    // Reload profile data
    const loadProfile = async () => {
      setIsLoading(true); // Indicate loading while refetching
      setError('');
      try {
        const profileData = await fetchUserProfile();
        if (profileData) {
          setProfile(prevProfile => ({
            ...prevProfile,
            ...profileData,
            measurements: {
              ...prevProfile.measurements,
              ...(profileData.measurements || {})
            }
          }));
          
          // Check if user has any measurements
          const hasAnyMeasurement = profileData.measurements && Object.values(profileData.measurements).some(m => m && m !== '');
          setHasMeasurements(hasAnyMeasurement || (profileData.weight && profileData.weight !== ''));
        } else {
          console.log("No profile data found after cancel, resetting to defaults?");
          // Or potentially refetch defaults if needed
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err.message || 'Failed to reload profile data after cancel');
        // Consider if navigation is needed here too on error
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      try {
        await logoutUser(); // Calls the API service logout function
        navigate('/login');
      } catch (err) {
        console.error('Error during logout:', err);
        setError('Failed to log out');
      }
    }
  };

  // Helper to render progress card
  const renderProgressCard = () => {
    if (!hasMeasurements) {
      return (
        <div className="bg-mint-green bg-opacity-20 p-4 rounded-lg mb-6 text-center">
          <h3 className="text-lg font-medium text-blossom mb-2">Track Your Progress</h3>
          <p className="text-soft-gray mb-3">
            Logging your measurements helps track your postpartum fitness journey. Add your measurements to see progress over time.
          </p>
          <button 
            onClick={() => { setIsEditing(true); setShowMeasurements(true); }}
            className="text-blossom text-sm font-medium hover:underline"
          >
            Start Tracking Now →
          </button>
        </div>
      );
    }
    
    // Basic progress display - in a real app, you would show charts or more detailed history
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium text-blossom mb-3">Your Progress</h3>
        <div className="grid grid-cols-2 gap-4">
          {profile.weight && (
            <div className="bg-mint-green bg-opacity-20 p-3 rounded-md">
              <span className="block text-soft-gray text-sm">Current Weight</span>
              <span className="block text-blossom text-lg font-medium">{profile.weight} {profile.weightUnit}</span>
            </div>
          )}
          
          {profile.measurements.waist && (
            <div className="bg-mint-green bg-opacity-20 p-3 rounded-md">
              <span className="block text-soft-gray text-sm">Current Waist</span>
              <span className="block text-blossom text-lg font-medium">{profile.measurements.waist} {profile.measurementUnit}</span>
            </div>
          )}
          
          {profile.measurements.hips && (
            <div className="bg-mint-green bg-opacity-20 p-3 rounded-md">
              <span className="block text-soft-gray text-sm">Current Hips</span>
              <span className="block text-blossom text-lg font-medium">{profile.measurements.hips} {profile.measurementUnit}</span>
            </div>
          )}
        </div>
        <div className="text-center mt-4">
          <button 
            onClick={() => { setIsEditing(true); setShowMeasurements(true); }}
            className="text-blossom text-sm font-medium hover:underline"
          >
            Update Measurements →
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <div className="p-6 bg-warm-neutral min-h-full">
      <h1 className="text-2xl font-bold text-blossom mb-6">Your Profile</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      {/* Add Progress Card */}
      {!isEditing && renderProgressCard()}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-soft-gray mb-1">Name</label>
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

        {/* Height and Weight Section */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium text-blossom mb-3">Body Stats</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-soft-gray mb-1">Weight (optional)</label>
              <div className="flex">
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={profile.weight}
                  onChange={handleInputChange}
                  className="input-field rounded-r-none flex-1" 
                  readOnly={!isEditing}
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                />
                <select
                  name="weightUnit"
                  value={profile.weightUnit}
                  onChange={handleInputChange}
                  className={`border border-l-0 border-soft-gray px-2 rounded-r-md ${!isEditing ? 'bg-warm-neutral text-soft-gray' : 'bg-white'}`}
                  disabled={!isEditing}
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-soft-gray mb-1">Height (optional)</label>
              <div className="flex">
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={profile.height}
                  onChange={handleInputChange}
                  className="input-field rounded-r-none flex-1" 
                  readOnly={!isEditing}
                  placeholder="0"
                  min="0"
                  step="0.5"
                />
                <select
                  name="heightUnit"
                  value={profile.heightUnit}
                  onChange={handleInputChange}
                  className={`border border-l-0 border-soft-gray px-2 rounded-r-md ${!isEditing ? 'bg-warm-neutral text-soft-gray' : 'bg-white'}`}
                  disabled={!isEditing}
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Measurements Section */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium text-blossom">Measurements (optional)</h3>
            <button 
              type="button" 
              onClick={() => setShowMeasurements(!showMeasurements)}
              className="text-soft-gray text-sm hover:text-blossom"
            >
              {showMeasurements ? "Hide" : "Show"}
            </button>
          </div>
          
          {showMeasurements && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label htmlFor="arms" className="block text-sm font-medium text-soft-gray mb-1">Arms</label>
                  <input
                    type="number"
                    id="arms"
                    name="arms"
                    value={profile.measurements.arms}
                    onChange={handleMeasurementChange}
                    className="input-field" 
                    readOnly={!isEditing}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label htmlFor="chest" className="block text-sm font-medium text-soft-gray mb-1">Chest</label>
                  <input
                    type="number"
                    id="chest"
                    name="chest"
                    value={profile.measurements.chest}
                    onChange={handleMeasurementChange}
                    className="input-field" 
                    readOnly={!isEditing}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label htmlFor="waist" className="block text-sm font-medium text-soft-gray mb-1">Waist</label>
                  <input
                    type="number"
                    id="waist"
                    name="waist"
                    value={profile.measurements.waist}
                    onChange={handleMeasurementChange}
                    className="input-field" 
                    readOnly={!isEditing}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label htmlFor="hips" className="block text-sm font-medium text-soft-gray mb-1">Hips</label>
                  <input
                    type="number"
                    id="hips"
                    name="hips"
                    value={profile.measurements.hips}
                    onChange={handleMeasurementChange}
                    className="input-field" 
                    readOnly={!isEditing}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label htmlFor="thighs" className="block text-sm font-medium text-soft-gray mb-1">Thighs</label>
                  <input
                    type="number"
                    id="thighs"
                    name="thighs"
                    value={profile.measurements.thighs}
                    onChange={handleMeasurementChange}
                    className="input-field" 
                    readOnly={!isEditing}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label htmlFor="measurementUnit" className="block text-sm font-medium text-soft-gray mb-1">Unit</label>
                  <select
                    id="measurementUnit"
                    name="measurementUnit"
                    value={profile.measurementUnit}
                    onChange={handleInputChange}
                    className={`input-field ${!isEditing ? 'bg-warm-neutral text-soft-gray' : 'bg-white'}`}
                    disabled={!isEditing}
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-soft-gray italic">Measurements help track your postpartum fitness journey progress.</p>
            </>
          )}
        </div>

        <div>
          <label htmlFor="recoveryNotes" className="block text-sm font-medium text-soft-gray mb-1">Recovery Notes</label>
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
          <label htmlFor="trainingPhase" className="block text-sm font-medium text-soft-gray mb-1">Current Training Phase</label>
          <input
            type="text"
            id="trainingPhase"
            name="trainingPhase"
            value={profile.trainingPhase}
            className="input-field bg-warm-neutral" // Style as read-only
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
            className="h-4 w-4 text-blossom focus:ring-blossom border-soft-gray rounded disabled:opacity-50"
            disabled={!isEditing}
          />
          <label htmlFor="reminders" className="ml-2 block text-sm text-soft-gray">
            Enable Workout Reminders (Feature coming soon!)
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {isEditing ? (
            <>
              <button 
                type="button" 
                onClick={handleCancel} 
                className="bg-warm-neutral text-soft-gray px-4 py-2 rounded-lg hover:bg-warm-neutral hover:bg-opacity-70"
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-pink"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
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

      {/* Logout Button */}
      <div className="mt-8 text-center">
        <button onClick={handleLogout} className="text-blossom hover:underline">
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Profile; 
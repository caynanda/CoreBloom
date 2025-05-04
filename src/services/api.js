import axios from 'axios';

// Get the API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || '/api'; // Default to /api if not set

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or wherever you store the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Authentication API Calls ---

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    // Assuming the backend returns { token: '...', user: { ... } }
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      // Optionally store user info if needed, or rely on profile fetch
      localStorage.setItem('current_user', JSON.stringify(response.data.user)); // Example
    }
    return response.data; 
  } catch (error) {
    console.error('Login API error:', error.response || error.message);
    throw error.response?.data || new Error('Login failed');
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password });
    // Assuming backend returns similar { token: '...', user: { ... } } or just success
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('current_user', JSON.stringify(response.data.user)); // Example
    }
    return response.data;
  } catch (error) {
    console.error('Register API error:', error.response || error.message);
    throw error.response?.data || new Error('Registration failed');
  }
};

export const logoutUser = async () => {
  // Optional: Call a backend logout endpoint if it exists (e.g., to invalidate token server-side)
  // try {
  //   await apiClient.post('/auth/logout');
  // } catch (error) {
  //   console.error('Logout API error:', error.response || error.message);
  //   // Decide if frontend logout should proceed even if backend call fails
  // }
  
  // Clear local storage
  localStorage.removeItem('authToken');
  localStorage.removeItem('current_user'); 
  // Add any other relevant keys to remove
  localStorage.removeItem('isOnboardingComplete');
  // Consider removing user-specific data or leave it for potential re-login
  // localStorage.removeItem('profile');
  // localStorage.removeItem('workoutsDone');
};

// --- User Profile API Calls ---

export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get('/users/profile'); // Endpoint to get current user's profile
    return response.data; // Assuming backend returns the profile object
  } catch (error) {
    console.error('Fetch Profile API error:', error.response || error.message);
    throw error.response?.data || new Error('Failed to fetch profile');
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/users/profile', profileData); // Endpoint to update profile
    return response.data; // Assuming backend returns the updated profile or success message
  } catch (error) {
    console.error('Update Profile API error:', error.response || error.message);
    throw error.response?.data || new Error('Failed to update profile');
  }
};

// --- Measurement History API Calls ---

export const saveMeasurement = async (measurementData) => {
  try {
    const response = await apiClient.post('/users/measurements', measurementData);
    return response.data;
  } catch (error) {
    console.error('Save Measurement API error:', error.response || error.message);
    throw error.response?.data || new Error('Failed to save measurement');
  }
};

// Add other API calls as needed (e.g., fetch workouts, save workout, fetch progress)

export default apiClient; 
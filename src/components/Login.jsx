import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { signInUser, registerUser, resetPassword } from '../firebase/auth';
// import { isFirebaseConfigured, getFirebaseConfigErrorMessage } from '../firebase/isConfigured';
import { loginUser, registerUser } from '../services/api'; // Import API functions

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // const checkConfig = () => {
    //   if (!isFirebaseConfigured()) {
    //     setError(getFirebaseConfigErrorMessage());
    //   }
    // };
    // checkConfig();
    // TODO: Check if backend is configured/reachable?
    console.warn("Firebase config check commented out.");
    // TODO: Implement API call for password reset if needed
    // We are skipping password reset implementation for now
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // // If Firebase is not configured, show error // Removed Firebase config check
    // if (!isFirebaseConfigured()) { 
    //   setError('Firebase is not properly configured. Please check your environment variables.');
    //   return;
    // }
    
    setError('');
    setLoading(true);

    try {
      if (forgotPassword) {
        // Password reset flow - Skipping for now
        // await resetPassword(email);
        // setInfoMessage('Password reset email sent! Check your inbox.');
        // TODO: Replace with API call to password reset endpoint
        setError('Password reset is not yet implemented.'); // Indicate feature is missing
        setForgotPassword(false);
      } else if (isRegistering) {
        // Registration flow
        if (!name.trim()) {
          setError('Name is required'); // Use setError state
          setLoading(false); // Stop loading indicator
          return; // Stop execution
        }
        await registerUser(name, email, password);
        // On successful registration, the API service saves the token.
        // Navigate to onboarding or home, depending on your flow.
        // Assuming registration leads to onboarding:
        navigate('/onboarding'); 
      } else {
        // Login flow
        await loginUser(email, password);
        // On successful login, the API service saves the token.
        // Navigate to the main app page.
        navigate('/'); 
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Simplified error handling - remove specific Firebase codes
      // if (error.code === 'auth/invalid-api-key') { 
      //   setError('Firebase API key is invalid. Please check your configuration.');
      //   setIsConfigured(false);
      // } else {
      //   setError(getErrorMessage(error.code) || error.message);
      // }
      setError(error.message || 'An unexpected error occurred.'); // Generic error
    } finally {
      setLoading(false);
    }
  };

  // Helper function to provide friendly error messages
  // const getErrorMessage = (errorCode) => {
  //   switch (errorCode) {
  //     case 'auth/email-already-in-use':
  //       return 'This email is already registered. Try logging in instead.';
  //     case 'auth/invalid-email':
  //       return 'Please enter a valid email address.';
  //     case 'auth/user-not-found':
  //     case 'auth/wrong-password':
  //       return 'Invalid email or password.';
  //     case 'auth/weak-password':
  //       return 'Password should be at least 6 characters.';
  //     case 'auth/invalid-api-key':
  //       return 'Firebase configuration error: Invalid API key. Please set up Firebase correctly.';
  //     case 'auth/app-deleted':
  //     case 'auth/invalid-credential':
  //     case 'auth/operation-not-allowed':
  //       return 'Authentication service configuration error. Please contact support.';
  //     default:
  //       return null;
  //   }
  // };

  // Switch to local auth if Firebase isn't configured
  // const switchToLocalAuth = () => {
  //   localStorage.setItem('auth_type', 'local');
  //   window.location.reload(); // Reload to apply the auth change
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-warm-neutral">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <img 
          src="/CoreBloom-logo.jpg" 
          alt="CoreBloom Logo" 
          className="w-24 h-24 mx-auto mb-6 rounded-full"
        />
        <h1 className="text-2xl font-bold text-blossom text-center mb-6">
          {forgotPassword 
            ? 'Reset Password' 
            : isRegistering 
              ? 'Create Account' 
              : 'Welcome to CoreBloom'}
        </h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-soft-gray mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Jane Doe"
                required={isRegistering}
                disabled={loading}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-soft-gray mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>
          
          {!forgotPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-soft-gray mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required={!forgotPassword}
                disabled={loading}
                minLength={6}
              />
            </div>
          )}
          
          <div className="flex justify-end">
            {!isRegistering && !forgotPassword && (
              <button
                type="button"
                onClick={() => setForgotPassword(true)}
                className="text-sm text-blossom hover:underline"
                disabled={loading}
              >
                Forgot password?
              </button>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn-pink w-full py-2 mt-2"
            disabled={loading}
          >
            {loading 
              ? 'Please wait...' 
              : forgotPassword 
                ? 'Send Reset Link' 
                : isRegistering 
                  ? 'Create Account' 
                  : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          {forgotPassword ? (
            <button
              onClick={() => setForgotPassword(false)}
              className="text-soft-gray hover:text-blossom text-sm"
              disabled={loading}
            >
              Back to login
            </button>
          ) : (
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-soft-gray hover:text-blossom text-sm"
              disabled={loading}
            >
              {isRegistering 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login; 
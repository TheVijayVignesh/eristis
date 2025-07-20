import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login as loginApi, loginWithGoogle } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SaveGuestDataPrompt from '../components/SaveGuestDataPrompt';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const { login, isGuest, enableGuestMode, guestDebates, clearGuestDebates } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL from the query params or default to '/app'
  const from = location.state?.from?.pathname || '/app';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // If guest has debates, show save prompt instead of logging in directly
      if (guestDebates && guestDebates.length > 0) {
        setShowSavePrompt(true);
        setLoading(false);
        return;
      }
      
      const res = await loginApi(formData);
      await login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      // If guest has debates, show save prompt instead of proceeding with Google login
      if (guestDebates && guestDebates.length > 0) {
        setShowSavePrompt(true);
        return;
      }
      
      // If no guest debates, proceed with normal Google login
      loginWithGoogle();
    } catch (err) {
      setError('Failed to initiate Google login. Please try again.');
    }
  };

  // Handle the save and continue action from the prompt
  const handleSaveAndContinue = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First, log in the user
      const res = await loginApi(formData);
      
      // The login function will handle saving guest debates
      await login(res.data.token, res.data.user);
      
      // Navigate to the intended destination
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save and log in.');
      setLoading(false);
      throw err; // Re-throw to allow the SaveGuestDataPrompt to handle the error
    }
  };
  
  // Handle continue without saving
  const handleContinueWithoutSaving = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Clear guest debates before logging in
      clearGuestDebates();
      
      // Log in the user
      const res = await loginApi(formData);
      await login(res.data.token, res.data.user);
      
      // Navigate to the intended destination
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in.');
      setLoading(false);
      throw err; // Re-throw to allow the SaveGuestDataPrompt to handle the error
    }
  };
  
  // Handle guest mode
  const handleGuestMode = () => {
    enableGuestMode();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {showSavePrompt && (
        <SaveGuestDataPrompt 
          onClose={() => setShowSavePrompt(false)}
          onSaveAndContinue={handleSaveAndContinue}
          onContinueWithoutSaving={handleContinueWithoutSaving}
        />
      )}
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            id="email" 
            name="email" 
            type="email" 
            label="Email Address" 
            placeholder="you@example.com" 
            value={formData.email}
            onChange={handleChange} 
            required 
          />
          <Input 
            id="password" 
            name="password" 
            type="password" 
            label="Password" 
            placeholder="••••••••" 
            value={formData.password}
            onChange={handleChange} 
            required 
          />
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </div>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleGoogleLogin} 
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2"/>
            Continue with Google
          </Button>
          
          <Button 
            onClick={handleGuestMode} 
            variant="secondary"
            className="w-full"
          >
            Continue as Guest
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            state={{ from: location.state?.from }}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;

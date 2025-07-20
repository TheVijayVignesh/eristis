import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signup, resendVerification } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SaveGuestDataPrompt from '../components/SaveGuestDataPrompt';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  
  const { login, enableGuestMode, guestDebates, clearGuestDebates } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/app';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // If guest has debates, show save prompt instead of proceeding with signup
      if (guestDebates && guestDebates.length > 0) {
        setShowSavePrompt(true);
        setLoading(false);
        return;
      }
      
      const res = await signup(formData);
      setSuccess(res.data.message);
      setEmailSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup.');
      setLoading(false);
    }
  };
  
  // Handle the save and continue action from the prompt
  const handleSaveAndContinue = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await signup(formData);
      setSuccess(res.data.message);
      setShowSavePrompt(false);
      setEmailSent(true);
      clearGuestDebates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save and sign up.');
      setLoading(false);
    }
  };
  
  // Handle continue without saving
  const handleContinueWithoutSaving = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await signup(formData);
      setSuccess(res.data.message);
      setShowSavePrompt(false);
      setEmailSent(true);
      clearGuestDebates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      await resendVerification({ email: formData.email });
      setSuccess('A new verification email has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
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
      <Card>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        {!emailSent ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <Input id="name" name="name" label="Full Name" placeholder="John Doe" onChange={handleChange} required />
            <Input id="email" name="email" type="email" label="Email Address" placeholder="you@example.com" onChange={handleChange} required />
            <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" onChange={handleChange} required />
            <Button type="submit" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</Button>
          </form>
        ) : (
          <div className="text-center">
            <p>Check your inbox at <strong>{formData.email}</strong> to verify your account.</p>
            <Button onClick={handleResend} disabled={loading} variant="secondary" className="mt-4">
              {loading ? 'Sending...' : 'Resend Email'}
            </Button>
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;

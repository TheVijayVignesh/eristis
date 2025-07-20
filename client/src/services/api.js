import axios from 'axios';

// TODO: Set your REACT_APP_BACKEND_URL in a .env file for production
// For development, you might need to set up a proxy in package.json
// or use the full backend URL like http://localhost:8080
export const API = axios.create({ 
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080',
});

// Auth API calls
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const verifyEmail = (token) => API.get(`/auth/verify?token=${token}`);
export const resendVerification = (data) => API.post('/auth/resend-verification', data);
export const loginWithGoogle = () => window.location.href = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}/auth/google`;

// Example of a protected route call
export const getDashboardData = () => API.get('/dashboard');

export default API;

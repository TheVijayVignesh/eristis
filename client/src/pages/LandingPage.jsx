import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { enableGuestMode } = useAuth();

  const handleGuestMode = () => {
    enableGuestMode();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Windsurf</h1>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-4xl w-full">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Debate with AI. Hone Your Skills.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practice your debating skills with our AI-powered platform. Get instant feedback and improve your arguments in real-time.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started</h2>
              <p className="text-gray-600 mb-6">Choose how you'd like to use Windsurf</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Guest Mode</h3>
                  <p className="text-gray-500 text-sm mb-4">Try all features without an account. Your data won't be saved.</p>
                  <button
                    onClick={handleGuestMode}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Continue as Guest
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Login / Sign Up</h3>
                  <p className="text-gray-500 text-sm mb-4">Save your debates and access them from any device.</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Create Account or Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

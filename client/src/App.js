import React, { useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VoiceProvider, useVoice } from './contexts/VoiceContext';
import VoiceSelector from './components/VoiceSelector';
import SpeechPlayer from './components/SpeechPlayer';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Verify from './pages/Verify';
import LandingPage from './pages/LandingPage';
import GuestBanner from './components/GuestBanner';

// Main App Layout
const AppLayout = ({ children }) => {
  const { isGuest } = useAuth();
  const location = useLocation();
  
  // Don't show banner on auth pages or landing page
  const hideBanner = ['/', '/login', '/signup', '/verify'].includes(location.pathname);
  const showBanner = isGuest && !hideBanner;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showBanner && <GuestBanner />}
      <main className={`flex-grow ${showBanner ? 'pt-0' : 'pt-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

// Protected Route - requires authentication (either logged in or guest mode)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

// Auth Route - only accessible when not authenticated
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/app" />;
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <VoiceProvider>
          <Routes>
            <Route path="/" element={
              <AuthRoute>
                <LandingPage />
              </AuthRoute>
            } />
            
            <Route path="/login" element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } />
            
            <Route path="/signup" element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            } />
            
            <Route path="/verify" element={
              <AuthRoute>
                <Verify />
              </AuthRoute>
            } />
            
            <Route path="/app/*" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="text-center py-10">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome to the App</h1>
                    <p className="mt-2 text-gray-600">This is the main application interface.</p>
                    {/* Voice selector in the main app area */}
                    <div className="mt-6 max-w-md mx-auto">
                      <VoiceSelector />
                    </div>
                    {/* Example of using the speech functionality */}
                    <SpeechTestButton />
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </VoiceProvider>
      </AuthProvider>
    </Router>
  );
}

// Component to test speech functionality
const SpeechTestButton = () => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Test Text-to-Speech</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select a voice and click the play button to test the text-to-speech functionality.
      </p>
      <div className="bg-white p-4 rounded border border-gray-200">
        <p className="text-gray-800 mb-3">
          "Welcome to the AI Debate Simulator. This is a test of the text-to-speech functionality. "
          "You can change the voice using the dropdown above and hear how it sounds with different voices."
        </p>
        <SpeechPlayer 
          text="Welcome to the AI Debate Simulator. This is a test of the text-to-speech functionality. "
          autoPlay={false}
        />
      </div>
    </div>
  );
};

export default App;

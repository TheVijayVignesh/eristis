import React, { useState } from 'react';
import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { getGuestDebatesMessage } from '../utils/guestUtils';

const SaveGuestDataPrompt = ({ onClose, onSaveAndContinue, onContinueWithoutSaving }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { guestDebates } = useAuth();
  
  const handleSave = async () => {
    if (!onSaveAndContinue) return;
    
    try {
      setIsSaving(true);
      await onSaveAndContinue();
    } catch (error) {
      console.error('Failed to save guest data:', error);
      // The error will be handled by the parent component
      throw error;
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleContinue = () => {
    onContinueWithoutSaving?.();
  };
  
  const message = getGuestDebatesMessage(guestDebates?.length || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <ArrowRightIcon className="-ml-1 mr-2 h-4 w-4" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          
          <h3 className="mt-3 text-lg font-medium text-gray-900">Save your debates</h3>
          <div className="mt-2">
            <p className="text-sm text-yellow-800 font-medium">
              {message} Would you like to save them to your account before logging in?
            </p>
          </div>
          
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm ${
                isSaving ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save and Continue'}
            </button>
            
            <button
              type="button"
              onClick={handleContinue}
              disabled={isSaving}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Continue without saving
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveGuestDataPrompt;

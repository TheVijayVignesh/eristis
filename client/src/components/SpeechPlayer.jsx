import React, { useState, useEffect } from 'react';
import { useVoice } from '../contexts/VoiceContext';

const SpeechPlayer = ({ text, autoPlay = false, onPlay, onEnd }) => {
  const { playSpeech, stopSpeech, isPlaying } = useVoice();
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);

  useEffect(() => {
    // Auto-play the speech when the component mounts if autoPlay is true
    if (autoPlay && text) {
      handlePlay();
    }

    // Clean up on unmount
    return () => {
      if (isLocalPlaying) {
        stopSpeech();
      }
    };
  }, [text, autoPlay]);

  const handlePlay = async () => {
    if (!text) return;
    
    try {
      setIsLocalPlaying(true);
      onPlay?.();
      await playSpeech(text);
    } catch (error) {
      console.error('Error playing speech:', error);
    } finally {
      setIsLocalPlaying(false);
      onEnd?.();
    }
  };

  const handleStop = () => {
    stopSpeech();
    setIsLocalPlaying(false);
  };

  if (!text) return null;

  return (
    <div className="flex items-center space-x-2">
      {isLocalPlaying ? (
        <button
          onClick={handleStop}
          className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
          title="Stop speech"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      ) : (
        <button
          onClick={handlePlay}
          className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
          disabled={isPlaying}
          title="Play speech"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </button>
      )}
      
      <div className="text-sm text-gray-500">
        {isLocalPlaying ? 'Playing...' : 'Play speech'}
      </div>
    </div>
  );
};

export default SpeechPlayer;

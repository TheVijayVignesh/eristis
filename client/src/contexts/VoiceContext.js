import React, { createContext, useState, useContext } from 'react';

const VOICES = [
  {
    id: 'siw1N9V8LmYeEWKyWBxv',
    name: 'Ruhan',
    description: 'Calm and assertive male voice',
  },
  {
    id: 'vYENaCJHl4vFKNDYPr8y',
    name: 'Ria',
    description: 'Confident and expressive female',
  },
  {
    id: 'wyWA56cQNU2KqUW4eCsI',
    name: 'Clyde',
    description: 'Deep authoritative male voice',
  },
  {
    id: '8N2ng9i2uiUWqstgmWlH',
    name: 'Beth',
    description: 'Energetic and persuasive female',
  },
];

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const playSpeech = async (text) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      setIsPlaying(true);
      
      // Call the backend to generate speech
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error('Error playing audio');
        setIsPlaying(false);
      };

      setCurrentAudio(audio);
      await audio.play();
      
    } catch (error) {
      console.error('Error playing speech:', error);
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        voices: VOICES,
        selectedVoice,
        setSelectedVoice,
        playSpeech,
        stopSpeech,
        isPlaying,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

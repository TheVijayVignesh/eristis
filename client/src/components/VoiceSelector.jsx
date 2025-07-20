import React from 'react';
import { useVoice } from '../contexts/VoiceContext';

const VoiceSelector = ({ className = '' }) => {
  const { voices, selectedVoice, setSelectedVoice } = useVoice();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="voice-select" className="text-sm font-medium text-gray-700">
        Voice:
      </label>
      <select
        id="voice-select"
        value={selectedVoice.id}
        onChange={(e) => {
          const voice = voices.find((v) => v.id === e.target.value);
          if (voice) setSelectedVoice(voice);
        }}
        className="block w-full rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {voices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name} - {voice.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VoiceSelector;

# Text-to-Speech (TTS) Integration

This feature integrates ElevenLabs Text-to-Speech API to provide realistic voice synthesis for the AI debate simulator.

## Features

- Multiple voice options with different characteristics
- Global voice selection that persists across the app
- Play/pause controls for speech playback
- Support for streaming audio from the backend
- Clean, reusable components for speech playback

## Components

### 1. VoiceContext

Manages the global state for voice selection and speech playback.

**Exports:**
- `VoiceProvider`: Context provider component
- `useVoice`: Hook to access voice context

**Context Value:**
- `voices`: Array of available voices
- `selectedVoice`: Currently selected voice
- `setSelectedVoice`: Function to change the selected voice
- `playSpeech(text)`: Function to play speech
- `stopSpeech()`: Function to stop current speech
- `isPlaying`: Boolean indicating if speech is currently playing

### 2. VoiceSelector

A dropdown component for selecting the preferred voice.

**Props:**
- `className`: Optional CSS classes for styling

### 3. SpeechPlayer

A reusable component for playing speech with play/pause controls.

**Props:**
- `text`: The text to be spoken
- `autoPlay`: Whether to automatically play the speech when mounted (default: false)
- `onPlay`: Callback when speech starts playing
- `onEnd`: Callback when speech finishes playing

## Usage

### 1. Setup the Provider

Wrap your app with the `VoiceProvider`:

```jsx
import { VoiceProvider } from './contexts/VoiceContext';

function App() {
  return (
    <VoiceProvider>
      {/* Your app components */}
    </VoiceProvider>
  );
}
```

### 2. Use the Voice Selector

Add the `VoiceSelector` component where you want users to choose a voice:

```jsx
import VoiceSelector from './components/VoiceSelector';

function Preferences() {
  return (
    <div>
      <h2>Voice Preferences</h2>
      <VoiceSelector />
    </div>
  );
}
```

### 3. Play Speech Programmatically

Use the `useVoice` hook to play speech from anywhere in your app:

```jsx
import { useVoice } from '../contexts/VoiceContext';

function DebateSpeech({ text }) {
  const { playSpeech, isPlaying } = useVoice();
  
  const handlePlay = async () => {
    try {
      await playSpeech(text);
    } catch (error) {
      console.error('Error playing speech:', error);
    }
  };
  
  return (
    <div>
      <p>{text}</p>
      <button onClick={handlePlay} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Play Speech'}
      </button>
    </div>
  );
}
```

### 4. Use the SpeechPlayer Component

For a more complete solution with built-in controls, use the `SpeechPlayer` component:

```jsx
import SpeechPlayer from './components/SpeechPlayer';

function DebateSpeech({ text }) {
  return (
    <div className="debate-speech">
      <p>{text}</p>
      <SpeechPlayer text={text} autoPlay={false} />
    </div>
  );
}
```

## Backend Integration

The backend provides a single endpoint for TTS:

- **POST /api/speech**
  - **Request Body:**
    ```json
    {
      "text": "The text to be spoken",
      "voiceId": "voice-id-from-elevenlabs"
    }
    ```
  - **Response:** Audio stream (audio/mpeg)

## Available Voices

| Name  | Voice ID                     | Description                     |
|-------|------------------------------|---------------------------------|
| Ruhan | siw1N9V8LmYeEWKyWBxv         | Calm and assertive male voice   |
| Ria   | vYENaCJHl4vFKNDYPr8y         | Confident and expressive female |
| Clyde | wyWA56cQNU2KqUW4eCsI         | Deep authoritative male voice   |
| Beth  | 8N2ng9i2uiUWqstgmWlH         | Energetic and persuasive female |

## Error Handling

- The `playSpeech` function will throw an error if the request fails
- The `SpeechPlayer` component handles errors internally and logs them to the console
- Network errors are automatically retried once

## Styling

All components use Tailwind CSS for styling and can be customized with additional classes.

## Dependencies

- axios: For making HTTP requests to the TTS API
- react: For the UI components

## Environment Variables

Ensure these environment variables are set in your `.env` file:

```
ELEVEN_LABS_API_KEY=your_api_key_here
```

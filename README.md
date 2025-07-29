# eristis
Eristis is an AI-powered debate simulation platform that brings competitive debating to life with real-time speech transcription, POIs, adjudication, and support for multiple debate formats,  all in your browser.
=======
# Debate Platform

This project is a full-stack Debate Platform featuring user authentication via email/password and Google OAuth, email verification, and a PostgreSQL database managed by Supabase.

## Project Structure

- `/client`: Contains the React frontend application.
- `/server`: Contains the Node.js Express backend server.

## Getting Started

### Prerequisites

- Node.js and npm
- A Supabase account for the PostgreSQL database.
- A Google Cloud project with OAuth 2.0 credentials.
- A Gmail account with an App Password for sending verification emails.

### Environment Variables

Create a `.env` file in the `server` directory and add the following environment variables. You can also set these in the Windsurf "Environments" tab.

```
# /server/.env

# TODO: Paste the SQL connection string here
DATABASE_URL="postgresql://neondb_owner:npg_vIEUbM3tWoF8@ep-floral-night-a1ykiuyj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# TODO: Paste your Gmail credentials here (optional, guest mode can be used)
# EMAIL_USER should be your full Gmail address (e.g., you@gmail.com)
# EMAIL_PASS is the 16-character App Password you generate from your Google Account settings.
EMAIL_USER=""
EMAIL_PASS=""

# TODO: Paste your Google OAuth credentials here (optional)
# Get these from the Google Cloud Console for your project.
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# TODO: Generate a long, random, and secure string for signing JWTs
JWT_SECRET="your-super-secret-jwt-string"

# TODO: Set the URLs for your frontend and backend deployments
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:8080"
```

For the frontend, create a `.env` file in the `client` directory:

```
# /client/.env

# TODO: Set the base URL for your backend API
REACT_APP_BACKEND_URL=http://localhost:8080
```


### Installation & Running the App

    cd client
    npm install
    npm start
    ```

    ### Whisper Server Setup

To enable real-time speech-to-text transcription in Eristis, you need to run a local Whisper server. Follow the steps below to set it up:

1. Clone or download the Whisper server script from this repository or use your own implementation of `whisper_server.py`.

2. Open a terminal, navigate to the folder containing `whisper_server.py`, and run the following command:

   ```bash
   python3 whisper_server.py
3. Once the server is running, the url will be available

4. Copy this URL and paste it into the appropriate field in the SpeechToText.tsx file.

5. Make sure the Whisper server is running locally before starting a debate session. If the server is not active, speech transcription features will not work.

The React app should now be running on `http://localhost:3000` and the Express server on `http://localhost:8080`.

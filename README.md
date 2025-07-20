<<<<<<< HEAD
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

# TODO: Paste your Supabase connection string here
# Find this in your Supabase project settings > Database > Connection string
DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres"

# TODO: Paste your Gmail credentials here
# EMAIL_USER should be your full Gmail address (e.g., you@gmail.com)
# EMAIL_PASS is the 16-character App Password you generate from your Google Account settings.
EMAIL_USER=""
EMAIL_PASS=""

# TODO: Paste your Google OAuth credentials here
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

### Database Setup

Connect to your Supabase project and run the following SQL script in the SQL Editor to create the `users` table.

```sql
-- TODO: Run this SQL in your Supabase SQL Editor to create the users table.

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  provider TEXT NOT NULL CHECK (provider IN ('local', 'google')),
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  verification_token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Installation & Running the App

1.  **Backend**
    ```bash
    cd server
    npm install
    npm start
    ```

2.  **Frontend**
    ```bash
    cd client
    npm install
    npm start
    ```

The React app should now be running on `http://localhost:3000` and the Express server on `http://localhost:8080`.

## How to Obtain Credentials

-   **Supabase `DATABASE_URL`**: 
    1. Go to your Supabase project dashboard.
    2. Navigate to **Settings** > **Database**.
    3. Under **Connection string**, find the URI and replace `[YOUR-PASSWORD]` with your database password.

-   **Gmail `EMAIL_PASS` (App Password)**:
    1. Go to your Google Account settings: `myaccount.google.com`.
    2. Navigate to **Security**.
    3. Enable **2-Step Verification** if you haven't already.
    4. Under "Signing in to Google," click on **App Passwords**.
    5. Select "Mail" for the app and "Other (Custom name)" for the device, give it a name (e.g., "Debate Platform"), and click **Generate**.
    6. Copy the 16-character password provided. This is your `EMAIL_PASS`.

-   **`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`**:
    1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
    2. Create a new project or select an existing one.
    3. Go to **APIs & Services** > **Credentials**.
    4. Click **Create Credentials** > **OAuth client ID**.
    5. Select **Web application** as the application type.
    6. Under **Authorized JavaScript origins**, add your frontend URL (e.g., `http://localhost:3000`).
    7. Under **Authorized redirect URIs**, add your backend callback URL (e.g., `http://localhost:8080/auth/google/callback`).
    8. Click **Create**. Your Client ID and Client Secret will be displayed.
>>>>>>> e8b73e1 (Add AIDebateSim as a regular folder)

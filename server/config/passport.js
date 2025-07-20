const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

// TODO: paste your GOOGLE_CLIENT_ID & SECRET in Windsurf Environments or .env
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    try {
      // Check if user already exists
      let user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

      if (user.rows.length > 0) {
        // User exists, log them in
        return done(null, user.rows[0]);
      } else {
        // User doesn't exist, create a new one
        const newUser = await db.query(
          'INSERT INTO users (name, email, provider, email_verified) VALUES ($1, $2, $3, $4) RETURNING *',
          [displayName, email, 'google', true]
        );
        return done(null, newUser.rows[0]);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, user.rows[0]);
    } catch (err) {
        done(err, null);
    }
});

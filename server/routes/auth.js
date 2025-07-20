const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const db = require('../db');
require('../config/passport'); // Import passport config

const router = express.Router();

// Nodemailer transporter setup
// TODO: paste your EMAIL_USER & EMAIL_PASS in Windsurf Environments or .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const verification_token = crypto.randomBytes(32).toString('hex');
    const verification_token_expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash, provider, verification_token, verification_token_expiry) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email',
      [name, email, password_hash, 'local', verification_token, verification_token_expiry]
    );

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${verification_token}`;
    await transporter.sendMail({
      from: `"Debate Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `<b>Please click the following link to verify your email:</b> <a href="${verificationLink}">${verificationLink}</a>`,
    });

    res.status(201).json({ success: true, message: 'Check your email for a verification link.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
});

// GET /auth/verify?token=...
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  try {
    const user = await db.query('SELECT * FROM users WHERE verification_token = $1 AND verification_token_expiry > NOW()', [token]);

    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
    }

    await db.query('UPDATE users SET email_verified = true, verification_token = NULL, verification_token_expiry = NULL WHERE id = $1', [user.rows[0].id]);

    // TODO: Redirect to a more robust success page on the frontend
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during verification.' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const user = result.rows[0];

        if (user.provider !== 'local') {
            return res.status(400).json({ message: `Please log in using your ${user.provider} account.` });
        }

        if (!user.email_verified) {
            return res.status(401).json({ message: 'Email not verified. Please check your inbox or resend the verification email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, provider: user.provider }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /auth/resend-verification
router.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
    try {
        const verification_token = crypto.randomBytes(32).toString('hex');
        const verification_token_expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        const result = await db.query(
            'UPDATE users SET verification_token = $1, verification_token_expiry = $2 WHERE email = $3 AND provider = \'local\' RETURNING id',
            [verification_token, verification_token_expiry, email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found or is not a local account.' });
        }

        const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${verification_token}`;
        await transporter.sendMail({
            from: `"Debate Platform" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email Address (Resend)',
            html: `<b>Please click the following link to verify your email:</b> <a href="${verificationLink}">${verificationLink}</a>`,
        });

        res.json({ success: true, message: 'Verification email resent.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /auth/google
router.get('/google', passport.authenticate('google'));

// GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
    const token = jwt.sign({ id: req.user.id, provider: req.user.provider }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // TODO: Redirect to the frontend with the token in a more secure way (e.g., query param for a script that stores it)
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
});

module.exports = router;

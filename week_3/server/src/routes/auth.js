// routes/auth.js
// Endpoints for signup, login, logout, and "get me".
// Passwords are hashed with bcrypt (one-way cryptographic scramble).
// Sessions are stored in PostgreSQL, not in memory.
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { COOKIE_OPTIONS } from '../db/sessionStore.js';

const router = Router();

// Validate email format (simple regex) and password length.
// Returns an error message string or null if valid.
function validateSignup({ name, email, password }) {
  if (typeof name !== 'string' || name.trim().length < 2) {
    return 'Please enter a name (at least 2 characters)';
  }
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return 'Enter a valid email address';
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
    return 'Password must be 8 to 72 characters';
  }
  return null;
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body ?? {};
  const error = validateSignup({ name, email, password });
  if (error) {
    return res.status(400).json({ error });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const passwordHash = await bcrypt.hash(password, 10); // 10 = rounds of scrambling

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at AS "createdAt"`,
      [name.trim(), cleanEmail, passwordHash],
    );

    const user = result.rows[0];
    // Store user info in the session (not in a JWT)
    req.session.user = { id: user.id, email: user.email, name: user.name };
    req.session.save(() => {
      res.status(201).json({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
    });
  } catch (error) {
    // 23505 = PostgreSQL "unique violation" -> email already registered.
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error(error);
    res.status(500).json({ error: 'Could not create account' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query(
      `SELECT id, email, name, password_hash, created_at AS "createdAt"
       FROM users WHERE email = $1`,
      [email.trim().toLowerCase()],
    );
    const user = result.rows[0];

    // Same message for "no such email" and "wrong password" prevents attackers
    // from discovering which emails are registered.
    const passwordOk = user && (await bcrypt.compare(password, user.password_hash));
    if (!passwordOk) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Store user info in the session (HttpOnly cookie = secure)
    req.session.user = { id: user.id, email: user.email, name: user.name };
    req.session.save(() => {
      res.json({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not log in' });
  }
});

// GET /api/auth/me
// The session middleware already populated req.session.user if the cookie was valid.
router.get('/me', (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json({ id: req.session.user.id, name: req.session.user.name, email: req.session.user.email });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid', COOKIE_OPTIONS);
    res.json({ message: 'Logged out' });
  });
});

export default router;
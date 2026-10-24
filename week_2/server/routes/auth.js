import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true, // JavaScript in the browser can't read it (protects against XSS)
  secure: process.env.NODE_ENV === 'production', // HTTPS only when deployed
  sameSite: 'lax', // the browser won't send it on most cross-site requests
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, in milliseconds
};

// Create a signed token holding the user's id, and store it in the cookie.
function setAuthCookie(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, COOKIE_OPTIONS);
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body ?? {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Enter a valid email' });
  }
  // bcrypt only uses the first 72 characters, so we cap the length there.
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
    return res.status(400).json({ error: 'Password must be 8 to 72 characters' });
  }

  try {
    // 10 = how many times bcrypt scrambles (higher = slower for attackers, and for us).
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2)
       RETURNING id, email, created_at AS "createdAt"`,
      [cleanEmail, passwordHash],
    );
    const user = result.rows[0];

    setAuthCookie(res, user.id); // signing up also logs you in
    res.status(201).json(user);
  } catch (error) {
    // 23505 = Postgres "unique violation": our UNIQUE rule on email was triggered.
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
      `SELECT id, email, password_hash, created_at AS "createdAt"
       FROM users WHERE email = $1`,
      [email.trim().toLowerCase()],
    );
    const user = result.rows[0];

    // Same message for "no such email" and "wrong password", so attackers
    // can't use the error to find out which emails are registered.
    const passwordOk = user && (await bcrypt.compare(password, user.password_hash));
    if (!passwordOk) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    setAuthCookie(res, user.id);
    // Never send password_hash back to the client.
    res.json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not log in' });
  }
});

// GET /api/auth/me: "who am I?" The React app will call this on page load.
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at AS "createdAt" FROM users WHERE id = $1',
      [req.userId],
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load user' });
  }
});

// POST /api/auth/logout: remove the cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'Logged out' });
});

export default router;
// server.js: entry point for the Express server.
// Loads environment variables, configures middleware, mounts routes.
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import itemsRouter from './src/routes/items.js';
import authRouter from './src/routes/auth.js';
import { sessionStore, COOKIE_OPTIONS } from './src/db/sessionStore.js';
import { configureCors } from './src/middleware/cors.js';

// Fail early if required env vars are missing.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in server/.env');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: parse request bodies and cookies.
app.use(express.json());
app.use(cookieParser());

// Session middleware with PostgreSQL-backed store.
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
    resave: false,          // don't resave session if unmodified
    saveUninitialized: false, // don't create session until something is stored
    cookie: COOKIE_OPTIONS,
  }),
);

// CORS for cross-origin requests (needed when frontend is on Vercel,
// backend on Railway).
configureCors(app);

// API routes.
app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);

// Health check endpoint (Railway expects one).
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

export default app;
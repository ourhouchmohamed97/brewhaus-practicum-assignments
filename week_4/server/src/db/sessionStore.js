// db/sessionStore.js: PostgreSQL-backed session storage.
// express-session calls these four methods. connect-pg-simple implements them
// against the `session` table created by 001_schema.sql.
import pg from 'pg';
import ConnectPGSimple from 'connect-pg-simple';
import session from 'express-session';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const PgSessionStore = ConnectPGSimple(session);

// The session store is what makes login survive a server restart: the data
// lives in PostgreSQL, not in the process's memory.
export const sessionStore = new PgSessionStore({
  pool,
  tableName: 'session',
  // How often (ms) the store prunes expired sessions. Default 60s is fine.
  pruneSessionInterval: 60 * 1000,
});

// Shared cookie options. `secure` flips on automatically in production.
export const COOKIE_OPTIONS = {
  httpOnly: true, // JavaScript cannot read it -> protects against XSS
  secure: process.env.NODE_ENV === 'production', // HTTPS only when deployed
  sameSite: 'lax', // browser won't send it on most cross-site requests
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
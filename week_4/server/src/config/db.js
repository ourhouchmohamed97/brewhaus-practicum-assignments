// config/db.js: creates the database connection ONCE and shares it with
// every route / session store. A Pool keeps a few connections open and
// reuses them, which is faster than reconnecting on every request.
import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (err) => {
  // An idle connection error should not crash the whole server.
  console.error('Database pool error:', err.message);
});

export default pool;
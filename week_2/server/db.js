// db.js: creates the database connection ONCE and shares it with every route.
import 'dotenv/config';
import pg from 'pg';

// A Pool keeps a few connections open and reuses them, which is faster than
// reconnecting to Neon on every request.
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export default pool;
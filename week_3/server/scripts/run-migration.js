// Run database migrations programmatically
import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing');
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read and execute the orders migration
    const sqlPath = path.join(process.cwd(), 'scripts', '002_add_orders.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        console.log(`Executing: ${trimmed.substring(0, 60)}...`);
        await client.query(trimmed);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

runMigration();
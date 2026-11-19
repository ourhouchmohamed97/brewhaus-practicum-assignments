// 002_seed.js
// Populates the `items` table from the Week 2 dataset.
// Safe to run repeatedly: it TRUNCATEs first, so it never creates duplicates.
//
//   node server/scripts/002_seed.js
//
// The connection string comes from server/.env (loaded by dotenv).

import 'dotenv/config';
import pg from 'pg';
import { items } from '../../client/src/data/items.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // TRUNCATE ... RESTART IDENTITY: empties the table AND resets the
    // auto-increment counter, so re-running the seed gives the same ids.
    await client.query('TRUNCATE TABLE items RESTART IDENTITY');

    for (const item of items) {
      await client.query(
        `INSERT INTO items
           (name, destination, category, badge, price, days, nights,
            rating, image, image_alt, description, features)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          item.title,
          item.destination,
          item.category,
          item.badge,
          item.price,
          item.days,
          item.nights,
          item.rating,
          item.image,
          item.imageAlt,
          item.description,
          item.features,
        ],
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${items.length} items.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
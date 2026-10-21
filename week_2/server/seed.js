import 'dotenv/config';
import pg from 'pg';
import { tours } from '../client/src/data/tours.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('TRUNCATE TABLE tours RESTART IDENTITY');

    for (const tour of tours) {
      await client.query(
        `INSERT INTO tours
           (title, destination, category, badge, price, days, nights,
            rating, image, image_alt, description, features)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          tour.title,
          tour.destination,
          tour.category,
          tour.badge,
          tour.price,
          tour.days,
          tour.nights,
          tour.rating,
          tour.image,
          tour.imageAlt,
          tour.description,
          tour.features,
        ],
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${tours.length} tours.`);
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
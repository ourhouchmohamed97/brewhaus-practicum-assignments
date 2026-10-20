
import 'dotenv/config';
import pool from './db.js';

const tours = [
  {
    title: 'Alpine Escape',
    destination: 'Swiss Alps',
    category: 'Adventure',
    badge: 'Popular',
    price: 1299,
    days: 7,
    nights: 6,
    rating: 4.9,
    image: '/images/alpine.svg',
    image_alt: 'Mountain scenery in the Swiss Alps',
    description: 'Explore mountain trails and beautiful alpine villages.',
    features: ['Mountain hiking', 'Scenic views', 'Local cuisine'],
  },
  {
    title: 'Desert Discovery',
    destination: 'Sahara Desert',
    category: 'Adventure',
    badge: 'Featured',
    price: 899,
    days: 5,
    nights: 4,
    rating: 4.8,
    image: '/images/desert.svg',
    image_alt: 'Golden sand dunes in the desert',
    description: 'Experience desert landscapes and traditional culture.',
    features: ['Camel ride', 'Desert camp', 'Sunset views'],
  },
  {
    title: 'Coastal Retreat',
    destination: 'Mediterranean Coast',
    category: 'Relaxation',
    badge: null,
    price: 749,
    days: 4,
    nights: 3,
    rating: 4.7,
    image: '/images/coast.svg',
    image_alt: 'Clear blue water along the Mediterranean coast',
    description: 'Enjoy peaceful beaches and charming coastal towns.',
    features: ['Beach time', 'Boat trip', 'Local food'],
  },
];

async function seedTours() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const tour of tours) {
      await client.query(
        `INSERT INTO tours (
          title, destination, category, badge, price,
          days, nights, rating, image, image_alt,
          description, features
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12
        )`,
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
          tour.image_alt,
          tour.description,
          tour.features,
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`Successfully inserted ${tours.length} tours.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to seed tours:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedTours();

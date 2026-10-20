
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
}));

app.use(express.json());

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Wanderlust API is running!' });
});

// Get all tours
app.get('/api/tours', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tours ORDER BY id ASC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tours:', error.message);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

// Get one tour by ID
app.get('/api/tours/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid tour ID' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM tours WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tour:', error.message);
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Wanderlust API running at http://localhost:${PORT}`);
});

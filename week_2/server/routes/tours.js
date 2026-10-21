import { Router } from 'express';
import pool from '../db.js';

const router = Router();

const TOUR_COLUMNS = `
  id, title, destination, category, badge, price, days, nights,
  rating::float AS rating, image, image_alt AS "imageAlt", description, features
`;

// GET /api/tours: list all tours
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT ${TOUR_COLUMNS} FROM tours ORDER BY id`);
    res.json(result.rows); // rows is an array of objects, sent as JSON
  } catch (error) {
    console.error(error); // full details stay in the server log
    res.status(500).json({ error: 'Could not load tours' }); // safe message for the client
  }
});

// GET /api/tours/:id: one tour (the :id part is available as req.params.id)
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Reject things like /api/tours/abc before touching the database.
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid tour id' });
  }

  try {
    // $1 is a placeholder: the value is sent separately, so SQL injection is impossible.
    const result = await pool.query(`SELECT ${TOUR_COLUMNS} FROM tours WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load tour' });
  }
});

export default router;
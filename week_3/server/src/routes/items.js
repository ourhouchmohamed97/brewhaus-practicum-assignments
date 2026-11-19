// routes/items.js
// GET /api/items       -> every item, ordered by id
// GET /api/items/:id   -> a single item
import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// The column list lives in one place so both endpoints stay in sync.
const ITEM_COLUMNS = `
  id, name, destination, category, badge, price, days, nights,
  rating::float AS rating, image, image_alt AS "imageAlt",
  description, features, created_at AS "createdAt"
`;

// GET /api/items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT ${ITEM_COLUMNS} FROM items ORDER BY id`);
    res.json(result.rows);
  } catch (error) {
    console.error(error); // full details stay in the server log
    res.status(500).json({ error: 'Could not load items' }); // safe message for the client
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Reject things like /api/items/abc before touching the database.
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid item id' });
  }

  try {
    const result = await pool.query(`SELECT ${ITEM_COLUMNS} FROM items WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load item' });
  }
});

export default router;
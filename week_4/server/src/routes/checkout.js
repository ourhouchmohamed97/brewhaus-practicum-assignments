// routes/checkout.js
// POST /api/checkout - Create a Stripe Checkout Session
// Requires authentication (user must be logged in)
import { Router } from 'express';
import Stripe from 'stripe';
import pool from '../config/db.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Helper: convert items array to Stripe line items
function buildLineItems(items, clientUrl) {
  return items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title,
        images: item.image ? [`${clientUrl}${item.image}`] : undefined,
        description: item.description,
      },
      unit_amount: Math.round(item.price * 100), // convert to cents
    },
  }));
}

// Helper: calculate total amount from items
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// POST /api/checkout
// Creates a Stripe Checkout Session for the items in the cart.
// Body: { items: [{ id: itemId, quantity: number }] }
router.post('/', requireAuth, async (req, res) => {
  const { items } = req.body;
  const userId = req.session.user.id;

  // Validate items array
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  for (const item of items) {
    if (!item.id || item.quantity <= 0) {
      return res.status(400).json({ error: 'Invalid cart item' });
    }
  }

  try {
    // Fetch full item details from database (don't trust client prices)
    const itemIds = items.map((i) => i.id);
    const placeholders = itemIds.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `SELECT id, name, destination, price, description, image FROM items WHERE id IN (${placeholders})`,
      itemIds
    );

    if (result.rows.length !== items.length) {
      return res.status(400).json({ error: 'One or more items not found' });
    }

    const itemsWithDetails = result.rows.map((row, idx) => ({
      id: row.id,
      title: row.name,
      price: parseFloat(row.price),
      description: row.description,
      image: row.image,
      quantity: items[idx].quantity,
    }));

    // Calculate total
    const totalAmount = calculateTotal(itemsWithDetails);
    const lineItems = buildLineItems(itemsWithDetails, process.env.CLIENT_URL);

    // Create a pending order in the database first (for tracking)
    const orderItems = itemsWithDetails.map((i) => ({
      itemId: i.id,
      quantity: i.quantity,
      priceAtPurchase: i.price,
    }));

    // Insert order with a temporary unique placeholder
    const tempSessionId = `temp_${Date.now()}_${userId}`;
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, stripe_checkout_session_id, total_amount, currency, items)
       VALUES ($1, $2, $3, 'usd', $4)
       RETURNING id`,
      [userId, tempSessionId, totalAmount, JSON.stringify(orderItems)]
    );

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL}?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: userId.toString(),
        orderId: orderResult.rows[0].id.toString(),
      },
    });

    // Update order with the actual Stripe checkout session ID
    await pool.query(
      `UPDATE orders SET stripe_checkout_session_id = $1 WHERE id = $2`,
      [checkoutSession.id, orderResult.rows[0].id]
    );

    res.json({ checkoutUrl: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    console.error('Error message:', error.message);
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
    res.status(500).json({ error: 'Could not create checkout session', details: error.message });
  }
});

export default router;
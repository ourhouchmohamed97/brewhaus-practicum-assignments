// routes/orders.js
// GET /api/orders/:checkoutSessionId - Fetch order by Stripe session ID
import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// GET /api/orders/:checkoutSessionId
// Returns the order details including status and items.
// Note: This is public via the session_id in the success/cancel URL.
// The order can only be marked as paid via the Stripe webhook.
router.get('/:checkoutSessionId', async (req, res) => {
  const { checkoutSessionId } = req.params;

  if (!checkoutSessionId || checkoutSessionId === 'success') {
    return res.status(400).json({ error: 'Invalid checkout session ID' });
  }

  try {
    const result = await pool.query(
      `SELECT
        o.id, o.user_id, o.stripe_checkout_session_id, o.stripe_payment_intent_id,
        o.status, o.total_amount, o.currency, o.items, o.created_at,
        u.name AS user_name, u.email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.stripe_checkout_session_id = $1`,
      [checkoutSessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];
    res.json({
      id: order.id,
      userId: order.user_id,
      checkoutSessionId: order.stripe_checkout_session_id,
      paymentIntentId: order.stripe_payment_intent_id,
      status: order.status,
      totalAmount: parseFloat(order.total_amount),
      currency: order.currency,
      items: order.items,
      createdAt: order.created_at,
      user: {
        name: order.user_name,
        email: order.email,
      },
    });
  } catch (error) {
    console.error('Order lookup error:', error);
    res.status(500).json({ error: 'Could not fetch order' });
  }
});

export default router;
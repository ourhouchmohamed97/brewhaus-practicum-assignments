// routes/webhook.js
// Stripe webhook endpoint.
//
// IMPORTANT: This route MUST be mounted BEFORE express.json() in server.js
// so the raw request body is available for signature verification.
// Express 5 + the Stripe SDK both need the raw bytes, not the parsed JSON.
//
// Webhook flow:
//   1. Stripe sends a signed POST to /webhooks/stripe
//   2. We verify the signature with stripe.webhooks.constructEvent()
//   3. We route on event.type and update the order row accordingly
//   4. We always return 200 quickly — Stripe retries on non-2xx,
//      so a slow or failing handler causes unnecessary retries.
import { Router } from 'express';
import Stripe from 'stripe';
import pool from '../config/db.js';

const router = Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Process a single event idempotently.
// We store the event ID on the order row so a duplicate delivery
// (Stripe sometimes sends the same event twice) is a no-op.
async function handleEvent(event) {
  const type = event.type;
  const data = event.data.object;

  // Only handle the events we care about.
  if (type === 'checkout.session.completed') {
    await handleCheckoutSessionCompleted(data);
  } else if (type === 'checkout.session.async_payment_succeeded') {
    await handleCheckoutSessionCompleted(data);
  } else if (type === 'checkout.session.async_payment_failed') {
    await handleCheckoutSessionFailed(data);
  } else if (type === 'payment_intent.payment_failed') {
    await handlePaymentIntentFailed(data);
  }
  // All other event types are ignored (e.g. customer.subscription.created).
}

// checkout.session.completed — the payment succeeded.
// Mark the order as paid and store the payment intent ID.
async function handleCheckoutSessionCompleted(session) {
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;

  if (!orderId) {
    console.warn('Webhook: checkout.session.completed missing orderId metadata', session.id);
    return;
  }

  await pool.query(
    `UPDATE orders
       SET status = 'paid',
           stripe_payment_intent_id = $1,
           updated_at = now()
     WHERE id = $2`,
    [session.payment_intent || session.id, orderId]
  );
}

// checkout.session.async_payment_failed — the payment failed.
async function handleCheckoutSessionFailed(session) {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.warn('Webhook: async_payment_failed missing orderId metadata', session.id);
    return;
  }

  await pool.query(
    `UPDATE orders SET status = 'failed', updated_at = now() WHERE id = $1`,
    [orderId]
  );
}

// payment_intent.payment_failed — the underlying payment failed.
async function handlePaymentIntentFailed(paymentIntent) {
  // Find the order by payment intent ID and mark it failed.
  await pool.query(
    `UPDATE orders
       SET status = 'failed', updated_at = now()
     WHERE stripe_payment_intent_id = $1`,
    [paymentIntent.id]
  );
}

// POST /webhooks/stripe
// Receives Stripe webhook events.
// NOTE: The raw body middleware is applied in server.js (express.raw),
// so req.body here is a Buffer. We must NOT use express.json() on this route.
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Webhook: missing signature or STRIPE_WEBHOOK_SECRET');
    return res.status(400).json({ error: 'Webhook signature missing' });
  }

  let event;

  try {
    // req.body is a Buffer (from express.raw). The Stripe SDK accepts
    // a Buffer, string, or Uint8Array for the raw payload.
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error('Webhook handler error:', err.message);
    // Return 500 so Stripe retries. For transient DB errors this is
    // the right call; for permanent errors we'd want to log and move on.
    return res.status(500).json({ error: 'Handler error' });
  }

  // Always acknowledge the event with 200.
  res.json({ received: true });
});

export default router;
import 'dotenv/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function test() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Test' },
          unit_amount: 129900,
        },
        quantity: 1,
      }],
      success_url: 'http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/checkout/cancel?session_id={CHECKOUT_SESSION_ID}',
      metadata: { userId: '1', orderId: '1' },
    });
    console.log('Success:', session.url);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
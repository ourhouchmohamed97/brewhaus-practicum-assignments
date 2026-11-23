-- 002_add_orders.sql
-- Add Stripe checkout support to the database.
-- Run this AFTER 001_schema.sql to add orders and order_items tables.
--
-- Run once:
--   psql "$DATABASE_URL" -f server/scripts/002_add_orders.sql

-- ----------------------------------------------------------------------------
-- orders
--   One row per successful checkout. Stores the Stripe identifiers,
--   the total amount, and the status of the payment.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                      SERIAL PRIMARY KEY,
  user_id                 INTEGER REFERENCES users(id) ON DELETE CASCADE,
  stripe_checkout_session_id VARCHAR NOT NULL UNIQUE,  -- from Stripe Checkout
  stripe_payment_intent_id  VARCHAR,                    -- from the Checkout Session
  status                    TEXT NOT NULL DEFAULT 'pending',  -- pending, paid, failed, cancelled
  total_amount              NUMERIC(10,2) NOT NULL,           -- sum of items at purchase time
  currency                  TEXT NOT NULL DEFAULT 'usd',
  items                     JSON NOT NULL,                    -- array of {itemId, quantity, priceAtPurchase}
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for orders table
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders (stripe_checkout_session_id);

-- ----------------------------------------------------------------------------
-- order_items
--   Optional: individual items in an order. Useful for order details page.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  item_id      INTEGER REFERENCES items(id) ON DELETE RESTRICT,
  quantity     INTEGER NOT NULL DEFAULT 1,
  price_at_purchase NUMERIC(10,2) NOT NULL    -- snapshot of price when purchased
);

-- ----------------------------------------------------------------------------
-- Helper: add unique constraint on session_checkout_id if the table
-- already exists from a previous run
-- ----------------------------------------------------------------------------
-- ALTER TABLE orders ADD CONSTRAINT unique_stripe_session UNIQUE (stripe_checkout_session_id);
-- This is handled by the UNIQUE in CREATE TABLE IF NOT EXISTS above.
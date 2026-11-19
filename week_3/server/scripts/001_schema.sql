-- 001_schema.sql
-- Run once against your Neon PostgreSQL database:
--   psql "$DATABASE_URL" -f server/scripts/001_schema.sql
--
-- Every table is explained below in beginner-friendly language.

-- ----------------------------------------------------------------------------
-- users
--   One row per person who signs up. Stores the credentials needed to
--   authenticate them (email + password hash) plus a display name.
--   UNIQUE on email stops the same address registering twice.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,              -- auto-incrementing number, one per user
  name          TEXT NOT NULL,                   -- display name shown in the header
  email         TEXT NOT NULL UNIQUE,             -- login email; UNIQUE = cannot register twice
  password_hash TEXT NOT NULL,                   -- bcrypt hash, NEVER the plain password
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now() -- when the account was created
);

-- ----------------------------------------------------------------------------
-- items
--   One row per travel package (the same data as Assignment 2's tours.js).
--   The React app reads this table through GET /api/items.
--   features is stored as a JSON array so a single column holds the list.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,                    -- tour title, e.g. "Alpine Summit Expedition"
  destination TEXT NOT NULL,                    -- where in the world
  category    TEXT NOT NULL,                    -- Adventure | Cultural | Beach | Luxury
  badge       TEXT,                             -- label on the card image
  price       NUMERIC(10,2) NOT NULL,             -- starting price in USD
  days        INTEGER NOT NULL,
  nights      INTEGER NOT NULL,
  rating      NUMERIC(3,1) NOT NULL,              -- e.g. 4.9
  image       TEXT NOT NULL,                    -- path under /public/images
  image_alt   TEXT NOT NULL,                    -- alt text for accessibility
  description TEXT NOT NULL,
  features    TEXT[] NOT NULL DEFAULT '{}',      -- array of bullet points
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index so filtering/sorting by category is fast even as the table grows.
CREATE INDEX IF NOT EXISTS idx_items_category ON items (category);

-- ----------------------------------------------------------------------------
-- session
--   One row per logged-in browser. express-session + connect-pg-simple store
--   each session here instead of keeping it in memory (which would be lost on
--   every restart). The cookie in the browser only holds a random session ID;
--   the actual data (who is logged in) lives here, unreadable by JavaScript.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session (
  sid    VARCHAR PRIMARY KEY,                 -- random session ID from the cookie
  sess   JSON NOT NULL,                       -- the session data, stored as JSON
  expire TIMESTAMPTZ NOT NULL                 -- when the session expires
);

CREATE INDEX IF NOT EXISTS idx_session_expire ON session (expire);
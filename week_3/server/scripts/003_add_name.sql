-- 003_add_name.sql
-- The `users` table may already exist from Assignment 2 without a `name` column.
-- This migration adds it safely (IF NOT EXISTS means it is a no-op on fresh DBs).
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
-- Preview seed data for misc-astro (ephemeral per-PR D1 databases).
--
-- This file runs on EVERY preview deploy (pushes re-run the workflow), so
-- every statement in it must be IDEMPOTENT. Re-running it against an already
-- seeded database must succeed without errors.
--
-- Rules:
--   - Use `INSERT OR IGNORE` for fixture rows with fixed primary keys, or
--     `INSERT ... ON CONFLICT(...) DO UPDATE SET ...` when the seed should
--     refresh existing rows.
--   - Never use bare `INSERT` into a table with a UNIQUE / PRIMARY KEY
--     constraint: the second deploy of the same PR would fail with a
--     UNIQUE constraint violation.
--   - Keep this file free of DDL. Schema changes belong in `migrations/`.
--
-- Intentionally a no-op for now: no tables exist yet. Example once a table
-- ships (in a migration, not here):
-- INSERT OR IGNORE INTO example (id, name) VALUES (1, 'preview fixture');

SELECT 1;

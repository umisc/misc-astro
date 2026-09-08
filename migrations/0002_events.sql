-- Events table, mirroring the content/events.json model.
--
-- Columns map 1:1 to the content collection fields:
--   id                -> id            (TEXT PRIMARY KEY, e.g. 2025-03-06-gameshownight)
--   title             -> title
--   description       -> description   (card copy)
--   modal_description -> modalDescription
--   category          -> category      (Workshop | Social | Industry)
--   image             -> image         (relative asset path)
--   date_iso          -> dateISO       (YYYY-MM-DD)

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  modal_description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('Workshop', 'Social', 'Industry')),
  image TEXT NOT NULL DEFAULT '',
  date_iso TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_events_date_iso ON events (date_iso, title);

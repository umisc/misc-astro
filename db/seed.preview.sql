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
-- Fixture events modelled on content/events.json (one per category).
-- Fixed primary keys + INSERT OR IGNORE keep this safe to re-run.

INSERT OR IGNORE INTO events (id, title, description, modal_description, category, image, date_iso) VALUES
  ('2025-03-06-gameshow-night-3', 'Gameshow Night', '🎲 A night of trivia, prizes, and brain-teasers!', '🎉 Get ready for the ultimate Game Show Night with WIT & MISC! Think you have what it takes to outsmart the competition? Join us for an electrifying night filled with brain-teasers, gameshow-inspired rounds, and epic prizes!

🗓 Thursday March 6th, 2025
🕕 6:00 PM – 8:00 PM
📍 Clyde Hotel, 385 Cardigan St, Carlton

Come for the trivia, stay for the fun! Meet fellow gaming enthusiasts, show off your skills, and enjoy a great time with your friends. Let the games begin!', 'Social', './images/events/gameshownight.png', '2025-03-06'),
  ('2025-03-13-intro-to-cybersecurity-workshop-4', 'Intro to Cybersecurity Workshop', '🛡️ Learn the basics of cybersecurity with us!', '🛡️ Ready to dive into the world of cybersecurity? Join us for an Intro to Cybersecurity Workshop!

🗓 Thursday March 13
🕠 5:30 PM – 6:30 PM
📍 Sidney Myer G07

Whether you''re completely new to cybersecurity or just looking to learn the basics, this workshop is perfect for you! Plus, enjoy free food while you learn and get the chance to mingle with fellow digital defenders!', 'Workshop', './images/events/introcypersecurity.png', '2025-03-13'),
  ('2025-03-20-cyber-security-pathways-navigating-your-future-in-cybersecurity-5', 'Cyber Security Pathways: Navigating Your Future in Cybersecurity', '🧭 Explore the many career paths in cybersecurity!', '🧭 Are you a student looking to learn more about cyber security pathways? Then this event is for you!

Join us on this unique opportunity to get all your burning questions answered, connect with industry leaders, and find your path in cyber!

🌐 Panel Discussion: Get the inside scoop from pros in Security Operations, Architecture, AppSec, GRC, and more!
⚡ Speed Group Interactions: Discover your niche through fast-paced, focused discussions.
📚 Exclusive Resources: Learn how to access valuable materials from ISACA Foundation Melbourne to jumpstart your cyber career.', 'Industry', './images/events/cybersecuritypathways.png', '2025-03-20');


-- Remove seeded brands
DELETE FROM brands WHERE system IN ('faa', 'hsomni', 'seedwave');

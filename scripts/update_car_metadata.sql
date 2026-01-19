-- 1. Create fuel_types table
CREATE TABLE IF NOT EXISTS fuel_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO fuel_types (name) VALUES ('Petrol'), ('Diesel') 
ON CONFLICT (name) DO NOTHING;

-- 2. Ensure columns exist on cars table
ALTER TABLE cars ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS fuel_type TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS seats INTEGER;

-- 3. Randomly populate data for existing cars
-- We use a dummy correlation (c.id) and arrays to force per-row randomization in Postgres
UPDATE cars c
SET 
    location = (SELECT name FROM locations ORDER BY random() * (c.id IS NOT NULL)::int LIMIT 1),
    fuel_type = (ARRAY['Petrol', 'Diesel'])[floor(random() * 2 + 1)],
    seats = (ARRAY[2, 4, 5, 7])[floor(random() * 4 + 1)];




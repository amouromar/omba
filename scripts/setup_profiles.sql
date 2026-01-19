-- Update profiles table for Clerk integration and additional verification fields

-- 1. Drop dependent foreign key constraints
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;

-- 2. Drop the foreign key and primary key constraints on profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey;

-- 3. Alter dependent columns to TEXT to match clerk_id type
ALTER TABLE public.bookings ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.reviews ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.favorites ALTER COLUMN user_id TYPE TEXT;

-- 4. Add clerk_id column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- 5. Set clerk_id as the new primary key
-- Note: Populate clerk_id from existing data or clear table if needed
ALTER TABLE public.profiles ALTER COLUMN clerk_id SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (clerk_id);

-- 6. Re-add dependent foreign key constraints pointing to clerk_id
ALTER TABLE public.bookings ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(clerk_id) ON DELETE CASCADE;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(clerk_id) ON DELETE CASCADE;
ALTER TABLE public.favorites ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(clerk_id) ON DELETE CASCADE;

-- 5. Add/Update other columns
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS national_id_number TEXT,
  ADD COLUMN IF NOT EXISTS national_id_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS driver_license_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS house_number TEXT,
  ADD COLUMN IF NOT EXISTS selfie_url TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'USER';

-- Create index on clerk_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Define a function to check if a user is an admin without causing infinite recursion
-- SECURITY DEFINER allows the function to run with the privileges of the creator (bypassing RLS)
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'ADMIN' 
    FROM public.profiles 
    WHERE clerk_id = auth.jwt() ->> 'sub'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create policy to allow users to see their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (clerk_id = auth.jwt() ->> 'sub');

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (clerk_id = auth.jwt() ->> 'sub');

-- Create policy for admins to see and manage all profiles
-- Using public.is_admin() to avoid recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR ALL 
USING (public.is_admin());

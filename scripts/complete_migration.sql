-- Complete fix for profiles table migration to use clerk_id
-- Run this in your Supabase SQL Editor

-- 1. Drop dependent foreign key constraints
ALTER TABLE IF EXISTS public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE IF EXISTS public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE IF EXISTS public.favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;

-- 2. Drop the old primary key constraint on profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Drop the old id column if it exists
ALTER TABLE public.profiles DROP COLUMN IF EXISTS id;

-- 4. Ensure clerk_id column exists and is set up correctly
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clerk_id TEXT;
ALTER TABLE public.profiles ALTER COLUMN clerk_id SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (clerk_id);

-- 5. Alter dependent columns to TEXT to match clerk_id type
ALTER TABLE IF EXISTS public.bookings ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.reviews ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.favorites ALTER COLUMN user_id TYPE TEXT;

-- 6. Re-add dependent foreign key constraints pointing to clerk_id
ALTER TABLE IF EXISTS public.bookings 
  ADD CONSTRAINT bookings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(clerk_id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.reviews 
  ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(clerk_id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.favorites 
  ADD CONSTRAINT favorites_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(clerk_id) ON DELETE CASCADE;

-- 7. Ensure all required columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS national_id_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS driver_license_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS national_id_photo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS driver_license_photo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS house_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS selfie_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'USER';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 8. Create index on clerk_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);

-- 9. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 10. Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 11. Create INSERT policy (allows users to create their own profile)
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- 12. Create SELECT policy (allows users to view their own profile)
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (clerk_id = auth.jwt() ->> 'sub');

-- 13. Create UPDATE policy (allows users to update their own profile)
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (clerk_id = auth.jwt() ->> 'sub');

-- 14. Create admin function
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

-- 15. Create admin policy (allows admins to manage all profiles)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin());

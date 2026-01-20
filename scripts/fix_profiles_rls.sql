-- Fix Profiles Table Schema and RLS Policies
-- VERSION 1.0 - Optimized for Clerk Integration

-- 1. Ensure all columns exist
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

-- 2. Clear existing policies for this table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 3. Create SELECT policy
-- We use public to avoid 'TO authenticated' issues with Clerk JWTs
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (clerk_id = auth.jwt() ->> 'sub');

-- 4. Create INSERT policy
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- 5. Create UPDATE policy
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (clerk_id = auth.jwt() ->> 'sub');

-- 6. Admin Policy (if is_admin() function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        EXECUTE 'CREATE POLICY "Admins can view all profiles"
        ON public.profiles FOR ALL
        USING (public.is_admin())';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;

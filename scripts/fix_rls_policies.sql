-- Fix RLS policy to allow users to insert their own profile
-- This should be run in your Supabase SQL Editor

-- Drop the existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create policy to allow users to INSERT their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- Create policy to allow users to SELECT their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (clerk_id = auth.jwt() ->> 'sub');

-- Create policy to allow users to UPDATE their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (clerk_id = auth.jwt() ->> 'sub');

-- Create policy for admins to see and manage all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin());

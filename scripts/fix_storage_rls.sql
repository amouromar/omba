-- Fix Storage RLS policies for user-documents bucket
-- DIAGNOSTIC VERSION

-- Ensure bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-documents', 'user-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all documents" ON storage.objects;
DROP POLICY IF EXISTS "Diagnostic Permissive Upload" ON storage.objects;

-- 1. Try a slightly more permissive policy for authenticated users
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-documents' AND
  (name LIKE (auth.jwt() ->> 'sub') || '/%')
);

-- 2. DIAGNOSTIC: Allow ALL authenticated users to upload to THIS bucket
-- If this fails, then Supabase is not recognizing the user as authenticated (Secret mismatch)
CREATE POLICY "Diagnostic Permissive Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-documents'
);

-- 3. Diagnostic SELECT
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-documents' AND
  (name LIKE (auth.jwt() ->> 'sub') || '/%')
);

-- Always allow admins
CREATE POLICY "Admins can manage all documents"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'user-documents' AND
  public.is_admin()
);

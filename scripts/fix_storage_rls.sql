-- Fix Storage RLS policies for user-documents bucket
-- VERSION 2.1 - Simplified for Permissions Compatibility

-- 1. Ensure bucket exists and is private
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-documents', 'user-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Clear existing policies for this bucket
-- We use standard DROP POLICY instead of direct system catalog manipulation
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage all documents" ON storage.objects;
DROP POLICY IF EXISTS "Diagnostic Permissive Upload" ON storage.objects;

-- 3. INSERT Policy: Allow users to upload to their own folder
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-documents' AND
  (name LIKE (auth.jwt() ->> 'sub') || '/%')
);

-- 4. SELECT Policy: Allow users to view their own documents
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-documents' AND
  (name LIKE (auth.jwt() ->> 'sub') || '/%')
);

-- 5. UPDATE Policy: Allow users to update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-documents' AND
  (name LIKE (auth.jwt() ->> 'sub') || '/%')
);

-- 6. DELETE Policy: Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-documents' AND
  (name LIKE (auth.jwt() ->> 'sub') || '/%')
);

-- 7. Admin Policy (if is_admin() function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        EXECUTE 'CREATE POLICY "Admins can manage all documents"
        ON storage.objects FOR ALL
        USING (
            bucket_id = ''user-documents'' AND
            public.is_admin()
        )';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;

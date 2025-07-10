-- ====================================
-- STORAGE CONFIGURATION MIGRATION
-- ====================================
-- This migration sets up storage buckets and policies for file management
-- Handles profile images and other user-uploaded content
-- Includes security policies to ensure users can only access their own files

-- ====================================
-- STORAGE BUCKET CREATION
-- ====================================

-- Create the profiles bucket for user profile images
-- This bucket stores user avatars and profile-related images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',           -- Bucket identifier
  'profiles',           -- Bucket display name
  true,                 -- Public access (files are publicly viewable via URL)
  52428800,            -- 50MB file size limit (50 * 1024 * 1024 bytes)
  '{"image/*"}'        -- Only allow image files (jpg, png, gif, webp, etc.)
);

-- ====================================
-- STORAGE SECURITY POLICIES
-- ====================================
-- These policies control who can upload, view, update, and delete files
-- Files are organized by user ID in the bucket structure: profiles/{user_id}/filename.ext

-- Policy: Users can upload their own profile images
-- Allows authenticated users to upload files to their own folder
-- File path structure: profiles/{user_id}/filename.ext
-- The policy extracts the user_id from the file path and compares it to auth.uid()
CREATE POLICY "Users can upload their own profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policy: Users can update their own profile images
-- Allows authenticated users to replace/modify files in their own folder
-- Uses the same path-based verification as the upload policy
CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policy: Users can delete their own profile images
-- Allows authenticated users to remove files from their own folder
-- Essential for profile management and cleanup
CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policy: Anyone can view profile images
-- Allows public read access to all profile images
-- This makes profile images viewable without authentication
-- Consider restricting this if you need private profile images
CREATE POLICY "Anyone can view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profiles');

-- ====================================
-- STORAGE USAGE GUIDELINES
-- ====================================
--
-- FILE ORGANIZATION:
-- - All profile images should be stored as: profiles/{user_id}/filename.ext
-- - Use meaningful filenames (e.g., avatar.jpg, profile_image.png)
-- - Consider adding timestamps to prevent caching issues
--
-- SECURITY CONSIDERATIONS:
-- - The public read policy allows anyone to view profile images if they have the URL
-- - File uploads are restricted to the authenticated user's folder only
-- - File size is limited to 50MB to prevent abuse
-- - Only image files are allowed (prevents uploading malicious files)
--
-- PERFORMANCE TIPS:
-- - Use appropriate image formats (WebP for modern browsers, JPEG for compatibility)
-- - Consider implementing image compression on the client side
-- - Use Supabase's image transformation features for different sizes
--
-- EXAMPLE USAGE IN CODE:
-- // Upload a profile image
-- const filePath = `${user.id}/avatar.jpg`;
-- const { data, error } = await supabase.storage
--   .from('profiles')
--   .upload(filePath, file);
--
-- // Get public URL for display
-- const { data: publicURL } = supabase.storage
--   .from('profiles')
--   .getPublicUrl(filePath);

-- ====================================
-- ADDITIONAL STORAGE BUCKETS (FOR FUTURE USE)
-- ====================================
-- Uncomment and modify these if you need additional storage buckets

-- Example: Private documents bucket
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'documents',
--   'documents', 
--   false,                -- Private bucket
--   104857600,           -- 100MB limit
--   '{"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}'
-- );

-- Example: App assets bucket (for application-level files)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'app-assets',
--   'app-assets',
--   true,                 -- Public for app assets
--   10485760,            -- 10MB limit
--   '{"image/*", "application/json"}'
-- ); 
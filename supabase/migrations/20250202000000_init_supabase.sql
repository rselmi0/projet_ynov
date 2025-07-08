-- ====================================
-- TABLE CREATION
-- ====================================

-- Users table - Stores user profile information
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text,
  is_paid boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  last_name text,
  avatar_url text,
  update_at timestamp with time zone,
  expo_push_token text,
  push_notifications_enabled boolean DEFAULT true,
  email_notifications_enabled boolean DEFAULT true,
  marketing_notifications_enabled boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  first_name text,
  stripe_customer_id text,
  lang text DEFAULT 'en'::text,
  revenuecat_id text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Tasks table - Stores user tasks with sync capabilities
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  local_id text UNIQUE,
  synced boolean NOT NULL DEFAULT true,
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- RevenueCat customers table - Stores subscription and purchase data
CREATE TABLE public.revenuecat_customers (
  id text NOT NULL,
  latest_expiration timestamp without time zone,
  original_app_user_id text,
  entitlements jsonb,
  subscriptions jsonb,
  all_purchased_products jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT revenuecat_customers_pkey PRIMARY KEY (id)
);

-- ====================================
-- STORAGE BUCKET CREATION
-- ====================================

-- Create a bucket for profile images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles', 
  'profiles', 
  true, 
  52428800, -- 50MB limit
  '{"image/*"}'
);

-- ====================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- ====================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenuecat_customers ENABLE ROW LEVEL SECURITY;

-- ====================================
-- RLS POLICIES FOR USERS TABLE
-- ====================================

-- Users can only view their own profile
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (typically done during signup)
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ====================================
-- RLS POLICIES FOR TASKS TABLE
-- ====================================

-- Users can only view their own tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only create tasks for themselves
CREATE POLICY "Users can create their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own tasks
CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- RLS POLICIES FOR REVENUECAT_CUSTOMERS TABLE
-- ====================================

-- Users can view their own RevenueCat data
-- This policy checks both original_app_user_id and the linked revenuecat_id in users table
CREATE POLICY "Users can view their own revenuecat data" ON public.revenuecat_customers
  FOR SELECT USING (
    auth.uid()::text = original_app_user_id OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.revenuecat_id = revenuecat_customers.id
    )
  );

-- Allow insertion of RevenueCat data (typically done by webhooks or server-side operations)
-- Note: You might want to restrict this further based on your security requirements
CREATE POLICY "Allow revenuecat data insertion" ON public.revenuecat_customers
  FOR INSERT WITH CHECK (true);

-- Allow updates to RevenueCat data for the data owner
CREATE POLICY "Allow revenuecat data updates" ON public.revenuecat_customers
  FOR UPDATE USING (
    auth.uid()::text = original_app_user_id OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.revenuecat_id = revenuecat_customers.id
    )
  );

-- ====================================
-- STORAGE POLICIES FOR PROFILES BUCKET
-- ====================================

-- Policy for uploading (INSERT)
CREATE POLICY "Users can upload their own profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policy for updating (UPDATE) 
CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policy for deleting (DELETE)
CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policy for viewing (SELECT) - public access
CREATE POLICY "Anyone can view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profiles');
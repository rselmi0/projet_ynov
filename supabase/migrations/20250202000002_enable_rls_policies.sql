-- ====================================
-- ROW LEVEL SECURITY (RLS) POLICIES MIGRATION
-- ====================================
-- This migration enables Row Level Security and creates policies
-- RLS ensures users can only access their own data
-- Critical for multi-tenant applications and data privacy

-- ====================================
-- ENABLE RLS ON ALL TABLES
-- ====================================
-- Enable Row Level Security on all user-facing tables
-- This is the foundation of data security in Supabase
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenuecat_customers ENABLE ROW LEVEL SECURITY;

-- ====================================
-- RLS POLICIES FOR USERS TABLE
-- ====================================
-- These policies ensure users can only access and modify their own profile data

-- Policy: Users can view their own profile
-- Allows authenticated users to read their own user record
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile  
-- Allows authenticated users to modify their own user record
-- This includes updating payment statuses, preferences, and profile information
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile
-- Typically used during the signup process to create a user profile
-- The auth.uid() ensures the user can only create a profile for themselves
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ====================================
-- RLS POLICIES FOR TASKS TABLE
-- ====================================
-- These policies ensure users can only access and manage their own tasks
-- Essential for task privacy and data isolation

-- Policy: Users can view their own tasks
-- Allows users to see only tasks they created
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can create their own tasks
-- Ensures new tasks are only created with the authenticated user as owner
CREATE POLICY "Users can create their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
-- Allows users to modify tasks they own (title, description, completion status)
CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own tasks
-- Allows users to remove tasks they created
CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- RLS POLICIES FOR REVENUECAT_CUSTOMERS TABLE
-- ====================================
-- These policies handle RevenueCat subscription data access
-- More complex due to the relationship between users and RevenueCat customers

-- Policy: Users can view their own RevenueCat data
-- This policy checks two conditions:
-- 1. The user's ID matches the original_app_user_id in RevenueCat
-- 2. The user has a linked revenuecat_id in their profile
-- This dual-check ensures flexibility in how users are linked to RevenueCat
CREATE POLICY "Users can view their own revenuecat data" ON public.revenuecat_customers
  FOR SELECT USING (
    auth.uid()::text = original_app_user_id OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.revenuecat_id = revenuecat_customers.id
    )
  );

-- Policy: Allow RevenueCat data insertion
-- This policy allows insertion of RevenueCat data
-- Typically used by:
-- - RevenueCat webhooks (server-side)
-- - Initial subscription setup
-- - Migration scripts
-- Note: In production, you might want to restrict this to service accounts only
CREATE POLICY "Allow revenuecat data insertion" ON public.revenuecat_customers
  FOR INSERT WITH CHECK (true);

-- Policy: Allow RevenueCat data updates
-- Users can update their own RevenueCat data
-- Uses the same dual-check as the SELECT policy
-- Allows updates from both the user and RevenueCat webhooks
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
-- ADDITIONAL SECURITY NOTES
-- ====================================
-- 
-- IMPORTANT SECURITY CONSIDERATIONS:
--
-- 1. Payment Status Updates:
--    - is_paid (Stripe) should be updated via secure server-side operations
--    - is_premium (RevenueCat) is updated via RevenueCat webhooks
--    - Consider adding triggers to log payment status changes
--
-- 2. RevenueCat Integration:
--    - The "Allow revenuecat data insertion" policy is permissive
--    - In production, consider restricting to service accounts or API keys
--    - Monitor RevenueCat webhook authenticity
--
-- 3. User Data Privacy:
--    - All policies ensure strict user data isolation
--    - No user can access another user's data
--    - Consider adding audit logging for sensitive operations 
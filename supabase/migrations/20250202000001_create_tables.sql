-- ====================================
-- TABLE CREATION MIGRATION
-- ====================================
-- This migration creates the core database tables
-- Separated for better organization and maintainability

-- ====================================
-- USERS TABLE
-- ====================================
-- Core user profile table that stores user information and subscription statuses
-- Contains two different payment status fields for different payment providers:
-- - is_paid: Stripe subscription status (direct payment processing)  
-- - is_premium: RevenueCat subscription status (cross-platform subscription management)
CREATE TABLE public.users (
  -- Primary identifier linked to Supabase Auth
  id uuid NOT NULL,
  
  -- Basic user information
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  lang text DEFAULT 'en'::text,
  
  -- Payment and subscription status fields
  -- IMPORTANT: Different payment providers track different subscription states
  is_paid boolean DEFAULT false,        -- Stripe direct payment status (web payments, one-time purchases)
  is_premium boolean DEFAULT false,     -- RevenueCat subscription status (mobile app subscriptions, cross-platform)
  
  -- External service identifiers
  stripe_customer_id text,              -- Links to Stripe customer for payment processing
  revenuecat_id text,                   -- Links to RevenueCat customer for subscription management
  
  -- Notification preferences
  expo_push_token text,                 -- Token for push notifications via Expo
  push_notifications_enabled boolean DEFAULT true,
  email_notifications_enabled boolean DEFAULT true,
  marketing_notifications_enabled boolean DEFAULT false,
  
  -- User journey tracking
  onboarding_completed boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp with time zone,   -- Note: This should probably be updated_at for consistency
  
  -- Constraints
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- ====================================
-- TASKS TABLE  
-- ====================================
-- Stores user tasks with offline sync capabilities
-- Supports both online and offline task management
CREATE TABLE public.tasks (
  -- Primary identifier
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  
  -- User association
  user_id uuid NOT NULL,
  
  -- Task content
  title text NOT NULL,
  description text,
  completed boolean NOT NULL DEFAULT false,
  
  -- Sync management for offline support
  local_id text UNIQUE,                 -- Client-side ID for offline sync
  synced boolean NOT NULL DEFAULT true, -- Tracks if task is synced with server
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- ====================================
-- REVENUECAT CUSTOMERS TABLE
-- ====================================
-- Stores RevenueCat subscription and purchase data
-- This table syncs with RevenueCat webhooks to track cross-platform subscriptions
CREATE TABLE public.revenuecat_customers (
  -- RevenueCat customer identifier
  id text NOT NULL,
  
  -- Subscription timing
  latest_expiration timestamp without time zone,
  
  -- User linking
  original_app_user_id text,            -- Links back to our user system
  
  -- RevenueCat data (stored as JSON for flexibility)
  entitlements jsonb,                   -- Current active entitlements
  subscriptions jsonb,                  -- Subscription history and status
  all_purchased_products jsonb,         -- Complete purchase history
  
  -- Timestamps
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  
  -- Constraints
  CONSTRAINT revenuecat_customers_pkey PRIMARY KEY (id)
);

-- ====================================
-- HELPFUL INDEXES FOR PERFORMANCE
-- ====================================

-- Index for user lookups by email (useful for admin queries)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Index for RevenueCat customer lookups by original_app_user_id
CREATE INDEX IF NOT EXISTS idx_revenuecat_original_user ON public.revenuecat_customers(original_app_user_id);

-- Index for tasks by user_id (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);

-- Index for tasks by local_id (used for offline sync)
CREATE INDEX IF NOT EXISTS idx_tasks_local_id ON public.tasks(local_id); 
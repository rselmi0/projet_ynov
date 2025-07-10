-- ====================================
-- DATABASE TRIGGERS AND FUNCTIONS MIGRATION
-- ====================================
-- This migration creates triggers and functions for data consistency
-- Handles automatic timestamp updates and data synchronization
-- Essential for maintaining data integrity across payment providers

-- ====================================
-- UTILITY FUNCTIONS
-- ====================================

-- Function: Update timestamp on row modification
-- This function automatically updates the updated_at timestamp
-- whenever a row is modified in any table that uses it
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set the updated_at field to the current timestamp
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Function: Sync user payment status
-- This function ensures consistency between is_paid (Stripe) and is_premium (RevenueCat)
-- It can be called manually or triggered by changes in payment status
CREATE OR REPLACE FUNCTION public.sync_user_payment_status(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record public.users%ROWTYPE;
  revenuecat_record public.revenuecat_customers%ROWTYPE;
  has_active_subscription boolean := false;
BEGIN
  -- Get user record
  SELECT * INTO user_record FROM public.users WHERE id = user_id_param;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', user_id_param;
  END IF;
  
  -- Check RevenueCat subscription status if user has revenuecat_id
  IF user_record.revenuecat_id IS NOT NULL THEN
    SELECT * INTO revenuecat_record 
    FROM public.revenuecat_customers 
    WHERE id = user_record.revenuecat_id;
    
    -- Check if user has active entitlements
    IF FOUND AND revenuecat_record.entitlements IS NOT NULL THEN
      -- Simple check for any active entitlement
      -- You might want to customize this logic based on your specific entitlements
      SELECT jsonb_array_length(revenuecat_record.entitlements) > 0 INTO has_active_subscription;
    END IF;
  END IF;
  
  -- Update is_premium based on RevenueCat data
  UPDATE public.users 
  SET is_premium = has_active_subscription,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = user_id_param;
  
  -- Log the sync operation (optional - uncomment if you want logging)
  -- RAISE NOTICE 'Synced payment status for user %: is_premium = %', user_id_param, has_active_subscription;
END;
$$;

-- ====================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ====================================

-- Trigger: Auto-update timestamp for users table
-- Automatically updates the update_at field when a user record is modified
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Auto-update timestamp for tasks table  
-- Automatically updates the updated_at field when a task is modified
CREATE TRIGGER trigger_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Auto-update timestamp for revenuecat_customers table
-- Automatically updates the updated_at field when RevenueCat data is modified
CREATE TRIGGER trigger_revenuecat_updated_at
  BEFORE UPDATE ON public.revenuecat_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ====================================
-- PAYMENT STATUS SYNC TRIGGERS
-- ====================================

-- Function: Handle RevenueCat data changes
-- This function is triggered when RevenueCat customer data is updated
-- It automatically syncs the user's is_premium status
CREATE OR REPLACE FUNCTION public.handle_revenuecat_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_user_id uuid;
BEGIN
  -- Find the user ID associated with this RevenueCat customer
  SELECT id INTO affected_user_id 
  FROM public.users 
  WHERE revenuecat_id = NEW.id 
     OR id::text = NEW.original_app_user_id;
  
  -- If we found a user, sync their payment status
  IF affected_user_id IS NOT NULL THEN
    PERFORM public.sync_user_payment_status(affected_user_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger: Sync payment status when RevenueCat data changes
-- Automatically updates user's is_premium status when RevenueCat data is modified
CREATE TRIGGER trigger_sync_revenuecat_payment_status
  AFTER INSERT OR UPDATE ON public.revenuecat_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_revenuecat_change();

-- ====================================
-- DATA CONSISTENCY FUNCTIONS
-- ====================================

-- Function: Validate payment status consistency
-- This function checks for inconsistencies between payment providers
-- Useful for debugging and data auditing
CREATE OR REPLACE FUNCTION public.validate_payment_consistency()
RETURNS TABLE(
  user_id uuid,
  email text,
  is_paid boolean,
  is_premium boolean,
  has_stripe_customer boolean,
  has_revenuecat_customer boolean,
  issue_description text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.is_paid,
    u.is_premium,
    (u.stripe_customer_id IS NOT NULL) as has_stripe_customer,
    (u.revenuecat_id IS NOT NULL) as has_revenuecat_customer,
    CASE 
      WHEN u.is_paid = true AND u.stripe_customer_id IS NULL THEN 
        'User marked as paid but no Stripe customer ID'
      WHEN u.is_premium = true AND u.revenuecat_id IS NULL THEN 
        'User marked as premium but no RevenueCat ID'
      WHEN u.stripe_customer_id IS NOT NULL AND u.is_paid = false THEN 
        'User has Stripe customer but not marked as paid'
      WHEN u.revenuecat_id IS NOT NULL AND u.is_premium = false THEN 
        'User has RevenueCat ID but not marked as premium'
      ELSE 'No issues detected'
    END as issue_description
  FROM public.users u
  WHERE 
    -- Only return rows where there might be an issue
    (u.is_paid = true AND u.stripe_customer_id IS NULL) OR
    (u.is_premium = true AND u.revenuecat_id IS NULL) OR
    (u.stripe_customer_id IS NOT NULL AND u.is_paid = false) OR
    (u.revenuecat_id IS NOT NULL AND u.is_premium = false);
END;
$$;

-- ====================================
-- MAINTENANCE FUNCTIONS
-- ====================================

-- Function: Clean up orphaned tasks
-- Removes tasks that belong to deleted users (cleanup function)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_tasks()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete tasks for users that no longer exist in auth.users
  DELETE FROM public.tasks 
  WHERE user_id NOT IN (SELECT id FROM auth.users);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup operation
  RAISE NOTICE 'Cleaned up % orphaned tasks', deleted_count;
  
  RETURN deleted_count;
END;
$$;

-- ====================================
-- USAGE EXAMPLES AND NOTES
-- ====================================
--
-- MANUAL PAYMENT STATUS SYNC:
-- SELECT public.sync_user_payment_status('user-uuid-here');
--
-- CHECK PAYMENT CONSISTENCY:
-- SELECT * FROM public.validate_payment_consistency();
--
-- CLEANUP ORPHANED DATA:
-- SELECT public.cleanup_orphaned_tasks();
--
-- TRIGGER BEHAVIOR:
-- - All timestamp fields are automatically updated on row modifications
-- - RevenueCat changes automatically sync to user's is_premium status
-- - Stripe payment status (is_paid) should be updated via secure server-side operations
--
-- IMPORTANT NOTES:
-- - These triggers run automatically and don't require manual intervention
-- - The sync functions can be called manually if needed for debugging
-- - Consider running the validation function periodically to check data consistency
-- - The cleanup functions should be run periodically as maintenance tasks 
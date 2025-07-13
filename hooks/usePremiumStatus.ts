import { useState, useEffect, useCallback } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { supabase } from '@/config/supabase';
import { 
  PremiumStatus, 
  RevenueCatCustomerInfo, 
  RevenueCatCustomer, 
  User 
} from '@/types/revenuecat';

export const usePremiumStatus = (): PremiumStatus => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<RevenueCatCustomerInfo | null>(null);

  // Function to synchronize with Supabase
  const syncWithSupabase = useCallback(async (customerInfo: RevenueCatCustomerInfo) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const hasPro = !!customerInfo.entitlements.active[process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME!];
      const latestExpiration = customerInfo.latestExpirationDate;

      // Update users table
      await supabase
        .from('users')
        .update({ 
          is_premium: hasPro,
          revenuecat_id: customerInfo.originalAppUserId 
        })
        .eq('id', user.id);

      // Upsert into revenuecat_customers
      const revenueCatData: Partial<RevenueCatCustomer> = {
        id: customerInfo.originalAppUserId,
        latest_expiration: latestExpiration,
        original_app_user_id: customerInfo.originalAppUserId,
        entitlements: customerInfo.entitlements.active,
        subscriptions: customerInfo.subscriptionsByProductIdentifier,
        all_purchased_products: customerInfo.allPurchasedProductIdentifiers,
      };

      await supabase
        .from('revenuecat_customers')
        .upsert(revenueCatData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      console.log('✅ RevenueCat data synchronized with Supabase');
    } catch (err) {
      console.error('❌ Error synchronizing with Supabase:', err);
      setError(err instanceof Error ? err.message : 'Synchronization error');
    }
  }, []);

  // Function to check premium status
  const checkPremiumStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const customerInfo = await Purchases.getCustomerInfo();
      const customerInfoTyped = customerInfo as unknown as RevenueCatCustomerInfo;
      
      setCustomerInfo(customerInfoTyped);
      
      // Check if user has "Pro" entitlement
      const hasPro = !!customerInfoTyped.entitlements.active[process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME!];
              setIsPremium(hasPro);

      // Synchronize with Supabase
      await syncWithSupabase(customerInfoTyped);

          console.log('✅ Premium status updated:', { 
            isPremium: hasPro,
        entitlements: Object.keys(customerInfoTyped.entitlements.active) 
      });

    } catch (err) {
      console.error('❌ Error checking premium status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  }, [syncWithSupabase]);

  // Function to manually refetch
  const refetch = useCallback(async () => {
    await checkPremiumStatus();
  }, [checkPremiumStatus]);

  // Initialization and change listeners
  useEffect(() => {
    checkPremiumStatus();

    // Listen to customerInfo changes
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log('🔄 CustomerInfo updated via listener');
      const customerInfoTyped = customerInfo as unknown as RevenueCatCustomerInfo;
      
      setCustomerInfo(customerInfoTyped);
      const hasPro = !!customerInfoTyped.entitlements.active[process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME!];
      setIsPremium(hasPro);
      
      // Synchronize with Supabase
      syncWithSupabase(customerInfoTyped);
    });

    // RevenueCat automatically handles listener cleanup
  }, [checkPremiumStatus, syncWithSupabase]);

  return {
    isPremium,
    loading,
    error,
    customerInfo,
    refetch,
  };
}; 
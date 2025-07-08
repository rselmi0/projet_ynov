import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Purchases, { CustomerInfo, PurchasesStoreProduct } from 'react-native-purchases';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';
import {
  RevenueCatContextType,
  RevenueCatCustomerInfo,
  RevenueCatCustomer,
} from '../types/revenuecat';

const APIKeys = {
  ios: process.env.EXPO_PUBLIC_RC_IOS!,
  android: process.env.EXPO_PUBLIC_RC_ANDROID!,
};

export const RevenueCatContext = createContext<Partial<RevenueCatContextType>>({});

export const RevenueCatProvider = ({ children }: { children: ReactNode }) => {
  const [isPro, setIsPro] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<RevenueCatCustomerInfo | null>(null);

  const init = async () => {
    console.log('🚀 RevenueCat initialization for:', Platform.OS);
    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: APIKeys.ios });
    } else {
      Purchases.configure({ apiKey: APIKeys.android });
    }
    setIsReady(true);

    Purchases.setLogLevel(Purchases.LOG_LEVEL.ERROR);

    // First data fetch
    await refetchCustomerInfo();

    // Listen to changes
    Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
      console.log('🔄 CustomerInfo updated:', customerInfo.originalAppUserId);
      await updateCustomerInfo(customerInfo as unknown as RevenueCatCustomerInfo);
    });
  };

  const updateCustomerInfo = async (customerInfo: RevenueCatCustomerInfo) => {
    try {
      setCustomerInfo(customerInfo);

      const hasPro = !!customerInfo.entitlements.active[process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME!];
      setIsPro(hasPro);

      // Synchronize with Supabase
      await syncWithSupabase(customerInfo);

      console.log('✅ CustomerInfo updated:', {
        isPro: hasPro,
        originalAppUserId: customerInfo.originalAppUserId,
        activeEntitlements: Object.keys(customerInfo.entitlements.active),
      });
    } catch (error) {
      console.error('❌ Error updating customerInfo:', error);
    }
  };

  const refetchCustomerInfo = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      await updateCustomerInfo(customerInfo as unknown as RevenueCatCustomerInfo);
    } catch (error) {
      console.error('❌ Error refetching customerInfo:', error);
    }
  };

  const syncWithSupabase = async (customerInfo: RevenueCatCustomerInfo) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log('⚠️ User not logged in, no Supabase synchronization');
        return;
      }

      const hasPro = !!customerInfo.entitlements.active[process.env.EXPO_PUBLIC_RC_SUBSCRIPTION_NAME!];
      const latestExpiration = customerInfo.latestExpirationDate;

      // Update users table
      await supabase
        .from('users')
        .update({
          is_premium: hasPro,
          revenuecat_id: customerInfo.originalAppUserId,
        })
        .eq('id', user.id);

      // Upsert in revenuecat_customers
      const revenueCatData: Partial<RevenueCatCustomer> = {
        id: customerInfo.originalAppUserId,
        latest_expiration: latestExpiration,
        original_app_user_id: customerInfo.originalAppUserId,
        entitlements: customerInfo.entitlements.active,
        subscriptions: customerInfo.subscriptionsByProductIdentifier,
        all_purchased_products: customerInfo.allPurchasedProductIdentifiers,
      };

      await supabase.from('revenuecat_customers').upsert(revenueCatData, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

      console.log('✅ Data synchronized with Supabase');
    } catch (err) {
      console.error('❌ Error synchronizing with Supabase:', err);
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <RevenueCatContext.Provider
      value={{
        isPro,
        isReady,
        customerInfo,
        updateCustomerInfo,
        refetchCustomerInfo,
      }}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => {
  return useContext(RevenueCatContext);
};

import React, { useState } from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { router } from 'expo-router';
import { supabase } from '@/config/supabase';
import { PaymentButton } from '@/components/payment/PaymentButton';
import { useTranslation } from '@/hooks/useTranslation';
import { useProfileStore } from '@/stores/profileStore';
import Paywall from 'react-native-purchases-ui';
import { Text } from '@/components/ui/text';
import { PaymentLoadingStates } from '@/types/payment';
import * as Haptics from 'expo-haptics';

export default function PaymentScreen() {
  const { t } = useTranslation();
  const [loadingStates, setLoadingStates] = useState<PaymentLoadingStates>({
    stripeRedirect: false,
    stripeInApp: false,
    revenueCat: false,
  });

  const { profile } = useProfileStore();

  const setLoading = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  // Stripe Redirect - Same logic as PayNowButton
  const handleStripeRedirect = async () => {
    try {
      setLoading('stripeRedirect', true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { data, error: invokeError } = await supabase.functions.invoke('create-stripe-checkout');

      if (invokeError) throw new Error(invokeError.message || t('payment.alerts.stripeRedirectError'));
      const { url } = data;

      if (url) {
        await router.push(url);
      } else {
        throw new Error(t('payment.alerts.stripeMissingUrl'));
      }
    } catch (error) {
      console.error('Erreur Stripe checkout:', error);
      Alert.alert(t('common.error'), t('payment.alerts.paymentError'));
    } finally {
      setLoading('stripeRedirect', false);
    }
  };

  // Stripe In-App - Same logic as PaymentSheet
  const handleStripeInApp = async () => {
    try {
      setLoading('stripeInApp', true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Create PaymentIntent
      const { data, error: invokeError } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: 1000, // 10$
          currency: 'usd',
          customer_id: profile?.stripe_customer_id,
        },
      });

      if (invokeError) throw new Error(invokeError.message || t('payment.alerts.paymentIntentError'));
      const { client_secret, customer_id } = data;

      // Initialize PaymentSheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Mon App',
        paymentIntentClientSecret: client_secret,
        customerId: customer_id,
        applePay: {
          merchantCountryCode: 'FR',
        },
        googlePay: {
          merchantCountryCode: 'FR',
          currencyCode: 'EUR',
          testEnv: true,
        },
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Utilisateur',
        },
        returnURL: 'myapp://payment-success',
      });

      if (error) {
        throw new Error(error.message);
      }

      // Present PaymentSheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === 'Canceled') {
          return; // User cancelled
        }
        throw new Error(presentError.message);
      }

      Alert.alert(t('common.success'), t('payment.alerts.paymentSuccess'));
    } catch (error) {
      console.error('Erreur PaymentSheet:', error);
      Alert.alert(t('common.error'), t('payment.alerts.paymentError'));
    } finally {
      setLoading('stripeInApp', false);
    }
  };

  const handlePaywall = async () => {
    try {
      setLoading('revenueCat', true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (1) {
        Paywall.presentPaywall();
      } else {
        Paywall.presentPaywall();
      }
    } catch (_error) {
      Alert.alert(t('common.error'), t('payment.alerts.generalError'));
    } finally {
      setLoading('revenueCat', false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-2">
        {/* Section d'introduction */}
        <View className=" rounded-2xl bg-card p-6">
          <Text className="text-foreground" style={{ fontSize: 20, fontWeight: 'bold' }}>
            {t('payment.title')}
          </Text>
          <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
            {t('payment.subtitle')}
          </Text>
        </View>

        {/* Boutons de paiement */}
        <View className="mb-8 gap-4">
          <PaymentButton
            title={t('payment.buttons.stripeRedirect.title')}
            subtitle={t('payment.buttons.stripeRedirect.subtitle')}
            imageSource={require('../../../assets/logo/stripe.jpeg')}
            onPress={handleStripeRedirect}
            loading={loadingStates.stripeRedirect}
            imageBackgroundColor="bg-blue-50 dark:bg-blue-900/20"
          />

          <PaymentButton
            title={t('payment.buttons.stripeInApp.title')}
            subtitle={t('payment.buttons.stripeInApp.subtitle')}
            imageSource={require('../../../assets/logo/stripe.jpeg')}
            onPress={handleStripeInApp}
            loading={loadingStates.stripeInApp}
            imageBackgroundColor="bg-blue-50 dark:bg-blue-900/20"
          />

          <PaymentButton
            title={t('payment.buttons.revenueCat.title')}
            subtitle={t('payment.buttons.revenueCat.subtitle')}
            imageSource={require('../../../assets/logo/revenuecat.png')}
            onPress={handlePaywall}
            loading={loadingStates.revenueCat}
            imageBackgroundColor="bg-purple-50 dark:bg-purple-900/20"
          />
        </View>

        {/* Section de comparaison */}
        <View className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Text
            className="mb-6 text-center text-foreground"
            style={{ fontSize: 18, fontWeight: 'bold' }}>
            {t('payment.comparison.title')}
          </Text>

          <View className="mb-6 flex-row justify-center" style={{ gap: 32 }}>
            {/* Stripe */}
            <View className="items-center">
              <View className="mb-3 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
                <Image
                  source={require('../../../assets/logo/stripe.jpeg')}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '600' }}>
                {t('payment.comparison.stripe')}
              </Text>
            </View>

            {/* RevenueCat */}
            <View className="items-center">
              <View className="mb-3 rounded-2xl bg-purple-50 p-4 dark:bg-purple-900/20">
                <Image
                  source={require('../../../assets/logo/revenuecat.png')}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '600' }}>
                {t('payment.comparison.revenueCat')}
              </Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <View className="flex-row items-center justify-between ">
              <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
                {t('payment.comparison.easeOfUse')}
              </Text>
              <View className="flex-row" style={{ gap: 24 }}>
                <Text className="text-yellow-600" style={{ fontSize: 14, fontWeight: '500' }}>
                  {t('payment.comparison.values.average')}
                </Text>
                <Text className="text-green-600" style={{ fontSize: 14, fontWeight: '500' }}>
                  {t('payment.comparison.values.easy')}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
                {t('payment.comparison.transactionFees')}
              </Text>
              <View className="flex-row" style={{ gap: 24 }}>
                <Text className="text-green-600" style={{ fontSize: 14, fontWeight: '500' }}>
                  2.9%
                </Text>
                <Text className="text-yellow-600" style={{ fontSize: 14, fontWeight: '500' }}>
                  1%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

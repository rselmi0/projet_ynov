import React, { useState } from 'react';
import { Pressable, Text, ActivityIndicator, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { supabase } from '@/config/supabase';
import { useProfileStore } from '@/stores/profileStore';
import { PaymentSheetProps } from '@/types/payment';

export const PaymentSheet = ({
  className,
  amount = 1000, // amount in cents (10.00€)
  currency = 'eur',
  onSuccess,
  onError,
}: PaymentSheetProps) => {
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { profile } = useProfileStore();

  const initializePaymentSheet = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Non authentifié');

      //  CREATE PAYMENT INTENT ON SERVER
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency,
            customer_id: profile?.stripe_customer_id,
          }),
        }
      );

      if (!response.ok) throw new Error('Échec de création du PaymentIntent');

      const { client_secret, customer_id } = await response.json();
      console.log('client_secret', client_secret);
      console.log('customer_id', customer_id);

      // INITIALIZE PAYMENT SHEET
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

      return true;
    } catch (error) {
      console.error('Erreur initialisation PaymentSheet:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // INITIALIZE PAYMENT SHEET
      await initializePaymentSheet();

      // PRESENT PAYMENT SHEET
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === 'Canceled') {
          // USER CANCELLED
          return;
        }
        throw new Error(error.message);
      }

      // SUCCESSFUL PAYMENT
      Alert.alert('Success', 'Payment successful!');
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment error';
      Alert.alert('Error', errorMessage);
      onError?.(errorMessage);
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePayment}
      disabled={loading}
      className={`items-center justify-center rounded-2xl bg-black px-6 py-3 dark:bg-white ${
        loading ? 'opacity-50' : ''
      } ${className}`}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-base font-semibold text-white dark:text-black">
          Payer {(amount / 100).toFixed(2)}€
        </Text>
      )}
    </Pressable>
  );
};

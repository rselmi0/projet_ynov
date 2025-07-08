import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/config/supabase';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { PayNowButtonProps } from '@/types/payment';

export const PayNowButton = ({ className }: PayNowButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/create-stripe-checkout`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('res', res);

      if (!res.ok) throw new Error('Failed to create Stripe session');
      const { url } = await res.json();

      if (url) {
        await router.push(url);
      } else {
        throw new Error('Stripe URL missing');
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleCheckout}
      disabled={loading}
                className={`w-full items-center justify-center rounded-lg bg-primary ${
        loading ? 'opacity-50' : ''
      } ${className}`}
      style={{
        minHeight: 50,
        paddingVertical: 12,
        paddingHorizontal: 16,
      }}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white" style={{ fontSize: 16, fontWeight: '600' }}>
          Payer maintenant
        </Text>
      )}
    </TouchableOpacity>
  );
};

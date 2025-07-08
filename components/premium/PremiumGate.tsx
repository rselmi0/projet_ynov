import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { usePremiumStatus } from '../../hooks/usePremiumStatus';
import { useRevenueCat } from '../../context/RevenuCatContext';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import * as Icons from 'lucide-react-native';
import { useIconColors } from '@/hooks/useIconColors';
interface PremiumGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component to protect premium features
 * Only show content if user is premium
 */
export const PremiumGate: React.FC<PremiumGateProps> = ({
  children,
  fallback,
  redirectTo = '/(protected)/payment',
}) => {
  const router = useRouter();
  const { isPremium, loading, error } = usePremiumStatus();
  const { isPro } = useRevenueCat();
  const iconColors = useIconColors();
  const hasAccess = isPremium || isPro;

  const handleUpgrade = () => {
    router.push(redirectTo as any);
  };

  const handleGoBack = () => {
    router.back();
  };

    // Display while loading
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <ActivityIndicator size="large" color="hsl(var(--primary))" />
        <Text className="mt-4 text-center text-muted-foreground">
          Vérification de votre statut Premium...
        </Text>
      </View>
    );
  }

  // Display error
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Icons.AlertCircle size={48} color={iconColors.error} />
        <Text className="mt-4 text-center text-lg font-semibold text-foreground">
          Erreur de Vérification
        </Text>
        <Text className="mt-2 text-center text-muted-foreground">{error}</Text>
        <View className="mt-6 flex-row space-x-4">
          <Button onPress={handleGoBack} variant="outline">
            <Text>Retour</Text>
          </Button>
          <Button onPress={handleUpgrade}>
            <Text>Voir Premium</Text>
          </Button>
        </View>
      </View>
    );
  }

  // If no premium access, show fallback or upgrade screen
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <View className="items-center rounded-2xl bg-card p-8 shadow-lg">
          <View className="mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-4">
            <Icons.Shield size={32} color="#FFFFFF" />
          </View>

          <Text className="mb-2 text-center text-2xl font-bold text-foreground">
            🔒 Accès Premium Requis
          </Text>

          <Text className="mb-6 text-center text-muted-foreground">
            Cette fonctionnalité est réservée aux membres Premium. Découvrez tous les avantages et
            débloquezvotre potentiel !
          </Text>

          <View className="w-full space-y-3">
            <Button onPress={handleUpgrade} className="w-full">
              <Icons.Star size={16} color="#FFFFFF" />
              <Text className="ml-2 font-semibold text-white">Découvrir Premium</Text>
            </Button>

            <Button onPress={handleGoBack} variant="outline" className="w-full">
              <Text>Retour</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // If user has access, show content
  return <>{children}</>;
};

/**
 * Hook to easily check premium access
 */
export const usePremiumAccess = () => {
  const { isPremium, loading, error } = usePremiumStatus();
  const { isPro } = useRevenueCat();

  return {
    hasAccess: isPremium || isPro,
    isPremium,
    isPro,
    loading,
    error,
  };
};

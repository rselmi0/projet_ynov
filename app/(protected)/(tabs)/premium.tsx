import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@/hooks/useTranslation';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useRevenueCat } from '@/context/RevenuCatContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useIconColors } from '@/hooks/useIconColors';
import * as Icons from 'lucide-react-native';

// Simple Feature Component
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  available: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description, available }) => {
  return (
    <View className="flex-row items-center gap-3 py-3">
      <View className={`w-10 h-10 rounded-lg items-center justify-center ${
        available ? 'bg-primary/10' : 'bg-muted/50'
      }`}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className={`font-medium ${available ? 'text-foreground' : 'text-muted-foreground'}`}>
          {title}
        </Text>
        <Text className={`text-sm ${available ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
          {description}
        </Text>
      </View>
      <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
        available ? 'border-primary bg-primary' : 'border-muted bg-transparent'
      }`}>
        {available && <Icons.Check size={12} color="#ffffff" strokeWidth={2} />}
      </View>
    </View>
  );
};


export default function PremiumPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { session } = useAuth();
  const { isDark } = useTheme();
  const iconColors = useIconColors();

  const { isPremium, loading, error, customerInfo, refetch } = usePremiumStatus();
  const { isPro, customerInfo: rcCustomerInfo } = useRevenueCat();

  const [isVerifying, setIsVerifying] = useState(true);

  // Security: Check authentication and premium status
  useEffect(() => {
    const checkAccess = () => {
      console.log('🔒 Checking premium access...');
      
      // Must be authenticated
      if (!session?.user) {
        console.log('❌ No authenticated user');
        Alert.alert(
          t('premium.access.authRequired.title'),
          t('premium.access.authRequired.message'),
          [{ text: t('common.ok'), onPress: () => router.replace('/(auth)/login') }]
        );
        return;
      }

      // Must have premium access
      if (!loading && !isPremium && !isPro) {
        console.log('❌ No premium access');
        Alert.alert(
          t('premium.access.premiumRequired.title'),
          t('premium.access.premiumRequired.message'),
          [
            { text: t('common.cancel'), style: 'cancel', onPress: () => router.back() },
            { text: t('premium.access.viewOffers'), onPress: () => router.replace('/(protected)/(tabs)/payment') }
          ]
        );
        return;
      }

      if (!loading) {
        setIsVerifying(false);
        console.log('✅ Premium access granted');
      }
    };

    checkAccess();
  }, [session, isPremium, isPro, loading, router, t]);

  // Show loading while verifying access
  if (isVerifying || loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center" style={{ paddingTop: insets.top }}>
        <View className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <Text className="text-muted-foreground">{t('premium.verifying')}</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6" style={{ paddingTop: insets.top }}>
        <Icons.AlertCircle size={48} color={iconColors.error} />
        <Text className="text-foreground text-lg font-medium mt-4 text-center">
          {t('premium.error.title')}
        </Text>
        <Text className="text-muted-foreground text-center mt-2">
          {t('premium.error.message')}
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="bg-primary rounded-lg px-6 py-3 mt-6"
        >
          <Text className="text-primary-foreground font-medium">{t('common.retry')}</Text>
        </Pressable>
      </View>
    );
  }

  const features = [
    {
      icon: <Icons.Zap size={20} color={iconColors.primary} />,
      title: t('premium.features.advanced.title'),
      description: t('premium.features.advanced.description'),
      available: true
    },
    {
      icon: <Icons.Cloud size={20} color={iconColors.primary} />,
      title: t('premium.features.sync.title'),
      description: t('premium.features.sync.description'),
      available: true
    },
    {
      icon: <Icons.Shield size={20} color={iconColors.primary} />,
      title: t('premium.features.security.title'),
      description: t('premium.features.security.description'),
      available: true
    },
    {
      icon: <Icons.Users size={20} color={iconColors.primary} />,
      title: t('premium.features.team.title'),
      description: t('premium.features.team.description'),
      available: true
    },
    {
      icon: <Icons.BarChart3 size={20} color={iconColors.primary} />,
      title: t('premium.features.analytics.title'),
      description: t('premium.features.analytics.description'),
      available: true
    }
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('premium.status.unlimited');
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ScrollView className="flex-1 bg-background px-6" showsVerticalScrollIndicator={false}>
      {/* Status Card */}
      <View className="bg-card border border-border rounded-xl p-4 mb-6 mt-4">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
            <Icons.Crown size={24} color={iconColors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-lg font-semibold">
              {t('premium.status.active')}
            </Text>
            <Text className="text-muted-foreground text-sm">
              {session?.user?.email}
            </Text>
          </View>
        </View>
        
        {customerInfo && (
          <View className="bg-muted/30 rounded-lg p-3">
            <Text className="text-foreground text-sm font-medium">
              {t('premium.status.renewal')}: {formatDate(customerInfo.latestExpirationDate)}
            </Text>
          </View>
        )}
      </View>

      {/* Features */}
      <View className="mb-6">
        <Text className="text-foreground text-xl font-semibold mb-4">
          {t('premium.features.title')}
        </Text>
        
        <View className="bg-card border border-border rounded-xl p-4">
          {features.map((feature, index) => (
            <View key={index}>
              <FeatureItem {...feature} />
              {index < features.length - 1 && <View className="h-px bg-border my-1" />}
            </View>
          ))}
        </View>
      </View>

      {/* Support */}
      <View className="mb-6">
        <Text className="text-foreground text-xl font-semibold mb-4">
          {t('premium.support.title')}
        </Text>
        
        <Pressable className="bg-card border border-border rounded-xl p-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
              <Icons.MessageCircle size={20} color={iconColors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-medium">
                {t('premium.support.contact')}
              </Text>
              <Text className="text-muted-foreground text-sm">
                {t('premium.support.description')}
              </Text>
            </View>
            <Icons.ChevronRight size={20} color={iconColors.muted} />
          </View>
        </Pressable>
      </View>

      {/* Management */}
      <View className="mb-8">
        <Text className="text-foreground text-xl font-semibold mb-4">
          {t('premium.management.title')}
        </Text>
        
        <View className="gap-3">
          <Pressable 
            onPress={() => router.push('/(protected)/(tabs)/payment')}
            className="bg-card border border-border rounded-xl p-4"
          >
            <View className="flex-row items-center gap-3">
              <Icons.CreditCard size={20} color={iconColors.muted} />
              <Text className="flex-1 text-foreground font-medium">
                {t('premium.management.billing')}
              </Text>
              <Icons.ChevronRight size={20} color={iconColors.muted} />
            </View>
          </Pressable>

          <Pressable 
            onPress={() => {
              Alert.alert(
                t('premium.management.subscription.title'),
                t('premium.management.subscription.message'),
                [
                  { text: t('common.cancel') },
                  { text: t('premium.management.subscription.settings'), onPress: () => router.push('/(protected)/(tabs)/settings') }
                ]
              );
            }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <View className="flex-row items-center gap-3">
              <Icons.Settings size={20} color={iconColors.muted} />
              <Text className="flex-1 text-foreground font-medium">
                {t('premium.management.subscription.title')}
              </Text>
              <Icons.ChevronRight size={20} color={iconColors.muted} />
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
} 
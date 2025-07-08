import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { CheckCircle, AlertTriangle, CreditCard, Gift, Star, Lock } from 'lucide-react-native';

interface ProfileStatusSectionProps {
  isPaidUser: boolean;
  isPremiumUser: boolean;
  isProfileComplete: boolean;
}

export const ProfileStatusSection = React.memo(function ProfileStatusSection({
  isPaidUser,
  isPremiumUser,
  isProfileComplete,
}: ProfileStatusSectionProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <SettingsSection title={t('profile.status.title')}>
      {/* Profile Completion Status */}
      <View className="px-6 py-4">
        <View className="flex-row items-center">
          <View style={{ marginRight: 12 }}>
            {isProfileComplete ? (
              <CheckCircle size={20} color={iconColors.success} />
            ) : (
              <AlertTriangle size={20} color={iconColors.warning} />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
              {t('profile.status.title')}
            </Text>
            <Text 
              className={isProfileComplete ? 'text-green-600' : 'text-yellow-600'} 
              style={{ fontSize: 14, marginTop: 2, fontWeight: '500' }}
            >
              {isProfileComplete ? t('profile.status.complete') : t('profile.status.incomplete')}
            </Text>
          </View>
        </View>
      </View>

      <View className="ml-11 h-px bg-border" />

      {/* Payment Status */}
      <View className="px-6 py-4">
        <View className="flex-row items-center">
          <View style={{ marginRight: 12 }}>
            {isPaidUser ? (
              <CreditCard size={20} color={iconColors.success} />
            ) : (
              <Gift size={20} color={iconColors.muted} />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
              {t('settings.subscription.title')}
            </Text>
            <Text 
              className={isPaidUser ? 'text-green-600' : 'text-muted-foreground'} 
              style={{ fontSize: 14, marginTop: 2, fontWeight: '500' }}
            >
              {isPaidUser ? t('profile.status.paid') : t('settings.subscription.free')}
            </Text>
          </View>
        </View>
      </View>

      <View className="ml-11 h-px bg-border" />

      {/* Premium Status */}
      <View className="px-6 py-4">
        <View className="flex-row items-center">
          <View style={{ marginRight: 12 }}>
            {isPremiumUser ? (
              <Star size={20} color={iconColors.warning} />
            ) : (
              <Lock size={20} color={iconColors.muted} />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
              {t('settings.subscription.premium')}
            </Text>
            <Text 
              className={isPremiumUser ? 'text-purple-600' : 'text-muted-foreground'} 
              style={{ fontSize: 14, marginTop: 2, fontWeight: '500' }}
            >
              {isPremiumUser ? t('profile.status.premium') : t('settings.subscription.standard')}
            </Text>
          </View>
        </View>
      </View>
    </SettingsSection>
  );
}); 
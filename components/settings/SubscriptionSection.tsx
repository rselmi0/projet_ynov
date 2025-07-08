import React, { useCallback } from 'react';
import { View, Alert } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { SettingsSection } from './SettingsSection';
import { SettingsRow } from './SettingsRow';
import * as Icons from 'lucide-react-native';
import { Text } from '../ui/text';
import Purchases from 'react-native-purchases';
import { SubscriptionSectionProps } from '../../types/settings';
import { useIconColors } from '../../hooks/useIconColors';

export const SubscriptionSection = React.memo(function SubscriptionSection({
  isPaidUser,
  isPremiumUser,
  isPremiumFromRC,
}: SubscriptionSectionProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const handleRestorePurchases = useCallback(async () => {
    try {
      Alert.alert(t('premium.restore.restoring'), t('premium.restore.description'), [], {
        cancelable: false,
      });

      const customerInfo = await Purchases.restorePurchases();
      const hasActiveEntitlements = Object.keys(customerInfo.entitlements.active).length > 0;

      if (hasActiveEntitlements) {
        Alert.alert(
          t('premium.restore.alerts.success.title'),
          t('premium.restore.alerts.success.message'),
          [{ text: t('common.ok') }]
        );
      } else {
        Alert.alert(
          t('premium.restore.alerts.noItems.title'),
          t('premium.restore.alerts.noItems.message'),
          [{ text: t('common.ok') }]
        );
      }

      console.log('✅ Achats restaurés:', {
        entitlements: Object.keys(customerInfo.entitlements.active),
        subscriptions: Object.keys(customerInfo.activeSubscriptions),
      });
    } catch (error) {
      console.error('❌ Erreur lors de la restauration:', error);
      Alert.alert(
        t('premium.restore.alerts.error.title'),
        t('premium.restore.alerts.error.message'),
        [{ text: t('common.ok') }]
      );
    }
  }, [t]);

  return (
    <SettingsSection title={t('settings.subscription.title')}>
      <SettingsRow
        icon={<Icons.CreditCard color={iconColors.secondary} size={20} />}
        title={t('settings.subscription.payment')}
        value={isPaidUser ? t('settings.subscription.paid') : t('settings.subscription.free')}
        rightElement={
          <View
            className={`rounded-full px-2 py-1 ${isPaidUser ? 'bg-green-500/10' : 'bg-secondary'}`}>
            <Text
              className={`text-xs font-medium ${
                isPaidUser ? 'text-green-600' : 'text-muted-foreground'
              }`}>
              {isPaidUser ? '✓' : '○'}
            </Text>
          </View>
        }
      />
      <View className="ml-11 h-px bg-border" />
      <SettingsRow
        icon={<Icons.Shield color={iconColors.secondary} size={20} />}
        title={t('settings.subscription.premium')}
        value={
          isPremiumFromRC 
            ? t('settings.subscription.premiumRevenueCat') 
            : isPremiumUser 
              ? t('settings.subscription.premiumStandard') 
              : t('settings.subscription.standard')
        }
        rightElement={
          <View
            className={`rounded-full px-2 py-1 ${
              isPremiumFromRC || isPremiumUser ? 'bg-purple-500/10' : 'bg-secondary'
            }`}>
            <Text
              className={`text-xs font-medium ${
                isPremiumFromRC || isPremiumUser ? 'text-purple-600' : 'text-muted-foreground'
              }`}>
              {isPremiumFromRC || isPremiumUser ? '⭐' : '○'}
            </Text>
          </View>
        }
      />
      <View className="ml-11 h-px bg-border" />
      <SettingsRow
        icon={<Icons.RotateCcw color={iconColors.info} size={20} />}
        title={t('premium.restore.button')}
        subtitle={t('premium.restore.description')}
        onPress={handleRestorePurchases}
        showChevron
      />
    </SettingsSection>
  );
});

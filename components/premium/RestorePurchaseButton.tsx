import React, { useState } from 'react';
import { useIconColors } from '@/hooks/useIconColors';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Icons from 'lucide-react-native';
import Purchases from 'react-native-purchases';
import { useTranslation } from '@/hooks/useTranslation';


interface RestorePurchaseButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const RestorePurchaseButton = ({
  variant = 'default',
  size = 'md',
  showIcon = true,
  onSuccess,
  onError,
}: RestorePurchaseButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const handleRestorePurchases = async () => {
    try {
      setIsLoading(true);

      // Restaurer les achats RevenueCat
      const customerInfo = await Purchases.restorePurchases();

      // Vérifier si l'utilisateur a des entitlements actifs
      const hasActiveEntitlements = Object.keys(customerInfo.entitlements.active).length > 0;

      if (hasActiveEntitlements) {
        Alert.alert(
          t('premium.restore.alerts.success.title'),
          t('premium.restore.alerts.success.message'),
          [{ text: t('common.ok') }]
        );
        onSuccess?.();
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

      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Styles basés sur la variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return 'border border-blue-500 bg-transparent';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-blue-500';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return 'text-blue-500';
      default:
        return 'text-white';
    }
  };

  // Styles basés sur la taille
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2';
      case 'lg':
        return 'px-6 py-4';
      default:
        return 'px-4 py-3';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <TouchableOpacity
      onPress={handleRestorePurchases}
      disabled={isLoading}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        flex-row
        items-center justify-center rounded-lg
        ${isLoading ? 'opacity-70' : ''}
      `}>
      {isLoading ? (
        <>
          <ActivityIndicator size="small" color={variant === 'default' ? 'white' : '#3B82F6'} />
          <Text className={`ml-2 font-medium ${getTextStyles()} ${getTextSize()}`}>
            {t('premium.restore.restoring')}
          </Text>
        </>
      ) : (
        <>
          {showIcon && (
            <Icons.RotateCcw
              size={getIconSize()}
              color={variant === 'default' ? 'white' : '#3B82F6'}
            />
          )}
          <Text
            className={`${showIcon ? 'ml-2' : ''} font-medium ${getTextStyles()} ${getTextSize()}`}>
            {t('premium.restore.button')}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// Compact version for settings
export const RestorePurchaseRow = ({ onPress }: { onPress?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const iconColors = useIconColors();

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      const hasActiveEntitlements = Object.keys(customerInfo.entitlements.active).length > 0;

      if (hasActiveEntitlements) {
        Alert.alert(t('premium.restore.alerts.success.title'), t('premium.restore.alerts.success.message'));
      } else {
        Alert.alert(t('premium.restore.alerts.noItems.title'), t('premium.restore.alerts.noItems.message'));
      }

      onPress?.();
    } catch (error) {
      Alert.alert(t('premium.restore.alerts.error.title'), t('premium.restore.alerts.error.message'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleRestore}
      disabled={isLoading}
      className="flex-row items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-800">
      <View className="flex-row items-center">
        <Icons.RotateCcw size={20} color={iconColors.info} />
        <View className="ml-3">
          <Text className="font-medium text-gray-900 dark:text-white">{t('premium.restore.button')}</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {t('premium.restore.description')}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color={iconColors.info} />
      ) : (
        <Icons.ChevronRight size={20} color={iconColors.muted} />
      )}
    </TouchableOpacity>
  );
};

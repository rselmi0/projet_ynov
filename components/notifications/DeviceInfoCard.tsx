import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import * as Device from 'expo-device';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';

export const DeviceInfoCard: React.FC = () => {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  const getDeviceInfo = () => {
    if (Device.isDevice) {
      return {
        type: 'real',
        message: t('notifications.device.real'),
        icon: '📱',
        color: iconColors.success
      };
    } else {
      return {
        type: 'simulator',
        message: t('notifications.device.simulator'),
        icon: '💻',
        color: iconColors.warning
      };
    }
  };

  const deviceInfo = getDeviceInfo();

  return (
    <View className="bg-card rounded-2xl p-4 border border-border">
      <View className="flex-row items-center gap-3">
        <Text className="text-2xl">{deviceInfo.icon}</Text>
        <View className="flex-1">
          <Text className="text-sm font-medium text-foreground">
            {deviceInfo.message}
          </Text>
          {!Device.isDevice && (
            <Text className="text-xs text-muted-foreground mt-1">
              {t('notifications.device.simulatorNote')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}; 
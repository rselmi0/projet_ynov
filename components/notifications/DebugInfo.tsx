import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import * as Device from 'expo-device';
import { useTranslation } from '../../hooks/useTranslation';
import { useNotifications } from '../../hooks/useNotifications';

export const DebugInfo: React.FC = () => {
  const { t } = useTranslation();
  const { hasPermission, pushToken } = useNotifications();

  if (!__DEV__) {
    return null;
  }

  return (
    <View className="bg-muted/50 rounded-2xl p-4">
      <Text className="text-sm font-semibold text-muted-foreground mb-2">
        {t('notifications.debug.title')}
      </Text>
      <View className="gap-1">
        <Text className="text-xs font-mono text-muted-foreground">
          {t('notifications.debug.device')}: {Device.isDevice ? t('notifications.debug.physical') : t('notifications.debug.simulator')}
        </Text>
        <Text className="text-xs font-mono text-muted-foreground">
          {t('notifications.debug.permissions')}: {hasPermission ? t('notifications.debug.granted') : t('notifications.debug.notGranted')}
        </Text>
        {pushToken && (
          <Text className="text-xs font-mono text-muted-foreground">
            {t('notifications.debug.token')}: {pushToken.substring(0, 50)}...
          </Text>
        )}
      </View>
    </View>
  );
}; 
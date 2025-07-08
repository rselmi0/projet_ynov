import React from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { CheckCircle, AlertCircle, Settings, RefreshCw, Info } from 'lucide-react-native';
import * as Device from 'expo-device';
import { useTranslation } from '../../hooks/useTranslation';
import { useIconColors } from '../../hooks/useIconColors';
import { useNotifications } from '../../hooks/useNotifications';

export const PermissionStatusCard: React.FC = () => {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const { 
    isLoading, 
    pushToken,
    hasPermission,
    requestPermissions,
    checkPermissions,
    checkSystemPermissions,
  } = useNotifications();

  const handleRequestPermissions = async () => {
    try {
      const result = await requestPermissions();
      if (result.granted) {
        Alert.alert(t('notifications.alerts.success.title'), t('notifications.alerts.success.message'));
      } else {
        Alert.alert(t('notifications.alerts.denied.title'), t('notifications.alerts.denied.message'));
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert(t('notifications.alerts.error.title'), t('notifications.alerts.error.message'));
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <ActivityIndicator size="small" color={iconColors.info} />;
    if (hasPermission) return <CheckCircle size={20} color={iconColors.success} />;
    return <AlertCircle size={20} color={iconColors.error} />;
  };

  const getStatusText = () => {
    if (isLoading) return t('notifications.status.checking');
    if (hasPermission) return t('notifications.status.enabled');
    return t('notifications.status.disabled');
  };

  return (
    <View className="bg-card rounded-2xl p-6 border border-border">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-semibold text-foreground">
          {t('notifications.permission.status')}
        </Text>
        <View className="flex-row items-center gap-2">
          {getStatusIcon()}
          <Text className="text-base font-medium text-foreground">
            {getStatusText()}
          </Text>
        </View>
      </View>

      {!hasPermission && (
        <View className="gap-4">
          <Text className="text-sm text-muted-foreground">
            {t('notifications.description')}
          </Text>
          <Button
            onPress={handleRequestPermissions}
            disabled={isLoading}
            className="bg-blue-500 rounded-xl py-4">
            <Text className="text-white font-semibold text-base">
              {isLoading ? t('notifications.configuration') : t('notifications.enable')}
            </Text>
          </Button>
        </View>
      )}

      {hasPermission && (
        <View className="gap-4">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={checkSystemPermissions}
              className="flex-1 bg-secondary/20 rounded-xl p-4 flex-row items-center justify-center gap-2">
              <RefreshCw size={18} color={iconColors.primary} />
              <Text className="text-foreground font-medium">
                {t('notifications.actions.refresh')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert(
                t('notifications.actions.settings'), 
                t('notifications.messages.openSettings')
              )}
              className="flex-1 bg-secondary/20 rounded-xl p-4 flex-row items-center justify-center gap-2">
              <Settings size={18} color={iconColors.secondary} />
              <Text className="text-foreground font-medium">
                {t('notifications.actions.settings')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Token Status for Real Devices */}
          {Device.isDevice && (
            <View className="p-3 bg-secondary/10 rounded-lg">
              <View className="flex-row items-center gap-2">
                <Info size={16} color={iconColors.info} />
                <Text className="text-sm text-foreground font-medium">
                  {t('notifications.token.label')}: {pushToken ? t('notifications.status.connected') : t('notifications.status.disconnected')}
                </Text>
              </View>
              {pushToken && (
                <Text className="text-xs text-muted-foreground mt-1">
                  {t('notifications.messages.tokenSaved')}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}; 
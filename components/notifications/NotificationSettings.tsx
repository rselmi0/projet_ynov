import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslation } from '@/hooks/useTranslation';
import { Bell, CheckCircle, AlertCircle, Settings, Send } from 'lucide-react-native';
import { useIconColors } from '@/hooks/useIconColors';

export const NotificationSettings: React.FC = () => {
  const { permissionStatus, isLoading, expoPushToken, checkSystemPermissions, sendLocalTest, sendRemoteTest, testLoading } =
    useNotifications();
  const { t } = useTranslation();
  const iconColors = useIconColors();


  const handleRequestPermissions = async () => {
    await checkSystemPermissions();
  };

  const handleSendLocalTest = async () => {
    await sendLocalTest();
  };

  const handleSendRemoteTest = async () => {
    await sendRemoteTest();
  };

  const getStatusColor = () => {
    if (isLoading) return '#6B7280';
    if (permissionStatus.granted) return '#10B981';
    if (!permissionStatus.canAskAgain) return '#EF4444';
    return '#F59E0B';
  };

  const getStatusText = () => {
    if (isLoading) return t('settings.notifications.status.checking');
    if (permissionStatus.granted) return t('settings.notifications.status.enabled');
    if (!permissionStatus.canAskAgain) return t('settings.notifications.status.blocked');
    return t('settings.notifications.status.disabled');
  };

  const getStatusIcon = () => {
    if (isLoading) return <ActivityIndicator size="small" color={iconColors.secondary} />;
    if (permissionStatus.granted) return <CheckCircle size={20} color={iconColors.success} />;
    return <AlertCircle size={20} color={getStatusColor()} />;
  };

  return (
    <View className="space-y-6">
      {/* Header */}
      <View className="flex-row items-center">
        <Bell size={24} color={iconColors.info} className="mr-3" />
        <Text className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
          {t('settings.notifications.push')}
        </Text>
      </View>

      {/* Status Card */}
      <View className="rounded-xl bg-light-surface p-6 dark:bg-dark-surface">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            {t('settings.notifications.status.current')}
          </Text>
          <View className="flex-row items-center">
            {getStatusIcon()}
            <Text className="ml-2 text-sm font-medium" style={{ color: getStatusColor() }}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        <Text className="mb-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {t('settings.notifications.description')}
        </Text>

        {/* Action buttons */}
        <View className="space-y-3">
          {!permissionStatus.granted && (
            <Button
              onPress={handleRequestPermissions}
              disabled={isLoading}
              className="flex-row items-center justify-center rounded-lg bg-blue-500 p-4">
              <Settings size={18} color="white" className="mr-2" />
              <Text className="font-semibold text-white">
                {isLoading ? t('settings.notifications.configuration') : t('settings.notifications.enable')}
              </Text>
            </Button>
          )}

          {permissionStatus.granted && (
            <View className="space-y-3">
              <Button
                onPress={handleSendLocalTest}
                disabled={testLoading === 'local'}
                variant="outline"
                className="flex-row items-center justify-center rounded-lg border-blue-500 p-4">
                {testLoading === 'local' ? (
                  <ActivityIndicator size="small" color={iconColors.info} className="mr-2" />
                ) : (
                  <Send size={18} color={iconColors.info} className="mr-2" />
                )}
                <Text className="font-semibold text-blue-500">
                  {testLoading === 'local' ? t('settings.notifications.testing') : t('notifications.actions.testLocal')}
                </Text>
              </Button>

              {expoPushToken && (
                <Button
                  onPress={handleSendRemoteTest}
                  disabled={testLoading === 'remote'}
                  variant="outline"
                  className="flex-row items-center justify-center rounded-lg border-green-500 p-4">
                  {testLoading === 'remote' ? (
                    <ActivityIndicator size="small" color={iconColors.success} className="mr-2" />
                  ) : (
                    <Send size={18} color={iconColors.success} className="mr-2" />
                  )}
                  <Text className="font-semibold text-green-500">
                    {testLoading === 'remote' ? t('settings.notifications.testing') : t('notifications.actions.testRemote')}
                  </Text>
                </Button>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Token Info (Debug) */}
      {__DEV__ && expoPushToken && (
        <View className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
          <Text className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Token Push (Debug)
          </Text>
          <Text className="font-mono text-xs text-gray-600 dark:text-gray-400">
            {expoPushToken}
          </Text>
        </View>
      )}

      {/* Info Section */}
      <View className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
        <Text className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
          {t('onboarding.notifications.benefitsTitle')}
        </Text>
        <View className="space-y-1">
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {t('onboarding.notifications.benefits.updates')}
          </Text>
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            • {t('onboarding.notifications.benefits.sync')}
          </Text>
          <Text className="text-xs text-blue-600 dark:text-blue-400">• {t('onboarding.notifications.benefits.security')}</Text>
        </View>
      </View>
    </View>
  );
};

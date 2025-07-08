import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '../ui/text';
import { Smartphone, Send, Mail } from 'lucide-react-native';
import * as Device from 'expo-device';
import { useTranslation } from '../../hooks/useTranslation';
import { useIconColors } from '../../hooks/useIconColors';
import { useNotifications } from '../../hooks/useNotifications';

export const TestButtonsSection: React.FC = () => {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const { 
    hasPermission,
    pushToken,
    sendLocalTest,
    sendRemoteTest,
    sendEmailTest,
    testLoading
  } = useNotifications();

  // Debug logs
  console.log('=== PUSH TEST DEBUG ===');
  console.log('Device.isDevice:', Device.isDevice);
  console.log('hasPermission:', hasPermission);
  console.log('pushToken exists:', !!pushToken);
  console.log('pushToken preview:', pushToken ? `${pushToken.substring(0, 20)}...` : 'null');
  console.log('testLoading:', testLoading);
  console.log('Button should be enabled:', Device.isDevice && !!pushToken && testLoading !== 'remote');

  if (!hasPermission) {
    return null;
  }

  return (
    <View className="gap-4">
      <Text className="text-xl font-semibold text-foreground">
        {t('notifications.testNotifications')}
      </Text>
      
      <View className="gap-3">
        {/* Local Test Button - Always available when permissions granted */}
        <TouchableOpacity
          onPress={sendLocalTest}
          disabled={testLoading === 'local'}
          className="bg-card rounded-2xl p-6 border border-border active:opacity-80">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 gap-4">
              <View className="bg-green-100 dark:bg-green-900/30 rounded-full p-3">
                <Smartphone size={24} color={iconColors.success} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground mb-1">
                  {t('notifications.actions.testLocal')}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {t('notifications.messages.localTest')}
                </Text>
              </View>
            </View>
            {testLoading === 'local' ? (
              <ActivityIndicator size="small" color={iconColors.success} />
            ) : (
              <View className="bg-green-500 rounded-full p-2">
                <Send size={16} color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Remote Test Button - Only for real devices with push token */}
        <TouchableOpacity
          onPress={sendRemoteTest}
          disabled={!Device.isDevice || !pushToken || testLoading === 'remote'}
          className={`bg-card rounded-2xl p-6 border border-border ${
            Device.isDevice && pushToken && testLoading !== 'remote'
              ? 'active:opacity-80' 
              : 'opacity-50'
          }`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 gap-4">
              <View className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                <Send size={24} color={iconColors.info} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground mb-1">
                  {t('notifications.actions.testRemote')}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {Device.isDevice 
                    ? t('notifications.messages.remoteTest')
                    : t('notifications.messages.requiresDevice')
                  }
                </Text>
              </View>
            </View>
            {testLoading === 'remote' ? (
              <ActivityIndicator size="small" color={iconColors.info} />
            ) : (
              <View className={`rounded-full p-2 ${
                Device.isDevice && pushToken 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
              }`}>
                <Send size={16} color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Email Test Button - Always available when user is logged in */}
        <TouchableOpacity
          onPress={sendEmailTest}
          disabled={testLoading === 'email'}
          className="bg-card rounded-2xl p-6 border border-border active:opacity-80">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 gap-4">
              <View className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-3">
                <Mail size={24} color="#f97316" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground mb-1">
                  {t('notifications.actions.testEmail')}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {t('notifications.messages.emailTest')}
                </Text>
              </View>
            </View>
            {testLoading === 'email' ? (
              <ActivityIndicator size="small" color="#f97316" />
            ) : (
              <View className="bg-orange-500 rounded-full p-2">
                <Mail size={16} color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 
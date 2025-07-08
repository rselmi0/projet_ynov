import React from 'react';
import { View, Switch } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react-native';
import type { NotificationSettingsProps } from '@/types/onboarding';
import { useIconColors } from '@/hooks/useIconColors';

export function NotificationSettings({
  enabled,
  onToggle,
  permissionStatus,
  isLoading = false,
  benefits = [],
}: NotificationSettingsProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const getStatusText = () => {
    if (isLoading) return t('onboarding.notifications.status.checking');
    if (permissionStatus.granted) return t('onboarding.notifications.status.granted');
    if (!permissionStatus.canAskAgain) return t('onboarding.notifications.status.blocked');
    return t('onboarding.notifications.status.notGranted');
  };

  const getStatusColor = () => {
    if (isLoading) return '#6B7280';
    if (permissionStatus.granted) return '#10B981';
    if (!permissionStatus.canAskAgain) return '#EF4444';
    return '#F59E0B';
  };

  const StatusIcon = permissionStatus.granted ? CheckCircle : AlertCircle;

  return (
    <View className="gap-6">
      {/* Header section */}
      <View className="rounded-xl bg-card p-6">
        <View className="mb-6 flex-row items-center">
          <Bell size={24} color={iconColors.info} />
          <Text className="ml-3 text-lg font-semibold text-foreground">
            {t('onboarding.notifications.title')}
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground">
          {t('onboarding.notifications.description')}
        </Text>
      </View>

      {/* Toggle section */}
      <View className="rounded-xl bg-card p-6">
        <View className="flex-row items-center justify-between">
          <View className="mr-4 flex-1">
            <View className="mb-2 flex-row items-center">
              <Bell size={20} color={iconColors.info} />
              <Text className="ml-2 text-lg font-semibold text-foreground">
                {t('onboarding.notifications.pushTitle')}
              </Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              {t('onboarding.notifications.pushDescription')}
            </Text>

            {/* Status indicator */}
            <View className="mt-2 flex-row items-center">
              <StatusIcon size={16} color={getStatusColor()} />
              <Text
                className="ml-2 text-xs font-medium"
                style={{ color: getStatusColor() }}
              >
                {t('onboarding.notifications.status.label')}: {getStatusText()}
              </Text>
            </View>
          </View>
          
          <Switch
            value={enabled}
            onValueChange={onToggle}
            trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D1D5DB"
            disabled={isLoading}
          />
        </View>
      </View>

      {/* Benefits list */}
      {benefits.length > 0 && (
        <View className="gap-3">
          <Text className="text-base font-semibold text-foreground">
            {t('onboarding.notifications.benefitsTitle')}
          </Text>
          {benefits.map((benefit, index) => (
            <View key={index} className="flex-row items-center">
              <CheckCircle size={16} color={iconColors.success} />
              <Text className="ml-3 flex-1 text-sm text-muted-foreground">
                {benefit}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Privacy note */}
      <View className="rounded-lg bg-card p-4">
        <Text className="text-center text-xs text-foreground">
          {t('onboarding.notifications.privacyNote')}
        </Text>
      </View>
    </View>
  );
} 
import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { useNotifications } from '@/hooks/useNotifications';
import { Text } from '@/components/ui/text';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export default function Notifications() {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const { isLoading } = useNotifications();

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={iconColors.info} />
        <Text className="mt-4 text-muted-foreground">{t('common.loading')}...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-2 px-2">
          {/* Notification Center Component */}
          <NotificationCenter />
        </View>
      </ScrollView>
    </View>
  );
} 
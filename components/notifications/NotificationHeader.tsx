import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { Bell } from 'lucide-react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { useIconColors } from '../../hooks/useIconColors';

export const NotificationHeader: React.FC = () => {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <View>
      <View className="flex-row items-center gap-3 mb-3">
        <Bell size={28} color={iconColors.primary} />
        <Text className="text-3xl font-bold text-foreground">
          {t('notifications.title')}
        </Text>
      </View>
      <Text className="text-lg text-muted-foreground">
        {t('notifications.subtitle')}
      </Text>
    </View>
  );
}; 
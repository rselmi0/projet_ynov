import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { Mail, Shield } from 'lucide-react-native';
import type { ProfileInfoSectionProps } from '@/types/profile.d';

export const ProfileInfoSection = React.memo(function ProfileInfoSection({
  email,
  memberSince,
}: ProfileInfoSectionProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <SettingsSection title={t('settings.profile.title')}>
      {/* Email (read-only) */}
      <View className="px-6 py-4">
        <View className="flex-row items-center">
          <View style={{ marginRight: 12, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={20} color={iconColors.secondary} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
              {t('profile.info.email')}
            </Text>
            <Text className="text-muted-foreground" style={{ fontSize: 14, marginTop: 2 }}>
              {email || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View className="ml-15 h-px bg-border" />

      {/* Member Since */}
      <View className="px-6 py-4">
        <View className="flex-row items-center">
          <View style={{ marginRight: 12, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} color={iconColors.secondary} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
              {t('profile.info.memberSince')}
            </Text>
            <Text className="text-muted-foreground" style={{ fontSize: 14, marginTop: 2 }}>
              {memberSince}
            </Text>
          </View>
        </View>
      </View>
    </SettingsSection>
  );
}); 
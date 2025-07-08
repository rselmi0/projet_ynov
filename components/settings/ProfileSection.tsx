import React from 'react';
import { View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { useIconColors } from '../../hooks/useIconColors';
import { SettingsSection } from './SettingsSection';
import { SettingsRow } from './SettingsRow';
import * as Icons from 'lucide-react-native';
import { Text } from '../ui/text';
import { ProfileSectionProps } from '../../types/settings';

export const ProfileSection = React.memo(function ProfileSection({
  profile,
  displayName,
  isProfileComplete,
}: ProfileSectionProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <SettingsSection title={t('settings.profile.title')}>
      <SettingsRow
        icon={<Icons.Mail color={iconColors.secondary} size={20} />}
        title={t('settings.profile.email')}
        value={profile?.email || t('common.notSet')}
      />
      <View className="ml-11 h-px bg-border" />
      <SettingsRow
        icon={<Icons.User color={iconColors.secondary} size={20} />}
        title="Nom complet"
        value={displayName !== 'User' ? displayName : t('common.notSet')}
      />
      <View className="ml-11 h-px bg-border" />
      <SettingsRow
        icon={<Icons.Shield color={iconColors.secondary} size={20} />}
        title={t('settings.profile.status')}
        value={isProfileComplete ? t('common.complete') : t('common.incomplete')}
        rightElement={
          <View
            className={`rounded-full px-2 py-1 ${
              isProfileComplete ? 'bg-green-500/10' : 'bg-yellow-500/10'
            }`}>
            <Text
              className={`text-xs font-medium ${
                isProfileComplete ? 'text-green-600' : 'text-yellow-600'
              }`}>
              {isProfileComplete ? '✓' : '!'}
            </Text>
          </View>
        }
      />
    </SettingsSection>
  );
});

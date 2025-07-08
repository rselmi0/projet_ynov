import React, { useCallback } from 'react';
import { View, Alert } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { SettingsSection } from './SettingsSection';
import { SettingsRow } from './SettingsRow';
import { Toggle } from '@/components/ui/toggle';
import * as Icons from 'lucide-react-native';
import { NotificationsSectionProps } from '@/types/settings';
import { useIconColors } from '@/hooks/useIconColors';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationsSection = React.memo(function NotificationsSection({
  settings,
  updateSettings,
  notificationsLoading,
}: NotificationsSectionProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const { checkSystemPermissions, openSettings } = useNotifications();
  
  const handlePushNotificationToggle = useCallback(
    async (value: boolean) => {
      if (notificationsLoading) return; // Prevent multiple calls

      // If trying to enable notifications, first check system permissions
      if (value) {
        console.log('🔍 Checking system permissions before enabling...');
        const permissions = await checkSystemPermissions();
        
        if (!permissions.granted) {
          console.log('❌ System permissions not granted, cannot enable push notifications');
          return;
        }
        
        console.log('✅ System permissions granted, proceeding to enable...');
      }

      try {
        await updateSettings({ pushEnabled: value });
      } catch (error) {
        console.error('Erreur lors de la mise à jour des paramètres:', error);
      }
    },
    [updateSettings, notificationsLoading, checkSystemPermissions]
  );

  const handleEmailNotificationToggle = useCallback(
    async (value: boolean) => {
      if (notificationsLoading) return; // Prevent multiple calls

      try {
        await updateSettings({ emailEnabled: value });
      } catch (error) {
        console.error('Erreur lors de la mise à jour des paramètres:', error);
      }
    },
    [updateSettings, notificationsLoading]
  );

  const handleMarketingToggle = useCallback(
    async (value: boolean) => {
      if (notificationsLoading) return; // Prevent multiple calls

      try {
        await updateSettings({ marketingEnabled: value });
      } catch (error) {
        console.error('Erreur lors de la mise à jour des paramètres:', error);
      }
    },
    [updateSettings, notificationsLoading]
  );



  return (
    <SettingsSection
      title={t('settings.notifications.title')}
      footer={t('settings.notifications.footer')}>
      
      {/* Push Notifications Toggle */}
      <SettingsRow
        icon={<Icons.Bell color={iconColors.primary} size={20} />}
        title={t('settings.notifications.push')}
        subtitle={
          settings.pushEnabled
            ? t('settings.notifications.pushEnabled')
            : t('settings.notifications.pushDisabled')
        }
        rightElement={
          <Toggle 
            value={settings.pushEnabled} 
            onValueChange={handlePushNotificationToggle}
            disabled={notificationsLoading}
          />
        }
      />
      
      <View className="ml-11 h-px bg-border" />
      
      {/* Email Notifications */}
      <SettingsRow
        icon={<Icons.Mail color={iconColors.info} size={20} />}
        title={t('settings.notifications.email')}
        subtitle={
          settings.emailEnabled
            ? t('settings.notifications.emailEnabled')
            : t('settings.notifications.emailDisabled')
        }
        rightElement={
          <Toggle
            value={settings.emailEnabled}
            onValueChange={handleEmailNotificationToggle}
            disabled={notificationsLoading}
          />
        }
      />
      
      <View className="ml-11 h-px bg-border" />
      
      {/* Marketing Communications */}
      <SettingsRow
        icon={<Icons.MessageSquare color={iconColors.warning} size={20} />}
        title={t('settings.notifications.marketing')}
        subtitle={
          settings.marketingEnabled
            ? t('settings.notifications.marketingEnabled')
            : t('settings.notifications.marketingDisabled')
        }
        rightElement={
          <Toggle
            value={settings.marketingEnabled}
            onValueChange={handleMarketingToggle}
            disabled={notificationsLoading}
          />
        }
      />
      



    </SettingsSection>
  );
});

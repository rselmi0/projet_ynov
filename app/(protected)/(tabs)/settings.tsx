import React, { useMemo, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { useTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/hooks/useNotifications';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { Text } from '@/components/ui/text';
import {
  SettingsSection,
  ProfileSection,
  SubscriptionSection,
  NotificationsSection,
  PreferencesSection,
  AssistanceSection,
} from '@/components/settings';

export default function Settings() {
  const { signOut, session } = useAuth();
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const { profile, loading, isProfileComplete, isPaidUser, isPremiumUser } = useProfile();
  const { isDark, themeMode, setTheme } = useTheme();
  const { isPremium: isPremiumFromRC } = usePremiumStatus();
  const notifications = useNotifications();
  const iconColors = useIconColors();

  // Memoized computed values
  const displayName = useMemo(() => {
    return profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || profile?.email || 'User';
  }, [profile?.first_name, profile?.last_name, profile?.email]);

  const memberSinceDate = useMemo(() => {
    return profile?.created_at
      ? new Date(profile.created_at).toLocaleDateString(
          currentLanguage === 'fr' ? 'fr-FR' : 'en-US'
        )
      : 'N/A';
  }, [profile?.created_at, currentLanguage]);

  // Sign out handler
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [signOut]);

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={iconColors.info} />
        <Text className="mt-4 text-muted-foreground">{t('common.loading')}...</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text className="mt-4 text-muted-foreground">{t('settings.signOut')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View style={{ paddingVertical: 24 }}>
          {/* Profile Information Section */}
          <ProfileSection
            profile={profile}
            displayName={displayName}
            isProfileComplete={!!isProfileComplete}
          />

          {/* Subscription & Billing Section */}
          <SubscriptionSection
            isPaidUser={!!isPaidUser}
            isPremiumUser={!!isPremiumUser}
            isPremiumFromRC={!!isPremiumFromRC}
          />

          {/* Notifications Preferences */}
          <NotificationsSection
            settings={notifications.settings}
            updateSettings={notifications.updateSettings}
            notificationsLoading={notifications.isLoading}
          />

          {/* App Preferences */}
          <PreferencesSection
            currentLanguage={currentLanguage}
            isDark={isDark}
            themeMode={themeMode}
            changeLanguage={changeLanguage}
            setTheme={setTheme}
          />

          {/* Member Since Information */}
          <SettingsSection>
            <View className="px-6 py-4">
              <View className="flex-row items-center">
                <View style={{ marginRight: 12 }}>
                  <Text style={{ fontSize: 20 }}>🛡️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
                    {t('settings.memberSince')}
                  </Text>
                  <Text className="text-muted-foreground" style={{ fontSize: 14, marginTop: 2 }}>
                    {memberSinceDate}
                  </Text>
                </View>
              </View>
            </View>
          </SettingsSection>

          {/* Support & Legal */}
          <AssistanceSection
            profile={profile}
            isPremiumFromRC={!!isPremiumFromRC}
            session={session}
          />

          {/* Sign Out Action */}
          <SettingsSection>
            <TouchableOpacity
              className="px-6 py-4 active:opacity-70"
              onPress={handleSignOut}
              activeOpacity={0.7}>
              <View className="flex-row items-center">
                <View style={{ marginRight: 12 }}>
                  <Text style={{ fontSize: 20 }}>🚪</Text>
                </View>
                <Text className="text-red-600" style={{ fontSize: 16, fontWeight: '500' }}>
                  {t('settings.signOut')}
                </Text>
              </View>
            </TouchableOpacity>
          </SettingsSection>

          {/* Development Debug Sections - Only in DEV mode */}
          {__DEV__ &&profile && (
            <>
              {/* Debug Information */}
              <SettingsSection title="Debug Info">
                <View className="p-4">
                  <Text className="mb-2 font-mono text-xs text-muted-foreground">
                    Profile ID: {profile.id}
                  </Text>
                  <Text className="mb-2 font-mono text-xs text-muted-foreground">
                    Updated: {profile.updated_at || 'N/A'}
                  </Text>
                  <Text className="mb-2 font-mono text-xs text-muted-foreground">
                    Avatar URL: {profile.avatar_url || 'N/A'}
                  </Text>
                  <Text className="mb-2 font-mono text-xs text-muted-foreground">
                    Push Token:{' '}
                    {notifications.pushToken
                      ? notifications.pushToken.substring(0, 20) + '...'
                      : 'N/A'}
                  </Text>
                  <Text className="mb-2 font-mono text-xs text-muted-foreground">
                    Permissions: {notifications.settings.pushEnabled ? 'Granted' : 'Not Granted'}
                  </Text>
                </View>
              </SettingsSection>

              {/* Session Management Debug */}
              <SettingsSection title="Session Management Debug">
                <View className="p-4">
                  <Text className="mb-4 font-mono text-xs text-muted-foreground">
                    Test and debug MMKV + Supabase session persistence system
                  </Text>
                  {/* Debug buttons would go here - keeping them simple for now */}
                  <Text className="text-center text-muted-foreground">
                    Debug tools available in development mode
                  </Text>
                </View>
              </SettingsSection>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

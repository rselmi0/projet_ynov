import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '../ui/text';
import { SettingsSection } from '../settings/SettingsSection';
import { useTranslation } from '../../hooks/useTranslation';
import { useIconColors } from '../../hooks/useIconColors';

interface ProfileActionsSectionProps {
  onUpdateProfile: () => void;
  onSignOut: () => void;
  isUpdating: boolean;
}

export const ProfileActionsSection = React.memo(function ProfileActionsSection({
  onUpdateProfile,
  onSignOut,
  isUpdating,
}: ProfileActionsSectionProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <SettingsSection>
      {/* Update Profile Button */}
      <TouchableOpacity
        className={`px-6 py-4 active:opacity-70 ${isUpdating ? 'opacity-50' : ''}`}
        onPress={onUpdateProfile}
        disabled={isUpdating}
        activeOpacity={0.7}>
        <View className="flex-row items-center">
          <View style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 20 }}>💾</Text>
          </View>
          <View className="flex-1 flex-row items-center">
            {isUpdating ? (
              <>
                <ActivityIndicator size="small" color={iconColors.primary} style={{ marginRight: 8 }} />
                <Text className="text-primary" style={{ fontSize: 16, fontWeight: '500' }}>
                  Mise à jour en cours...
                </Text>
              </>
            ) : (
              <Text className="text-primary" style={{ fontSize: 16, fontWeight: '500' }}>
                Mettre à jour le profil
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View className="ml-11 h-px bg-border" />

      {/* Sign Out Button */}
      <TouchableOpacity
        className="px-6 py-4 active:opacity-70"
        onPress={onSignOut}
        activeOpacity={0.7}>
        <View className="flex-row items-center">
          <View style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 20 }}>🚪</Text>
          </View>
          <Text className="text-red-600" style={{ fontSize: 16, fontWeight: '500' }}>
            Se déconnecter
          </Text>
        </View>
      </TouchableOpacity>
    </SettingsSection>
  );
}); 
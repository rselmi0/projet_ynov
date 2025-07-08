import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { SettingsSection } from '../settings/SettingsSection';
import { useTranslation } from '../../hooks/useTranslation';

interface ProfileEditSectionProps {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onAvatarUrlChange: (value: string) => void;
  onEditField: (field: 'firstName' | 'lastName' | 'avatarUrl', currentValue: string) => void;
}

export const ProfileEditSection = React.memo(function ProfileEditSection({
  firstName,
  lastName,
  avatarUrl,
  onEditField,
}: ProfileEditSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingsSection title={t('profile.edit.title')}>
      {/* First Name Field */}
      <TouchableOpacity
        className="px-6 py-4 active:opacity-70"
        onPress={() => onEditField('firstName', firstName)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 20 }}>👤</Text>
          </View>
          <View className="flex-1">
            <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
              {t('profile.edit.firstName.label')}
            </Text>
            <Text className="text-muted-foreground" style={{ fontSize: 14, marginTop: 2 }}>
              {firstName || t('profile.placeholders.addFirstName')}
            </Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 18, color: '#3B82F6' }}>✏️</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View className="ml-11 h-px bg-border" />

      {/* Last Name Field */}
      <TouchableOpacity
        className="px-6 py-4 active:opacity-70"
        onPress={() => onEditField('lastName', lastName)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 20 }}>👥</Text>
          </View>
          <View className="flex-1">
            <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
              {t('profile.edit.lastName.label')}
            </Text>
            <Text className="text-muted-foreground" style={{ fontSize: 14, marginTop: 2 }}>
              {lastName || t('profile.placeholders.addLastName')}
            </Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 18, color: '#3B82F6' }}>✏️</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View className="ml-11 h-px bg-border" />

      {/* Avatar URL Field */}
      <TouchableOpacity
        className="px-6 py-4 active:opacity-70"
        onPress={() => onEditField('avatarUrl', avatarUrl)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View style={{ marginRight: 12 }}>
            <Text style={{ fontSize: 20 }}>🖼️</Text>
          </View>
          <View className="flex-1">
            <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
              {t('profile.edit.avatar.label')}
            </Text>
            <Text 
              className="text-muted-foreground" 
              style={{ fontSize: 14, marginTop: 2 }}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {avatarUrl || t('profile.placeholders.addAvatarUrl')}
            </Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 18, color: '#3B82F6' }}>✏️</Text>
          </View>
        </View>
      </TouchableOpacity>
    </SettingsSection>
  );
}); 
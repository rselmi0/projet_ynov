import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { useSounds } from '@/hooks/useSounds';
import { toast } from 'sonner-native';
import { Text } from '@/components/ui/text';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { Edit, User, Users } from 'lucide-react-native';
import {
  ProfileStatusSection,
  ProfileInfoSection,
  ProfileHeaderSection,
  EditFieldModal,
} from '@/components/profile';
import type { EditModalState } from '@/types/profile.d';
import { useIconColors } from '@/hooks/useIconColors';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { profile, loading, error, updateProfile, isProfileComplete, isPaidUser, isPremiumUser } =
    useProfile();
  const { playComplete, playClick } = useSounds();
  const iconColors = useIconColors();
  
  // Modal state for editing fields
  const [editModal, setEditModal] = useState<EditModalState>({
    visible: false,
    field: 'firstName',
    currentValue: '',
  });

  // Use profile data directly from store - no local state needed
  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';
  const avatarUrl = profile?.avatar_url || '';

  // Memoized computed values
  const memberSinceDate = useMemo(() => {
    return profile?.created_at
      ? new Date(profile.created_at).toLocaleDateString('fr-FR')
      : 'N/A';
  }, [profile?.created_at]);

  const handleImageSelected = useCallback(async (imageUri: string) => {
    // Save avatar to database when image is uploaded - no local state update needed
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        avatar_url: imageUri || undefined,
      });
      playComplete();
      // Toast is handled by useImageUpload hook - avoid duplicate notifications
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error(t('profile.toasts.avatarError'));
    }
  }, [firstName, lastName, updateProfile, playComplete]);

  const handleEditField = useCallback((field: 'firstName' | 'lastName', currentValue: string) => {
    playClick();
    setEditModal({
      visible: true,
      field,
      currentValue,
    });
  }, [playClick]);

  const handleCloseModal = useCallback(() => {
    setEditModal(prev => ({ ...prev, visible: false }));
  }, []);

  const handleSaveField = useCallback(async (value: string) => {
    const { field } = editModal;
    
    try {
      const updateData: Record<string, string | undefined> = {
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl || undefined,
      };

      // Update the specific field - store will handle state updates
      switch (field) {
        case 'firstName':
          updateData.first_name = value;
          break;
        case 'lastName':
          updateData.last_name = value;
          break;
      }

      await updateProfile(updateData);
      playComplete();
      toast.success(t('profile.toasts.updateSuccess'));
    } catch (error) {
      console.error('Save error:', error);
      toast.error(t('profile.toasts.updateError'));
    }
  }, [editModal, firstName, lastName, avatarUrl, updateProfile, playComplete, toast, t]);

  // Optimized loading state - only show loader if no cached profile
  if (loading && !profile) {
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
        <View className="py-6">
          {/* Error Alert */}
          {error && (
            <View className="mx-4 mb-6 rounded-2xl border border-destructive bg-red-500/10 p-4">
              <Text className="text-destructive text-sm">
                {error}
              </Text>
            </View>
          )}

          {/* Profile Incomplete Warning */}
          {!isProfileComplete && (
            <View className="mx-4 mb-6 rounded-2xl border border-yellow-500 bg-yellow-500/10 p-4">
              <Text className="text-yellow-600 text-sm">
                {t('profile.alerts.completeProfile')}
              </Text>
            </View>
          )}

          {/* Profile Header with Photo and Name */}
          <ProfileHeaderSection
            firstName={firstName}
            lastName={lastName}
            avatarUrl={avatarUrl}
            onImageSelected={handleImageSelected}
          />

          {/* Profile Information Section */}
          <ProfileInfoSection
            email={profile?.email}
            memberSince={memberSinceDate}
          />

          {/* Edit Profile Section with Icons */}
          <SettingsSection title={t('profile.edit.title')}>
            {/* First Name Field */}
            <TouchableOpacity
              className="px-6 py-4 active:opacity-70"
              onPress={() => handleEditField('firstName', firstName)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="mr-3 w-10 h-10 items-center justify-center">
                  <User size={20} color={iconColors.secondary} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-base font-medium">
                    {t('profile.edit.firstName.label')}
                  </Text>
                  <Text className="text-muted-foreground text-sm mt-0.5">
                    {firstName || t('profile.placeholders.addFirstName')}
                  </Text>
                </View>
                <View className="ml-2">
                  <Edit size={16} color={iconColors.primary} />
                </View>
              </View>
            </TouchableOpacity>

            <View className="ml-15 h-px bg-border" />

            {/* Last Name Field */}
            <TouchableOpacity
              className="px-6 py-4 active:opacity-70"
              onPress={() => handleEditField('lastName', lastName)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="mr-3 w-10 h-10 items-center justify-center">
                  <Users size={20} color={iconColors.secondary} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-base font-medium">
                    {t('profile.edit.lastName.label')}
                  </Text>
                  <Text className="text-muted-foreground text-sm mt-0.5">
                    {lastName || t('profile.placeholders.addLastName')}
                  </Text>
                </View>
                <View className="ml-2">
                  <Edit size={16} color={iconColors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          </SettingsSection>

          {/* Status Section */}
          <ProfileStatusSection
            isPaidUser={!!isPaidUser}
            isPremiumUser={!!isPremiumUser}
            isProfileComplete={!!isProfileComplete}
          />

          {/* Debug info (remove in production) */}
          {__DEV__ && profile && (
            <View className="mx-4 rounded-2xl border border-border bg-card p-4">
              <Text className="mb-2 text-muted-foreground text-xs font-medium uppercase">
                Debug Info
              </Text>
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
                Profile Complete: {isProfileComplete ? 'Yes' : 'No'}
              </Text>
              <Text className="mb-2 font-mono text-xs text-muted-foreground">
                Paid User: {isPaidUser ? 'Yes' : 'No'}
              </Text>
              <Text className="font-mono text-xs text-muted-foreground">
                Premium User: {isPremiumUser ? 'Yes' : 'No'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Field Modal */}
      <EditFieldModal
        visible={editModal.visible}
        fieldType={editModal.field}
        currentValue={editModal.currentValue}
        onClose={handleCloseModal}
        onSave={handleSaveField}
        onAutoSave={() => {}} // Disabled auto-save
      />
    </View>
  );
}

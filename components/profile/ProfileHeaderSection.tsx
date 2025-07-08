import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Image, Alert, ActionSheetIOS, Platform, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useAuth } from '@/context/AuthContext';
import { User, Camera } from 'lucide-react-native';
import type { ProfileHeaderSectionProps, ImageSource } from '@/types/profile.d';

export const ProfileHeaderSection = React.memo(function ProfileHeaderSection({
  firstName,
  lastName,
  avatarUrl,
  onImageSelected,
}: ProfileHeaderSectionProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const { session } = useAuth();

  // Memoized callback to prevent unnecessary re-renders
  const handleImageSuccess = useCallback((url: string) => {
    onImageSelected(url);
  }, [onImageSelected]);

  const { uploading, pickAndUploadImage, deleteImage, getCachedImage } = useImageUpload({
    bucketName: 'profiles',
    onSuccess: handleImageSuccess
  });

  // Memoized display name
  const displayName = useMemo(() => 
    firstName || lastName || 'User', 
    [firstName, lastName]
  );
  
  // Optimized image display logic with anti-flicker protection
  const currentImageUri = useMemo(() => {
    const cachedImage = getCachedImage(session?.user?.id);
    // Priority: cached image > avatarUrl (prevents white flash)
    return cachedImage || avatarUrl;
  }, [getCachedImage, session?.user?.id, avatarUrl]);

  const showImagePicker = () => {
    const options = [
      t('profile.imageSource.cancel'),
      t('profile.imageSource.gallery'),
      t('profile.imageSource.camera'),
    ];

    if (currentImageUri) {
      options.push(t('profile.imageSource.delete'));
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 0,
          destructiveButtonIndex: currentImageUri ? options.length - 1 : undefined,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleImageSelection('gallery');
          } else if (buttonIndex === 2) {
            handleImageSelection('camera');
          } else if (buttonIndex === 3 && currentImageUri) {
            handleDeleteImage();
          }
        }
      );
    } else {
      const alertOptions: {
        text: string;
        style?: 'default' | 'cancel' | 'destructive';
        onPress?: () => void;
      }[] = [
        { text: t('profile.imageSource.cancel'), style: 'cancel' },
        { text: t('profile.imageSource.gallery'), onPress: () => handleImageSelection('gallery') },
        { text: t('profile.imageSource.camera'), onPress: () => handleImageSelection('camera') },
      ];

      if (currentImageUri) {
        alertOptions.push({
          text: t('profile.imageSource.delete'),
          onPress: handleDeleteImage,
          style: 'destructive',
        });
      }

      Alert.alert(t('profile.imageSource.title'), undefined, alertOptions);
    }
  };

  // Memoized callbacks to prevent unnecessary re-renders
  const handleImageSelection = useCallback(async (source: ImageSource) => {
    await pickAndUploadImage(source, avatarUrl);
  }, [pickAndUploadImage, avatarUrl]);

  const handleDeleteImage = useCallback(async () => {
    if (!currentImageUri) return;

    Alert.alert(
      t('profile.alerts.deleteImageTitle'),
      t('profile.alerts.deleteImageMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.alerts.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            const success = await deleteImage(avatarUrl || '');
            if (success) {
              onImageSelected('');
            }
          },
        },
      ]
    );
  }, [currentImageUri, t, deleteImage, avatarUrl, onImageSelected]);

  return (
    <View className="mx-4 mb-6">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={showImagePicker}
          activeOpacity={0.7}
          className="relative"
          disabled={uploading}
        >
          <View className="relative">
            {currentImageUri ? (
              <Image
                source={{ uri: currentImageUri }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#f3f4f6',
                }}
                resizeMode="cover"
                fadeDuration={200} // Smooth fade transition
                defaultSource={{ 
                  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' 
                }} // Transparent placeholder
              />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#f3f4f6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#e5e7eb',
                }}
              >
                <User size={36} color={iconColors.muted} />
              </View>
            )}
            
            {uploading && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 40,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator size="small" color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View className="flex-1 ml-4">
          <Text 
            className="text-foreground" 
            style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}
          >
            {displayName}
          </Text>
          <Text 
            className="text-muted-foreground" 
            style={{ fontSize: 14, fontWeight: '400' }}
          >
            {t('profile.edit.title')}
          </Text>
          <View className="flex-row items-center gap-4 mt-2">
            <TouchableOpacity
              onPress={showImagePicker}
              className="flex-row items-center"
              disabled={uploading}
            >
              <Camera size={16} color={iconColors.primary} style={{ marginRight: 6 }} />
              <Text 
                className="text-primary" 
                style={{ fontSize: 14, fontWeight: '500' }}
              >
                {t('profile.edit.avatar.changePhoto')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}); 
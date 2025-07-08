import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useProfileStore } from '@/stores/profileStore';
import type { ImageSource } from '@/types/profile.d';

interface UseImageUploadOptions {
  bucketName?: string;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export const useImageUpload = ({ 
  bucketName = 'profiles', 
  onSuccess,
  onError 
}: UseImageUploadOptions = {}) => {
  const { session } = useAuth();
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const { setLocalImage, setRemoteImage, getDisplayImage, clearImageCache } = useProfileStore();
  
  // Avoid duplicate toasts
  const [lastToastTime, setLastToastTime] = useState(0);
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const now = Date.now();
    if (now - lastToastTime > 2000) { // Avoid toasts within 2s interval
      if (type === 'success') {
        toast.success(message);
      } else {
        toast.error(message);
      }
      setLastToastTime(now);
    }
  };

  const uploadToSupabase = async (base64Data: string, fileExtension: string): Promise<string | null> => {
    try {
      if (!session?.user?.id) {
        throw new Error('No user session found');
      }

      if (!base64Data || base64Data.length === 0) {
        throw new Error('Base64 data is empty');
      }

      const arrayBuffer = decode(base64Data);
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('ArrayBuffer is empty - base64 conversion failed');
      }

      const fileName = `${bucketName}_${Date.now()}.${fileExtension}`;
      const filePath = `${session.user.id}/${fileName}`;
      const contentType = `image/${fileExtension}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, arrayBuffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: contentType,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const deleteFromSupabase = async (imageUrl: string): Promise<void> => {
    try {
      if (!imageUrl) return;

      const url = new URL(imageUrl);
      const pathSegments = url.pathname.split('/');
      const filePath = pathSegments.slice(-2).join('/');

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const checkAndRequestPermission = async (type: 'camera' | 'library'): Promise<boolean> => {
    try {
      if (type === 'camera') {
        const currentPermissions = await ImagePicker.getCameraPermissionsAsync();
        
        if (currentPermissions.status === 'granted') {
          return true;
        }
        
        if (currentPermissions.status === 'denied' && currentPermissions.canAskAgain === false) {
          Alert.alert(
            t('profile.alerts.permissionDenied'),
            t('profile.alerts.cameraPermissionMessage')
          );
          return false;
        }
        
        const requestResult = await ImagePicker.requestCameraPermissionsAsync();
        
        if (requestResult.status === 'granted') {
          return true;
        } else {
          Alert.alert(
            t('profile.alerts.permissionDenied'),
            t('profile.alerts.cameraPermissionMessage')
          );
          return false;
        }
      } else {
        const currentPermissions = await ImagePicker.getMediaLibraryPermissionsAsync();
        
        if (currentPermissions.status === 'granted') {
          return true;
        }
        
        if (currentPermissions.status === 'denied' && currentPermissions.canAskAgain === false) {
          Alert.alert(
            t('profile.alerts.permissionDenied'),
            t('profile.alerts.galleryPermissionMessage')
          );
          return false;
        }
        
        const requestResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (requestResult.status === 'granted') {
          return true;
        } else {
          Alert.alert(
            t('profile.alerts.permissionDenied'),
            t('profile.alerts.galleryPermissionMessage')
          );
          return false;
        }
      }
    } catch (error) {
      console.error('Permission check error:', error);
      showToast(t('profile.alerts.permissionError'), 'error');
      return false;
    }
  };

  const pickImage = async (source: ImageSource): Promise<ImagePicker.ImagePickerAsset | null> => {
    try {
      const hasPermission = await checkAndRequestPermission(source === 'camera' ? 'camera' : 'library');
      if (!hasPermission) return null;

      let result;

      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1.0,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1.0,
          base64: true,
        });
      }

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }

      return null;
    } catch (error) {
      console.error('Image picker error:', error);
      showToast(t('profile.alerts.imageSelectionError'), 'error');
      return null;
    }
  };

  const uploadImage = async (
    asset: ImagePicker.ImagePickerAsset, 
    existingImageUrl?: string
  ): Promise<string | null> => {
    if (!session?.user?.id) {
      throw new Error('No user session found');
    }

    setUploading(true);
    
    // 1. Store local image immediately for fast display (without callback)
    setLocalImage(session.user.id, asset.uri);
    
    try {
      if (!asset.base64) {
        throw new Error('No base64 data found in asset');
      }

      const fileExtension = asset.fileName?.split('.').pop()?.toLowerCase() || 
                           asset.uri.split('.').pop()?.toLowerCase() || 
                           'jpg';

      if (existingImageUrl) {
        try {
          await deleteFromSupabase(existingImageUrl);
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError);
        }
      }

      // 2. Background upload
      const uploadedUrl = await uploadToSupabase(asset.base64, fileExtension);
      
      if (uploadedUrl) {
        // 3. Update with Supabase URL
        setRemoteImage(session.user.id, uploadedUrl);
        
        // 4. Single callback and toast at the end
        onSuccess?.(uploadedUrl);
        showToast(t('profile.alerts.imageUploaded'));
        return uploadedUrl;
      }

      return null;
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onError?.(new Error(errorMessage));
      showToast(t('profile.alerts.uploadError'), 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    if (!session?.user?.id) {
      throw new Error('No user session found');
    }

    setUploading(true);
    try {
      if (imageUrl && imageUrl.includes('supabase')) {
        await deleteFromSupabase(imageUrl);
      }
      
      // Clean cache for this user
      clearImageCache(session.user.id);
      showToast(t('profile.alerts.imageDeleted'));
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      showToast(t('profile.alerts.deleteError'), 'error');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const pickAndUploadImage = async (
    source: ImageSource, 
    existingImageUrl?: string
  ): Promise<string | null> => {
    const asset = await pickImage(source);
    if (!asset) return null;
    
    return await uploadImage(asset, existingImageUrl);
  };

  const getCachedImage = (userId?: string): string | undefined => {
    if (!userId) return undefined;
    return getDisplayImage(userId);
  };



  return {
    uploading,
    uploadImage,
    deleteImage,
    pickImage,
    pickAndUploadImage,
    uploadToSupabase,
    deleteFromSupabase,
    checkAndRequestPermission,
    getCachedImage,
  };
}; 
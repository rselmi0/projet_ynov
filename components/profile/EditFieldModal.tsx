import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, Alert } from 'react-native';
import { Text } from '../ui/text';
import { Input } from '../ui/input';
import { useTranslation } from '../../hooks/useTranslation';
import type { EditFieldModalProps, FieldConfig } from '../../types/profile.d';

export const EditFieldModal = React.memo(function EditFieldModal({
  visible,
  onClose,
  fieldType,
  currentValue,
  onSave,
}: EditFieldModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(currentValue);

  // Reset when modal opens
  useEffect(() => {
    if (visible) {
      setValue(currentValue);
    }
  }, [visible, currentValue]);

  const getFieldConfig = (): FieldConfig => {
    switch (fieldType) {
      case 'firstName':
        return {
          title: t('profile.edit.firstName.title'),
          placeholder: t('profile.edit.firstName.placeholder'),
          autoCapitalize: 'words' as const,
          keyboardType: 'default' as const,
        };
      case 'lastName':
        return {
          title: t('profile.edit.lastName.title'),
          placeholder: t('profile.edit.lastName.placeholder'),
          autoCapitalize: 'words' as const,
          keyboardType: 'default' as const,
        };
      case 'avatarUrl':
        return {
          title: t('profile.edit.avatar.title'),
          placeholder: t('profile.edit.avatar.placeholder'),
          autoCapitalize: 'none' as const,
          keyboardType: 'url' as const,
        };
    }
  };

  const config = getFieldConfig();

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  const handleTextChange = (text: string) => {
    setValue(text);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-primary" style={{ fontSize: 16, fontWeight: '500' }}>
              {t('profile.actions.cancel')}
            </Text>
          </TouchableOpacity>
          <Text className="text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            {config.title}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-primary" style={{ fontSize: 16, fontWeight: '600' }}>
              {t('profile.actions.save')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 py-6">
          <Input
            className="rounded-lg border border-border bg-card px-4 text-foreground"
            style={{
              minHeight: 50,
              paddingVertical: 12,
              paddingHorizontal: 16,
              fontSize: 16,
            }}
            placeholder={config.placeholder}
            value={value}
            onChangeText={handleTextChange}
            autoCapitalize={config.autoCapitalize}
            keyboardType={config.keyboardType}
            autoCorrect={fieldType !== 'avatarUrl'}
            autoFocus={true}
            selectTextOnFocus={true}
          />

          {fieldType === 'avatarUrl' && value && (
            <View style={{ marginTop: 16, padding: 16, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
              <Text className="text-muted-foreground" style={{ fontSize: 12, marginBottom: 8 }}>
                {t('profile.edit.avatar.preview')}
              </Text>
              <Text className="text-foreground" style={{ fontSize: 14, fontFamily: 'monospace' }}>
                {value}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}); 
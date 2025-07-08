import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Modal } from 'react-native';
import { Edit2, X } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import { TaskCardTask, EditTaskModalProps } from '@/types/tasks';

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isVisible,
  isUpdating,
  onClose,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDescription(task.description || '');
    }
  }, [task]);

  const handleUpdate = () => {
    if (!editTitle.trim()) return;
    onUpdate(editTitle.trim(), editDescription.trim() || undefined);
  };

  const isValid = editTitle.trim().length > 0;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-card border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-foreground text-xl font-bold">
              {t('tasks.edit.title')}
            </Text>
            <Pressable
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-muted items-center justify-center"
            >
              <X size={20} className="text-muted-foreground" />
            </Pressable>
          </View>

          {/* Title Input */}
          <View className="mb-4">
            <Text className="text-muted-foreground text-sm font-medium mb-2">
              {t('tasks.edit.titleLabel')}
            </Text>
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder={t('tasks.edit.titlePlaceholder')}
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              className="text-foreground text-base bg-secondary rounded-xl px-4 py-3 border border-transparent focus:border-primary"
              maxLength={100}
              editable={!isUpdating}
            />
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="text-muted-foreground text-sm font-medium mb-2">
              {t('tasks.edit.descriptionLabel')}
            </Text>
            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder={t('tasks.edit.descriptionPlaceholder')}
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              className="text-foreground text-sm bg-secondary rounded-xl px-4 py-3 border border-transparent focus:border-primary"
              multiline
              numberOfLines={3}
              maxLength={500}
              editable={!isUpdating}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-muted rounded-xl py-3 items-center"
            >
              <Text className="text-muted-foreground font-semibold">
                {t('common.cancel')}
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleUpdate}
              disabled={!isValid || isUpdating}
              className={`flex-1 rounded-xl py-3 items-center ${
                isValid && !isUpdating 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
            >
              {isUpdating ? (
                <View className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Text className={`font-semibold ${
                  isValid ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {t('common.save')}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 
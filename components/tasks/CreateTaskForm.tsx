import React, { useState } from 'react';
import { View, TextInput, Pressable, Animated } from 'react-native';
import { Plus, Edit3 } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import { CreateTaskFormProps } from '@/types/tasks';

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onCreateTask }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || isCreating) return;

    setIsCreating(true);
    try {
      await onCreateTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      
      // Reset form on success
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsCreating(false);
    }
  };

  const isValid = title.trim().length > 0;

  return (
    <View className="mb-8">
      {/* Quick Input - Always visible */}
      <View className={`bg-card/80 backdrop-blur-xl border ${titleFocused ? 'border-primary/50' : 'border-border/30'} rounded-2xl p-5 shadow-lg shadow-black/5 transition-all duration-200`}>
        <View className="flex-row items-center gap-3">
          <View className={`w-10 h-10 rounded-full ${titleFocused ? 'bg-primary/10' : 'bg-muted/50'} items-center justify-center transition-all duration-200`}>
            <Plus 
              size={20} 
              color={titleFocused ? (isDark ? '#3B82F6' : '#2563EB') : (isDark ? '#9CA3AF' : '#6B7280')} 
            />
          </View>
          
          <TextInput
            value={title}
            onChangeText={setTitle}
            onFocus={() => {
              setTitleFocused(true);
              setIsExpanded(true);
            }}
            onBlur={() => setTitleFocused(false)}
            placeholder={t('tasks.create.titlePlaceholder')}
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            className="flex-1 text-foreground text-[16px] font-medium"
            maxLength={100}
            editable={!isCreating}
            returnKeyType="next"
            onSubmitEditing={() => {
              if (!isExpanded) setIsExpanded(true);
            }}
          />
          
          {title.trim() && (
            <Pressable
              onPress={handleSubmit}
              disabled={!isValid || isCreating}
              className={`w-10 h-10 rounded-full items-center justify-center transition-all duration-200 ${
                isValid && !isCreating
                  ? 'bg-primary shadow-lg shadow-primary/25'
                  : 'bg-muted/50'
              }`}
            >
              <Plus 
                size={18} 
                color={isValid && !isCreating ? '#ffffff' : (isDark ? '#6B7280' : '#9CA3AF')} 
                className={isCreating ? 'animate-spin' : ''}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Expanded Form */}
      {isExpanded && (
        <View className="mt-3">
          <View className={`bg-card/80 backdrop-blur-xl border ${descriptionFocused ? 'border-primary/50' : 'border-border/30'} rounded-2xl p-5 shadow-lg shadow-black/5 transition-all duration-200`}>
            <View className="flex-row items-start gap-3">
              <View className={`w-10 h-10 rounded-full ${descriptionFocused ? 'bg-primary/10' : 'bg-muted/50'} items-center justify-center transition-all duration-200 mt-1`}>
                <Edit3 
                  size={16} 
                  color={descriptionFocused ? (isDark ? '#3B82F6' : '#2563EB') : (isDark ? '#9CA3AF' : '#6B7280')} 
                />
              </View>
              
              <View className="flex-1">
                <Text className="text-muted-foreground text-sm font-medium mb-3">
                  {t('tasks.create.descriptionInput')}
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setDescriptionFocused(true)}
                  onBlur={() => setDescriptionFocused(false)}
                  placeholder={t('tasks.create.descriptionPlaceholder')}
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  className="text-foreground text-[15px] leading-6 min-h-[80px]"
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                  editable={!isCreating}
                />
              </View>
            </View>
            
            {/* Action Buttons */}
            <View className="flex-row items-center justify-between mt-5 pt-4 border-t border-border/30">
              <Pressable
                onPress={() => {
                  setIsExpanded(false);
                  setDescription('');
                }}
                className="px-4 py-2 rounded-lg"
              >
                <Text className="text-muted-foreground font-medium">
                  {t('common.cancel')}
                </Text>
              </Pressable>
              
              <Pressable
                onPress={handleSubmit}
                disabled={!isValid || isCreating}
                className={`px-6 py-3 rounded-lg flex-row items-center gap-2 transition-all duration-200 ${
                  isValid && !isCreating
                    ? 'bg-primary shadow-lg shadow-primary/25'
                    : 'bg-muted/50'
                }`}
              >
                <Plus 
                  size={18} 
                  color={isValid && !isCreating ? '#ffffff' : (isDark ? '#6B7280' : '#9CA3AF')} 
                  className={isCreating ? 'animate-spin' : ''}
                />
                <Text 
                  className={`font-semibold ${
                    isValid && !isCreating
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {isCreating 
                    ? t('common.loading')
                    : t('tasks.create.createButton')
                  }
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}; 
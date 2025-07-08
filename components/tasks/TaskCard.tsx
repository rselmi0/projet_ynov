import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Check, Trash2, Clock, Edit2 } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import { useIconColors } from '@/hooks/useIconColors';
import { TaskCardProps } from '@/types/tasks';

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const iconColors = useIconColors();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('common.today');
    if (diffDays === 2) return t('common.yesterday');
    if (diffDays < 7) return `${diffDays} ${t('common.daysAgo')}`;
    
    return date.toLocaleDateString();
  };

  return (
    <View className="bg-card border border-border rounded-xl p-4">
      <View className="flex-row items-start gap-3">
        {/* Checkbox */}
        <Pressable
          onPress={() => onToggle(task.id)}
          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
            task.completed
              ? 'bg-primary border-primary'
              : 'border-border bg-background'
          }`}
        >
          {task.completed && (
            <Check size={12} color="#ffffff" strokeWidth={2} />
          )}
        </Pressable>

        {/* Content */}
        <View className="flex-1">
          {/* Title */}
          <Text 
            className={`text-foreground font-medium text-base mb-1 ${
              task.completed ? 'line-through opacity-60' : ''
            }`}
          >
            {task.title}
          </Text>

          {/* Description */}
          {task.description && (
            <Text className={`text-muted-foreground text-sm mb-2 ${
              task.completed ? 'opacity-50' : ''
            }`}>
              {task.description}
            </Text>
          )}

          {/* Date */}
          <View className="flex-row items-center gap-1">
            <Clock size={12} color={iconColors.muted} />
            <Text className="text-muted-foreground text-xs">
              {formatDate(task.created_at)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row items-center gap-2">
          {/* Edit Button */}
          {onEdit && (
            <Pressable
              onPress={() => onEdit(task)}
              className="w-8 h-8 rounded-lg bg-primary/10 items-center justify-center"
            >
              <Edit2 size={14} color={iconColors.primary} strokeWidth={2} />
            </Pressable>
          )}

          {/* Delete Button */}
          <Pressable
            onPress={() => onDelete(task.id)}
            className="w-8 h-8 rounded-lg bg-destructive/10 items-center justify-center"
          >
            <Trash2 size={14} color={iconColors.error} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}; 
import React, { useMemo } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { ListTodo, CheckCircle2, Clock, Sparkles } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import { useIconColors } from '@/hooks/useIconColors';
import { TaskCard } from './TaskCard';
import { TaskCardTask, TaskListProps } from '@/types/tasks';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const iconColors = useIconColors();

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      t('tasks.alerts.deleteTitle'),
      t('tasks.alerts.deleteMessage'),
      [
        {
          text: t('tasks.alerts.deleteCancel'),
          style: 'cancel',
        },
        {
          text: t('tasks.alerts.deleteConfirm'),
          style: 'destructive',
          onPress: () => onDeleteTask(id),
        },
      ]
    );
  };

  // Organize tasks
  const { pendingTasks, completedTasks, stats } = useMemo(() => {
    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);
    
    return {
      pendingTasks: pending,
      completedTasks: completed,
      stats: {
        total: tasks.length,
        completed: completed.length,
        pending: pending.length,
        completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0
      }
    };
  }, [tasks]);

  // Empty state
  if (tasks.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8 py-12">
        <View className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl items-center justify-center mb-6 shadow-lg shadow-primary/5">
          <Sparkles size={32} color={iconColors.info} />
        </View>
        
        <Text className="text-2xl font-bold text-foreground mb-3 text-center">
          {t('tasks.list.empty')}
        </Text>
        
        <Text className="text-muted-foreground text-center text-[16px] leading-6 max-w-sm">
          {t('tasks.list.emptySubtitle')}
        </Text>
        
        <View className="mt-8 bg-card/50 border border-border/30 rounded-2xl p-4">
          <Text className="text-muted-foreground text-sm text-center">
            💡 {t('tasks.list.emptyHint')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Pending tasks */}
        {pendingTasks.length > 0 && (
          <View className="mb-8">
            <View className="flex-row items-center gap-2 mb-4">
              <Clock size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text className="text-muted-foreground font-semibold">
                {t('tasks.list.pendingSection')} ({pendingTasks.length})
              </Text>
            </View>
            
            <View className="gap-3">
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onDelete={handleDeleteTask}
                  onEdit={onEditTask}
                />
              ))}
            </View>
          </View>
        )}

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <CheckCircle2 size={16} color={iconColors.success} />
              <Text className="text-muted-foreground font-semibold">
                {t('tasks.list.completedSection')} ({completedTasks.length})
              </Text>
            </View>
            
            <View className="gap-3">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onDelete={handleDeleteTask}
                  onEdit={onEditTask}
                />
              ))}
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}; 
import React, { useState, useMemo } from 'react';
import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Send } from 'lucide-react-native';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';
import { useIconColors } from '@/hooks/useIconColors';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/context/ThemeContext';
import { useSounds } from '@/hooks/useSounds';
import { toast } from 'sonner-native';
import { EditTaskModal } from '@/components/tasks';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { TaskCardTask } from '@/types/tasks';

/**
 * Tasks Page Component
 * 
 * A comprehensive task management interface with:
 * - Create new tasks with simple input
 * - Edit existing tasks with modal
 * - View, toggle, and delete existing tasks
 * - Animated progress bar
 * - Haptic feedback
 * - Clean and modern UI
 */
export default function TasksPage() {
  const { t } = useTranslation();
  const { tasks, createTask, updateTask, toggleTask, deleteTask } = useTasks();
  const { isDark } = useTheme();
  const { playClick, playComplete, playDelete } = useSounds();
  const iconColors = useIconColors();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskCardTask | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Convert tasks to match our component interface
  const tasksList: TaskCardTask[] = (tasks || []).map(task => ({
    ...task,
  }));

  // Memoized calculations to avoid unnecessary re-renders and animation glitches
  const { completedTasks, totalTasks, progressPercentage } = useMemo(() => {
    const completed = tasksList.filter(task => task.completed).length;
    const total = tasksList.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      completedTasks: completed,
      totalTasks: total,
      progressPercentage: percentage
    };
  }, [tasksList]);

  /**
   * Handle creating a new task
   */
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || isCreating) return;

    playClick();
    setIsCreating(true);
    
    try {
      await createTask({ title: newTaskTitle.trim() });
      setNewTaskTitle('');
      toast.success(t('tasks.toasts.created'));
    } catch (_error) {
      toast.error(t('tasks.toasts.createError'));
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Handle opening edit modal
   */
  const handleEditTask = (task: TaskCardTask) => {
    setEditingTask(task);
    playClick();
  };

  /**
   * Handle updating a task
   */
  const handleUpdateTask = async (title: string, description?: string) => {
    if (!editingTask) return;

    setIsUpdating(true);
    try {
      await updateTask(editingTask.id, {
        id: editingTask.id,
        title,
        description,
      });
      
      setEditingTask(null);
      toast.success(t('tasks.toasts.updated'));
    } catch (_error) {
      toast.error(t('tasks.toasts.updateError'));
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle toggling task completion status
   */
  const handleToggleTask = async (id: string) => {
    try {
      const task = tasksList.find(t => t.id === id);
      await toggleTask(id);
      playComplete();
      
      // Show appropriate toast based on completion status
      if (task?.completed) {
        toast.success(t('tasks.toasts.uncompleted'));
      } else {
        toast.success(t('tasks.toasts.completed'));
      }
    } catch (_error) {
      toast.error(t('tasks.toasts.toggleError'));
    }
  };

  /**
   * Handle deleting a task
   */
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      playDelete();
      toast.success(t('tasks.toasts.deleted'));
    } catch (_error) {
      toast.error(t('tasks.toasts.deleteError'));
    }
  };

  const isValid = newTaskTitle.trim().length > 0;

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Task Input */}
        <View className="mb-6">
          <View className="bg-card border border-border rounded-2xl px-4 py-2">
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <TextInput
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  placeholder={t('tasks.create.placeholder')}
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  className="text-foreground text-base py-2"
                  maxLength={100}
                  editable={!isCreating}
                  returnKeyType="send"
                  onSubmitEditing={handleCreateTask}
                />
              </View>
        
              
              <Pressable
                onPress={handleCreateTask}
                disabled={!isValid || isCreating}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isValid && !isCreating 
                    ? 'bg-primary' 
                    : 'bg-muted'
                }`}
              >
                {isCreating ? (
                  <View className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send 
                    size={16} 
                    color={isValid ? '#ffffff' : '#9CA3AF'}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>

        {/* Header and Progress */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-foreground text-2xl font-bold">
              {t('tasks.title')}
            </Text>
            {totalTasks > 0 && (
              <Text className="text-muted-foreground text-sm">
                {completedTasks}/{totalTasks}
              </Text>
            )}
          </View>
          
          {/* Progress Bar */}
          {totalTasks > 0 && (
            <ProgressBar 
              progress={progressPercentage} 
              height={4}
              animated={true}
              color={iconColors.primary}
            />
          )}
          
          {/* Task Status Labels */}
          {totalTasks > 0 && (
            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-muted-foreground text-sm font-medium">
                {totalTasks - completedTasks > 0 
                  ? `${totalTasks - completedTasks} ${t('tasks.list.pending')}`
                  : t('tasks.list.allCompleted')
                }
              </Text>
              {completedTasks > 0 && (
                <Text className="text-muted-foreground text-sm font-medium">
                  {completedTasks} {t('tasks.list.completed')}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Tasks list with edit functionality */}
        <TaskList
          tasks={tasksList}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      </ScrollView>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isVisible={editingTask !== null}
        isUpdating={isUpdating}
        onClose={() => setEditingTask(null)}
        onUpdate={handleUpdateTask}
      />
    </View>
  );
}

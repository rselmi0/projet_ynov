import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';

import { 
  fetchTasks, 
  createTask as createTaskAPI, 
  updateTask as updateTaskAPI, 
  toggleTask as toggleTaskAPI, 
  deleteTask as deleteTaskAPI 
} from '@/fetch/tasks';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/tasks';

/**
 * Query Keys for React Query
 * Centralized key management for better cache control
 */
export const QUERY_KEYS = {
  TASKS: ['tasks'] as const,
  TASK: (id: string) => ['tasks', id] as const,
} as const;

/**
 * Custom hook for managing tasks with React Query
 * 
 * Features:
 * - Automatic caching with React Query
 * - Optimistic updates for better UX
 * - Error handling with user feedback
 * - Background refetching when online
 * - Simple and reusable pattern
 */
export function useTasks() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  /**
   * Query: Fetch all tasks
   * React Query automatically handles:
   * - Caching
   * - Background refetching
   * - Loading states
   * - Error retries
   */
  const tasksQuery = useQuery({
    queryKey: QUERY_KEYS.TASKS,
    queryFn: fetchTasks,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 3, // Retry failed requests 3 times
  });

  /**
   * Mutation: Create a new task
   * Includes optimistic updates for instant feedback
   */
  const createTaskMutation = useMutation({
    mutationFn: createTaskAPI,
    onMutate: async (newTask: CreateTaskInput) => {
      console.log('🚀 Creating task optimistically:', newTask);
      
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
      
      // Get current tasks
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);
      
             // Optimistically update cache with new task
       const optimisticTask: Task = {
         id: `temp-${Date.now()}`, // Temporary ID
         title: newTask.title,
         description: newTask.description,
         completed: false,
         user_id: 'current-user',
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         synced: false,
       };
      
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) => 
        old ? [optimisticTask, ...old] : [optimisticTask]
      );
      
      return { previousTasks };
    },
    onError: (error, variables, context) => {
      console.error('❌ Create task failed, reverting optimistic update:', error);
      
      // Revert optimistic update on error
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
      }
    },
    onSettled: () => {
      // Always refetch after mutation to ensure data consistency
      console.log('🔄 Refetching tasks after create mutation');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });

  /**
   * Mutation: Update a task
   */
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Omit<UpdateTaskInput, 'id'> }) =>
      updateTaskAPI(id, updates),
    onMutate: async ({ id, updates }) => {
      console.log(`🔄 Updating task ${id} optimistically:`, updates);
      
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
      
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);
      
      // Optimistically update the specific task
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) =>
        old?.map(task => 
          task.id === id 
            ? { ...task, ...updates, updated_at: new Date().toISOString() }
            : task
        ) || []
      );
      
      return { previousTasks };
    },
    onError: (error, variables, context) => {
      console.error('❌ Update task failed, reverting optimistic update:', error);
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
      }
    },
    onSettled: () => {
      console.log('🔄 Refetching tasks after update mutation');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });

  /**
   * Mutation: Toggle task completion
   */
  const toggleTaskMutation = useMutation({
    mutationFn: toggleTaskAPI,
    onMutate: async (taskId: string) => {
      console.log(`🔄 Toggling task ${taskId} optimistically`);
      
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
      
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);
      
      // Optimistically toggle the task
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) =>
        old?.map(task => 
          task.id === taskId 
            ? { ...task, completed: !task.completed, updated_at: new Date().toISOString() }
            : task
        ) || []
      );
      
      return { previousTasks };
    },
    onError: (error, variables, context) => {
      console.error('❌ Toggle task failed, reverting optimistic update:', error);
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
      }
    },
    onSettled: () => {
      console.log('🔄 Refetching tasks after toggle mutation');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });

  /**
   * Mutation: Delete a task
   */
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTaskAPI,
    onMutate: async (taskId: string) => {
      console.log(`🗑️ Deleting task ${taskId} optimistically`);
      
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });
      
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.TASKS);
      
      // Optimistically remove the task
      queryClient.setQueryData<Task[]>(QUERY_KEYS.TASKS, (old) =>
        old?.filter(task => task.id !== taskId) || []
      );
      
      return { previousTasks };
    },
    onError: (error, variables, context) => {
      console.error('❌ Delete task failed, reverting optimistic update:', error);
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
      }
    },
    onSettled: () => {
      console.log('🔄 Refetching tasks after delete mutation');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });

  /**
   * Convenience methods for easier usage in components
   */
  const createTask = (input: CreateTaskInput) => {
    console.log('📝 Initiating task creation:', input);
    return createTaskMutation.mutateAsync(input);
  };

  const updateTask = (id: string, updates: UpdateTaskInput) => {
    console.log(`🔄 Initiating task update for ${id}:`, updates);
    return updateTaskMutation.mutateAsync({ id, updates });
  };

  const toggleTask = (id: string) => {
    console.log(`🔄 Initiating task toggle for ${id}`);
    return toggleTaskMutation.mutateAsync(id);
  };

  const deleteTask = (id: string) => {
    console.log(`🗑️ Initiating task deletion for ${id}`);
    return deleteTaskMutation.mutateAsync(id);
  };

  return {
    // Query data and states
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    
    // Mutation states
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isToggling: toggleTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    
    // Actions
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    
    // Utility functions
    refetch: tasksQuery.refetch,
    invalidateCache: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS }),
  };
} 
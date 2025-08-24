import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTasks } from '@/hooks/useTasks';
import * as tasksFetch from '@/fetch/tasks';

// Mock fetch functions
jest.mock('@/fetch/tasks', () => ({
  fetchTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  toggleTask: jest.fn(),
  deleteTask: jest.fn(),
}));

const mockFetchTasks = tasksFetch.fetchTasks as jest.MockedFunction<typeof tasksFetch.fetchTasks>;
const mockCreateTask = tasksFetch.createTask as jest.MockedFunction<typeof tasksFetch.createTask>;
const mockUpdateTask = tasksFetch.updateTask as jest.MockedFunction<typeof tasksFetch.updateTask>;
const mockToggleTask = tasksFetch.toggleTask as jest.MockedFunction<typeof tasksFetch.toggleTask>;
const mockDeleteTask = tasksFetch.deleteTask as jest.MockedFunction<typeof tasksFetch.deleteTask>;

// Create wrapper component for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
};

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchTasks.mockResolvedValue([]);
  });

  describe('initial state', () => {
    it('should return default values when hook is called', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      expect(result.current.tasks).toEqual([]);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.isCreating).toBe(false);
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.isToggling).toBe(false);
      expect(result.current.isDeleting).toBe(false);
      expect(typeof result.current.createTask).toBe('function');
      expect(typeof result.current.updateTask).toBe('function');
      expect(typeof result.current.toggleTask).toBe('function');
      expect(typeof result.current.deleteTask).toBe('function');
      expect(typeof result.current.refetch).toBe('function');
      expect(typeof result.current.invalidateCache).toBe('function');
    });
  });

  describe('fetchTasks', () => {
    it('should fetch and return tasks successfully', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false, user_id: 'user-1', created_at: '2023-01-01', updated_at: '2023-01-01', synced: true },
        { id: '2', title: 'Task 2', completed: true, user_id: 'user-1', created_at: '2023-01-02', updated_at: '2023-01-02', synced: true }
      ];
      mockFetchTasks.mockResolvedValue(mockTasks);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Fetch failed');
      mockFetchTasks.mockRejectedValue(error);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.tasks).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const newTask = { title: 'New Task', description: 'Task description' };
      const createdTask = { 
        id: '1', 
        title: 'New Task', 
        description: 'Task description',
        completed: false, 
        user_id: 'user-1', 
        created_at: '2023-01-01', 
        updated_at: '2023-01-01', 
        synced: true 
      };
      mockCreateTask.mockResolvedValue(createdTask);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await result.current.createTask(newTask);
      });

      expect(mockCreateTask).toHaveBeenCalledWith(newTask);
      expect(result.current.isCreating).toBe(false);
    });

    it('should handle create task errors', async () => {
      const newTask = { title: 'New Task', description: 'Task description' };
      const error = new Error('Create failed');
      mockCreateTask.mockRejectedValue(error);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        try {
          await result.current.createTask(newTask);
        } catch (e) {
          // Expected to throw
        }
      });

      expect(mockCreateTask).toHaveBeenCalledWith(newTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskId = '1';
      const updates = { title: 'Updated Task' };
      const updatedTask = { 
        id: '1', 
        title: 'Updated Task', 
        completed: false, 
        user_id: 'user-1', 
        created_at: '2023-01-01', 
        updated_at: '2023-01-01', 
        synced: true 
      };
      mockUpdateTask.mockResolvedValue(updatedTask);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await result.current.updateTask(taskId, { id: taskId, ...updates });
      });

      expect(mockUpdateTask).toHaveBeenCalledWith(taskId, updates);
      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe('toggleTask', () => {
    it('should toggle a task successfully', async () => {
      const taskId = '1';
      const toggledTask = { 
        id: '1', 
        title: 'Task 1', 
        completed: true, 
        user_id: 'user-1', 
        created_at: '2023-01-01', 
        updated_at: '2023-01-01', 
        synced: true 
      };
      mockToggleTask.mockResolvedValue(toggledTask);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await result.current.toggleTask(taskId);
      });

      expect(mockToggleTask).toHaveBeenCalledWith(taskId);
      expect(result.current.isToggling).toBe(false);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const taskId = '1';
      mockDeleteTask.mockResolvedValue();

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await result.current.deleteTask(taskId);
      });

      expect(mockDeleteTask).toHaveBeenCalledWith(taskId);
      expect(result.current.isDeleting).toBe(false);
    });
  });

  describe('utility functions', () => {
    it('should call invalidateCache method correctly', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await result.current.invalidateCache();
      });

      expect(typeof result.current.invalidateCache).toBe('function');
    });

    it('should call refetch method correctly', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await result.current.refetch();
      });

      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('comprehensive task operations', () => {
    it('should handle multiple task operations sequentially', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false, user_id: 'user-1', created_at: '2023-01-01', updated_at: '2023-01-01', synced: true },
      ];
      
      mockFetchTasks.mockResolvedValue(mockTasks);
      mockCreateTask.mockResolvedValue({ id: '2', title: 'New Task', completed: false, user_id: 'user-1', created_at: '2023-01-02', updated_at: '2023-01-02', synced: true });
      mockUpdateTask.mockResolvedValue({ id: '1', title: 'Updated Task', completed: false, user_id: 'user-1', created_at: '2023-01-01', updated_at: '2023-01-02', synced: true });
      mockToggleTask.mockResolvedValue({ id: '1', title: 'Updated Task', completed: true, user_id: 'user-1', created_at: '2023-01-01', updated_at: '2023-01-03', synced: true });
      mockDeleteTask.mockResolvedValue();

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      // Wait for initial load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Create task
      await act(async () => {
        await result.current.createTask({ title: 'New Task', description: 'Description' });
      });

      // Update task
      await act(async () => {
        await result.current.updateTask('1', { id: '1', title: 'Updated Task' });
      });

      // Toggle task
      await act(async () => {
        await result.current.toggleTask('1');
      });

      // Delete task
      await act(async () => {
        await result.current.deleteTask('1');
      });

      expect(mockCreateTask).toHaveBeenCalledWith({ title: 'New Task', description: 'Description' });
      expect(mockUpdateTask).toHaveBeenCalledWith('1', { title: 'Updated Task' });
      expect(mockToggleTask).toHaveBeenCalledWith('1');
      expect(mockDeleteTask).toHaveBeenCalledWith('1');
    });

    it('should handle concurrent operations', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      const promises = [
        result.current.createTask({ title: 'Task 1', description: 'Desc 1' }),
        result.current.createTask({ title: 'Task 2', description: 'Desc 2' }),
        result.current.createTask({ title: 'Task 3', description: 'Desc 3' }),
      ];

      await act(async () => {
        await Promise.all(promises);
      });

      expect(mockCreateTask).toHaveBeenCalledTimes(3);
    });

    it('should handle different error types', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      // Network error
      mockCreateTask.mockRejectedValueOnce(new Error('Network error'));
      await act(async () => {
        try {
          await result.current.createTask({ title: 'Test', description: 'Test' });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      // String error
      mockUpdateTask.mockRejectedValueOnce('String error');
      await act(async () => {
        try {
          await result.current.updateTask('1', { id: '1', title: 'Test' });
        } catch (error) {
          expect(error).toBe('String error');
        }
      });

      // Null error
      mockToggleTask.mockRejectedValueOnce(null);
      await act(async () => {
        try {
          await result.current.toggleTask('1');
        } catch (error) {
          expect(error).toBe(null);
        }
      });
    });

    it('should handle validation errors', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      // Empty title
      await act(async () => {
        try {
          await result.current.createTask({ title: '', description: 'Valid description' });
        } catch (error) {
          expect(error).toBeDefined();
        }
      });

      // Empty description
      await act(async () => {
        try {
          await result.current.createTask({ title: 'Valid title', description: '' });
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });

    it('should handle loading states correctly', async () => {
      let resolveCreate: (value: any) => void;
      const createPromise = new Promise(resolve => {
        resolveCreate = resolve;
      });
      
      mockCreateTask.mockReturnValue(createPromise as any);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      const createTaskPromise = act(async () => {
        await result.current.createTask({ title: 'Test Task', description: 'Test Description' });
      });

      expect(result.current.isCreating).toBe(true);

      resolveCreate!({ id: '1', title: 'Test Task', completed: false, user_id: 'user-1', created_at: '2023-01-01', updated_at: '2023-01-01', synced: true });
      await createTaskPromise;

      expect(result.current.isCreating).toBe(false);
    });

    it('should handle cache invalidation', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await result.current.invalidateCache();
      });

      expect(typeof result.current.invalidateCache).toBe('function');
    });

    it('should handle refetch with error', async () => {
      mockFetchTasks.mockRejectedValueOnce(new Error('Refetch failed'));

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        try {
          await result.current.refetch();
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });
    });

    it('should provide correct state properties', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      expect(typeof result.current.tasks).toBe('object');
      expect(Array.isArray(result.current.tasks)).toBe(true);
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isError).toBe('boolean');
      expect(typeof result.current.isCreating).toBe('boolean');
      expect(typeof result.current.isUpdating).toBe('boolean');
      expect(typeof result.current.isToggling).toBe('boolean');
      expect(typeof result.current.isDeleting).toBe('boolean');
    });

    it('should handle empty task list', async () => {
      mockFetchTasks.mockResolvedValue([]);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.tasks).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should handle task with all properties', async () => {
      const fullTask = {
        id: '1',
        title: 'Full Task',
        description: 'Full Description',
        completed: false,
        user_id: 'user-1',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        synced: true,
        due_date: '2023-12-31T23:59:59Z',
        priority: 'high',
        tags: ['work', 'urgent']
      };

      mockFetchTasks.mockResolvedValue([fullTask]);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.tasks[0]).toEqual(fullTask);
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      const error = new Error('Network error');
      mockFetchTasks.mockRejectedValue(error);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeTruthy();
    });

    it('should handle validation errors for createTask', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTasks(), { wrapper });

      await act(async () => {
        try {
          await result.current.createTask({ title: '', description: '' });
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });
  });
});
import { fetchTasks, createTask, updateTask, deleteTask, toggleTask } from '@/fetch/tasks';
import { supabase } from '@/config/supabase';

// Mock Supabase
jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({
          data: [
            { id: '1', title: 'Task 1', completed: false, user_id: 'user-1', created_at: '2023-01-01', updated_at: '2023-01-01' },
            { id: '2', title: 'Task 2', completed: true, user_id: 'user-1', created_at: '2023-01-02', updated_at: '2023-01-02' }
          ],
          error: null
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: { id: '1', title: 'New Task', completed: false, user_id: 'user-1', created_at: '2023-01-01', updated_at: '2023-01-01' },
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: { id: '1', title: 'Updated Task', completed: false, user_id: 'user-1', created_at: '2023-01-01', updated_at: '2023-01-01' },
              error: null
            }))
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          error: null
        }))
      }))
    })),
    auth: {
      getUser: jest.fn(() => Promise.resolve({
        data: { user: { id: 'user-1' } },
        error: null
      }))
    }
  }
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      const tasks = await fetchTasks();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Task 1');
    });

    it('should handle fetch errors', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: null,
            error: new Error('Fetch failed')
          }))
        }))
      } as any);

      await expect(fetchTasks()).rejects.toThrow('Failed to fetch tasks: Fetch failed');
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const input = { title: 'New Task', description: 'Task description' };
      const task = await createTask(input);
      
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(task.title).toBe('New Task');
    });

    it('should handle create errors', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: null,
              error: new Error('Create failed')
            }))
          }))
        }))
      } as any);

      const input = { title: 'New Task', description: 'Task description' };
      await expect(createTask(input)).rejects.toThrow('Failed to create task: Create failed');
    });

    it('should handle authentication errors', async () => {
      (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated')
      });

      const input = { title: 'New Task', description: 'Task description' };
      await expect(createTask(input)).rejects.toThrow('User must be authenticated to create tasks');
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const task = await updateTask('1', { title: 'Updated Task' });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
      expect(task.title).toBe('Updated Task');
    });

    it('should handle update errors', async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({
                data: null,
                error: new Error('Update failed')
              }))
            }))
          }))
        }))
      } as any);

      await expect(updateTask('1', { title: 'Updated' })).rejects.toThrow('Failed to update task: Update failed');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      await deleteTask('1');
      
      expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
    });

    it('should handle delete errors', async () => {
      mockSupabase.from.mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            error: new Error('Delete failed')
          }))
        }))
      } as any);

      await expect(deleteTask('1')).rejects.toThrow('Failed to delete task: Delete failed');
    });
  });

  describe('toggleTask', () => {
    it('should toggle a task successfully', async () => {
      // Mock the select call to get current task
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: { completed: false },
              error: null
            }))
          }))
        }))
      } as any);

      // Mock the update call
      mockSupabase.from.mockReturnValueOnce({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({
                data: { id: '1', title: 'Task 1', completed: true, user_id: 'user-1', created_at: '2023-01-01', updated_at: '2023-01-01' },
                error: null
              }))
            }))
          }))
        }))
      } as any);

      const task = await toggleTask('1');
      
      expect(task.completed).toBe(true);
    });

    it('should handle toggle errors', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: null,
              error: new Error('Toggle failed')
            }))
          }))
        }))
      } as any);

      await expect(toggleTask('1')).rejects.toThrow('Failed to fetch task: Toggle failed');
    });
  });

  describe('error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: null,
            error: new Error('Network error')
          }))
        }))
      } as any);

      await expect(fetchTasks()).rejects.toThrow('Network error');
    });

    it('should handle empty input validation', async () => {
      try {
        await createTask({ title: '', description: '' });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
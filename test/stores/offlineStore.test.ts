import { useOfflineStore } from '@/stores/offlineStore';

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(() => null),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

describe('offlineStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useOfflineStore.setState({
      tasks: [],
    });
    jest.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const state = useOfflineStore.getState();
    
    expect(state.tasks).toEqual([]);
  });

  it('should add a task', () => {
    const { addTask } = useOfflineStore.getState();
    
    const newTask = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      createdAt: new Date().toISOString(),
      needsSync: true,
    };
    
    addTask(newTask);
    
    const state = useOfflineStore.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]).toEqual(newTask);
  });

  it('should update a task', () => {
    const { addTask, updateTask } = useOfflineStore.getState();
    
    const task = {
      id: '1',
      title: 'Original Title',
      completed: false,
      createdAt: new Date().toISOString(),
      needsSync: true,
    };
    
    addTask(task);
    updateTask('1', { title: 'Updated Title', completed: true });
    
    const state = useOfflineStore.getState();
    expect(state.tasks[0].title).toBe('Updated Title');
    expect(state.tasks[0].completed).toBe(true);
  });

  it('should remove a task', () => {
    const { addTask, removeTask } = useOfflineStore.getState();
    
    const task = {
      id: '1',
      title: 'Task to Remove',
      completed: false,
      createdAt: new Date().toISOString(),
      needsSync: true,
    };
    
    addTask(task);
    expect(useOfflineStore.getState().tasks).toHaveLength(1);
    
    removeTask('1');
    expect(useOfflineStore.getState().tasks).toHaveLength(0);
  });

  it('should toggle task completion', () => {
    const { addTask, toggleTask } = useOfflineStore.getState();
    
    const task = {
      id: '1',
      title: 'Toggle Task',
      completed: false,
      createdAt: new Date().toISOString(),
      needsSync: false,
    };
    
    addTask(task);
    toggleTask('1');
    
    const state = useOfflineStore.getState();
    expect(state.tasks[0].completed).toBe(true);
    expect(state.tasks[0].needsSync).toBe(true); // Should mark as needing sync
  });

  it('should get tasks that need sync', () => {
    const { addTask, getTasksToSync } = useOfflineStore.getState();
    
    const syncTask = {
      id: '1',
      title: 'Sync Task',
      completed: false,
      createdAt: new Date().toISOString(),
      needsSync: true,
    };
    
    const noSyncTask = {
      id: '2',
      title: 'No Sync Task',
      completed: false,
      createdAt: new Date().toISOString(),
      needsSync: false,
    };
    
    addTask(syncTask);
    addTask(noSyncTask);
    
    const tasksToSync = getTasksToSync();
    expect(tasksToSync).toHaveLength(1);
    expect(tasksToSync[0].id).toBe('1');
  });

  it('should mark task as synced', () => {
    const { addTask, markTaskSynced } = useOfflineStore.getState();
    
    const task = {
      id: '1',
      title: 'Sync Task',
      completed: false,
      createdAt: new Date().toISOString(),
      needsSync: true,
    };
    
    addTask(task);
    markTaskSynced('1');
    
    const state = useOfflineStore.getState();
    expect(state.tasks[0].needsSync).toBe(false);
  });

  it('should clear all tasks', () => {
    const { addTask, clearAll } = useOfflineStore.getState();
    
    const task1 = {
      id: '1',
      title: 'Task 1',
      completed: false,
      createdAt: new Date().toISOString(),
      needsSync: true,
    };
    
    const task2 = {
      id: '2',
      title: 'Task 2',
      completed: false,
      createdAt: new Date().toISOString(),
      needsSync: true,
    };
    
    addTask(task1);
    addTask(task2);
    expect(useOfflineStore.getState().tasks).toHaveLength(2);
    
    clearAll();
    expect(useOfflineStore.getState().tasks).toHaveLength(0);
  });

  it('should handle non-existent task updates gracefully', () => {
    const { updateTask } = useOfflineStore.getState();
    
    // Should not throw when updating non-existent task
    expect(() => {
      updateTask('nonexistent', { title: 'Updated' });
    }).not.toThrow();
    
    const state = useOfflineStore.getState();
    expect(state.tasks).toHaveLength(0);
  });
});
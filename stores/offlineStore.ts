import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage/zustand';
import { OfflineState, OfflineTaskLocal } from '../types/stores.d';

// Export OfflineTask alias for compatibility
export type OfflineTask = OfflineTaskLocal;

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task: OfflineTaskLocal) => 
        set((state) => ({ 
          tasks: [...state.tasks, task] 
        })),

      updateTask: (id: string, updates: Partial<OfflineTaskLocal>) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, ...updates } : task
          ),
        })),

      removeTask: (id: string) => 
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      toggleTask: (id: string) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id 
              ? { ...task, completed: !task.completed, needsSync: true }
              : task
          ),
        })),

      getTasksToSync: () => {
        const state = get();
        return state.tasks.filter((task) => task.needsSync);
      },

      markTaskSynced: (id: string) => 
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id ? { ...task, needsSync: false } : task
          ),
        })),

      clearAll: () => {
        set({ tasks: [] });
      },
    }),
    {
      name: 'offline-tasks',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
); 
// Profile store types (using Profile from profile.d.ts)
import { Profile } from './profile.d';

// Onboarding store types
export interface OnboardingUserData {
  firstName: string;
  lastName: string;
  notificationsEnabled: boolean;
}

export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  userData: OnboardingUserData;
  
  // Actions
  setCompleted: (completed: boolean) => void;
  setCurrentStep: (step: number) => void;
  updateUserData: (data: Partial<OnboardingUserData>) => void;
  completeOnboarding: (userId: string) => Promise<void>;
  resetOnboarding: () => void;
}

// Offline store specific task interface
export interface OfflineTaskLocal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  needsSync: boolean; // If the task needs to be synchronized
}

// Offline store types (using local task interface)
export interface OfflineState {
  // Local tasks
  tasks: OfflineTaskLocal[];
  
  // Simple actions
  addTask: (task: OfflineTaskLocal) => void;
  updateTask: (id: string, updates: Partial<OfflineTaskLocal>) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  getTasksToSync: () => OfflineTaskLocal[];
  markTaskSynced: (id: string) => void;
  clearAll: () => void;
}

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  subscription: any;
  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  clearProfile: () => void;
  setProfile: (profile: Profile) => void;
  startRealtimeSubscription: (userId: string) => void;
  stopRealtimeSubscription: () => void;
} 
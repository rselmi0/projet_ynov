// Translation hook types
export interface UseTranslationReturn {
  t: (key: string, options?: any) => string;
  changeLanguage: (language: string) => Promise<void>;
  currentLanguage: string;
}

// Profile hook types
export interface UseProfileReturn {
  profile: any | null;
  loading: boolean;
  error: string | null;
  updateLanguage: (language: string) => Promise<void>;
  isProfileComplete: boolean;
  isPaidUser: boolean;
  isPremiumUser: boolean;
}

// Premium status hook types
export interface UsePremiumStatusReturn {
  isPremium: boolean;
  isLoading: boolean;
  customerInfo: any | null;
  refetch: () => Promise<void>;
}

// Network status hook types
export interface UseNetworkStatusReturn {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string | null;
}

// Cache hook types
export interface UseCacheReturn {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  clear: (key: string) => void;
  clearAll: () => void;
}

// Notifications hook types
export interface UseNotificationsReturn {
  settings: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    marketingEnabled: boolean;
  };
  hasPermission: boolean;
  pushToken: string | null;
  isLoading: boolean;
  updateSettings: (settings: any) => Promise<void>;
  sendTestNotification: () => Promise<void>;
  sendBasicTestNotification: () => Promise<{ success: boolean; }>;
  sendSoundTestNotification: () => Promise<{ success: boolean; }>;
  sendActionTestNotification: () => Promise<{ success: boolean; }>;
  sendReminderTestNotification: () => Promise<{ success: boolean; }>;
  arePermissionsBlocked: () => Promise<boolean>;
  requestPermissions: () => Promise<any>;
  openSettings: () => void;
}

// Tasks hook types
export interface UseTasksReturn {
  tasks: any[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: any) => Promise<void>;
  updateTask: (id: string, updates: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

// Onboarding hook types
export interface UseOnboardingReturn {
  currentStep: number;
  isCompleted: boolean;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
} 
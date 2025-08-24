import { useOnboardingStore } from '@/stores/onboardingStore';

// Mock MMKV since it's used in the store
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(() => null),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

// Mock Supabase
jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

// Mock profile store
jest.mock('@/stores/profileStore', () => ({
  useProfileStore: {
    getState: jest.fn(() => ({
      fetchProfile: jest.fn(),
    })),
  },
}));

describe('onboardingStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useOnboardingStore.setState({
      currentStep: 0,
      completed: false,
      userData: {
        firstName: '',
        lastName: '',
        notificationsEnabled: true,
      },
    });
  });

  it('should have correct initial state', () => {
    const state = useOnboardingStore.getState();
    
    expect(state.currentStep).toBe(0);
    expect(state.completed).toBe(false);
    expect(state.userData).toEqual({
      firstName: '',
      lastName: '',
      notificationsEnabled: true,
    });
  });

  it('should set current step', () => {
    const { setCurrentStep } = useOnboardingStore.getState();
    
    setCurrentStep(2);
    
    const state = useOnboardingStore.getState();
    expect(state.currentStep).toBe(2);
  });

  it('should set completed status', () => {
    const { setCompleted } = useOnboardingStore.getState();
    
    setCompleted(true);
    
    const state = useOnboardingStore.getState();
    expect(state.completed).toBe(true);
  });

  it('should update user data', () => {
    const { updateUserData } = useOnboardingStore.getState();
    
    updateUserData({
      firstName: 'John',
      lastName: 'Doe',
    });
    
    const state = useOnboardingStore.getState();
    expect(state.userData.firstName).toBe('John');
    expect(state.userData.lastName).toBe('Doe');
    expect(state.userData.notificationsEnabled).toBe(true); // Should preserve existing
  });

  it('should complete onboarding successfully', async () => {
    const { completeOnboarding, updateUserData } = useOnboardingStore.getState();
    
    // Set some user data first
    updateUserData({
      firstName: 'John',
      lastName: 'Doe',
    });
    
    await completeOnboarding('user-123');
    
    const state = useOnboardingStore.getState();
    expect(state.completed).toBe(true);
  });

  it('should reset onboarding', () => {
    const { setCompleted, setCurrentStep, updateUserData, resetOnboarding } = useOnboardingStore.getState();
    
    // Set some state first
    setCompleted(true);
    setCurrentStep(3);
    updateUserData({
      firstName: 'John',
      lastName: 'Doe',
    });
    
    // Then reset
    resetOnboarding();
    
    const state = useOnboardingStore.getState();
    expect(state.currentStep).toBe(0);
    expect(state.completed).toBe(false);
    expect(state.userData).toEqual({
      firstName: '',
      lastName: '',
      notificationsEnabled: true,
    });
  });
});
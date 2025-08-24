import { renderHook, act } from '@testing-library/react-native';
import { useOnboarding } from '@/hooks/useOnboarding';

// Mock dependencies
jest.mock('@/stores/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    completed: false,
    currentStep: 0,
    userData: {},
    setCompleted: jest.fn(),
    setCurrentStep: jest.fn(),
    updateUserData: jest.fn(),
    completeOnboarding: jest.fn(),
    resetOnboarding: jest.fn(),
  })),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    session: { user: { id: 'test-user-id' } },
  })),
}));

const mockStore = require('@/stores/onboardingStore').useOnboardingStore;
const mockAuth = require('@/context/AuthContext').useAuth;

describe('useOnboarding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.mockReturnValue({
      completed: false,
      currentStep: 0,
      userData: {},
      setCompleted: jest.fn(),
      setCurrentStep: jest.fn(),
      updateUserData: jest.fn(),
      completeOnboarding: jest.fn(),
      resetOnboarding: jest.fn(),
    });
    mockAuth.mockReturnValue({
      session: { user: { id: 'test-user-id' } },
    });
  });

  it('should return onboarding state and functions', () => {
    const { result } = renderHook(() => useOnboarding());
    
    expect(result.current.completed).toBe(false);
    expect(result.current.currentStep).toBe(0);
    expect(result.current.userData).toEqual({});
    expect(result.current.setCompleted).toBeDefined();
    expect(result.current.setCurrentStep).toBeDefined();
    expect(result.current.updateUserData).toBeDefined();
    expect(result.current.completeStep).toBeDefined();
    expect(result.current.skipOnboarding).toBeDefined();
    expect(result.current.resetOnboarding).toBeDefined();
  });

  it('should complete onboarding step', async () => {
    const mockCompleteOnboarding = jest.fn().mockResolvedValue(undefined);
    mockStore.mockReturnValue({
      completed: false,
      currentStep: 0,
      userData: {},
      setCompleted: jest.fn(),
      setCurrentStep: jest.fn(),
      updateUserData: jest.fn(),
      completeOnboarding: mockCompleteOnboarding,
      resetOnboarding: jest.fn(),
    });

    const { result } = renderHook(() => useOnboarding());
    
    await act(async () => {
      await result.current.completeStep();
    });
    
    expect(mockCompleteOnboarding).toHaveBeenCalledWith('test-user-id');
  });

  it('should skip onboarding', () => {
    const mockSetCompleted = jest.fn();
    mockStore.mockReturnValue({
      completed: false,
      currentStep: 0,
      userData: {},
      setCompleted: mockSetCompleted,
      setCurrentStep: jest.fn(),
      updateUserData: jest.fn(),
      completeOnboarding: jest.fn(),
      resetOnboarding: jest.fn(),
    });

    const { result } = renderHook(() => useOnboarding());
    
    act(() => {
      result.current.skipOnboarding();
    });
    
    expect(mockSetCompleted).toHaveBeenCalledWith(true);
  });

  it('should set current step', () => {
    const mockSetCurrentStep = jest.fn();
    mockStore.mockReturnValue({
      completed: false,
      currentStep: 0,
      userData: {},
      setCompleted: jest.fn(),
      setCurrentStep: mockSetCurrentStep,
      updateUserData: jest.fn(),
      completeOnboarding: jest.fn(),
      resetOnboarding: jest.fn(),
    });

    const { result } = renderHook(() => useOnboarding());
    
    act(() => {
      result.current.setCurrentStep(2);
    });
    
    expect(mockSetCurrentStep).toHaveBeenCalledWith(2);
  });

  it('should update user data', () => {
    const mockUpdateUserData = jest.fn();
    mockStore.mockReturnValue({
      completed: false,
      currentStep: 0,
      userData: {},
      setCompleted: jest.fn(),
      setCurrentStep: jest.fn(),
      updateUserData: mockUpdateUserData,
      completeOnboarding: jest.fn(),
      resetOnboarding: jest.fn(),
    });

    const { result } = renderHook(() => useOnboarding());
    
    const newData = { firstName: 'John', lastName: 'Doe', notificationsEnabled: true };
    
    act(() => {
      result.current.updateUserData(newData);
    });
    
    expect(mockUpdateUserData).toHaveBeenCalledWith(newData);
  });

  it('should check if onboarding is needed', () => {
    mockAuth.mockReturnValue({
      session: { user: { id: 'test-user-id' } },
    });
    
    const { result } = renderHook(() => useOnboarding());
    
    expect(result.current.isOnboardingNeeded).toBeTruthy();
  });

  it('should return false for onboarding needed when completed', () => {
    mockStore.mockReturnValue({
      completed: true,
      currentStep: 0,
      userData: {},
      setCompleted: jest.fn(),
      setCurrentStep: jest.fn(),
      updateUserData: jest.fn(),
      completeOnboarding: jest.fn(),
      resetOnboarding: jest.fn(),
    });

    const { result } = renderHook(() => useOnboarding());
    
    expect(result.current.isOnboardingNeeded).toBe(false);
  });

  it('should handle no user session for complete step', async () => {
    mockAuth.mockReturnValue({
      session: null,
    });

    const { result } = renderHook(() => useOnboarding());
    
    await expect(result.current.completeStep()).rejects.toThrow('No user session found');
  });

  it('should not skip onboarding without user session', () => {
    mockAuth.mockReturnValue({
      session: null,
    });

    const mockSetCompleted = jest.fn();
    mockStore.mockReturnValue({
      completed: false,
      currentStep: 0,
      userData: {},
      setCompleted: mockSetCompleted,
      setCurrentStep: jest.fn(),
      updateUserData: jest.fn(),
      completeOnboarding: jest.fn(),
      resetOnboarding: jest.fn(),
    });

    const { result } = renderHook(() => useOnboarding());
    
    act(() => {
      result.current.skipOnboarding();
    });
    
    expect(mockSetCompleted).not.toHaveBeenCalled();
  });
}); 
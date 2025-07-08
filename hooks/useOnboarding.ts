import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAuth } from '@/context/AuthContext';

export const useOnboarding = () => {
  const { session } = useAuth();
  const {
    completed,
    currentStep,
    userData,
    setCompleted,
    setCurrentStep,
    updateUserData,
    completeOnboarding,
    resetOnboarding,
  } = useOnboardingStore();

  const isOnboardingNeeded = () => {
    return !completed && session?.user;
  };

  const completeStep = async () => {
    if (!session?.user?.id) {
      throw new Error('No user session found');
    }

    await completeOnboarding(session.user.id);
  };

  const skipOnboarding = () => {
    if (session?.user?.id) {
      setCompleted(true);
    }
  };

  return {
    // State
    completed,
    currentStep,
    userData,
    isOnboardingNeeded: isOnboardingNeeded(),

    // Actions
    setCompleted,
    setCurrentStep,
    updateUserData,
    completeStep,
    skipOnboarding,
    resetOnboarding,
  };
}; 
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage/zustand';
import { supabase } from '../config/supabase';
import { OnboardingState } from '../types/stores.d';
import { useProfileStore } from './profileStore';

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      completed: false,
      currentStep: 0,
      userData: {
        firstName: '',
        lastName: '',
        notificationsEnabled: true,
      },

      setCompleted: (completed: boolean) => {
        set({ completed });
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      updateUserData: (data: Partial<OnboardingState['userData']>) => {
        set((state) => ({
          userData: { ...state.userData, ...data },
        }));
      },

      completeOnboarding: async (userId: string) => {
        try {
          const { userData } = get();
          
          // Update user profile in database
          const { error } = await supabase
            .from('users')
            .update({
              first_name: userData.firstName,
              last_name: userData.lastName,
              push_notifications_enabled: userData.notificationsEnabled,
              onboarding_completed: true,
            })
            .eq('id', userId);

          if (error) {
            console.error('Error completing onboarding:', error);
            throw error;
          }

          // Mark onboarding as completed
          set({ completed: true });
          
          // Reload the profile to ensure the updated onboarding_completed status is reflected
          const { fetchProfile } = useProfileStore.getState();
          await fetchProfile(userId);
          
        } catch (error) {
          console.error('Error during onboarding:', error);
          throw error;
        }
      },

      resetOnboarding: () => {
        set({
          completed: false,
          currentStep: 0,
          userData: {
            firstName: '',
            lastName: '',
            notificationsEnabled: true,
          },
        });
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        completed: state.completed,
        userData: state.userData,
      }),
    }
  )
); 
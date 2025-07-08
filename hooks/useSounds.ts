import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

interface SoundEffects {
  playClick: () => Promise<void>;
  playComplete: () => Promise<void>;
  playDelete: () => Promise<void>;
}

/**
 * Custom hook for managing haptic feedback
 * 
 * Provides essential haptic effects for user interactions:
 * - Click haptics for button presses
 * - Completion haptics for task completion
 * - Delete haptics for destructive actions
 */
export const useSounds = (): SoundEffects => {
  /**
   * Play click haptic feedback
   */
  const playClick = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Failed to play click haptic:', error);
    }
  }, []);

  /**
   * Play completion haptic feedback
   */
  const playComplete = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Failed to play completion haptic:', error);
    }
  }, []);

  /**
   * Play delete haptic feedback
   */
  const playDelete = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.log('Failed to play delete haptic:', error);
    }
  }, []);

  return {
    playClick,
    playComplete,
    playDelete,
  };
}; 
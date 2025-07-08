import { Zap, Shield, Smartphone } from 'lucide-react-native';
import type { OnboardingFeature } from '@/types/onboarding';

/**
 * ONBOARDING FEATURES CONFIGURATION
 * Features showcased during step 2 of the onboarding process
 * Each feature uses theme-aware colors and translations
 */
export const onboardingFeatures: Omit<OnboardingFeature, 'color'>[] = [
  {
    icon: Zap,
    title: 'onboarding.step2.features.fast.title',
    description: 'onboarding.step2.features.fast.description',
  },
  {
    icon: Shield,
    title: 'onboarding.step2.features.secure.title',
    description: 'onboarding.step2.features.secure.description',
  },
  {
    icon: Smartphone,
    title: 'onboarding.step2.features.offline.title',
    description: 'onboarding.step2.features.offline.description',
  },
];

/**
 * ONBOARDING BENEFITS CONFIGURATION
 * Benefits shown in step 3 to encourage users to enable notifications
 */
export const onboardingBenefits: string[] = [
  'onboarding.notifications.benefits.updates',
  'onboarding.notifications.benefits.sync',
  'onboarding.notifications.benefits.security',
];

/**
 * ONBOARDING CONFIGURATION
 * General settings for the onboarding flow
 */
export const onboardingConfig = {
  totalSteps: 3,
  animationDuration: {
    fadeOut: 200,
    fadeIn: 300,
    stepDelay: 200,
    toggle: 200,
  },
  inputSettings: {
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
} as const; 
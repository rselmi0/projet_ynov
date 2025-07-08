export interface OnboardingUserData {
  firstName: string;
  lastName: string;
  notificationsEnabled: boolean;
}

export interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  completed: boolean;
}

export interface OnboardingFeature {
  icon: any; // Lucide icon component
  title: string;
  description: string;
  color: string;
}

export interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepText?: string;
}

export interface OnboardingFeatureCardProps {
  feature: OnboardingFeature;
  index: number;
}

export interface OnboardingNavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextText?: string;
  backText?: string;
  skipText?: string;
  isLoading?: boolean;
  showBack?: boolean;
  showSkip?: boolean;
  nextDisabled?: boolean;
}

export interface NotificationSettingsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  permissionStatus: {
    granted: boolean;
    canAskAgain: boolean;
  };
  isLoading?: boolean;
  benefits?: string[];
} 
import React, { useState, useRef } from 'react';
import { View, Alert, Animated } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  OnboardingProgressBar, 
  OnboardingNavigationButtons,
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
} from '@/components/onboarding';
import { onboardingConfig } from '@/constants/onboarding';

export default function OnboardingScreen() {
  // Hooks for translations, auth, and data management
  const { t } = useTranslation();
  const { userData, updateUserData, completeOnboarding } = useOnboardingStore();
  const { session } = useAuth();
  
  // Current step state - manages which step content to show (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1 state - Personal information collection
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  
  // Step 3 state - Notification preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(userData.notificationsEnabled);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Animation values for smooth content transitions between steps
  const fadeAnim = useRef(new Animated.Value(1)).current; // Controls opacity during transitions
  const slideAnim = useRef(new Animated.Value(0)).current; // Controls vertical slide effect
  
  const {
    permissionStatus,
    isLoading: notificationLoading,
    requestPermissions,
  } = useNotifications();

  /**
   * Handles smooth animated transitions between onboarding steps
   * Creates a fade-out/slide-up then fade-in/slide-down effect
   * @param callback Function to execute during the transition (usually step change)
   */
  const animateStepChange = (callback: () => void) => {
    Animated.sequence([
      // Phase 1: Fade out current content with slight upward movement
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: onboardingConfig.animationDuration.fadeOut,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: onboardingConfig.animationDuration.fadeOut,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Fade in new content with downward slide to original position
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: onboardingConfig.animationDuration.fadeIn,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: onboardingConfig.animationDuration.fadeIn,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Execute callback (step change) in the middle of transition for smooth UX
    setTimeout(callback, onboardingConfig.animationDuration.stepDelay);
  };

  /**
   * STEP HANDLERS - Navigation between onboarding steps
   */
  const handleStep1Next = () => {
    // Validate that both first name and last name are provided
    if (firstName.trim() && lastName.trim()) {
      // Save user data to store and proceed to next step
      updateUserData({ firstName: firstName.trim(), lastName: lastName.trim() });
      animateStepChange(() => setCurrentStep(2));
    } else {
      // Show validation error if fields are empty
      Alert.alert(t('onboarding.step1.requiredFields'), t('onboarding.step1.enterBothNames'));
    }
  };

  const handleStep2Next = () => {
    animateStepChange(() => setCurrentStep(3));
  };

  const handleStep2Back = () => {
    animateStepChange(() => setCurrentStep(1));
  };

  const handleStep3Back = () => {
    animateStepChange(() => setCurrentStep(2));
  };

  /**
   * NOTIFICATION TOGGLE HANDLER - Handle notification preference changes
   */
  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  /**
   * COMPLETION HANDLER - Finalize onboarding process
   */
  const handleComplete = async () => {
    // Ensure user is authenticated before completing onboarding
    if (!session?.user?.id) {
      Alert.alert(t('onboarding.errors.configError'), t('onboarding.errors.noUserSession'));
      return;
    }

    console.log('🎯 Starting onboarding completion process');
    setIsCompleting(true);

    try {
      let finalNotificationStatus = notificationsEnabled;

      // Handle notification permissions if user opted in
      if (notificationsEnabled) {
        console.log('📱 Requesting notification permissions...');
        try {
          const result = await requestPermissions();
          if (!result.granted) {
            // Permission denied - inform user and disable notifications
            console.log('❌ Notification permission denied');
            Alert.alert(
              t('onboarding.errors.permissionDenied'),
              t('onboarding.errors.permissionMessage'),
              [{ text: t('common.ok') }]
            );
            finalNotificationStatus = false;
          } else {
            console.log('✅ Notification permission granted');
          }
        } catch (error) {
          console.error('Error requesting permissions:', error);
          finalNotificationStatus = false;
        }
      }

      // Save final user preferences to store and complete onboarding flow
      updateUserData({ notificationsEnabled: finalNotificationStatus });
      await completeOnboarding(session.user.id);

      console.log('✅ Onboarding completed! Navigating to protected area...');
      router.replace('/(protected)');
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      Alert.alert(t('common.error'), t('onboarding.errors.completionError'));
    } finally {
      setIsCompleting(false);
    }
  };

  /**
   * SKIP HANDLER - Allow users to bypass onboarding process
   */
  const handleSkip = () => {
    router.replace('/(protected)');
  };

  /**
   * CONTENT RENDERER - Displays appropriate content based on current step
   * Uses switch statement to render step-specific UI components
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            firstName={firstName}
            lastName={lastName}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
          />
        );

      case 2:
        return <OnboardingStep2 />;

      case 3:
        return (
          <OnboardingStep3
            notificationsEnabled={notificationsEnabled}
            permissionStatus={permissionStatus}
            onToggleNotifications={handleToggleNotifications}
          />
        );

      default:
        return null;
    }
  };

  /**
   * NAVIGATION RENDERER - Shows appropriate buttons for each step
   * Customizes button visibility and behavior based on current step
   */
  const renderNavigationButtons = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingNavigationButtons
            onNext={handleStep1Next}
            onSkip={handleSkip}
            showBack={false}
          />
        );

      case 2:
        return (
          <OnboardingNavigationButtons
            onNext={handleStep2Next}
            onBack={handleStep2Back}
            onSkip={handleSkip}
            showBack={true}
            showSkip={true}
          />
        );

      case 3:
        return (
          <OnboardingNavigationButtons
            onNext={handleComplete}
            onBack={handleStep3Back}
            nextText={isCompleting ? t('onboarding.step3.completing') : t('onboarding.buttons.complete')}
            onSkip={handleSkip}
            isLoading={isCompleting}
            nextDisabled={notificationLoading}
            showBack={true}
            showSkip={true}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* 
        HEADER: Progress Bar - Always visible at top
        Shows current step progress with theme-aware colors
      */}
      <OnboardingProgressBar currentStep={currentStep} totalSteps={onboardingConfig.totalSteps} />

      {/* 
        MAIN CONTENT: Dynamic step content with smooth transitions
        Uses animated values to create fade/slide effects between steps
      */}
      <Animated.View 
        className="flex-1 px-6"
        style={{
          opacity: fadeAnim,          // Fade in/out during transitions
          transform: [{ translateY: slideAnim }], // Vertical slide effect
        }}
      >
        {renderStepContent()}
      </Animated.View>

      {/* 
        FOOTER: Navigation buttons - Always visible at bottom
        Button configuration changes based on current step
      */}
      {renderNavigationButtons()}
    </View>
  );
}

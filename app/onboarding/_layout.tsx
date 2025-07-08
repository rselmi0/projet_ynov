import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
        animationDuration: 300,
      }}
    >
      {/* Single onboarding screen with internal step management */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false, // Prevent swipe back during onboarding
        }} 
      />
    </Stack>
  );
}

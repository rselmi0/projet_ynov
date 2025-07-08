import { useCallback, useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../context/AuthContext';
import { useProfileStore } from '../stores/profileStore';
import { useTheme } from '../context/ThemeContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options
SplashScreen.setOptions({
  fade: true,
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();
  const { initialized, session } = useAuth();
  const { profile } = useProfileStore();
  const { isDark, themeVars } = useTheme();

  useEffect(() => {
    async function prepare() {
      try {
        console.log("🚀 App preparation...");
        // Reduced loading time for faster transition
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn('❌ App preparation error:', e);
      } finally {
        console.log('✅ App ready');
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && initialized) {
      console.log('🎬 Preparing navigation with theme-aware transition');
      console.log('📊 Session status:', {
        initialized,
        hasSession: !!session,
        hasProfile: !!profile,
        onboardingCompleted: profile?.onboarding_completed,
        isDark,
      });

      // Small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 200));

      // Navigation logic with theme-aware transitions
      if (!session) {
        console.log('👋 No session - Redirecting to welcome');
        router.replace('/welcome');
        // Hide splash screen after navigation starts
        setTimeout(() => SplashScreen.hideAsync(), 100);
      } else if (session && profile) {
        // Check if user needs onboarding
        const needsOnboarding =
          profile.onboarding_completed === false ||
          profile.onboarding_completed === undefined ||
          profile.onboarding_completed === null;

        if (needsOnboarding) {
          console.log('🚀 Session + profile without onboarding - Redirecting to onboarding');
          router.replace('/onboarding');
          setTimeout(() => SplashScreen.hideAsync(), 100);
        } else {
          console.log('🏠 Session + complete profile - Redirecting to main app');
          router.replace('/(protected)/(tabs)');
          setTimeout(() => SplashScreen.hideAsync(), 100);
        }
      } else if (session && !profile) {
        console.log('⏳ Session without profile - Waiting for profile loading...');
        // Profile will load, we wait - don't hide splash screen yet
      }
    }
  }, [appIsReady, initialized, session, profile, router, isDark]);

  // Wait for app to be ready AND AuthContext to be initialized
  if (!appIsReady || !initialized) {
    return null; // Native splash screen is displayed
  }

  // Once everything is initialized, show theme-aware temporary screen
  return (
    <View 
      onLayout={onLayoutRootView} 
      style={[
        { flex: 1 }, 
        themeVars,
        { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0F0F0F' : '#FFFFFF'}
        translucent={false}
      />
    </View>
  );
}

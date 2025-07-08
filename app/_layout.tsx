import 'react-native-reanimated';
import '@/global.css';
import '../config/i18n';

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AppState, StatusBar, View , Pressable } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, restoreQueryCache, persistQueryCache } from '@/lib/queryClient';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

import { RevenueCatProvider } from '@/context/RevenuCatContext';
import ExpoStripeProvider from '@/context/StripeContext';
import * as Sentry from '@sentry/react-native';
import { Toaster } from 'sonner-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
  integrations: [Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Keep splash screen visible while fonts are loading
SplashScreen.preventAutoHideAsync();


// Wrapper component that applies theme variables
function ThemedLayout({ children }: { children: React.ReactNode }) {
  const { isDark, themeVars } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[{ flex: 1 }, themeVars]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#0F0F0F' : '#FFFFFF'}
          translucent={false}
        />
        {children}
        <Toaster />
      </View>
    </GestureHandlerRootView>
  );
}

// Component to initialize MMKV persistence
function AppInitializer({ children }: { children: React.ReactNode }) {
  const { isConnected } = useNetworkStatus();

  useEffect(() => {
    // Restore React Query cache on startup
    Sentry.captureMessage("🚀 App initialization - Cache restoration");
    console.log("🚀 App initialization - Cache restoration");
    restoreQueryCache();
  }, []);

  useEffect(() => {
    // Save cache periodically when online
    if (!isConnected) return;

    console.log('📡 Online - Periodic backup enabled');
    const interval = setInterval(() => {
      persistQueryCache();
    }, 60000); // Every minute when online

    return () => {
      console.log('📡 Offline - Periodic backup disabled');
      clearInterval(interval);
    };
  }, [isConnected]);

  useEffect(() => {
    // Save cache when app goes to background or closes
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('💾 App backgrounded - Cache save');
        persistQueryCache();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Final save when component unmounts
    return () => {
      console.log("🔚 App closing - Final save");
      persistQueryCache();
      subscription?.remove();
    };
  }, []);

  return <ThemedLayout>{children}</ThemedLayout>;
}

export default Sentry.wrap(function RootLayout() {
  const [fontsLoaded] = useFonts({
    'InstrumentSerif-Regular': require('../assets/fonts/InstrumentSerif-Regular.ttf'),
    'InstrumentSerif-Italic': require('../assets/fonts/InstrumentSerif-Italic.ttf'),
  });

  // Don't hide splash screen here - let index.tsx handle it after auth is ready
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ExpoStripeProvider>
      <RevenueCatProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <AppInitializer>
                <Stack screenOptions={{ 
                  headerShown: false,
                  animation: 'fade',
                  animationDuration: 150
                }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
                  <Stack.Screen name="resetPassword" />
                  <Stack.Screen name="sign-in" />
                  <Stack.Screen name="sign-up" />
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="(protected)" options={{ animation: 'fade' }} />
                </Stack>
              </AppInitializer>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </RevenueCatProvider>
    </ExpoStripeProvider>
  );
});

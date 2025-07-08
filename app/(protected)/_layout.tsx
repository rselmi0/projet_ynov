import React from 'react';
import { Stack, Redirect , Slot } from 'expo-router';
import { PanGestureHandler, State , GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, useSidebar } from '@/context/SidebarContext';
import { Sidebar } from '@/components/ui/sidebar';
import '@/polyfills';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function ProtectedContent() {
  const { isOpen, closeSidebar, openSidebar } = useSidebar();

  const handleGestureEvent = (event: any) => {
    const { translationX, absoluteX, state } = event.nativeEvent;

    // More responsive gesture with lower thresholds
    if (
      state === State.ACTIVE &&
              absoluteX < 80 && // Wider zone to start gesture
      translationX > 60 && // Lower threshold to trigger opening
      !isOpen
    ) {
      openSidebar();
    }
  };

  return (
    <PanGestureHandler
      onHandlerStateChange={handleGestureEvent}
      activeOffsetX={10} // Start gesture more easily
      failOffsetY={[-15, 15]} // Avoid conflicts with vertical scroll
    >
      <Animated.View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: false, // Disable default back gesture
          }}>
          <Stack.Screen name="(tabs)" />
        </Stack>

        <Sidebar isOpen={isOpen} onClose={closeSidebar} />
      </Animated.View>
    </PanGestureHandler>
  );
}

export default function ProtectedLayout() {
  const { initialized, session } = useAuth();

  if (!initialized) {
    return null;
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  return (
    <SidebarProvider>
      <ProtectedContent />
    </SidebarProvider>
  );
}

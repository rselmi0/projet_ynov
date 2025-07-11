import React from 'react';
import { Stack } from 'expo-router';

export default function PlaygroundLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      <Stack.Screen 
        name="[...demo]" 
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
} 
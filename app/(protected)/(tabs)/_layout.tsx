import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from '@/components/ui/sidebar';
import { DynamicHeader } from '@/components/ui/dynamic-header';

export default function TabsLayout() {
  return (
    <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerShown: true,
          header: () => <DynamicHeader navigation={navigation} />,
          drawerStyle: {
            width: 290,
          },
          drawerType: 'slide',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        })}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Dashboard',
          }}
        />
        <Drawer.Screen
          name="tasks"
          options={{
            drawerLabel: 'Tasks',
            title: 'My Tasks',
          }}
        />
        <Drawer.Screen
          name="ai"
          options={{
            drawerLabel: 'AI Chat',
            title: 'AI Assistant',
          }}
        />
        <Drawer.Screen
          name="payment"
          options={{
            drawerLabel: 'Payment',
            title: 'Payment Integrations',
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Profile',
            title: 'My Profile',
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            drawerLabel: 'Notifications',
            title: 'Notifications',
          }}
        />
        <Drawer.Screen
          name="offline"
          options={{
            drawerLabel: 'Offline',
            title: 'Offline Mode',
          }}
        />
        <Drawer.Screen
          name="playground"
          options={{
            drawerLabel: 'Playground',
            title: 'Component Playground',
          }}
        />
        <Drawer.Screen
          name="premium"
          options={{
            drawerLabel: 'Premium',
            title: 'Premium',
          }}
        />
      </Drawer>
  );
}

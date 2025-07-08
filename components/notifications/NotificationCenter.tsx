import React from 'react';
import { View } from 'react-native';
import { NotificationHeader } from './NotificationHeader';
import { DeviceInfoCard } from './DeviceInfoCard';
import { PermissionStatusCard } from './PermissionStatusCard';
import { TestButtonsSection } from './TestButtonsSection';
import { DebugInfo } from './DebugInfo';

export const NotificationCenter: React.FC = () => {
  return (
    <View className="flex-1 px-6 py-8">
      <View className="flex-1 gap-6">
        <NotificationHeader />
        <DeviceInfoCard />
        <PermissionStatusCard />
        <TestButtonsSection />
        <DebugInfo />
      </View>
    </View>
  );
}; 
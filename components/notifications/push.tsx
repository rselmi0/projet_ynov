import React from 'react';
import { View } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { NotificationSettings } from './NotificationSettings';

interface PushProps {
  session: Session;
}

export default function Push({ session }: PushProps) {
  return (
    <View className="flex-1 bg-light-background p-6 dark:bg-dark-background">
      <NotificationSettings />
    </View>
  );
}

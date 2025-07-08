import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { SettingsSectionProps } from '../../types/settings';

export const SettingsSection = React.memo(function SettingsSection({
  title,
  children,
  footer,
}: SettingsSectionProps) {
  return (
    <View style={{ marginBottom: 32 }}>
      {title && (
        <Text
          className="mb-2 px-6 text-muted-foreground"
          style={{
            fontSize: 13,
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>
          {title}
        </Text>
      )}
      <View className="mx-4 overflow-hidden rounded-2xl border border-border bg-card">
        {children}
      </View>
      {footer && (
        <Text className="mt-2 px-6 text-muted-foreground" style={{ fontSize: 12, lineHeight: 16 }}>
          {footer}
        </Text>
      )}
    </View>
  );
});

import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';

interface SeparatorProps {
  text?: string;
}

export function Separator({ text = 'ou' }: SeparatorProps) {
  return (
    <View className="flex-row items-center">
      <View className="flex-1 border-t border-border" />
      <Text
        className="text-muted-foreground"
        style={{
          fontSize: 14,
          marginHorizontal: 16,
          paddingVertical: 4,
        }}>
        {text}
      </Text>
      <View className="flex-1 border-t border-border" />
    </View>
  );
}

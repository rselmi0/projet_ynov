import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Text } from '../ui/text';
import { useIconColors } from '../../hooks/useIconColors';  

export function EmailLoginToggle() {
  const iconColors = useIconColors();
  
  return (
    <Link href="/sign-in" asChild>
      <TouchableOpacity
        className="w-full items-center justify-center rounded-lg border border-border bg-card"
        style={{
          minHeight: 50,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}>
        <View className="flex-row items-center">
          <Feather name="mail" size={20} color={iconColors.secondary} style={{ marginRight: 8 }} />
          <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '600' }}>
            Continuer avec Email
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import * as Icons from 'lucide-react-native';
import { SettingsRowProps } from '../../types/settings';
import { useIconColors } from '../../hooks/useIconColors';

export const SettingsRow = React.memo(function SettingsRow({
  icon,
  title,
  subtitle,
  value,
  rightElement,
  onPress,
  showChevron = false,
}: SettingsRowProps) {
  const iconColors = useIconColors();
  return (
    <TouchableOpacity
      className={`px-6 py-4 ${onPress ? 'active:opacity-70' : ''}`}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          {icon && <View style={{ marginRight: 12 }}>{icon}</View>}
          <View className="flex-1">
            <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
              {title}
            </Text>
            {subtitle && (
              <Text className="text-muted-foreground" style={{ fontSize: 14, marginTop: 2 }}>
                {subtitle}
              </Text>
            )}
            {value && (
              <Text className="text-muted-foreground" style={{ fontSize: 14, marginTop: 2 }}>
                {value}
              </Text>
            )}
          </View>
        </View>
        <View className="flex-row items-center">
          {rightElement}
          {showChevron && (
            <View style={{ marginLeft: rightElement ? 8 : 0 }}>
              <Icons.ChevronRight size={20} color={iconColors.muted} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

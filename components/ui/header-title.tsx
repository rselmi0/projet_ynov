import React from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { HeaderMenu } from '@/components/ui/header-menu';

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onMenuPress?: () => void;
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  subtitle,
  children,
  onMenuPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-b border-border bg-background"
      style={{
        paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24),
        paddingBottom: 16,
      }}>
      <View className="px-6">
        <View className="flex-row items-center justify-between">
          {onMenuPress && <HeaderMenu onPress={onMenuPress} />}
          <View className=" flex-1" style={{ marginLeft: onMenuPress ? 16 : 0 }}>
            <Text className="pt-2 text-3xl font-bold text-foreground font-instrument-serif">{title}</Text>
            {subtitle && (
              <Text className="mt-1 text-muted-foreground font-instrument-serif-italic" style={{ fontSize: 16 }}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {children && <View style={{ marginTop: 16 }}>{children}</View>}
      </View>
    </View>
  );
};

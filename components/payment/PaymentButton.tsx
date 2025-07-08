import React from 'react';
import { TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useIconColors } from '@/hooks/useIconColors';
import { PaymentButtonProps } from '@/types/payment';

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  title,
  subtitle,
  imageSource,
  onPress,
  loading = false,
  className,
  imageBackgroundColor = 'bg-blue-50 dark:bg-blue-900/20',
}) => {
  const iconColors = useIconColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`rounded-2xl border border-border bg-card p-4  ${
        loading ? 'opacity-50' : ''
      } ${className}`}
      activeOpacity={0.8}>
      <View className="flex-row items-center">
        <View className={`mr-4 rounded-2xl p-3 ${imageBackgroundColor}`}>
          {loading ? (
            <ActivityIndicator size="small" color={iconColors.secondary} />
          ) : (
            <Image source={imageSource} style={{ width: 32, height: 32 }} resizeMode="contain" />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-foreground" style={{ fontSize: 18, fontWeight: 'bold' }}>
            {title}
          </Text>
          <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

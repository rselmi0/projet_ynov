import React, { useRef, useEffect } from 'react';
import { Pressable, Animated } from 'react-native';
import { cn } from '@/lib/utils';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ value, onValueChange, disabled = false, className }: ToggleProps) {
  const translateX = useRef(new Animated.Value(value ? 20 : 2)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 20 : 2,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        'relative h-8 w-12 rounded-full',
        value ? 'bg-primary' : 'bg-border',
        disabled && 'opacity-50',
        className
      )}>
      <Animated.View
        className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm shadow-black/20"
        style={{
          transform: [{ translateX }],
        }}
      />
    </Pressable>
  );
}

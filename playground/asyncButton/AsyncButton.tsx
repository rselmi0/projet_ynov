import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { CircleCheck, CircleX } from 'lucide-react-native';
import { useIconColors } from '@/hooks/useIconColors';

export interface AsyncButtonProps {
  text: string;
  state?: 'idle' | 'pending' | 'success' | 'error';
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export const AsyncButton: React.FC<AsyncButtonProps> = ({
  text,
  state = 'idle',
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
}) => {
  const iconColors = useIconColors();
  const [currentText, setCurrentText] = useState(text);
  const [previousText, setPreviousText] = useState('');
  
  // Reanimated shared values
  const scale = useSharedValue(1);
  const currentTextOpacity = useSharedValue(1);
  const currentTextTranslateY = useSharedValue(0);
  const previousTextOpacity = useSharedValue(0);
  const previousTextTranslateY = useSharedValue(0);
  const shadowHeight = useSharedValue(4);
  const shadowOpacity = useSharedValue(0.15);
  const shadowRadius = useSharedValue(8);
  const buttonWidth = useSharedValue(120);
  
  // Calculate dimensions
  const getSizeConfig = () => {
    const configs = {
      sm: { padding: 'px-3 py-2', text: 'text-xs', charWidth: 7, baseWidth: 80 },
      md: { padding: 'px-4 py-3', text: 'text-sm', charWidth: 8, baseWidth: 100 },
      lg: { padding: 'px-6 py-4', text: 'text-base', charWidth: 9, baseWidth: 120 },
    };
    return configs[size];
  };

  const getDisplayText = () => {
    switch (state) {
      case 'pending': return 'Loading...';
      case 'success': return 'Success';
      case 'error': return 'Error';
      default: return text;
    }
  };

  // Animate on state or text change
  useEffect(() => {
    const newText = getDisplayText();
    const isPending = state === 'pending';
    const sizeConfig = getSizeConfig();
    
    // Calculate new width
    const newWidth = Math.max(
      sizeConfig.baseWidth, 
      newText.length * sizeConfig.charWidth + 64 // icon + padding
    );
    
    // Store previous text for animation
    setPreviousText(currentText);
    
    // Haptic feedback for state changes
    if (state === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (state === 'error') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    // Scale feedback
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );
    
    // Text transition sequence
    // 1. Move current text up and fade out
    currentTextOpacity.value = withTiming(0, { duration: 150 });
    currentTextTranslateY.value = withTiming(-15, { duration: 150 });
    
    // 2. Resize button width
    setTimeout(() => {
      buttonWidth.value = withTiming(newWidth, { duration: 250 });
    }, 50);
    
    // 3. Update text and animate new text from bottom
    setTimeout(() => {
      setCurrentText(newText);
      currentTextTranslateY.value = 15;
      currentTextOpacity.value = 0;
      
      currentTextOpacity.value = withTiming(1, { duration: 200 });
      currentTextTranslateY.value = withTiming(0, { duration: 200 });
    }, 200);
    
    // Shadow animations  
    shadowHeight.value = withTiming(isPending ? 6 : 3, { duration: 300 });
    shadowOpacity.value = withTiming(isPending ? 0.2 : 0.1, { duration: 300 });
    shadowRadius.value = withTiming(isPending ? 8 : 4, { duration: 300 });
    
  }, [state, text]);

  const getButtonColors = () => {
    const colorMap = {
      primary: { bg: '#6366F1', shadow: '#4F46E5' },
      secondary: { bg: '#000000', shadow: '#000000' },
      success: { bg: '#059669', shadow: '#047857' },
      error: { bg: '#DC2626', shadow: '#B91C1C' },
    };
    
    const stateColors = {
      pending: { bg: '#2563EB', shadow: '#1D4ED8' },
      success: { bg: '#059669', shadow: '#047857' },
      error: { bg: '#DC2626', shadow: '#B91C1C' },
      idle: colorMap[variant],
    };
    
    return stateColors[state] || colorMap[variant];
  };

  const getIcon = () => {
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
    
    switch (state) {
      case 'pending':
        return <ActivityIndicator size="small" color="white" />;
      case 'success':
        return <CircleCheck size={iconSize} color="white" />;
      case 'error':
        return <CircleX size={iconSize} color="white" strokeWidth={2} />;
      default:
        return <></>;
    }
  };

  const colors = getButtonColors();
  const sizeConfig = getSizeConfig();
  
  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    width: buttonWidth.value,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: shadowHeight.value,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: shadowRadius.value,
    elevation: shadowHeight.value,
  }));
  
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: currentTextOpacity.value,
    transform: [{ translateY: currentTextTranslateY.value }],
  }));
  
  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(0.95, { duration: 100 });
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
  };

  const handlePress = () => {
    if (!disabled && state !== 'pending') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };
  
  return (
    <Animated.View style={containerAnimatedStyle}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || state === 'pending'}
        activeOpacity={0.9}
        style={{ backgroundColor: colors.bg }}
        className={`rounded-2xl ${sizeConfig.padding} flex-row items-center justify-center border-0 border-b-4 border-black/30`}
      >
        <View className="flex-row items-center justify-between flex-1">
          <View className="w-5 h-5 items-center justify-center">
            {getIcon()}
          </View>
          <Animated.View style={textAnimatedStyle} className="flex-1 mx-2">
            <Text 
              className={`text-white font-bold ${sizeConfig.text} tracking-wide text-center`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {currentText}
            </Text>
          </Animated.View>
          <View className="w-5 h-5" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}; 
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  animated?: boolean;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  animated = true,
  color = '#FF6B35', // Default orange
  backgroundColor = '#E5E7EB',
  className,
}) => {
  const animatedWidth = useSharedValue(0);
  const previousProgress = useRef(0);

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    
    if (animated) {
      // Detection of sudden changes (like 100% -> 0%)
      const progressDiff = Math.abs(clampedProgress - previousProgress.current);
      const isBigJump = progressDiff > 50;
      
      if (isBigJump) {
        // For large changes, use a faster animation
        animatedWidth.value = withTiming(clampedProgress, {
          duration: 300,
        });
      } else {
        // For small changes, use spring for more fluidity
        animatedWidth.value = withSpring(clampedProgress, {
          damping: 20,
          stiffness: 100,
          mass: 1,
        });
      }
    } else {
      animatedWidth.value = clampedProgress;
    }
    
    previousProgress.current = clampedProgress;
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View
      className={className}
      style={{
        height,
        backgroundColor,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            backgroundColor: color,
            borderRadius: height / 2,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}; 
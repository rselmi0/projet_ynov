import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  cancelAnimation,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';

interface AIThinkingLoaderProps {
  isVisible: boolean;
}

const AIThinkingLoader: React.FC<AIThinkingLoaderProps> = ({ isVisible }) => {
  // Simple 3 dots animation
  const dot1 = useSharedValue(0.4);
  const dot2 = useSharedValue(0.4);
  const dot3 = useSharedValue(0.4);

  useEffect(() => {
    if (isVisible) {
      // Simple bouncing animation for 3 dots
      const bounceAnimation = withRepeat(
        withTiming(1, { duration: 600, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        -1,
        true
      );

      dot1.value = bounceAnimation;
      dot2.value = withDelay(200, bounceAnimation);
      dot3.value = withDelay(400, bounceAnimation);
      
    } else {
      // Cancel animations
      cancelAnimation(dot1);
      cancelAnimation(dot2);
      cancelAnimation(dot3);
      
      // Reset values
      dot1.value = 0.4;
      dot2.value = 0.4;
      dot3.value = 0.4;
    }
  }, [isVisible]);

  // Animated styles for each dot
  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: dot1.value }],
    backgroundColor: '#f97316',
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: dot2.value }],
    backgroundColor: '#f97316',
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: dot3.value }],
    backgroundColor: '#f97316',
  }));

  if (!isVisible) return null;

  return (
    <Animated.View 
      entering={FadeInDown.duration(300)}
      className="mb-3"
    >
      <View className="p-3 px-4 rounded-2xl max-w-[85%] shadow-sm bg-card self-start rounded-bl-md">
        <View className="flex-row items-center">
          <Animated.View
            style={dot1Style}
            className="w-2 h-2 rounded-full mx-1"
          />
          <Animated.View
            style={dot2Style}
            className="w-2 h-2 rounded-full mx-1"
          />
          <Animated.View
            style={dot3Style}
            className="w-2 h-2 rounded-full mx-1"
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default AIThinkingLoader; 
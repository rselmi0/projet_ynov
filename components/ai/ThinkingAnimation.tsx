import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';

interface ThinkingAnimationProps {
  isVisible: boolean;
  size?: number;
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({
  isVisible,
  size = 8,
}) => {
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  useEffect(() => {
    if (isVisible) {
      // Start the thinking animation sequence
      dot1Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        false
      );

      setTimeout(() => {
        dot2Opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.3, { duration: 600 })
          ),
          -1,
          false
        );
      }, 200);

      setTimeout(() => {
        dot3Opacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.3, { duration: 600 })
          ),
          -1,
          false
        );
      }, 400);
    } else {
      // Stop animations and reset
      cancelAnimation(dot1Opacity);
      cancelAnimation(dot2Opacity);
      cancelAnimation(dot3Opacity);
      dot1Opacity.value = withTiming(0.3, { duration: 200 });
      dot2Opacity.value = withTiming(0.3, { duration: 200 });
      dot3Opacity.value = withTiming(0.3, { duration: 200 });
    }
  }, [isVisible]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  if (!isVisible) return null;

  return (
    <View className="flex-row items-center justify-center py-2">
      <Animated.View
        className="bg-muted-foreground rounded-full mx-0.5"
        style={[
          {
            width: size,
            height: size,
          },
          dot1Style,
        ]}
      />
      <Animated.View
        className="bg-muted-foreground rounded-full mx-0.5"
        style={[
          {
            width: size,
            height: size,
          },
          dot2Style,
        ]}
      />
      <Animated.View
        className="bg-muted-foreground rounded-full mx-0.5"
        style={[
          {
            width: size,
            height: size,
          },
          dot3Style,
        ]}
      />
    </View>
  );
};

export default ThinkingAnimation; 
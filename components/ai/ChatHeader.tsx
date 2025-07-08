import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  SlideInRight,
  SlideOutRight
} from 'react-native-reanimated';
import { RotateCcw } from 'lucide-react-native';
import { useTranslation } from '../../hooks/useTranslation';

interface ChatHeaderProps {
  onReset: () => void;
  hasMessages?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onReset,
  hasMessages = false,
}) => {
  const { t } = useTranslation();
  const rotateValue = useSharedValue(0);

  const handleReset = () => {
    // Animate the reset button
    rotateValue.value = withSequence(
      withTiming(360, { duration: 500 }),
      withTiming(0, { duration: 0 })
    );

    Alert.alert(
      t('ai.clear'),
      'Are you sure you want to clear all messages? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: onReset,
        },
      ]
    );
  };

  const animatedRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateValue.value}deg` }],
  }));

  if (!hasMessages) {
    return null; // Hide header completely when no messages
  }

  return (
    <Animated.View
      entering={SlideInRight.duration(300)}
      exiting={SlideOutRight.duration(300)}
      className="flex-row justify-end px-5  bg-background p-2"
    >
      {/* Reset Button */}
      <TouchableOpacity
        onPress={handleReset}
        className="p-2 bg-muted rounded-full border border-border"
      >
        <Animated.View style={animatedRotateStyle}>
          <RotateCcw size={16} className="text-muted-foreground" />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ChatHeader; 
import React, { useEffect } from 'react';
import { useIconColors } from '../../hooks/useIconColors';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { 
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { PromptItem } from '../../types/ai';
import { 
  Lightbulb, 
  MessageCircle, 
  Sparkles, 
  BookOpen, 
  Code, 
  Music, 
  Camera, 
  Heart 
} from 'lucide-react-native';

interface PromptLabelsProps {
  prompts: PromptItem[];
  onSelectPrompt: (prompt: PromptItem) => void;
  exiting: boolean;
}

const PromptLabels: React.FC<PromptLabelsProps> = ({
  prompts,
  exiting,
  onSelectPrompt,
}) => {
  const flatPrompts = prompts.slice(0, 8); // Limit to first 8 prompts
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const iconColors = useIconColors();
  useEffect(() => {
    if (exiting) {
      opacity.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(50, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      opacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [exiting]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  // Icons for the prompt labels
  const getIconForPrompt = (index: number) => {
    const icons = [Lightbulb, MessageCircle, Sparkles, BookOpen, Code, Music, Camera, Heart];
    const IconComponent = icons[index % icons.length];
    return <IconComponent size={14} color={iconColors.secondary} />;
  };

  return (
    <Animated.View 
      entering={FadeInDown.duration(600)}
      style={animatedStyle}
      className="mb-4"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-12 px-4"
      >
        <View className="flex-row items-center gap-2">
          {flatPrompts.map((prompt, index) => (
            <TouchableOpacity
              key={prompt.id}
              onPress={() => onSelectPrompt(prompt)}
              className="bg-secondary/80 px-3 py-2 rounded-full border border-border flex-row items-center gap-2"
            >
              {getIconForPrompt(index)}
              <Text className="text-secondary-foreground text-sm font-medium">
                {prompt.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default PromptLabels; 
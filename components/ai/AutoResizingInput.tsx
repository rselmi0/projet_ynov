import React, { useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useIconColors } from '../../hooks/useIconColors';
interface AutoResizingInputProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const AutoResizingInput: React.FC<AutoResizingInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type your message...',
  disabled = false,
}) => {
  const inputRef = useRef<TextInput>(null);
  const iconColors = useIconColors();
  // Animation for send button press
  const animationProgress = useSharedValue(0);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSubmit();

      // Quick animation
      animationProgress.value = withSpring(1, { damping: 15 });
      setTimeout(() => {
        animationProgress.value = withSpring(0, { damping: 15 });
      }, 100);
    }
  };

  const handleTextChange = (newText: string) => {
    onChange(newText);
  };

  // Handle key press for web (Enter to send)
  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle input container press to focus input (especially for web)
  const handleInputContainerPress = () => {
    inputRef.current?.focus();
  };

  // Calculate height based on content
  const lines = value.split('\n');
  const lineCount = Math.max(1, lines.length);
  const inputHeight = lineCount * 20;
  const containerHeight = inputHeight + 80;

  // Simple animated styles - only animate scale, not height to avoid conflict with KeyboardAvoidingView
  const animatedContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationProgress.value, [0, 1], [1, 0.95]);
    return {
      transform: [{ scale }],
    };
  });

  return (
    <View className="justify-end px-4 pb-6 pt-1">
      <Animated.View
        style={[
          animatedContainerStyle,
          {
            height: containerHeight,
          },
        ]}
        className="overflow-hidden rounded-2xl border border-border bg-card">
        {/* Input area */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleInputContainerPress}
          className="mt-1 flex-1 px-6 pt-2">
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            placeholderTextColor="hsl(var(--muted-foreground))"
            multiline
            className="text-base text-foreground"
            textAlignVertical="top"
            editable={!disabled}
            style={{
              fontSize: 16,
              lineHeight: 20,
              height: inputHeight + 15,
              ...(Platform.OS === 'android' && {
                marginTop: 4,
              }),
              // Remove focus outline/border
              ...(Platform.OS === 'web' && {
                outline: 'none',
                border: 'none',
              }),
            }}
          />
        </TouchableOpacity>

        {/* Bottom section */}
        <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
          {/* Icons */}
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4 p-1">
              <MaterialIcons name="attach-file" size={20}  color={iconColors.muted} />
            </TouchableOpacity>

            <TouchableOpacity className="mr-4 p-1">
              <Ionicons name="rocket" size={20}  color={iconColors.muted} />
            </TouchableOpacity>

            <TouchableOpacity className="mr-4 p-1">
              <MaterialIcons name="auto-awesome" size={20}  color={iconColors.muted} />
            </TouchableOpacity>

            <TouchableOpacity className="p-1">
                <MaterialIcons name="science" size={20}  color={iconColors.muted} />
            </TouchableOpacity>
          </View>

          {/* Send button - Orange theme */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={!value.trim() || disabled}
            className={`rounded-full px-4 py-2 ${
              value.trim() && !disabled ? 'bg-orange-500' : 'bg-muted'
            }`}>
            <Text className={`font-medium ${
              value.trim() && !disabled ? 'text-white' : 'text-muted-foreground'
            }`}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default AutoResizingInput; 
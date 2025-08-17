import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Icons } from '@/icons';
import { useIconColors } from '@/hooks/useIconColors';
import { AsyncButton } from './AsyncButton';

type AsyncButtonState = 'idle' | 'pending' | 'success' | 'error';

export default function AsyncButtonDemo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  
  const [button1State, setButton1State] = useState<AsyncButtonState>('idle');
  const [button2State, setButton2State] = useState<AsyncButtonState>('idle');
  const [button3State, setButton3State] = useState<AsyncButtonState>('idle');

  const simulateAsyncAction = (
    buttonSetter: React.Dispatch<React.SetStateAction<AsyncButtonState>>,
    shouldSucceed: boolean = true,
    delay: number = 2000
  ) => {
    buttonSetter('pending');
    
    setTimeout(() => {
      if (shouldSucceed) {
        buttonSetter('success');
        setTimeout(() => buttonSetter('idle'), 1500);
      } else {
        buttonSetter('error');
        setTimeout(() => buttonSetter('idle'), 1500);
      }
    }, delay);
  };

  const resetAll = () => {
    setButton1State('idle');
    setButton2State('idle');
    setButton3State('idle');
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={{ paddingTop: insets.top + 8 }} className="px-6 pb-4 border-b border-border">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-8 h-8 mr-4"
            activeOpacity={0.7}
          >
            <Icons.ChevronLeft size={24} color={iconColors.primary} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-semibold">
            Async Button
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-8 py-12" showsVerticalScrollIndicator={false}>
        
        {/* Description */}
        <View className="mb-16">
          <Text className="text-muted-foreground text-base leading-6 text-center">
            Animated buttons with smooth state transitions and dynamic width resizing.
          </Text>
        </View>

        {/* Interactive Demos */}
        <View className="items-center justify-center flex-1">
          <View className="gap-16 w-full max-w-sm">
            <View className="flex-row items-start">
              <View className="flex-1">
                <Text className="text-muted-foreground text-xs mb-3">
                  Primary Button
                </Text>
                <View className="items-center">
                  <AsyncButton
                    text="Send Message"
                    state={button1State}
                    variant="primary"
                    onPress={() => simulateAsyncAction(setButton1State, true, 1500)}
                  />
                </View>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="flex-1">
                <Text className="text-muted-foreground text-xs mb-3">
                  Secondary Button
                </Text>
                <View className="items-center">
                  <AsyncButton
                    text="Upload File"
                    state={button2State}
                    variant="secondary"
                    onPress={() => simulateAsyncAction(setButton2State, false, 1000)}
                  />
                </View>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="flex-1">
                <Text className="text-muted-foreground text-xs mb-3">
                  Success Button
                </Text>
                <View className="items-center">
                  <AsyncButton
                    text="Process Payment"
                    state={button3State}
                    variant="success"
                    onPress={() => simulateAsyncAction(setButton3State, true, 2000)}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Reset at bottom */}
        <View className="pb-8 pt-4">
          <TouchableOpacity
            onPress={resetAll}
            className="items-center py-4"
            activeOpacity={0.7}
          >
            <Text className="text-muted-foreground text-center font-medium">
              🔄 Reset All
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
} 
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Icons } from '@/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIconColors } from '@/hooks/useIconColors';

// Import components
import SwipeAnimationDemo from '@/playground/ui/SwipeAnimationDemo';
import { ExpandableFloatingButtonDemo } from '@/playground/floatingMenu';

// Dynamic import mapping for component demos
const componentMap: { [key: string]: React.ComponentType } = {
  'ui/SwipeAnimationDemo': SwipeAnimationDemo,
  'floatingMenu/ExpandableFloatingButtonDemo': ExpandableFloatingButtonDemo,
};

export default function PlaygroundDemoScreen() {
  const { demo } = useLocalSearchParams<{ demo: string[] }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  
  if (!demo || demo.length === 0) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground text-lg">
          No demo specified
        </Text>
      </View>
    );
  }

  const demoPath = demo.join('/');
  const ComponentDemo = componentMap[demoPath];

  if (!ComponentDemo) {
    return (
      <View className="flex-1 bg-background">
        {/* Simple Back button */}
        <View style={{ paddingTop: insets.top + 8 }} className="px-4 pb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-8 h-8"
            activeOpacity={0.7}
          >
            <Icons.ChevronLeft 
              size={24} 
              color={iconColors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Error content */}
        <View className="flex-1 items-center justify-center px-4">
          <Icons.AlertCircle 
            size={48} 
            color={iconColors.error} 
          />
          <Text className="text-foreground text-xl font-semibold mt-4">
            Component Not Found
          </Text>
          <Text className="text-muted-foreground text-base mt-2 text-center">
            The component demo &quot;{demoPath}&quot; could not be loaded.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
  
        <ComponentDemo />
  
    </View>
  );
} 
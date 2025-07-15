import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icons } from '@/icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

// Demo components list
const demos = [
  {
    id: 'swipe-animation',
    name: 'Swipe Animation',
    description: 'Interactive swipe gesture with sliding menu',
    path: 'ui/SwipeAnimationDemo',
  },
  {
    id: 'floating-menu',
    name: 'Floating Menu',
    description: 'Draggable floating button with expandable menu (AssistiveTouch style)',
    path: 'floatingMenu/ExpandableFloatingButtonDemo',
  },
];

export default function PlaygroundScreen() {
  const { isDark } = useTheme();
  const router = useRouter();

  const handleDemoPress = (demoPath: string) => {
    router.push(`/(protected)/playground/${demoPath}` as any);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Custom Header */}
      <View className="px-6 pt-12 pb-6 bg-primary/5 border-b border-border">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
            <Icons.Play size={20} color={isDark ? '#10B981' : '#059669'} />
          </View>
          <Text className="text-foreground text-2xl font-bold">
            Playground
          </Text>
        </View>
        <Text className="text-muted-foreground text-base">
          Collection of interactive demos and animations
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Demos List */}
        <View className="gap-4">
          {demos.map((demo) => (
            <TouchableOpacity
              key={demo.id}
              onPress={() => handleDemoPress(demo.path)}
              className="bg-card border border-border rounded-xl p-5"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground text-lg font-semibold mb-1">
                    {demo.name}
                  </Text>
                  <Text className="text-muted-foreground text-sm mb-3">
                    {demo.description}
                  </Text>
                  <View className="flex-row items-center">
                    <View className="bg-primary/10 px-2 py-1 rounded-md">
                      <Text className="text-primary text-xs font-medium">
                        DEMO
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View className="ml-4">
                  <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                    <Icons.Play 
                      size={16} 
                      color={isDark ? '#10B981' : '#059669'} 
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add more demos hint */}
        <View className="mt-8 p-6 bg-muted/30 border border-dashed border-border rounded-xl">
          <Text className="text-muted-foreground text-center text-sm">
            ✨ More animations coming soon...
          </Text>
        </View>
      </ScrollView>
    </View>
  );
} 
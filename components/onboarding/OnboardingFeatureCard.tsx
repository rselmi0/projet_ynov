import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import { Text } from '@/components/ui/text';
import type { OnboardingFeatureCardProps } from '@/types/onboarding';

export function OnboardingFeatureCard({ feature, index = 0 }: OnboardingFeatureCardProps) {
  const IconComponent = feature.icon;
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  
  useEffect(() => {
    const delay = index * 200; // Stagger animation
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);
  
  return (
    <Animated.View 
      className="mb-4 flex-row items-start rounded-xl bg-card p-5 border border-border"
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {/* Icon container */}
      <View 
        className="mr-4 rounded-full p-3 shadow-sm" 
        style={{ backgroundColor: feature.color }}
      >
        <IconComponent size={24} color="white" />
      </View>
      
      {/* Content */}
      <View className="flex-1">
        <Text className="mb-2 text-base font-semibold text-foreground">
          {feature.title}
        </Text>
        <Text className="text-sm leading-5 text-muted-foreground">
          {feature.description}
        </Text>
      </View>
    </Animated.View>
  );
} 
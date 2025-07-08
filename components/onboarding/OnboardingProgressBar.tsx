import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import type { OnboardingProgressBarProps } from '@/types/onboarding';

export function OnboardingProgressBar({ 
  currentStep, 
  totalSteps, 
  stepText 
}: OnboardingProgressBarProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <View className="px-6 pt-16">
      {/* Progress bars with theme colors */}
      <View className="mb-6 flex-row gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View 
            key={index}
            className="h-1 flex-1 rounded-full bg-muted overflow-hidden"
          >
            {/* Progress fill with primary color */}
            <View 
              className="h-full rounded-full transition-all duration-300"
              style={{
                backgroundColor: index < currentStep ? iconColors.primary : 'transparent',
                width: index < currentStep ? '100%' : '0%',
              }}
            />
          </View>
        ))}
      </View>
      
      {/* Step indicator text with better spacing */}
      <Text className="mb-4 text-sm font-medium text-muted-foreground">
        {stepText || t('onboarding.progress.step', { current: currentStep, total: totalSteps })}
      </Text>
    </View>
  );
} 
import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { OnboardingFeatureCard } from '@/components/onboarding';
import { onboardingFeatures } from '@/constants/onboarding';
import type { OnboardingFeature } from '@/types/onboarding';

export function OnboardingStep2() {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  // Map features with theme-aware colors and translated text
  const featuresWithColors: OnboardingFeature[] = onboardingFeatures.map((feature, index) => ({
    ...feature,
    title: t(feature.title),
    description: t(feature.description),
    color: index === 0 ? iconColors.warning : index === 1 ? iconColors.success : iconColors.primary,
  }));

  return (
    <>
      <Text className="mb-3 text-2xl font-bold text-foreground">
        {t('onboarding.step2.title')}
      </Text>
      <Text className="mb-6 text-base leading-6 text-muted-foreground">
        {t('onboarding.step2.subtitle')}
      </Text>

      {/* Features list */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {featuresWithColors.map((feature, index) => (
          <OnboardingFeatureCard key={index} feature={feature} index={index} />
        ))}
      </ScrollView>
    </>
  );
} 
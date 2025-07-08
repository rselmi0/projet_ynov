import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { onboardingConfig } from '@/constants/onboarding';

interface OnboardingStep1Props {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export function OnboardingStep1({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: OnboardingStep1Props) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <>
      <Text className="mb-3 text-2xl font-bold text-foreground">
        {t('onboarding.step1.title')}
      </Text>
      <Text className="mb-6 text-base leading-6 text-muted-foreground">
        {t('onboarding.step1.subtitle')}
      </Text>

      <View className="gap-4">
        <View>
          <Text className="mb-2 text-sm font-semibold text-foreground">
            {t('onboarding.step1.firstName')}
          </Text>
          <Input
            className="rounded-lg border border-border bg-card text-foreground"
            style={onboardingConfig.inputSettings}
            placeholder={t('onboarding.step1.firstNamePlaceholder')}
            placeholderTextColor={iconColors.muted}
            value={firstName}
            onChangeText={onFirstNameChange}
            autoCapitalize="words"
            autoComplete="given-name"
          />
        </View>

        <View>
          <Text className="mb-2 text-sm font-semibold text-foreground">
            {t('onboarding.step1.lastName')}
          </Text>
          <Input
            className="rounded-lg border border-border bg-card text-foreground"
            style={onboardingConfig.inputSettings}
            placeholder={t('onboarding.step1.lastNamePlaceholder')}
            placeholderTextColor={iconColors.muted}
            value={lastName}
            onChangeText={onLastNameChange}
            autoCapitalize="words"
            autoComplete="family-name"
          />
        </View>
      </View>
    </>
  );
} 
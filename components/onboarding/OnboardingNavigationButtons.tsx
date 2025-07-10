import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import type { OnboardingNavigationButtonsProps } from '@/types/onboarding';

export function OnboardingNavigationButtons({
  onNext,
  onBack,
  onSkip,
  nextText,
  backText,
  skipText,
  isLoading = false,
  showBack = false,
  showSkip = true,
  nextDisabled = false,
}: OnboardingNavigationButtonsProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <View className="px-4 pb-8">
      {/* Main action button */}
      {onNext && (
        <Button
          onPress={onNext}
          disabled={nextDisabled || isLoading}
          variant="primary"
          size="md"
          className="mb-3 flex-row items-center justify-center rounded-lg"
        >
          <Text className="mr-2 text-base font-semibold text-primary-foreground">
            {nextText || t('onboarding.buttons.continue')}
          </Text>
          {!isLoading && <ArrowRight size={16} color={iconColors.base} />}
        </Button>
      )}

      {/* Secondary actions container */}
      {(showBack || showSkip) && (
        <View className={`${showBack && showSkip ? 'flex-row items-center justify-between' : 'items-center'}`}>
          {/* Back button */}
          {showBack && onBack && (
            <Button
              onPress={onBack}
              variant="ghost"
              className="flex-row items-center justify-center rounded-lg p-4"
            >
              <ChevronLeft size={18} color={iconColors.secondary} />
              <Text className="ml-1 text-base font-medium text-muted-foreground">
                {backText || t('onboarding.buttons.back')}
              </Text>
            </Button>
          )}

          {/* Skip button */}
          {showSkip && onSkip && (
            <Button
              onPress={onSkip}
              variant="ghost"
              className="flex-row items-center justify-center rounded-lg p-4"
            >
              <Text className="mr-2 text-base font-medium text-muted-foreground">
                {skipText || t('onboarding.buttons.skip')}
              </Text>
              <ChevronRight size={18} color={iconColors.secondary} />
            </Button>
          )}
        </View>
      )}
    </View>
  );
} 
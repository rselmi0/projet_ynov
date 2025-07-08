import React, { useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { onboardingBenefits, onboardingConfig } from '@/constants/onboarding';

interface OnboardingStep3Props {
  notificationsEnabled: boolean;
  permissionStatus: any | null;
  onToggleNotifications: () => void;
}

export function OnboardingStep3({
  notificationsEnabled,
  permissionStatus,
  onToggleNotifications,
}: OnboardingStep3Props) {
  const { t } = useTranslation();
  const iconColors = useIconColors();
  
  // Animation for toggle switch
  const toggleAnim = useRef(new Animated.Value(notificationsEnabled ? 1 : 0)).current;

  // Animate toggle when notification state changes
  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: notificationsEnabled ? 1 : 0,
      duration: onboardingConfig.animationDuration.toggle,
      useNativeDriver: false,
    }).start();
  }, [notificationsEnabled, toggleAnim]);

  // Get translated benefits
  const translatedBenefits = onboardingBenefits.map(benefitKey => t(benefitKey));

  return (
    <>
      <Text className="mb-3 text-2xl font-bold text-foreground">
        {t('onboarding.step3.title')}
      </Text>
      <Text className="mb-6 text-base leading-6 text-muted-foreground">
        {t('onboarding.step3.subtitle')}
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Notification Toggle Section */}
        <TouchableOpacity 
          className="mb-6 p-4 bg-card rounded-xl border border-border"
          onPress={onToggleNotifications}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-foreground">
              🔔 {t('onboarding.step3.enableNotifications')}
            </Text>
            <Animated.View
              className="w-12 h-6 rounded-full p-1"
              style={{ 
                backgroundColor: toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [iconColors.muted, iconColors.primary],
                })
              }}
            >
              <Animated.View
                className="w-4 h-4 bg-white rounded-full shadow-sm"
                style={{
                  transform: [
                    {
                      translateX: toggleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 24],
                      }),
                    },
                  ],
                }}
              />
            </Animated.View>
          </View>
          <Text className="text-sm text-muted-foreground">
            {t('onboarding.step3.notificationDescription')}
          </Text>
        </TouchableOpacity>

        {/* Benefits List */}
        <View className="gap-3">
          <Text className="text-lg font-semibold text-foreground mb-2">
            ✨ {t('onboarding.step3.benefits')}
          </Text>
          {translatedBenefits.map((benefit, index) => (
            <View key={index} className="flex-row items-start gap-3 p-3 bg-card rounded-lg border border-border">
              <View 
                className="w-6 h-6 rounded-full items-center justify-center mt-0.5"
                style={{ backgroundColor: iconColors.primary }}
              >
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <Text className="flex-1 text-sm text-foreground leading-5">
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* Permission Status */}
        {notificationsEnabled && (
          <View className="mt-6 p-4 bg-muted/20 rounded-xl">
            <Text className="text-sm text-muted-foreground text-center">
              {permissionStatus?.status === 'granted' 
                ? '✅ ' + t('onboarding.step3.permissionGranted')
                : '📱 ' + t('onboarding.step3.permissionWillRequest')
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
} 
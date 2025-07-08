import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';
import { Text } from '@/components/ui/text';  
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { EmailLoginToggle } from '@/components/auth/EmailLoginToggle';
import { Separator } from '@/components/auth/Separator';
import { useIconColors } from '@/hooks/useIconColors';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ minHeight: '100%' }}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="flex-1 px-6 pb-8 pt-20">
          <View className="mb-16 items-center">
            <View className="mb-8 h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
              <Feather name="smartphone" size={36} color={iconColors.primary} />
            </View>

            <Text className="mb-3 text-center text-3xl font-bold tracking-tight text-foreground">
              {t('welcome.title') || 'Bienvenue'}
            </Text>

            <Text className="max-w-xs text-center text-base text-muted-foreground">
              {t('welcome.subtitle')}
            </Text>
          </View>
        </View>

        {/* Login Section */}
        <View className="gap-6 px-6 pb-8">
          {/* Social Login Buttons */}
          <SocialLoginButtons />

          {/* Separator */}
          <Separator />

          {/* Email Login Toggle/Form */}
          <EmailLoginToggle />

          {/* Sign Up Link */}
          <View className="items-center mt-3">
            <Text className="mb-2 text-muted-foreground text-sm">
              {t('welcome.noAccount')}
            </Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity className="py-2 px-4">
                <Text className="text-primary text-base font-semibold">
                  {t('welcome.signUp')}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

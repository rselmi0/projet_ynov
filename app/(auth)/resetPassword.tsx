import React, { useState } from 'react';
import { useIconColors } from '@/hooks/useIconColors';
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Text } from '@/components/ui/text';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const iconColors = useIconColors();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert(t('common.error'), t('auth.resetPassword.emailRequired'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), t('auth.resetPassword.emailInvalid'));
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setEmailSent(true);
      Alert.alert(
        t('auth.resetPassword.emailSentTitle'),
        t('auth.resetPassword.emailSentMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.replace('/sign-in'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Reset password error:', error);
      Alert.alert(t('common.error'), error.message || t('auth.resetPassword.generalError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pb-6 pt-4">
            <TouchableOpacity
              className="items-center justify-center rounded-2xl bg-secondary w-10 h-10"
              onPress={() => router.back()}
              activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={24} color={iconColors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 px-6">
            {/* Icon */}
            <View className="items-center mb-8">
              <View className="items-center justify-center rounded-3xl bg-primary/10 w-20 h-20">
                <Ionicons name="lock-closed" size={40} color={iconColors.primary} />
              </View>
            </View>

            {/* Title */}
            <Text className="text-center text-foreground text-3xl font-bold mb-3">
              {t('auth.resetPassword.title')}
            </Text>
            <Text className="text-center text-muted-foreground text-base leading-6 mb-10">
              {t('auth.resetPassword.subtitle')}
            </Text>

            {/* Form */}
            <View className="mb-8">
              <View className="mb-6 flex-row items-center rounded-2xl border border-border bg-card px-4">
                <Ionicons name="mail" size={20} color={iconColors.primary} className="mr-3" />
                <TextInput
                  className="flex-1 text-foreground min-h-[50px] py-3 text-base"
                  placeholder={t('auth.resetPassword.emailPlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading && !emailSent}
                />
              </View>

              <TouchableOpacity
                className={`items-center justify-center rounded-2xl min-h-[50px] py-3 px-4 ${
                  loading || !email.trim() || emailSent ? 'bg-secondary' : 'bg-primary'
                }`}
                onPress={handleResetPassword}
                disabled={loading || !email.trim() || emailSent}
                activeOpacity={0.8}>
                <Text
                  className={`text-base font-semibold ${
                    loading || !email.trim() || emailSent ? 'text-muted-foreground' : 'text-primary-foreground'
                  }`}>
                  {loading ? t('auth.resetPassword.sending') : emailSent ? t('auth.resetPassword.emailSent') : t('auth.resetPassword.sendLink')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Success Message */}
            {emailSent && (
              <View className="mb-6 flex-row items-center rounded-2xl bg-green-500/10 p-4">
                <Ionicons name="checkmark-circle" size={24} color={iconColors.success} />
                <Text className="ml-3 flex-1 text-green-600 text-sm leading-5">
                  {t('auth.resetPassword.successMessage', { email })}
                </Text>
              </View>
            )}

            {/* Back to Login */}
            <View className="items-center mt-6">
              <Text className="text-muted-foreground text-sm">
                {t('auth.resetPassword.rememberPassword')}
              </Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="mt-2 py-2 px-4">
                  <Text className="text-primary text-base font-semibold">
                    {t('auth.resetPassword.signIn')}
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

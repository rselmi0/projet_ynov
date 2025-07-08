import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { ActivityIndicator, View, Alert, TouchableOpacity } from 'react-native';
import * as z from 'zod';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

import { Text } from '../../components/ui/text';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Icons } from '../../icons';
import { SocialLoginButtons } from '../../components/auth/SocialLoginButtons';
import { Separator } from '../../components/auth/Separator';
import { useIconColors } from '../../hooks/useIconColors';

export default function SignIn() {
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const iconColors = useIconColors();
  const formSchema = z.object({
    email: z.string().email(t('auth.validation.emailRequired')),
    password: z
      .string()
      .min(8, t('auth.validation.passwordMinLength'))
      .max(64, t('auth.validation.passwordMaxLength')),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signIn(data.email, data.password);
      reset();
    } catch (error: Error | any) {
      console.error(error.message);
      Alert.alert(t('auth.signIn.errorTitle'), error.message || t('auth.validation.signInError'));
    }
  }

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <View className="flex-1 gap-6">
        <View className="mb-8 items-center">
          <Text className="mb-2 text-center text-3xl font-bold text-foreground">
            {t('auth.signIn.title')}
          </Text>
          <Text className="text-center text-muted-foreground">{t('auth.signIn.subtitle')}</Text>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Icons.Mail color={iconColors.primary} size={16} />
              <Label className="text-muted-foreground text-sm font-medium">
                {t('auth.signIn.email')}
              </Label>
            </View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="rounded-lg border border-border bg-card px-4 py-3 text-foreground text-base min-h-[50px]"
                  placeholder={t('auth.signIn.emailPlaceholder')}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text className="px-2 text-sm text-destructive">{errors.email.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Icons.Lock color={iconColors.primary} size={16} />
              <Label className="text-muted-foreground text-sm font-medium">
                {t('auth.signIn.password')}
              </Label>
            </View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="rounded-lg border border-border bg-card px-4 py-3 text-foreground text-base min-h-[50px]"
                  placeholder={t('auth.signIn.passwordPlaceholder')}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.password && (
              <Text className="px-2 text-sm text-destructive">{errors.password.message}</Text>
            )}

            <View className="flex-row justify-end mt-1">
              <Link href="/resetPassword" asChild>
                <TouchableOpacity className="py-1 px-2">
                                <Text className="text-primary text-sm">
                {t('auth.signIn.forgotPassword')}
              </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>

      <View className="pb-8 gap-6">
        <TouchableOpacity
                        className={`w-full items-center justify-center rounded-lg bg-primary min-h-[50px] py-3 px-4 ${isSubmitting ? 'opacity-50' : ''}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-base font-semibold">
              {t('auth.signIn.submitButton')}
            </Text>
          )}
        </TouchableOpacity>

        <Separator />

        <SocialLoginButtons />

        <View className="items-center mt-3">
          <Text className="mb-2 text-muted-foreground text-sm">
            {t('auth.signIn.noAccount')}
          </Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity className="py-2 px-4">
              <Text className="text-primary text-base font-semibold">
                {t('auth.signIn.createAccount')}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

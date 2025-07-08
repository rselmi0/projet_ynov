import { View, TouchableOpacity } from 'react-native';
import { Stack , router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';

import { Home, ArrowLeft, SearchX } from 'lucide-react-native';

export default function NotFound() {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  const handleGoHome = () => {
    router.replace('/(protected)/(tabs)/home');
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(protected)/(tabs)/home');
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* 404 Icon */}
        <View className="mb-8 items-center">
          <View className="rounded-full bg-muted/20 p-6 mb-4">
            <SearchX size={64} color={iconColors.muted} />
          </View>
          
          {/* 404 Number */}
          <Text className="text-6xl font-bold text-foreground mb-2">
            404
          </Text>
        </View>

        {/* Title and Description */}
        <View className="mb-8 items-center">
          <Text className="text-2xl font-semibold text-foreground mb-3 text-center">
            {t('notFound.title')}
          </Text>
          <Text className="text-base text-muted-foreground text-center leading-6 max-w-sm">
            {t('notFound.description')}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full max-w-sm space-y-3 gap-2">
          {/* Go Home Button */}
          <TouchableOpacity
            onPress={handleGoHome}
            className="bg-primary rounded-xl p-4 flex-row items-center justify-center space-x-3">
            <Home size={20} color="white" />
            <Text className="text-white font-semibold text-base">
              {t('notFound.actions.goHome')}
            </Text>
          </TouchableOpacity>

          {/* Go Back Button */}
          <TouchableOpacity
            onPress={handleGoBack}
            className="border border-border rounded-xl p-4 flex-row items-center justify-center space-x-3 ">
            <ArrowLeft size={20} color={iconColors.primary} />
            <Text className="text-foreground font-medium text-base">
              {t('notFound.actions.goBack')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 pb-8">
        <View className="bg-muted/20 rounded-xl p-4">
          <Text className="text-sm text-muted-foreground text-center">
            {t('notFound.help.message')}
          </Text>
        </View>
      </View>
    </View>
  );
}

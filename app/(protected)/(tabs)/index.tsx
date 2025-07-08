import { Link } from 'expo-router';
import { View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { Text } from '@/components/ui/text';
import { ExternalLink, ChevronRight } from 'lucide-react-native';
import { useIconColors } from '@/hooks/useIconColors';
import { quickActions, features } from '@/constants/quickActions';

export default function Home() {
  const { t, currentLanguage } = useTranslation();
  const iconColors = useIconColors();

  // Force re-render when language changes
  const key = `home-${currentLanguage}`;

  const handleDocsPress = async () => {
    try {
      await Linking.openURL('https://docs.expobase.dev');
    } catch (error) {
      console.error('Error opening docs:', error);
    }
  };

  return (
    <ScrollView 
      key={key}
      className="flex-1 bg-background px-6 py-4" 
      showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View className="rounded-xl bg-card p-6 mb-6">
        <Text className="text-2xl font-semibold text-foreground mb-2">
          {t('home.welcome.title')}
        </Text>
        <Text className="text-base text-muted-foreground mb-6">
          {t('home.welcome.subtitle')}
        </Text>
        
        <TouchableOpacity 
          onPress={handleDocsPress}
          className="flex-row items-center rounded-lg p-3"
        >
          <ExternalLink size={16} color={iconColors.primary} />
          <Text className="ml-2 text-primary font-medium">
            {t('home.welcome.docs')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View className="rounded-xl bg-card p-4 mb-6">
        <Text className="mb-4 text-lg font-semibold text-foreground">
          {t('home.quickActions.title')}
        </Text>

        <View className="gap-2">
          {quickActions.map((action, index) => (
            <Link key={action.key} href={action.route as any} asChild>
              <TouchableOpacity
                className="flex-row items-center p-3 rounded-lg bg-muted/20 active:bg-muted/40"
                activeOpacity={0.7}>
                <View className="w-8 h-8 rounded-lg bg-background items-center justify-center mr-3">
                  <action.icon size={16} color={action.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">
                    {t(action.titleKey)}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {t(action.descriptionKey)}
                  </Text>
                </View>
                <ChevronRight size={16} color={iconColors.muted} />
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      {/* Features Highlight */}
      <View className="rounded-xl bg-card p-4 mb-6">
        <Text className="mb-4 text-lg font-semibold text-foreground">
          {t('home.features.title')}
        </Text>
        
        <View className="gap-3">
          {features.map((feature, index) => (
            <View key={feature.key} className="flex-row items-center p-3 rounded-lg bg-muted/30">
              <View className="mr-3 p-2 rounded-lg bg-primary/10">
                <feature.icon size={18} color={feature.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-foreground mb-1">
                  {t(feature.titleKey)}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {t(feature.descriptionKey)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

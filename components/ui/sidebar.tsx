import React from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useRevenueCat } from '@/context/RevenuCatContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Icons } from '@/icons';
import { navigationItems } from '@/constants/navigation';
import { useIconColors } from '@/hooks/useIconColors';

// Custom Drawer Content Component
export const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const iconColors = useIconColors();
  // Hooks pour vérifier le statut premium
  const { isPremium, loading: premiumLoading } = usePremiumStatus();
  const { isPro } = useRevenueCat();

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  const handleNavigation = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Fermer le drawer
    props.navigation.dispatch(DrawerActions.closeDrawer());
    // Naviguer
    router.push(route as any);
  };

  const isActiveRoute = (route: string) => {
    if (route === '/(protected)/(tabs)/') {
      return pathname === '/(protected)/(tabs)' || pathname === '/(protected)/(tabs)/';
    }
    return pathname === route;
  };

  return (
    <View className="flex-1 border-r border-border bg-background">
      {/* Header */}
      <View className="border-b border-border px-6 py-5" style={{ paddingTop: insets.top + 20 }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground font-instrument-serif-italic text-3xl">
             Menu
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="items-center justify-center rounded-2xl bg-secondary/80"
            activeOpacity={0.6}
            style={{
              width: 36,
              height: 36,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 1,
            }}>
            <Icons.X size={18} color={iconColors.base} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: 16 }}>
          {navigationItems.map((item, index) => {
            const isActive = isActiveRoute(item.route);
            const IconComponent = Icons[item.icon];

            // Vérifier si l'item nécessite un accès premium
            const isPremiumItem = item.premiumOnly;
            const hasAccess = !isPremiumItem || isPremium || isPro;

            // Ne pas afficher l'item premium si pas d'accès et pas en cours de chargement
            if (isPremiumItem && !hasAccess && !premiumLoading) {
              return null;
            }

            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => handleNavigation(item.route)}
                className={`mb-1 flex-row items-center rounded-2xl  ${
                  isActive ? 'bg-primary/10' : 'bg-transparent'
                }`}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  shadowColor: isActive ? '#FF6B35' : 'transparent',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isActive ? 0.1 : 0,
                  shadowRadius: isActive ? 4 : 0,
                  elevation: isActive ? 2 : 0,
                }}
                activeOpacity={0.7}>
                <View
                  className={`items-center justify-center rounded-xl ${
                    isActive
                      ? 'bg-primary'
                      : isPremiumItem && hasAccess
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-secondary'
                  }`}
                  style={{ width: 32, height: 32, marginRight: 12 }}>
                  <IconComponent
                    size={18}
                    color={
                      isActive || (isPremiumItem && hasAccess)
                        ? iconColors.primary
                        : iconColors.secondary
                    }
                    strokeWidth={2}
                  />
                </View>
                <View className="flex-1 flex-row items-center">
                  <Text
                    className={`${
                      isActive
                        ? 'text-primary'
                        : isPremiumItem && hasAccess
                          ? 'text-purple-600 dark:text-purple-400  '
                          : 'text-foreground'
                    }`}
                    style={{ fontSize: 16, fontWeight: isActive ? '600' : '500' }}>
                    {t(item.labelKey)}
                  </Text>
                  {isPremiumItem && hasAccess && (
                    <View className="ml-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5">
                      <Text className="text-xs font-semibold text-white">✨</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View
        className="border-t border-border px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}>
        <Text className="text-center text-muted-foreground" style={{ fontSize: 12 }}>
          Expobase Version 1.0.0
        </Text>
      </View>
    </View>
  );
};

// Legacy Sidebar component for backward compatibility
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // This is kept for backward compatibility but should use CustomDrawerContent instead
  return null;
};

import React from 'react';
import { View } from 'react-native';
import { usePathname } from 'expo-router';
import { HeaderTitle } from './header-title';
import { useTranslation } from '@/hooks/useTranslation';
import { DrawerActions } from '@react-navigation/native';
import { findNavigationItemByRoute, defaultNavigationItem } from '@/utils/functionNavigations';

interface DynamicHeaderProps {
  navigation: any;
}

export const DynamicHeader: React.FC<DynamicHeaderProps> = ({ navigation }) => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const currentPage = findNavigationItemByRoute(pathname) || defaultNavigationItem;

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="bg-background">
      <HeaderTitle
        title={t(currentPage.titleKey)}
        subtitle={t(currentPage.subtitleKey)}
        onMenuPress={handleMenuPress}
      />
    </View>
  );
};

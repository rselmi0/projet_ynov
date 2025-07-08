import { Icons } from '../icons';

// Navigation item interface
export interface NavigationItem {
  key: string;
  labelKey: string; // Key for i18n
  titleKey: string; // Key for i18n title
  subtitleKey: string; // Key for i18n subtitle
  icon: keyof typeof Icons;
  route: string;
  premiumOnly?: boolean;
}

// Navigation utility function types
export type FindNavigationItemByRoute = (route: string) => NavigationItem | undefined; 
import { NavigationItem } from "@/types/navigation";
import { navigationItems } from "@/constants/navigation";

// Utility function to find a page by route
export const findNavigationItemByRoute = (route: string): NavigationItem | undefined => {
    // Exact search first
    let found = navigationItems.find(item => {
      if (item.route === '/(protected)/(tabs)/') {
        return route === '/(protected)/(tabs)' || route === '/(protected)/(tabs)/';
      }
      return item.route === route;
    });
    
    // If not found, search by route name
    if (!found) {
      found = navigationItems.find(item => {
        const routeName = item.route.split('/').pop();
        const inputName = route.split('/').pop();
        
        if (item.route === '/(protected)/(tabs)/' && (route.endsWith('/') || route.endsWith('/(tabs)'))) {
          return true;
        }
        
        return routeName === inputName;
      });
    }
    
    return found;
  };
  
  // Default page if no match
  export const defaultNavigationItem: NavigationItem = {
    key: 'app',
    labelKey: 'navigation.app.label',
    titleKey: 'navigation.app.title',
    subtitleKey: 'navigation.app.subtitle',
    icon: 'Home',
    route: '/',
  }; 
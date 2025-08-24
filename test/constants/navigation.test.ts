import { navigationItems } from '@/constants/navigation';

describe('Navigation Constants', () => {
  it('should export navigationItems array', () => {
    expect(navigationItems).toBeDefined();
    expect(Array.isArray(navigationItems)).toBe(true);
    expect(navigationItems.length).toBeGreaterThan(0);
  });

  it('should have valid navigation item structure', () => {
    navigationItems.forEach((item) => {
      expect(item).toHaveProperty('key');
      expect(item).toHaveProperty('labelKey');
      expect(item).toHaveProperty('titleKey');
      expect(item).toHaveProperty('subtitleKey');
      expect(item).toHaveProperty('icon');
      expect(item).toHaveProperty('route');
      
      expect(typeof item.key).toBe('string');
      expect(typeof item.labelKey).toBe('string');
      expect(typeof item.titleKey).toBe('string');
      expect(typeof item.subtitleKey).toBe('string');
      expect(typeof item.icon).toBe('string');
      expect(typeof item.route).toBe('string');
    });
  });

  it('should have unique keys for each navigation item', () => {
    const keys = navigationItems.map(item => item.key);
    const uniqueKeys = [...new Set(keys)];
    expect(keys.length).toBe(uniqueKeys.length);
  });

  it('should have unique routes for each navigation item', () => {
    const routes = navigationItems.map(item => item.route);
    const uniqueRoutes = [...new Set(routes)];
    expect(routes.length).toBe(uniqueRoutes.length);
  });

  it('should contain expected navigation items', () => {
    const expectedKeys = ['home', 'tasks', 'premium', 'payment', 'ai', 'profile', 'settings', 'offline', 'playground', 'notifications'];
    const actualKeys = navigationItems.map(item => item.key);
    
    expectedKeys.forEach(key => {
      expect(actualKeys).toContain(key);
    });
  });

  it('should have valid route formats', () => {
    navigationItems.forEach(item => {
      expect(item.route).toMatch(/^\/\(protected\)\//);
    });
  });

  it('should have premium flags where appropriate', () => {
    const premiumItem = navigationItems.find(item => item.key === 'premium');
    expect(premiumItem?.premiumOnly).toBe(true);
  });

  it('should have translation keys in correct format', () => {
    navigationItems.forEach(item => {
      expect(item.labelKey).toMatch(/^navigation\.\w+\.label$/);
      expect(item.titleKey).toMatch(/^navigation\.\w+\.title$/);
      expect(item.subtitleKey).toMatch(/^navigation\.\w+\.subtitle$/);
    });
  });

  it('should have consistent key and translation key naming', () => {
    navigationItems.forEach(item => {
      const expectedLabelKey = `navigation.${item.key}.label`;
      const expectedTitleKey = `navigation.${item.key}.title`;
      const expectedSubtitleKey = `navigation.${item.key}.subtitle`;
      
      expect(item.labelKey).toBe(expectedLabelKey);
      expect(item.titleKey).toBe(expectedTitleKey);
      expect(item.subtitleKey).toBe(expectedSubtitleKey);
    });
  });

  it('should export all required navigation items', () => {
    const requiredItems = ['home', 'tasks', 'ai', 'profile', 'settings'];
    const actualKeys = navigationItems.map(item => item.key);
    
    requiredItems.forEach(requiredKey => {
      expect(actualKeys).toContain(requiredKey);
    });
  });

  it('should have valid icon names', () => {
    const validIcons = ['Home', 'CheckSquare', 'Shield', 'CreditCard', 'Bot', 'User', 'Settings', 'LogOut', 'Play', 'Bell'];
    
    navigationItems.forEach(item => {
      expect(validIcons).toContain(item.icon);
    });
  });

  it('should handle optional properties correctly', () => {
    navigationItems.forEach(item => {
      if (item.premiumOnly !== undefined) {
        expect(typeof item.premiumOnly).toBe('boolean');
      }
    });
  });

  it('should maintain consistent structure', () => {
    expect(navigationItems.length).toBeGreaterThan(5);
    expect(navigationItems.length).toBeLessThan(20);
  });

  it('should provide complete navigation data', () => {
    navigationItems.forEach(item => {
      expect(item.key.length).toBeGreaterThan(0);
      expect(item.route.length).toBeGreaterThan(0);
      expect(item.icon.length).toBeGreaterThan(0);
    });
  });
});
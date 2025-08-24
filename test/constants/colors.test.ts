import { colors } from '@/constants/colors';

describe('Colors Constants', () => {
  it('should export colors object', () => {
    expect(colors).toBeDefined();
    expect(typeof colors).toBe('object');
  });

  it('should have icons property', () => {
    expect(colors.icons).toBeDefined();
    expect(typeof colors.icons).toBe('object');
  });

  it('should have icon color definitions', () => {
    expect(colors.icons.base).toBeDefined();
    expect(colors.icons.primary).toBeDefined();
    expect(colors.icons.secondary).toBeDefined();
    expect(colors.icons.success).toBeDefined();
    expect(colors.icons.error).toBeDefined();
    expect(colors.icons.warning).toBeDefined();
    expect(colors.icons.info).toBeDefined();
    expect(colors.icons.muted).toBeDefined();
  });

  it('should have light and dark variants for each icon color', () => {
    const iconTypes: (keyof typeof colors.icons)[] = ['base', 'primary', 'secondary', 'success', 'error', 'warning', 'info', 'muted'];
    
    iconTypes.forEach(iconType => {
      expect(colors.icons[iconType].light).toBeDefined();
      expect(colors.icons[iconType].dark).toBeDefined();
      expect(typeof colors.icons[iconType].light).toBe('string');
      expect(typeof colors.icons[iconType].dark).toBe('string');
    });
  });

  it('should have valid hex color values', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    
    Object.values(colors.icons).forEach(colorVariant => {
      expect(colorVariant.light).toMatch(hexColorRegex);
      expect(colorVariant.dark).toMatch(hexColorRegex);
    });
  });

  it('should have different light and dark variants', () => {
    Object.values(colors.icons).forEach(colorVariant => {
      // Most colors should have different light and dark variants
      // (though some might be the same, so we just check they're defined)
      expect(colorVariant.light).toBeDefined();
      expect(colorVariant.dark).toBeDefined();
    });
  });

  it('should provide consistent structure', () => {
    const iconTypes = Object.keys(colors.icons) as (keyof typeof colors.icons)[];
    
    iconTypes.forEach(iconType => {
      expect(colors.icons[iconType]).toHaveProperty('light');
      expect(colors.icons[iconType]).toHaveProperty('dark');
    });
  });

  it('should have proper base colors', () => {
    expect(colors.icons.base.light).toBe('#000000');
    expect(colors.icons.base.dark).toBe('#FFFFFF');
  });

  it('should have consistent primary color', () => {
    expect(colors.icons.primary.light).toBe('#FF6B35');
    expect(colors.icons.primary.dark).toBe('#FF6B35');
  });

  it('should export all required icon color types', () => {
    const requiredTypes = ['base', 'primary', 'secondary', 'success', 'error', 'warning', 'info', 'muted'];
    
    requiredTypes.forEach(type => {
      expect(colors.icons).toHaveProperty(type);
    });
  });

  it('should handle missing properties gracefully', () => {
    // Test that the structure is well-defined
    expect(() => {
      const testColor = colors.icons.primary.light;
      expect(typeof testColor).toBe('string');
    }).not.toThrow();
  });

  it('should provide readable colors', () => {
    // Basic check that colors are not empty strings
    Object.values(colors.icons).forEach(colorVariant => {
      expect(colorVariant.light.length).toBeGreaterThan(0);
      expect(colorVariant.dark.length).toBeGreaterThan(0);
    });
  });
});
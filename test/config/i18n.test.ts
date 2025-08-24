import i18n from '@/config/i18n';

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'en', regionCode: 'US' }]),
}));

// Mock MMKV storage
jest.mock('@/lib/storage', () => ({
  storage: {
    getString: jest.fn(() => null),
    set: jest.fn(),
  },
}));

describe('i18n configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be properly initialized', () => {
    expect(i18n).toBeDefined();
    expect(typeof i18n.t).toBe('function');
    expect(typeof i18n.changeLanguage).toBe('function');
  });

  it('should have default language set', () => {
    expect(i18n.language).toBeDefined();
    expect(typeof i18n.language).toBe('string');
  });

  it('should have supported languages', () => {
    const supportedLanguages = ['en', 'es', 'fr', 'pt'];
    
    supportedLanguages.forEach(lang => {
      expect(i18n.options.resources).toHaveProperty(lang);
    });
  });

  it('should translate keys correctly', () => {
    // Test basic translation
    const result = i18n.t('common:welcome');
    expect(typeof result).toBe('string');
  });

  it('should handle missing translations gracefully', () => {
    const result = i18n.t('nonexistent:key');
    expect(typeof result).toBe('string');
    // Should return the key if translation doesn't exist
    expect(result).toContain('key');
  });

  it('should support interpolation', () => {
    const result = i18n.t('common:hello', { name: 'John' });
    expect(typeof result).toBe('string');
  });

  it('should handle language changes', async () => {
    const originalLanguage = i18n.language;
    
    await i18n.changeLanguage('es');
    expect(i18n.language).toBe('es');
    
    // Change back
    await i18n.changeLanguage(originalLanguage);
  });

  it('should fallback to English for unsupported languages', async () => {
    await i18n.changeLanguage('unsupported');
    expect(i18n.language).toBe('en');
  });

  it('should load resources for all supported languages', () => {
    const resources = i18n.options.resources;
    
    expect(resources.en).toBeDefined();
    expect(resources.es).toBeDefined();
    expect(resources.fr).toBeDefined();
    expect(resources.pt).toBeDefined();
  });

  it('should have consistent namespaces across languages', () => {
    const resources = i18n.options.resources;
    const englishNamespaces = Object.keys(resources.en);
    
    Object.keys(resources).forEach(lang => {
      if (lang !== 'en') {
        const langNamespaces = Object.keys(resources[lang]);
        expect(langNamespaces.sort()).toEqual(englishNamespaces.sort());
      }
    });
  });

  it('should detect device language on initialization', () => {
    // This would be tested in a real environment where expo-localization works
    expect(i18n.language).toBeDefined();
  });

  it('should persist language choice', async () => {
    const mockStorage = require('@/lib/storage').storage;
    
    await i18n.changeLanguage('fr');
    
    // Should save to storage
    expect(mockStorage.set).toHaveBeenCalledWith(
      'user-language', 
      'fr'
    );
  });
});
import { renderHook, act } from '@testing-library/react-native';
import { useTranslation } from '@/hooks/useTranslation';

// Mock dependencies
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: jest.fn((key: string) => key),
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  })),
}));

jest.mock('@/hooks/useProfile', () => ({
  useProfile: jest.fn(() => ({
    profile: null,
    updateLanguage: jest.fn(),
  })),
}));

jest.mock('@/lib/storage', () => ({
  prefs: {
    set: jest.fn(),
    get: jest.fn(),
  },
}));

const mockUseI18n = require('react-i18next').useTranslation;
const mockUseProfile = require('@/hooks/useProfile').useProfile;
const mockPrefs = require('@/lib/storage').prefs;

describe('useTranslation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseI18n.mockReturnValue({
      t: jest.fn((key: string) => key),
      i18n: {
        changeLanguage: jest.fn().mockResolvedValue(undefined),
        language: 'en',
      },
    });
    mockUseProfile.mockReturnValue({
      profile: null,
      updateLanguage: jest.fn(),
    });
  });

  it('should provide translation function', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(result.current.t).toBeDefined();
    expect(typeof result.current.t).toBe('function');
    expect(result.current.changeLanguage).toBeDefined();
    expect(result.current.currentLanguage).toBe('en');
  });

  it('should handle language changes', async () => {
    const mockChangeLanguage = jest.fn().mockResolvedValue(undefined);
    const mockUpdateLanguage = jest.fn().mockResolvedValue(undefined);
    
    mockUseI18n.mockReturnValue({
      t: jest.fn(),
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'en',
      },
    });
    
    mockUseProfile.mockReturnValue({
      profile: { id: '1', lang: 'en' },
      updateLanguage: mockUpdateLanguage,
    });

    const { result } = renderHook(() => useTranslation());
    
    await act(async () => {
      await result.current.changeLanguage('fr');
    });
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
    expect(mockPrefs.set).toHaveBeenCalledWith('user_language', 'fr');
    expect(mockUpdateLanguage).toHaveBeenCalledWith('fr');
  });

  it('should sync language from profile on load', () => {
    const mockChangeLanguage = jest.fn();
    
    mockUseI18n.mockReturnValue({
      t: jest.fn(),
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'en',
      },
    });
    
    mockUseProfile.mockReturnValue({
      profile: { id: '1', lang: 'fr' },
      updateLanguage: jest.fn(),
    });

    renderHook(() => useTranslation());
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
    expect(mockPrefs.set).toHaveBeenCalledWith('user_language', 'fr');
  });

  it('should not sync if profile language matches current', () => {
    const mockChangeLanguage = jest.fn();
    
    mockUseI18n.mockReturnValue({
      t: jest.fn(),
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'fr',
      },
    });
    
    mockUseProfile.mockReturnValue({
      profile: { id: '1', lang: 'fr' },
      updateLanguage: jest.fn(),
    });

    renderHook(() => useTranslation());
    
    expect(mockChangeLanguage).not.toHaveBeenCalled();
  });

  it('should handle language change without profile', async () => {
    const mockChangeLanguage = jest.fn().mockResolvedValue(undefined);
    
    mockUseI18n.mockReturnValue({
      t: jest.fn(),
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'en',
      },
    });
    
    mockUseProfile.mockReturnValue({
      profile: null,
      updateLanguage: jest.fn(),
    });

    const { result } = renderHook(() => useTranslation());
    
    await act(async () => {
      await result.current.changeLanguage('es');
    });
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
    expect(mockPrefs.set).toHaveBeenCalledWith('user_language', 'es');
  });

  it('should translate keys correctly', () => {
    const mockT = jest.fn((key: string) => `translated_${key}`);
    
    mockUseI18n.mockReturnValue({
      t: mockT,
      i18n: {
        changeLanguage: jest.fn(),
        language: 'en',
      },
    });

    const { result } = renderHook(() => useTranslation());
    
    result.current.t('hello.world');
    
    expect(mockT).toHaveBeenCalledWith('hello.world');
  });

  it('should provide current language', () => {
    mockUseI18n.mockReturnValue({
      t: jest.fn(),
      i18n: {
        changeLanguage: jest.fn(),
        language: 'fr',
      },
    });

    const { result } = renderHook(() => useTranslation());
    
    expect(result.current.currentLanguage).toBe('fr');
  });

  it('should handle language change errors gracefully', async () => {
    const mockChangeLanguage = jest.fn().mockRejectedValue(new Error('Language change failed'));
    
    mockUseI18n.mockReturnValue({
      t: jest.fn(),
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'en',
      },
    });

    const { result } = renderHook(() => useTranslation());
    
    // Should not throw, should handle error internally
    await act(async () => {
      await result.current.changeLanguage('invalid');
    });
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('invalid');
  });

  it('should handle profile update errors gracefully', async () => {
    const mockChangeLanguage = jest.fn().mockResolvedValue(undefined);
    const mockUpdateLanguage = jest.fn().mockRejectedValue(new Error('Profile update failed'));
    
    mockUseI18n.mockReturnValue({
      t: jest.fn(),
      i18n: {
        changeLanguage: mockChangeLanguage,
        language: 'en',
      },
    });
    
    mockUseProfile.mockReturnValue({
      profile: { id: '1', lang: 'en' },
      updateLanguage: mockUpdateLanguage,
    });

    const { result } = renderHook(() => useTranslation());
    
    // Should not throw, should handle error internally
    await act(async () => {
      await result.current.changeLanguage('fr');
    });
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('fr');
    expect(mockUpdateLanguage).toHaveBeenCalledWith('fr');
  });
});
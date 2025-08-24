import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useTheme } from '@/hooks/useTheme';
import { useColorScheme } from 'react-native';

// Mock dependencies
jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('@/lib/storage', () => ({
  prefs: {
    getString: jest.fn(),
    set: jest.fn(),
  },
}));

const mockUseColorScheme = useColorScheme as jest.MockedFunction<typeof useColorScheme>;
const mockPrefs = require('@/lib/storage').prefs;

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
    mockPrefs.getString.mockReturnValue('system');
  });

  it('should initialize with system theme by default', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(result.current.isSystem).toBe(true);
  });

  it('should use dark system theme', () => {
    mockUseColorScheme.mockReturnValue('dark');
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('should load saved theme from storage', () => {
    mockPrefs.getString.mockReturnValue('dark');
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(result.current.isSystem).toBe(false);
  });

  it('should toggle theme correctly', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('light');
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(mockPrefs.set).toHaveBeenCalledWith('theme_mode', 'dark');
  });

  it('should set specific theme mode', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setMode('dark');
    });
    
    expect(result.current.theme).toBe('dark');
    expect(result.current.themeMode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(mockPrefs.set).toHaveBeenCalledWith('theme_mode', 'dark');
  });

  it('should handle system mode', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setMode('system');
    });
    
    expect(result.current.theme).toBe('light'); // Based on mocked useColorScheme
    expect(result.current.themeMode).toBe('system');
    expect(result.current.isSystem).toBe(true);
    expect(mockPrefs.set).toHaveBeenCalledWith('theme_mode', 'system');
  });

  it('should provide theme state flags', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.isLight).toBe(true);
    expect(result.current.isDark).toBe(false);
    expect(result.current.isSystem).toBe(true);
    
    act(() => {
      result.current.setMode('dark');
    });
    
    expect(result.current.isLight).toBe(false);
    expect(result.current.isDark).toBe(true);
    expect(result.current.isSystem).toBe(false);
  });

  it('should handle theme mode persistence', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setMode('dark');
    });
    
    act(() => {
      result.current.setMode('light');
    });
    
    expect(mockPrefs.set).toHaveBeenCalledTimes(2);
    expect(mockPrefs.set).toHaveBeenNthCalledWith(1, 'theme_mode', 'dark');
    expect(mockPrefs.set).toHaveBeenNthCalledWith(2, 'theme_mode', 'light');
  });

  it('should toggle from dark to light', () => {
    mockPrefs.getString.mockReturnValue('dark');
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('dark');
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('light');
    expect(mockPrefs.set).toHaveBeenCalledWith('theme_mode', 'light');
  });
}); 
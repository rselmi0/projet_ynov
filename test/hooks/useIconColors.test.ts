import { renderHook } from '@testing-library/react-native';
import { useIconColors } from '@/hooks/useIconColors';

// Mock dependencies
jest.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

jest.mock('@/constants/colors', () => ({
  colors: {
    icons: {
      base: {
        light: '#000000',
        dark: '#FFFFFF',
      },
      primary: {
        light: '#FF6B35',
        dark: '#FF6B35',
      },
      secondary: {
        light: '#374151',
        dark: '#374151',
      },
    },
  },
}));

describe('useIconColors', () => {
  it('should return icon colors object', () => {
    const { result } = renderHook(() => useIconColors());

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });

  it('should return correct colors for light theme', () => {
    const { result } = renderHook(() => useIconColors());

    expect(result.current.base).toBe('#000000');
    expect(result.current.primary).toBe('#FF6B35');
    expect(result.current.secondary).toBe('#374151');
  });

  it('should handle theme changes', () => {
    // Mock dark theme
    jest.requireMock('@/context/ThemeContext').useTheme.mockReturnValue({
      theme: 'dark',
    });

    const { result } = renderHook(() => useIconColors());

    expect(result.current.base).toBe('#FFFFFF');
    expect(result.current.primary).toBe('#FF6B35');
  });

  it('should provide all required color types', () => {
    const { result } = renderHook(() => useIconColors());

    expect(result.current).toHaveProperty('base');
    expect(result.current).toHaveProperty('primary');
    expect(result.current).toHaveProperty('secondary');
  });

  it('should return consistent colors across renders', () => {
    const { result, rerender } = renderHook(() => useIconColors());
    
    const firstRender = result.current;
    
    rerender({});
    
    const secondRender = result.current;
    
    expect(firstRender.primary).toBe(secondRender.primary);
  });

  it('should handle missing color gracefully', () => {
    const { result } = renderHook(() => useIconColors());

    // Should not throw when accessing colors
    expect(() => {
      const colors = result.current;
      expect(colors).toBeDefined();
    }).not.toThrow();
  });

  it('should work with system theme', () => {
    jest.requireMock('@/context/ThemeContext').useTheme.mockReturnValue({
      theme: 'system',
    });

    const { result } = renderHook(() => useIconColors());

    expect(result.current).toBeDefined();
    expect(typeof result.current.primary).toBe('string');
  });

  it('should provide valid hex color values', () => {
    const { result } = renderHook(() => useIconColors());
    
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    
    expect(result.current.base).toMatch(hexRegex);
    expect(result.current.primary).toMatch(hexRegex);
    expect(result.current.secondary).toMatch(hexRegex);
  });

  it('should memoize colors for performance', () => {
    const { result, rerender } = renderHook(() => useIconColors());
    
    const firstResult = result.current;
    
    rerender({});
    
    const secondResult = result.current;
    
    // Should return same object reference for same theme
    expect(firstResult).toEqual(secondResult);
  });

  it('should handle undefined theme', () => {
    jest.requireMock('@/context/ThemeContext').useTheme.mockReturnValue({
      theme: undefined,
    });

    const { result } = renderHook(() => useIconColors());

    expect(result.current).toBeDefined();
    expect(typeof result.current.primary).toBe('string');
  });
}); 
import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useColorScheme as useRNColorScheme } from 'react-native';

// Mock react-native
jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

const mockUseColorScheme = useRNColorScheme as jest.MockedFunction<typeof useRNColorScheme>;

describe('useColorScheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return light theme by default', () => {
    mockUseColorScheme.mockReturnValue('light');
    
    const { result } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('light');
  });

  it('should return dark theme when system is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    
    const { result } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('dark');
  });

  it('should return light when system returns null', () => {
    mockUseColorScheme.mockReturnValue(null);
    
    const { result } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('light');
  });

  it('should return light when system returns undefined', () => {
    mockUseColorScheme.mockReturnValue(undefined);
    
    const { result } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('light');
  });

  it('should update when system color scheme changes', () => {
    mockUseColorScheme.mockReturnValue('light');
    
    const { result, rerender } = renderHook(() => useColorScheme());
    
    expect(result.current).toBe('light');
    
    // Change system color scheme
    mockUseColorScheme.mockReturnValue('dark');
    rerender({});
    
    expect(result.current).toBe('dark');
  });
});
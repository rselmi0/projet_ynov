import { renderHook, act } from '@testing-library/react-native';
import { useSounds } from '@/hooks/useSounds';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

const mockHaptics = require('expo-haptics');

describe('useSounds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHaptics.impactAsync.mockResolvedValue(undefined);
  });

  it('should provide haptic feedback functions', () => {
    const { result } = renderHook(() => useSounds());
    
    expect(result.current.playClick).toBeDefined();
    expect(result.current.playComplete).toBeDefined();
    expect(result.current.playDelete).toBeDefined();
    expect(typeof result.current.playClick).toBe('function');
    expect(typeof result.current.playComplete).toBe('function');
    expect(typeof result.current.playDelete).toBe('function');
  });

  it('should play click haptic', async () => {
    const { result } = renderHook(() => useSounds());

    await act(async () => {
      await result.current.playClick();
    });

    expect(mockHaptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('should play complete haptic', async () => {
    const { result } = renderHook(() => useSounds());

    await act(async () => {
      await result.current.playComplete();
    });

    expect(mockHaptics.impactAsync).toHaveBeenCalledWith('medium');
  });

  it('should play delete haptic', async () => {
    const { result } = renderHook(() => useSounds());

    await act(async () => {
      await result.current.playDelete();
    });

    expect(mockHaptics.impactAsync).toHaveBeenCalledWith('heavy');
  });

  it('should handle haptic errors gracefully for click', async () => {
    mockHaptics.impactAsync.mockRejectedValue(new Error('Haptic failed'));

    const { result } = renderHook(() => useSounds());

    // Should not throw error, should handle gracefully
    await act(async () => {
      await result.current.playClick();
    });

    expect(mockHaptics.impactAsync).toHaveBeenCalled();
  });

  it('should handle haptic errors gracefully for complete', async () => {
    mockHaptics.impactAsync.mockRejectedValue(new Error('Haptic failed'));

    const { result } = renderHook(() => useSounds());

    await act(async () => {
      await result.current.playComplete();
    });

    expect(mockHaptics.impactAsync).toHaveBeenCalled();
  });

  it('should handle haptic errors gracefully for delete', async () => {
    mockHaptics.impactAsync.mockRejectedValue(new Error('Haptic failed'));

    const { result } = renderHook(() => useSounds());

    await act(async () => {
      await result.current.playDelete();
    });

    expect(mockHaptics.impactAsync).toHaveBeenCalled();
  });

  it('should be memoized and not recreate functions on each render', () => {
    const { result, rerender } = renderHook(() => useSounds());
    
    const firstRenderFunctions = {
      playClick: result.current.playClick,
      playComplete: result.current.playComplete,
      playDelete: result.current.playDelete,
    };

    rerender({});

    expect(result.current.playClick).toBe(firstRenderFunctions.playClick);
    expect(result.current.playComplete).toBe(firstRenderFunctions.playComplete);
    expect(result.current.playDelete).toBe(firstRenderFunctions.playDelete);
  });

  it('should call haptic functions multiple times without interference', async () => {
    const { result } = renderHook(() => useSounds());

    await act(async () => {
      await Promise.all([
        result.current.playClick(),
        result.current.playComplete(),
        result.current.playDelete(),
      ]);
    });

    expect(mockHaptics.impactAsync).toHaveBeenCalledTimes(3);
    expect(mockHaptics.impactAsync).toHaveBeenNthCalledWith(1, 'light');
    expect(mockHaptics.impactAsync).toHaveBeenNthCalledWith(2, 'medium');
    expect(mockHaptics.impactAsync).toHaveBeenNthCalledWith(3, 'heavy');
  });
}); 
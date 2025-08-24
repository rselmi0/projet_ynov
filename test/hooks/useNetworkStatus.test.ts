import { renderHook, act } from '@testing-library/react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => 
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      details: {},
    })
  ),
  addEventListener: jest.fn(() => () => {}),
}));

const mockNetInfo = require('@react-native-community/netinfo');

describe('useNetworkStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      details: {},
    });
  });

  it('should initialize with default network state', () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.isConnected).toBe(true); // Initial state from hook
    expect(result.current.isInternetReachable).toBe(null);
    expect(result.current.type).toBe('unknown');
    expect(result.current.details).toBe(null);
    expect(result.current.refreshNetworkState).toBeDefined();
  });

  it('should fetch initial network state on mount', async () => {
    renderHook(() => useNetworkStatus());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(mockNetInfo.fetch).toHaveBeenCalled();
  });

  it('should refresh network state manually', async () => {
    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {
      const success = await result.current.refreshNetworkState();
      expect(success).toBe(true);
    });

    expect(mockNetInfo.fetch).toHaveBeenCalled();
  });

  it('should handle network disconnection', async () => {
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: false,
      isInternetReachable: false,
      type: 'none',
      details: null,
    });

    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {
      const success = await result.current.refreshNetworkState();
      expect(success).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.isInternetReachable).toBe(false);
    expect(result.current.type).toBe('none');
  });

  it('should handle cellular connection', async () => {
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'cellular',
      details: {
        isConnectionExpensive: true,
        cellularGeneration: '4g',
      },
    });

    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {
      await result.current.refreshNetworkState();
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.type).toBe('cellular');
    expect(result.current.details).toEqual({
      isConnectionExpensive: true,
      cellularGeneration: '4g',
    });
  });

  it('should handle wifi connection', async () => {
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      details: {
        ssid: 'TestNetwork',
        bssid: '00:00:00:00:00:00',
        strength: 4,
        frequency: 2437,
      },
    });

    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {
      await result.current.refreshNetworkState();
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.type).toBe('wifi');
    expect(result.current.details).toEqual({
      ssid: 'TestNetwork',
      bssid: '00:00:00:00:00:00',
      strength: 4,
      frequency: 2437,
    });
  });

  it('should set up network state listener', () => {
    renderHook(() => useNetworkStatus());

    expect(mockNetInfo.addEventListener).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should handle null connection status', async () => {
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: null, // Sometimes null
      isInternetReachable: null,
      type: 'wifi',
      details: {},
    });

    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {
      const success = await result.current.refreshNetworkState();
      expect(success).toBe(false); // null isConnected becomes false
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.isInternetReachable).toBe(null);
  });

  it('should handle network state updates through listener', async () => {
    let networkListener: any;
    mockNetInfo.addEventListener.mockImplementation((callback: any) => {
      networkListener = callback;
      return () => {}; // unsubscribe function
    });

    const { result } = renderHook(() => useNetworkStatus());

    // Simulate network state change
    await act(async () => {
      networkListener({
        isConnected: false,
        isInternetReachable: false,
        type: 'none',
        details: null,
      });
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.type).toBe('none');
  });

  it('should cleanup listener on unmount', () => {
    const unsubscribe = jest.fn();
    mockNetInfo.addEventListener.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useNetworkStatus());

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('should handle undefined network details', async () => {
    mockNetInfo.fetch.mockResolvedValue({
      isConnected: true,
      isInternetReachable: true,
      type: 'wifi',
      details: undefined,
    });

    const { result } = renderHook(() => useNetworkStatus());

    await act(async () => {
      await result.current.refreshNetworkState();
    });

    expect(result.current.details).toBe(undefined);
  });
});
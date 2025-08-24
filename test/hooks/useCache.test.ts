import { renderHook, act } from '@testing-library/react-native';
import { useSimpleCache } from '@/hooks/useCache';

// Mock storage - declare before using
jest.mock('@/lib/storage', () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
  },
}));

const mockCache = {
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn(),
};

describe('useSimpleCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with null', () => {
    const { result } = renderHook(() => useSimpleCache('test-key'));
    
    expect(result.current.data).toBeNull();
    expect(result.current.setData).toBeDefined();
    expect(result.current.clearData).toBeDefined();
  });

  it('should get existing value', () => {
    mockCache.get.mockReturnValue('cached-value');
    
    const { result } = renderHook(() => useSimpleCache('existing-key'));
    
    expect(result.current.data).toBe('cached-value');
    expect(mockCache.get).toHaveBeenCalledWith('existing-key');
  });

  it('should set value', () => {
    const { result } = renderHook(() => useSimpleCache('test-key'));
    
    act(() => {
      result.current.setData('new-value');
    });
    
    expect(mockCache.set).toHaveBeenCalledWith('test-key', 'new-value');
    expect(result.current.data).toBe('new-value');
  });

  it('should clear value', () => {
    const { result } = renderHook(() => useSimpleCache('test-key'));
    
    act(() => {
      result.current.setData('some-value');
    });
    
    act(() => {
      result.current.clearData();
    });
    
    expect(mockCache.remove).toHaveBeenCalledWith('test-key');
    expect(result.current.data).toBeNull();
  });

  it('should work with JSON data', () => {
    const complexData = { name: 'test', value: 123, array: [1, 2, 3] };
    mockCache.get.mockReturnValue(complexData);
    
    const { result } = renderHook(() => useSimpleCache('complex-key'));
    
    expect(result.current.data).toEqual(complexData);
  });

  it('should handle non-existent keys', () => {
    mockCache.get.mockReturnValue(null);
    
    const { result } = renderHook(() => useSimpleCache('non-existent'));
    
    expect(result.current.data).toBeNull();
  });

  it('should handle empty string values', () => {
    const { result } = renderHook(() => useSimpleCache('empty-key'));
    
    act(() => {
      result.current.setData('');
    });
    
    expect(result.current.data).toBe('');
    expect(mockCache.set).toHaveBeenCalledWith('empty-key', '');
  });
}); 
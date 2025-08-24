import { queryClient, restoreQueryCache, persistQueryCache } from '@/lib/queryClient';

// Mock MMKV
const mockMMKV = {
  set: jest.fn(),
  getString: jest.fn(),
  delete: jest.fn(),
  clearAll: jest.fn(),
};

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => mockMMKV),
}));

// Mock the storage module to avoid circular dependency
jest.mock('@/lib/storage', () => ({
  storage: {
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
  },
}));

describe('queryClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a QueryClient instance', () => {
    expect(queryClient).toBeDefined();
    expect(typeof queryClient.getQueryCache).toBe('function');
  });

  it('should have correct default options', () => {
    const defaultOptions = queryClient.getDefaultOptions();
    
    expect(defaultOptions.queries?.staleTime).toBe(1000 * 60 * 5); // 5 minutes
    expect(defaultOptions.queries?.retry).toBe(false);
  });

  describe('persistQueryCache', () => {
    it('should persist cache to MMKV', () => {
      persistQueryCache();
      
      expect(mockMMKV.set).toHaveBeenCalledWith(
        'react-query-cache',
        expect.any(String)
      );
    });

    it('should handle errors when persisting cache', () => {
      mockMMKV.set.mockImplementation(() => {
        throw new Error('MMKV error');
      });
      
      // Should not throw
      expect(() => persistQueryCache()).not.toThrow();
    });
  });

  describe('restoreQueryCache', () => {
    it('should restore cache from MMKV when data exists', () => {
      const mockCacheData = JSON.stringify({
        queries: [],
        mutations: [],
      });
      
      mockMMKV.getString.mockReturnValue(mockCacheData);
      
      restoreQueryCache();
      
      expect(mockMMKV.getString).toHaveBeenCalledWith('react-query-cache');
    });

    it('should handle missing cache data gracefully', () => {
      mockMMKV.getString.mockReturnValue(null);
      
      // Should not throw
      expect(() => restoreQueryCache()).not.toThrow();
    });

    it('should handle corrupted cache data', () => {
      mockMMKV.getString.mockReturnValue('invalid json');
      
      // Should not throw
      expect(() => restoreQueryCache()).not.toThrow();
    });
  });
});
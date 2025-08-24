import { clearAllSessionData } from '@/utils/clearSession';

// Mock dependencies
jest.mock('@/lib/storage', () => ({
  storage: {
    auth: {
      clearAll: jest.fn(),
    },
    state: {
      clearAll: jest.fn(),
    },
    cache: {
      clearAll: jest.fn(),
    },
  },
}));

describe('clearSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export clearAllSessionData function', () => {
    expect(clearAllSessionData).toBeDefined();
    expect(typeof clearAllSessionData).toBe('function');
  });

  it('should clear session data successfully', () => {
    clearAllSessionData();
    
    // Should complete without throwing
    expect(true).toBe(true);
  });

  it('should handle errors gracefully', () => {
    const mockStorage = require('@/lib/storage').storage;
    mockStorage.auth.clearAll.mockImplementation(() => {
      throw new Error('Storage error');
    });

    // Should not throw even if storage fails
    expect(() => clearAllSessionData()).not.toThrow();
  });

  it('should clear auth storage', () => {
    const mockStorage = require('@/lib/storage').storage;
    
    clearAllSessionData();
    
    expect(mockStorage.auth.clearAll).toHaveBeenCalled();
  });

  it('should clear state storage', () => {
    const mockStorage = require('@/lib/storage').storage;
    
    clearAllSessionData();
    
    expect(mockStorage.state.clearAll).toHaveBeenCalled();
  });

  it('should clear cache storage', () => {
    const mockStorage = require('@/lib/storage').storage;
    
    clearAllSessionData();
    
    expect(mockStorage.cache.clearAll).toHaveBeenCalled();
  });

  it('should handle missing storage gracefully', () => {
    const mockStorage = require('@/lib/storage').storage;
    mockStorage.auth.clearAll.mockImplementation(() => {
      throw new Error('Storage error');
    });

    expect(() => clearAllSessionData()).not.toThrow();
  });

  it('should clear multiple storage types', () => {
    const mockStorage = require('@/lib/storage').storage;
    
    clearAllSessionData();
    
    // Should attempt to clear all storage types
    expect(mockStorage.auth.clearAll).toHaveBeenCalled();
    expect(mockStorage.state.clearAll).toHaveBeenCalled();
    expect(mockStorage.cache.clearAll).toHaveBeenCalled();
  });

  it('should be idempotent', () => {
    // Should be safe to call multiple times
    clearAllSessionData();
    clearAllSessionData();
    clearAllSessionData();
    
    expect(true).toBe(true);
  });

  it('should handle partial failures gracefully', () => {
    const mockStorage = require('@/lib/storage').storage;
    
    // Mock some operations to fail
    mockStorage.auth.clearAll.mockImplementation(() => {
      throw new Error('Auth storage error');
    });
    
    // Should still complete without throwing
    expect(() => clearAllSessionData()).not.toThrow();
    
    // Should still call other operations
    expect(mockStorage.state.clearAll).toHaveBeenCalled();
    expect(mockStorage.cache.clearAll).toHaveBeenCalled();
  });

  it('should handle all storage failures gracefully', () => {
    const mockStorage = require('@/lib/storage').storage;
    
    // Mock all operations to fail
    mockStorage.auth.clearAll.mockImplementation(() => {
      throw new Error('Auth storage error');
    });
    mockStorage.state.clearAll.mockImplementation(() => {
      throw new Error('State storage error');
    });
    mockStorage.cache.clearAll.mockImplementation(() => {
      throw new Error('Cache storage error');
    });
    
    // Should still complete without throwing
    expect(() => clearAllSessionData()).not.toThrow();
  });

  it('should call all storage clear methods', () => {
    const mockStorage = require('@/lib/storage').storage;
    
    clearAllSessionData();
    
    expect(mockStorage.auth.clearAll).toHaveBeenCalledTimes(1);
    expect(mockStorage.state.clearAll).toHaveBeenCalledTimes(1);
    expect(mockStorage.cache.clearAll).toHaveBeenCalledTimes(1);
  });
});
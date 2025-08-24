import { zustandStorage } from '@/lib/storage/zustand';

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

describe('zustandStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should store item in MMKV', () => {
      const key = 'test-key';
      const value = JSON.stringify({ data: 'test' });
      
      zustandStorage.setItem(key, value);
      
      expect(mockMMKV.set).toHaveBeenCalledWith(key, value);
    });

    it('should handle errors when setting item', () => {
      mockMMKV.set.mockImplementation(() => {
        throw new Error('MMKV error');
      });
      
      // Should not throw
      expect(() => {
        zustandStorage.setItem('key', 'value');
      }).not.toThrow();
    });
  });

  describe('getItem', () => {
    it('should retrieve item from MMKV', () => {
      const key = 'test-key';
      const value = JSON.stringify({ data: 'test' });
      mockMMKV.getString.mockReturnValue(value);
      
      const result = zustandStorage.getItem(key);
      
      expect(mockMMKV.getString).toHaveBeenCalledWith(key);
      expect(result).toBe(value);
    });

    it('should return null when item does not exist', () => {
      mockMMKV.getString.mockReturnValue(null);
      
      const result = zustandStorage.getItem('nonexistent-key');
      
      expect(result).toBeNull();
    });

    it('should return null when item is undefined', () => {
      mockMMKV.getString.mockReturnValue(undefined);
      
      const result = zustandStorage.getItem('undefined-key');
      
      expect(result).toBeNull();
    });

    it('should handle errors when getting item', () => {
      mockMMKV.getString.mockImplementation(() => {
        throw new Error('MMKV error');
      });
      
      const result = zustandStorage.getItem('error-key');
      
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove item from MMKV', () => {
      const key = 'test-key';
      
      zustandStorage.removeItem(key);
      
      expect(mockMMKV.delete).toHaveBeenCalledWith(key);
    });

    it('should handle errors when removing item', () => {
      mockMMKV.delete.mockImplementation(() => {
        throw new Error('MMKV error');
      });
      
      // Should not throw
      expect(() => {
        zustandStorage.removeItem('error-key');
      }).not.toThrow();
    });
  });

  it('should be compatible with Zustand persist middleware', () => {
    // Test that the storage interface matches what Zustand expects
    expect(typeof zustandStorage.setItem).toBe('function');
    expect(typeof zustandStorage.getItem).toBe('function');
    expect(typeof zustandStorage.removeItem).toBe('function');
  });

  it('should handle complex data structures', () => {
    const complexData = {
      user: { id: 1, name: 'John' },
      settings: { theme: 'dark', notifications: true },
      array: [1, 2, 3, 4, 5],
    };
    const serialized = JSON.stringify(complexData);
    
    zustandStorage.setItem('complex-data', serialized);
    
    expect(mockMMKV.set).toHaveBeenCalledWith('complex-data', serialized);
    
    mockMMKV.getString.mockReturnValue(serialized);
    const retrieved = zustandStorage.getItem('complex-data');
    
    expect(retrieved).toBe(serialized);
    expect(JSON.parse(retrieved)).toEqual(complexData);
  });
});
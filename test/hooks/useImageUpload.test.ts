import { renderHook } from '@testing-library/react-native';
import { useImageUpload } from '@/hooks/useImageUpload';

// Mock dependencies
jest.mock('expo-image-picker', () => ({
  MediaTypeOptions: { Images: 'Images' },
  launchImageLibraryAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
}));

jest.mock('@/config/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  },
}));

describe('useImageUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return image upload functions', () => {
    const { result } = renderHook(() => useImageUpload());
    
    expect(result.current.uploading).toBe(false);
    expect(typeof result.current.uploadImage).toBe('function');
    expect(typeof result.current.deleteImage).toBe('function');
    expect(typeof result.current.pickAndUploadImage).toBe('function');
  });

  it('should handle initial state correctly', () => {
    const { result } = renderHook(() => useImageUpload());
    
    expect(result.current.uploading).toBe(false);
  });
}); 
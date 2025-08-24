import { renderHook } from '@testing-library/react-native';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

// Mock RevenueCat context
jest.mock('@/context/RevenuCatContext', () => ({
  useRevenueCat: jest.fn(() => ({
    user: null,
    isLoading: false,
    products: [],
    purchaseProduct: jest.fn(),
    restorePurchases: jest.fn(),
  })),
}));

const mockRevenueCat = require('@/context/RevenuCatContext').useRevenueCat;

describe('usePremiumStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRevenueCat.mockReturnValue({
      user: null,
      isLoading: false,
      products: [],
      purchaseProduct: jest.fn(),
      restorePurchases: jest.fn(),
    });
  });

  it('should return premium status functions', () => {
    const { result } = renderHook(() => usePremiumStatus());
    
    expect(result.current).toBeDefined();
    expect(typeof result.current.isPremium).toBe('boolean');
    expect(typeof result.current.loading).toBe('boolean');
  });

  it('should handle user without premium', () => {
    mockRevenueCat.mockReturnValue({
      user: { entitlements: { active: {} } },
      isLoading: false,
      products: [],
      purchaseProduct: jest.fn(),
      restorePurchases: jest.fn(),
    });

    const { result } = renderHook(() => usePremiumStatus());
    
    expect(result.current.isPremium).toBe(false);
  });

  it('should handle loading state', () => {
    mockRevenueCat.mockReturnValue({
      user: null,
      isLoading: true,
      products: [],
      purchaseProduct: jest.fn(),
      restorePurchases: jest.fn(),
    });

    const { result } = renderHook(() => usePremiumStatus());
    
    expect(result.current.loading).toBe(true);
  });
}); 
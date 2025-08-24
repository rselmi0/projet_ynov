import { renderHook, act } from '@testing-library/react-native';
import { useNotifications } from '@/hooks/useNotifications';

// Mock Expo Notifications
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'undetermined', canAskAgain: true })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'expo-push-token' })),
  setNotificationChannelAsync: jest.fn(),
  PermissionStatus: {
    UNDETERMINED: 'undetermined',
    GRANTED: 'granted',
    DENIED: 'denied',
  },
  AndroidImportance: {
    MAX: 'max',
  },
}));

// Mock Expo Device
jest.mock('expo-device', () => ({
  isDevice: true,
}));

// Mock Platform
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Platform: {
    OS: 'ios',
    select: jest.fn((options) => options.ios),
  },
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
    openSettings: jest.fn(),
  },
}));

// Mock Constants
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        eas: {
          projectId: 'test-project-id',
        },
      },
    },
  },
}));

// Mock Supabase
jest.mock('@/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    functions: {
      invoke: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    },
  },
}));

// Mock Auth Context
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    session: { user: { id: 'test-user-id', email: 'test@example.com' } },
  })),
}));

// Mock Translation
jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: jest.fn((key) => key),
  })),
}));

// Mock constants
jest.mock('@/constants/notifications', () => ({
  NOTIFICATION_CONSTANTS: {},
}));

jest.mock('@/constants/emailTemplates', () => ({
  EMAIL_TEMPLATES: {
    TEST_EMAIL: jest.fn(() => ({
      subject: 'Test Email',
      html: '<p>Test</p>',
    })),
  },
}));

describe('useNotifications hook', () => {
  const mockNotifications = require('expo-notifications');
  const mockSupabase = require('@/config/supabase').supabase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNotifications.getPermissionsAsync.mockResolvedValue({ 
      status: 'undetermined', 
      canAskAgain: true 
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useNotifications());
    
    expect(result.current.hasPermission).toBe(false);
    expect(result.current.expoPushToken).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.permissionStatus.granted).toBe(false);
  });

  it('should request notification permissions', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({ 
      status: 'undetermined', 
      canAskAgain: true 
    });
    mockNotifications.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockNotifications.getExpoPushTokenAsync.mockResolvedValue({ 
      data: 'ExponentPushToken[test-token]' 
    });

    const { result } = renderHook(() => useNotifications());
    
    await act(async () => {
      await result.current.requestPermissions();
    });

    expect(mockNotifications.requestPermissionsAsync).toHaveBeenCalled();
  });

  it('should handle permission denial', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({ 
      status: 'denied', 
      canAskAgain: false 
    });
    mockNotifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const { result } = renderHook(() => useNotifications());
    
    await act(async () => {
      await result.current.requestPermissions();
    });

    expect(result.current.hasPermission).toBe(false);
  });

  it('should send local test notification', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({ 
      status: 'granted', 
      canAskAgain: true 
    });
    mockNotifications.scheduleNotificationAsync.mockResolvedValue('notification-1');

    const { result } = renderHook(() => useNotifications());
    
    // Set permission status to granted first
    await act(async () => {
      await result.current.checkPermissions();
    });

    await act(async () => {
      await result.current.sendLocalTest();
    });

    expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('should send remote test notification', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({ 
      status: 'granted', 
      canAskAgain: true 
    });
    mockNotifications.getExpoPushTokenAsync.mockResolvedValue({ 
      data: 'ExponentPushToken[test-token]' 
    });
    mockSupabase.functions.invoke.mockResolvedValue({ data: {}, error: null });

    const { result } = renderHook(() => useNotifications());
    
    // Set up the hook state
    await act(async () => {
      await result.current.requestPermissions();
    });

    await act(async () => {
      await result.current.sendRemoteTest();
    });

    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('send-notifications', {
      body: {
        title: 'Test Push Notification',
        body: 'This is a test notification from the server',
      },
    });
  });

  it('should send email test', async () => {
    mockSupabase.functions.invoke.mockResolvedValue({ data: {}, error: null });

    const { result } = renderHook(() => useNotifications());
    
    await act(async () => {
      await result.current.sendEmailTest();
    });

    expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('resend-email', 
      expect.objectContaining({
        body: expect.objectContaining({
          to: 'test@example.com',
        }),
      })
    );
  });

  it('should update notification settings', async () => {
    mockSupabase.from().update().eq.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useNotifications());
    
    await act(async () => {
      await result.current.updateSettings({ pushEnabled: true });
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('users');
  });

  it('should check system permissions', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({ 
      status: 'granted', 
      canAskAgain: true 
    });

    const { result } = renderHook(() => useNotifications());
    
    let permissionResult;
    await act(async () => {
      permissionResult = await result.current.checkSystemPermissions();
    });

    expect(permissionResult).toBe(true);
  });

  it('should handle blocked permissions', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValue({ 
      status: 'denied', 
      canAskAgain: false 
    });

    const { result } = renderHook(() => useNotifications());
    
    let isBlocked;
    await act(async () => {
      isBlocked = await result.current.arePermissionsBlocked();
    });

    expect(isBlocked).toBe(true);
  });
});
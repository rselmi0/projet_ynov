import 'react-native-gesture-handler/jestSetup';

// Mock react-native modules
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo modules
jest.mock('expo-font');
jest.mock('expo-asset');
jest.mock('expo-constants', () => ({
  default: {
    manifest: {},
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  })),
}));

// Mock NativeWind
jest.mock('nativewind', () => ({
  useColorScheme: jest.fn(() => ({
    colorScheme: 'light',
    setColorScheme: jest.fn(),
    toggleColorScheme: jest.fn(),
  })),
  vars: jest.fn((styles) => styles),
}));

// Mock ThemeContext
jest.mock('@/context/ThemeContext', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    isDark: false,
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  })),
  ThemeProvider: ({ children }) => children,
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  User: 'User',
  Camera: 'Camera',
  ChevronRight: 'ChevronRight',
  Settings: 'Settings',
  Bell: 'Bell',
  Home: 'Home',
  CheckSquare: 'CheckSquare',
  Shield: 'Shield',
  CreditCard: 'CreditCard',
  Bot: 'Bot',
  LogOut: 'LogOut',
  Play: 'Play',
}));

// Mock react-native-url-polyfill
jest.mock('react-native-url-polyfill/auto', () => {});

// Mock expo-device
jest.mock('expo-device', () => ({
  isDevice: true,
  brand: 'Apple',
  manufacturer: 'Apple Inc.',
  modelName: 'iPhone 14 Pro',
  modelId: 'iPhone14,3',
  deviceName: 'iPhone',
  deviceType: 2,
  osName: 'iOS',
  osVersion: '17.0',
  platformApiLevel: null,
  deviceYearClass: 2022,
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
  QueryClient: jest.fn(() => ({
    getQueryCache: jest.fn(),
    getDefaultOptions: jest.fn(() => ({
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: false,
      },
    })),
  })),
  QueryClientProvider: ({ children }) => children,
}));

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(),
  Stack: ({ children }) => children,
  Tabs: ({ children }) => children,
}));

// Mock React Native elements
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((options) => options.ios),
  },
  Appearance: {
    getColorScheme: jest.fn(() => 'light'),
    addChangeListener: jest.fn(),
    removeChangeListener: jest.fn(),
  },
  TouchableOpacity: 'TouchableOpacity',
  View: 'View',
  Text: 'Text',
  ScrollView: 'ScrollView',
  ActivityIndicator: 'ActivityIndicator',
  TextInput: 'TextInput',
  Pressable: 'Pressable',
  Image: 'Image',
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn(),
  },
  Animated: {
    View: 'Animated.View',
    Text: 'Animated.Text',
    Value: jest.fn(),
    timing: jest.fn(),
    sequence: jest.fn(),
    parallel: jest.fn(),
    loop: jest.fn(),
    delay: jest.fn(),
  },
  Easing: {
    linear: jest.fn(),
    ease: jest.fn(),
    quad: jest.fn(),
    cubic: jest.fn(),
  },
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
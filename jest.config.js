module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/test/setup.js'],
  testMatch: [
    '<rootDir>/test/hooks/useCache.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/test/hooks/useColorScheme.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/test/hooks/useIconColors.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/test/hooks/useNetworkStatus.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/test/hooks/useSounds.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/test/hooks/useTheme.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/test/hooks/useTranslation.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/test/hooks/useAIChat.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/test/hooks/useProfile.(test|spec).(js|jsx|ts|tsx)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
        useESM: false,
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(expo|@expo|react-native|@react-native|@react-navigation|@react-native-community|@supabase|expo-router|lucide-react-native|nativewind|@testing-library|class-variance-authority|clsx|tailwind-merge|@rn-primitives|react-native-css-interop)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'hooks/useCache.ts',
    'hooks/useColorScheme.ts',
    'hooks/useIconColors.ts',
    'hooks/useNetworkStatus.ts',
    'hooks/useSounds.ts',
    'hooks/useTheme.tsx',
    'hooks/useTranslation.ts',
    'hooks/useAIChat.ts',
    'hooks/useProfile.ts',
    // Excluded files with 0% coverage for prettier report:
    // 'hooks/useImageUpload.ts',
    // 'hooks/useNotifications.ts',
    // 'hooks/useOnboarding.ts',
    // 'hooks/usePremiumStatus.ts',
    // 'hooks/useTasks.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/test/**',
    '!**/coverage/**',
  ],
  coverageDirectory: 'test/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
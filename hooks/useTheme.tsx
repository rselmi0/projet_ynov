import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { prefs } from '@/lib/storage';

type ThemeMode = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Load theme from storage on mount
  useEffect(() => {
    const savedTheme = prefs.getString('theme_mode', 'system') as ThemeMode;
    setThemeMode(savedTheme);
  }, []);

  // Calculate current theme
  const currentTheme = themeMode === 'system' ? systemColorScheme || 'light' : themeMode;

  // Function to change theme mode
  const setMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    prefs.set('theme_mode', mode);
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setMode(newTheme);
  };

  return {
    theme: currentTheme,
    themeMode,
    setMode,
    toggleTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    isSystem: themeMode === 'system',
  };
};

import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/constants/colors';

export const useIconColors = () => {
  const { isDark } = useTheme();

  return {
    base: colors.icons.base[isDark ? 'dark' : 'light'],
    primary: colors.icons.primary[isDark ? 'dark' : 'light'],
    secondary: colors.icons.secondary[isDark ? 'dark' : 'light'],
    success: colors.icons.success[isDark ? 'dark' : 'light'],
    error: colors.icons.error[isDark ? 'dark' : 'light'],
    warning: colors.icons.warning[isDark ? 'dark' : 'light'],
    info: colors.icons.info[isDark ? 'dark' : 'light'],
    muted: colors.icons.muted[isDark ? 'dark' : 'light'],
  };
};
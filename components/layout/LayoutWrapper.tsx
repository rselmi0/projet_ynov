import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

interface LayoutWrapperProps {
  children: React.ReactNode;
  showStatusBar?: boolean;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  showStatusBar = true 
}) => {
  const { isDark, themeVars } = useTheme();

  return (
    <View style={[{ flex: 1 }, themeVars]}>
      {showStatusBar && (
        <StatusBar style={isDark ? 'light' : 'dark'} />
      )}
      {children}
    </View>
  );
}; 
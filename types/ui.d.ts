import React from 'react';

// Sidebar context types
export interface SidebarContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
}

// Component props types
export interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

// Modal types
export interface ModalProps extends ComponentProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
}

// Button types
export interface ButtonProps extends ComponentProps {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Input types
export interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  className?: string;
  disabled?: boolean;
}

// Text types
export interface TextProps extends ComponentProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
  color?: 'primary' | 'secondary' | 'muted' | 'destructive';
} 
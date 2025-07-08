import React from 'react';

// Base interface for settings row properties
export interface SettingsRowProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}

// Interface for settings sections
export interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
  footer?: string;
}

// Interface for profile section
export interface ProfileSectionProps {
  profile: any;
  displayName: string;
  isProfileComplete: boolean;
}

// Interface for subscription section
export interface SubscriptionSectionProps {
  isPaidUser: boolean;
  isPremiumUser: boolean;
  isPremiumFromRC: boolean;
}

// Interface for notifications section
export interface NotificationsSectionProps {
  settings: any;
  updateSettings: (settings: any) => void;
  notificationsLoading: boolean;
}

// Interface for preferences section
export interface PreferencesSectionProps {
  currentLanguage: string;
  isDark: boolean;
  themeMode: 'light' | 'dark' | 'system';
  changeLanguage: (lang: string) => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Interface for assistance section
export interface AssistanceSectionProps {
  profile: any;
  isPremiumFromRC: boolean;
  session: any;
} 
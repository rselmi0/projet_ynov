import React, { useCallback } from 'react';
import { View, Alert, ActionSheetIOS, Platform } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useIconColors } from '@/hooks/useIconColors';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingsRow } from '@/components/settings/SettingsRow';
import * as Icons from 'lucide-react-native';
import { PreferencesSectionProps } from '@/types/settings';

export const PreferencesSection = React.memo(function PreferencesSection({
  currentLanguage,
  isDark,
  themeMode,
  changeLanguage,
  setTheme,
}: PreferencesSectionProps) {
  const { t } = useTranslation();
  const iconColors = useIconColors();

  // Available languages configuration
  const availableLanguages = [
    { code: 'en', name: t('settings.preferences.languageEnglish'), flag: '🇺🇸' },
    { code: 'fr', name: t('settings.preferences.languageFrench'), flag: '🇫🇷' },
    { code: 'pt', name: t('settings.preferences.languagePortuguese'), flag: '🇵🇹' },
    { code: 'es', name: t('settings.preferences.languageSpanish'), flag: '🇪🇸' },
  ];

  const handleLanguagePress = useCallback(() => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            ...availableLanguages.map(lang => `${lang.flag} ${lang.name}`),
            t('common.cancel')
          ],
          cancelButtonIndex: availableLanguages.length,
          title: t('settings.preferences.selectLanguage'),
        },
        (buttonIndex) => {
          if (buttonIndex < availableLanguages.length) {
            changeLanguage(availableLanguages[buttonIndex].code);
          }
        }
      );
    } else {
      // Fallback for Android
      Alert.alert(
        t('settings.preferences.selectLanguage'),
        '',
        [
          ...availableLanguages.map(lang => ({
            text: `${lang.flag} ${lang.name}`,
            onPress: () => changeLanguage(lang.code)
          })),
          { text: t('common.cancel'), style: 'cancel' },
        ]
      );
    }
  }, [changeLanguage, t, availableLanguages]);

  const handleThemePress = useCallback(() => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            t('settings.preferences.themeLight'),
            t('settings.preferences.themeDark'), 
            t('settings.preferences.themeSystem'),
            t('common.cancel')
          ],
          cancelButtonIndex: 3,
          title: t('settings.preferences.selectTheme'),
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              setTheme('light');
              break;
            case 1:
              setTheme('dark');
              break;
            case 2:
              setTheme('system');
              break;
          }
        }
      );
    } else {
      // Fallback for Android
      Alert.alert(
        t('settings.preferences.selectTheme'),
        '',
        [
          { text: t('settings.preferences.themeLight'), onPress: () => setTheme('light') },
          { text: t('settings.preferences.themeDark'), onPress: () => setTheme('dark') },
          { text: t('settings.preferences.themeSystem'), onPress: () => setTheme('system') },
          { text: t('common.cancel'), style: 'cancel' },
        ]
      );
    }
  }, [setTheme, t]);

  const getThemeDisplayName = () => {
    switch (themeMode) {
      case 'light':
        return t('settings.preferences.themeLight');
      case 'dark':
        return t('settings.preferences.themeDark');
      case 'system':
        return t('settings.preferences.themeSystem');
      default:
        return t('settings.preferences.themeSystem');
    }
  };

  const getThemeIcon = () => {
    if (themeMode === 'system') {
      return <Icons.Smartphone color={iconColors.secondary} size={20} />;
    }
    return isDark ? 
      <Icons.Moon color={iconColors.secondary} size={20} /> : 
      <Icons.Sun color={iconColors.secondary} size={20} />;
  };

  const getLanguageDisplayName = () => {
    const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);
    return currentLang ? `${currentLang.flag} ${currentLang.name}` : `🇺🇸 ${t('settings.preferences.languageEnglish')}`;
  };

  return (
    <SettingsSection
      title={t('settings.preferences.title')}
      footer={t('settings.preferences.footer')}>
      <SettingsRow
        icon={<Icons.Languages color={iconColors.secondary} size={20} />}
        title={t('settings.preferences.language')}
        value={getLanguageDisplayName()}
        onPress={handleLanguagePress}
        showChevron
      />
      <View className="ml-11 h-px bg-border" />
      <SettingsRow
        icon={getThemeIcon()}
        title={t('settings.preferences.theme')}
        value={getThemeDisplayName()}
        onPress={handleThemePress}
        showChevron
      />
    </SettingsSection>
  );
});

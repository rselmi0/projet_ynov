import React, { useCallback } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SettingsSection } from './SettingsSection';
import { SettingsRow } from './SettingsRow';
import * as Icons from 'lucide-react-native';
import { AssistanceSectionProps } from '@/types/settings';
import { useIconColors } from '@/hooks/useIconColors';

export const AssistanceSection = React.memo(function AssistanceSection({
  profile,
  isPremiumFromRC,
  session,
}: AssistanceSectionProps) {
  const router = useRouter();
  const iconColors = useIconColors();

  const handleReportProblem = useCallback(async () => {
    try {
      const deviceInfo = `
📱 Device Information:
• Platform: ${Platform.OS} ${Platform.Version}
• User: ${profile?.email || 'N/A'}
• App Version: 1.0.0
• Premium: ${isPremiumFromRC ? 'Yes' : 'No'}
• Session ID: ${session?.user?.id || 'N/A'}
      `.trim();

      const subject = '🚨 Problem Report - App';
      const body = `Hello,

I'm experiencing an issue with the application:

[Please describe your problem here]

---
${deviceInfo}
`;

      const url = `mailto:support@yourapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Email Configuration',
          'Please configure an email client on your device to report issues.',
          [
            { text: 'OK' },
            {
              text: 'Copy Email',
              onPress: () => {
                // On mobile, we can show the email address
                Alert.alert('Support Email', 'support@yourapp.com');
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open email client.');
    }
  }, [profile?.email, isPremiumFromRC, session?.user?.id]);

  return (
    <SettingsSection title="Assistance" footer="Access to legal information and support">
      <SettingsRow
        icon={<Icons.FileText color={iconColors.secondary} size={20} />}
        title="Terms of Service"
        subtitle="Review our terms"
        showChevron
        onPress={() => router.push('/(protected)/terms-of-service')}
      />
      <SettingsRow
        icon={<Icons.Shield color={iconColors.secondary} size={20} />}
        title="Privacy Policy"
        subtitle="Data protection information"
        showChevron
        onPress={() => router.push('/(protected)/privacy-policy')}
      />
      <SettingsRow
        icon={<Icons.AlertCircle color={iconColors.warning} size={20} />}
        title="Report a Problem"
        subtitle="Contact our support team"
        showChevron
        onPress={handleReportProblem}
      />
    </SettingsSection>
  );
});

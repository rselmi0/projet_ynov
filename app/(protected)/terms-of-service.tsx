import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../components/ui/text';
import { HeaderTitle } from '../../components/ui/header-title';
import { useSidebar } from '../../context/SidebarContext';
import { ArrowLeft } from 'lucide-react-native';
import { useIconColors } from '../../hooks/useIconColors';
import { useTranslation } from '../../hooks/useTranslation';

export default function TermsOfServicePage() {
  const router = useRouter();
  const { openSidebar } = useSidebar();
  const iconColors = useIconColors();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background">
      {/* Page header with title and subtitle */}
      <HeaderTitle
        title={t('legal.termsOfService.title')}
        subtitle={t('legal.termsOfService.subtitle')}
        onMenuPress={openSidebar}
      />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Back button placed below header */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-6 mt-4 flex-row items-center"
          activeOpacity={0.7}>
          <ArrowLeft size={20} color={iconColors.primary} strokeWidth={2.5} />
          <Text className="ml-2 text-primary" style={{ fontSize: 16, fontWeight: '500' }}>
            {t('common.back')}
          </Text>
        </TouchableOpacity>

        {/* Introduction section with document header and last updated date */}
        <View className="mb-8 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 20, fontWeight: 'bold' }}>
            📋 {t('legal.termsOfService.header')}
          </Text>
          <Text className="text-muted-foreground" style={{ fontSize: 15, lineHeight: 22 }}>
            {t('legal.lastUpdated')}: {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Section 1: Terms acceptance and agreement */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            1. {t('legal.termsOfService.sections.acceptance.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.termsOfService.sections.acceptance.content')}
          </Text>
        </View>

        {/* Section 2: Service description and features */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            2. {t('legal.termsOfService.sections.serviceDescription.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.termsOfService.sections.serviceDescription.content')}
          </Text>
        </View>

        {/* Section 3: User accounts and responsibilities */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            3. {t('legal.termsOfService.sections.userAccounts.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.termsOfService.sections.userAccounts.content')}
          </Text>
        </View>

        {/* Section 4: Premium subscriptions and billing */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            4. {t('legal.termsOfService.sections.premiumSubscriptions.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.termsOfService.sections.premiumSubscriptions.content')}
          </Text>
        </View>

        {/* Section 5: Acceptable use policy and restrictions */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            5. {t('legal.termsOfService.sections.acceptableUse.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.termsOfService.sections.acceptableUse.content')}
          </Text>
        </View>

        {/* Section 6: Intellectual property rights and licenses */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            6. {t('legal.termsOfService.sections.intellectualProperty.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.termsOfService.sections.intellectualProperty.content')}
          </Text>
        </View>

        {/* Section 7: Limitation of liability and disclaimers */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            7. {t('legal.termsOfService.sections.limitationOfLiability.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.termsOfService.sections.limitationOfLiability.content')}
          </Text>
        </View>

        {/* Section 8: Terms modifications and updates */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            8. {t('legal.termsOfService.sections.modifications.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.termsOfService.sections.modifications.content')}
          </Text>
        </View>

        {/* Section 9: Contact information for support and inquiries */}
        <View className="mb-8 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            9. {t('legal.contact.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.contact.content')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
} 
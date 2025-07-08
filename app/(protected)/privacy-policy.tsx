import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../components/ui/text';
import { HeaderTitle } from '../../components/ui/header-title';
import { useSidebar } from '../../context/SidebarContext';
import { ArrowLeft } from 'lucide-react-native';
import { useIconColors } from '../../hooks/useIconColors';
import { useTranslation } from '../../hooks/useTranslation';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const { openSidebar } = useSidebar();
  const iconColors = useIconColors();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background">
      {/* Page header with title and subtitle */}
      <HeaderTitle
        title={t('legal.privacyPolicy.title')}
        subtitle={t('legal.privacyPolicy.subtitle')}
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

        {/* Introduction section with privacy policy overview */}
        <View className="mb-8 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 20, fontWeight: 'bold' }}>
            🔒 {t('legal.privacyPolicy.header')}
          </Text>
          <Text className="text-muted-foreground" style={{ fontSize: 15, lineHeight: 22 }}>
            {t('legal.lastUpdated')}: {new Date().toLocaleDateString()}
          </Text>
          <Text className="mt-4 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.privacyPolicy.introduction')}
          </Text>
        </View>

        {/* Section 1: Personal data collection and types */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            1. {t('legal.privacyPolicy.sections.dataCollection.title')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.dataCollection.accountInfo')}:</Text> {t('legal.privacyPolicy.sections.dataCollection.accountInfoDetails')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.dataCollection.usageData')}:</Text> {t('legal.privacyPolicy.sections.dataCollection.usageDataDetails')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.dataCollection.technicalData')}:</Text> {t('legal.privacyPolicy.sections.dataCollection.technicalDataDetails')}
          </Text>
        </View>

        {/* Section 2: How we use your data and processing purposes */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            2. {t('legal.privacyPolicy.sections.dataUsage.title')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.dataUsage.improve')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.dataUsage.personalize')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.dataUsage.payments')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.dataUsage.support')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.dataUsage.security')}
          </Text>
        </View>

        {/* Section 3: Data sharing practices and third parties */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            3. {t('legal.privacyPolicy.sections.dataSharing.title')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.privacyPolicy.sections.dataSharing.intro')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.dataSharing.consent')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.dataSharing.serviceProviders')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.dataSharing.legal')}
          </Text>
        </View>

        {/* Section 4: Data security measures and protection */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            4. {t('legal.privacyPolicy.sections.dataSecurity.title')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.dataSecurity.storage')}:</Text> {t('legal.privacyPolicy.sections.dataSecurity.storageDetails')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.dataSecurity.encryption')}:</Text> {t('legal.privacyPolicy.sections.dataSecurity.encryptionDetails')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.dataSecurity.access')}:</Text> {t('legal.privacyPolicy.sections.dataSecurity.accessDetails')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.dataSecurity.location')}:</Text> {t('legal.privacyPolicy.sections.dataSecurity.locationDetails')}
          </Text>
        </View>

        {/* Section 5: GDPR rights and user data control */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            5. {t('legal.privacyPolicy.sections.gdprRights.title')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.privacyPolicy.sections.gdprRights.intro')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.gdprRights.access')}:</Text> {t('legal.privacyPolicy.sections.gdprRights.accessDetails')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.gdprRights.rectification')}:</Text> {t('legal.privacyPolicy.sections.gdprRights.rectificationDetails')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.gdprRights.deletion')}:</Text> {t('legal.privacyPolicy.sections.gdprRights.deletionDetails')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.gdprRights.portability')}:</Text> {t('legal.privacyPolicy.sections.gdprRights.portabilityDetails')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • <Text style={{ fontWeight: '600' }}>{t('legal.privacyPolicy.sections.gdprRights.objection')}:</Text> {t('legal.privacyPolicy.sections.gdprRights.objectionDetails')}
          </Text>
        </View>

        {/* Section 6: Cookies and tracking technologies */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            6. {t('legal.privacyPolicy.sections.cookies.title')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.privacyPolicy.sections.cookies.intro')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.cookies.preferences')}
          </Text>
          <Text className="mb-3 text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.cookies.session')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            • {t('legal.privacyPolicy.sections.cookies.performance')}
          </Text>
        </View>

        {/* Section 7: Data retention policies and timelines */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            7. {t('legal.privacyPolicy.sections.dataRetention.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.privacyPolicy.sections.dataRetention.content')}
          </Text>
        </View>

        {/* Section 8: Policy updates and notifications */}
        <View className="mb-6 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            8. {t('legal.privacyPolicy.sections.policyUpdates.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.privacyPolicy.sections.policyUpdates.content')}
          </Text>
        </View>

        {/* Section 9: Contact information for privacy inquiries */}
        <View className="mb-8 rounded-2xl bg-card p-6">
          <Text className="mb-4 text-foreground" style={{ fontSize: 18, fontWeight: '600' }}>
            9. {t('legal.contact.title')}
          </Text>
          <Text className="text-foreground" style={{ fontSize: 15, lineHeight: 24 }}>
            {t('legal.privacyPolicy.contact')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
} 
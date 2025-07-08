import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { usePremiumStatus } from '../../hooks/usePremiumStatus';
import { useRevenueCat } from '../../context/RevenuCatContext';
import { PremiumStatus } from './PremiumStatus';
import { RestorePurchaseButton } from './RestorePurchaseButton';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '../ui/text';
import * as Icons from 'lucide-react-native';


interface PaywallScreenProps {
  onClose?: () => void;
  onUpgrade?: () => void;
}

export const PaywallScreen = ({ onClose, onUpgrade }: PaywallScreenProps) => {
  const { isPremium, loading, customerInfo } = usePremiumStatus();
  const { isPro } = useRevenueCat();
  const iconColors  = useIconColors();

  const features = [
    {
      icon: <Icons.Zap className="text-yellow-500" size={24} />,
      title: 'Fonctionnalités illimitées',
      description: 'Accès à toutes les fonctionnalités premium',
    },
    {
      icon: <Icons.Shield className="text-green-500" size={24} />,
      title: 'Support prioritaire',
      description: 'Assistance rapide et personnalisée',
    },
    {
      icon: <Icons.Cloud className="text-blue-500" size={24} />,
      title: 'Synchronisation cloud',
      description: 'Vos données synchronisées sur tous vos appareils',
    },
    {
      icon: <Icons.Star className="text-purple-500" size={24} />,
      title: 'Contenu exclusif',
      description: 'Accès aux fonctionnalités avancées',
    },
  ];

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Vérification du statut...</Text>
      </View>
    );
  }

  if (isPremium) {
    return (
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1" style={{ padding: 24 }}>
          {/* Header */}
          <View className="items-center" style={{ marginBottom: 32 }}>
            <View
              className="mb-6 items-center justify-center rounded-3xl bg-green-500/10"
              style={{ width: 80, height: 80 }}>
              <Icons.Crown size={40} color={iconColors.success} />
            </View>
            <Text
              className="mb-2 text-center text-foreground"
              style={{ fontSize: 24, fontWeight: 'bold' }}>
              Vous êtes Premium ! 👑
            </Text>
            <Text className="text-center text-muted-foreground">
              Profitez de toutes les fonctionnalités premium
            </Text>
          </View>

          {/* Status détaillé */}
          <PremiumStatus />

          {/* Bouton fermer */}
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              className="items-center justify-center rounded-lg border border-border bg-secondary"
              style={{
                minHeight: 50,
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginTop: 24,
              }}>
              <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '500' }}>
                Fermer
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-gradient-to-br from-primary to-purple-600 px-6 pb-12 pt-16">
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              className="absolute right-6 top-16 z-10"
              style={{ padding: 8 }}>
              <Icons.X size={24} color="white" />
            </TouchableOpacity>
          )}

          <View className="items-center" style={{ marginTop: 32 }}>
            <View
              className="mb-6 items-center justify-center rounded-3xl bg-white/20"
              style={{ width: 96, height: 96 }}>
              <Icons.Crown size={48} color="white" />
            </View>
            <Text
              className="mb-3 text-center text-white"
              style={{ fontSize: 32, fontWeight: 'bold' }}>
              Passez Premium
            </Text>
            <Text className="text-center text-blue-100" style={{ fontSize: 18, lineHeight: 24 }}>
              Débloquez toutes les fonctionnalités et profitez d&apos;une expérience complète
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={{ padding: 24 }}>
          <Text className="mb-6 text-foreground" style={{ fontSize: 20, fontWeight: 'bold' }}>
            Ce que vous obtenez :
          </Text>

          <View style={{ gap: 16, marginBottom: 32 }}>
            {features.map((feature, index) => (
              <View key={index} className="flex-row items-start">
                <View style={{ marginRight: 16, marginTop: 4 }}>{feature.icon}</View>
                <View className="flex-1">
                  <Text
                    className="mb-1 text-foreground"
                    style={{ fontSize: 16, fontWeight: '600' }}>
                    {feature.title}
                  </Text>
                  <Text className="text-muted-foreground" style={{ fontSize: 14, lineHeight: 20 }}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Prix et boutons */}
          <View
            className="rounded-2xl border border-border bg-card"
            style={{ padding: 24, marginBottom: 24 }}>
            <View className="items-center" style={{ marginBottom: 16 }}>
              <Text className="text-foreground" style={{ fontSize: 32, fontWeight: 'bold' }}>
                49,99€
              </Text>
              <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
                /an - Facturé annuellement
              </Text>
            </View>

            <TouchableOpacity
              onPress={onUpgrade}
              className="mb-4 items-center justify-center rounded-lg bg-primary"
              style={{
                minHeight: 50,
                paddingVertical: 12,
                paddingHorizontal: 16,
              }}>
              <Text className="text-white" style={{ fontSize: 18, fontWeight: '600' }}>
                Commencer l&apos;essai gratuit
              </Text>
            </TouchableOpacity>

            <Text
              className="mb-4 text-center text-muted-foreground"
              style={{ fontSize: 12, lineHeight: 16 }}>
              7 jours d&apos;essai gratuit, puis 49,99€/an
            </Text>
          </View>

          {/* Restore Purchase */}
          <View style={{ marginBottom: 24 }}>
            <RestorePurchaseButton
              variant="outline"
              onSuccess={() => {
                console.log('Purchases restored successfully');
              }}
            />
          </View>

          {/* Statut debug en développement */}
          {__DEV__ && (
            <View className="rounded-lg border border-border bg-card" style={{ padding: 16 }}>
              <Text className="mb-2 text-foreground" style={{ fontSize: 14, fontWeight: '500' }}>
                🐛 Debug Info
              </Text>
              <Text className="text-muted-foreground" style={{ fontSize: 12, lineHeight: 16 }}>
                isPremium: {isPremium ? 'Oui' : 'Non'}
                {'\n'}
                isPro (context): {isPro ? 'Oui' : 'Non'}
                {'\n'}
                customerInfo: {customerInfo ? 'Disponible' : 'Non disponible'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

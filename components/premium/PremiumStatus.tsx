import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { usePremiumStatus } from '../../hooks/usePremiumStatus';
import { useRevenueCat } from '../../context/RevenuCatContext';

export const PremiumStatus = () => {
  const { isPremium, loading, error, customerInfo, refetch } = usePremiumStatus();
  const { isPro } = useRevenueCat();

  const handleRefresh = async () => {
    try {
      await refetch();
      Alert.alert('✅ Succès', 'Statut premium actualisé');
    } catch (err) {
      Alert.alert('❌ Erreur', 'Impossible d&apos;actualiser le statut');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-600">Vérification du statut premium...</Text>
      </View>
    );
  }

  return (
    <View className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <Text className="mb-4 text-lg font-bold">🎯 Statut Premium</Text>

      {/* Statut principal */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-medium">Statut actuel :</Text>
          <View className={`rounded-full px-3 py-1 ${isPremium ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Text className={`font-medium ${isPremium ? 'text-green-800' : 'text-gray-600'}`}>
              {isPremium ? '✅ Premium' : '❌ Gratuit'}
            </Text>
          </View>
        </View>

        <Text className="mt-1 text-sm text-gray-500">
          Context: {isPro ? '✅ Pro' : '❌ Non Pro'}
        </Text>
      </View>

      {/* Informations détaillées */}
      {customerInfo && (
        <View className="mb-4 space-y-2">
          <Text className="font-medium text-gray-700">Détails de l&apos;abonnement :</Text>

          <View className="rounded-lg bg-gray-50 p-3">
            <Text className="text-sm">
              <Text className="font-medium">ID RevenueCat :</Text> {customerInfo.originalAppUserId}
            </Text>

            <Text className="mt-1 text-sm">
              <Text className="font-medium">Expiration :</Text>{' '}
              {formatDate(customerInfo.latestExpirationDate)}
            </Text>

            <Text className="mt-1 text-sm">
              <Text className="font-medium">Abonnements actifs :</Text>{' '}
              {customerInfo.activeSubscriptions.join(', ') || 'Aucun'}
            </Text>

            <Text className="mt-1 text-sm">
              <Text className="font-medium">Entitlements actifs :</Text>{' '}
              {Object.keys(customerInfo.entitlements.active).join(', ') || 'Aucun'}
            </Text>
          </View>
        </View>
      )}

      {/* Erreur */}
      {error && (
        <View className="mb-4 rounded-lg bg-red-50 p-3">
          <Text className="font-medium text-red-800">❌ Erreur</Text>
          <Text className="mt-1 text-sm text-red-600">{error}</Text>
        </View>
      )}

      {/* Bouton refresh */}
      <TouchableOpacity
        onPress={handleRefresh}
        className="rounded-lg bg-blue-500 px-4 py-3"
        disabled={loading}>
        <Text className="text-center font-medium text-white">🔄 Actualiser le statut</Text>
      </TouchableOpacity>

      {/* Informations de debug */}
      {__DEV__ && customerInfo && (
        <View className="mt-4 rounded-lg bg-yellow-50 p-3">
          <Text className="mb-2 font-medium text-yellow-800">🐛 Debug Info</Text>
          <Text className="text-xs text-yellow-700">
            {JSON.stringify(
              {
                isPremium,
                isPro,
                activeSubscriptions: customerInfo.activeSubscriptions,
                entitlements: Object.keys(customerInfo.entitlements.active),
              },
              null,
              2
            )}
          </Text>
        </View>
      )}
    </View>
  );
};

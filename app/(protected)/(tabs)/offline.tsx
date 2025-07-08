import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useOfflineStore } from '@/stores/offlineStore';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useTranslation } from '@/hooks/useTranslation';
import { debug, cache } from '@/lib/storage';
import { Text } from '@/components/ui/text';

export default function OfflinePage() {
  const { tasks, getTasksToSync } = useOfflineStore();
  const { isConnected } = useNetworkStatus();
  const { t } = useTranslation();
  const [storageInfo, setStorageInfo] = useState(debug.getSize());

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = () => {
    setStorageInfo(debug.getSize());
  };

  const clearAllStorage = () => {
    Alert.alert(
      t('offline.alerts.clearAll.title'),
      t('offline.alerts.clearAll.message'),
      [
        { text: t('offline.alerts.clearAll.cancel'), style: 'cancel' },
        {
          text: t('offline.alerts.clearAll.confirm'),
          style: 'destructive',
          onPress: () => {
            debug.clearAll();
            Alert.alert(t('offline.alerts.clearSuccess.title'), t('offline.alerts.clearSuccess.message'));
            loadStorageInfo();
          },
        },
      ]
    );
  };

  const testStorage = () => {
    const testValue = { timestamp: Date.now(), message: 'Test MMKV' };

    try {
      cache.set('test', testValue);
      const retrieved = cache.get('test');

      Alert.alert(
        t('offline.alerts.testMmkv.title'),
        t('offline.alerts.testMmkv.message', { 
          saved: JSON.stringify(testValue), 
          retrieved: JSON.stringify(retrieved) 
        }),
        [{ text: t('common.ok') }]
      );

      loadStorageInfo();
    } catch (error) {
      Alert.alert(t('offline.alerts.testError.title'), t('offline.alerts.testError.message', { error: String(error) }), [{ text: t('common.ok') }]);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-6 py-4" showsVerticalScrollIndicator={false}>
      {/* Status */}
      <View className="mb-6 rounded-2xl bg-card p-6 border border-border">
        <Text className="mb-4 text-xl font-semibold text-foreground">
          {t('offline.status.title')}
        </Text>

        <View style={{ gap: 12 }}>
          <Text
            className={`text-base ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {t('offline.status.network')}: {isConnected ? t('offline.status.online') : t('offline.status.offline')}
          </Text>
        </View>
      </View>

      {/* Tasks Info */}
      <View className="mb-6 rounded-2xl bg-card p-6 border border-border">
        <Text className="mb-4 text-xl font-semibold text-foreground">
          {t('offline.tasks.title')}
        </Text>

        <View style={{ gap: 8 }}>
          <Text className="text-base text-muted-foreground">
            {t('offline.tasks.total')}: {tasks.length}
          </Text>
          <Text className="text-base text-muted-foreground">
            {t('offline.tasks.completed')}: {tasks.filter((t) => t.completed).length}
          </Text>
          <Text className="text-base text-muted-foreground">
            {t('offline.tasks.toSync')}: {getTasksToSync().length}
          </Text>
        </View>
      </View>

      {/* Storage Info */}
      <View className="mb-6 rounded-2xl bg-card p-6 border border-border">
        <Text className="mb-4 text-xl font-semibold text-foreground">
          {t('offline.storage.title')}
        </Text>

        {Object.entries(storageInfo).map(([type, size]) => (
          <View key={type} className="flex-row justify-between py-2">
            <Text className="capitalize text-base text-muted-foreground">
              {type}:
            </Text>
            <Text className="text-base font-medium text-foreground">
              {size} {t('offline.storage.keys')}
            </Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={testStorage}
          className="flex-row items-center justify-center rounded-xl bg-primary p-4">
          <Text className="text-lg font-bold text-white font-instrument-serif">
            {t('offline.actions.testMmkv')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={loadStorageInfo}
          className="flex-row items-center justify-center rounded-xl bg-green-500 p-4">
          <Text className="text-lg font-bold text-white font-instrument-serif">
            {t('offline.actions.refresh')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={clearAllStorage}
          className="flex-row items-center justify-center rounded-xl bg-destructive p-4">
          <Text className="text-lg font-bold text-white font-instrument-serif">
            {t('offline.actions.clearAll')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

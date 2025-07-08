import React from 'react';
import { View, Pressable } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { StatusBadgesProps } from '@/types/tasks';

export const StatusBadges: React.FC<StatusBadgesProps> = ({
  isConnected,
  pendingCount,
  onManualSync,
  showSyncButton = false,
}) => {
  const { t } = useTranslation();

  if (!isConnected && pendingCount === 0 && !showSyncButton) {
    return null;
  }

  return (
    <View className="flex-row items-center gap-3 mb-6">
      {/* Offline indicator */}
      {!isConnected && (
        <Badge variant="warning" size="sm">
          {t('tasks.status.offline')}
        </Badge>
      )}

      {/* Pending sync count */}
      {pendingCount > 0 && (
        <Badge variant="secondary" size="sm">
          {t('tasks.status.pending')}: {pendingCount}
        </Badge>
      )}

      {/* Manual sync button (dev only) */}
      {showSyncButton && pendingCount > 0 && onManualSync && (
        <Pressable
          onPress={onManualSync}
          className="bg-primary rounded-lg px-3 py-2 flex-row items-center gap-2"
        >
          <RefreshCw size={14} color="#ffffff" />
          <Text className="text-primary-foreground text-xs font-medium">
            {t('tasks.actions.sync')} ({pendingCount})
          </Text>
        </Pressable>
      )}
    </View>
  );
}; 
export const NOTIFICATION_CONSTANTS = {
  // Translation keys
  TRANSLATIONS: {
    title: 'navigation.notifications.title',
    description: 'navigation.notifications.description',
    permission: {
      status: 'notifications.permission.status',
      request: 'notifications.permission.request',
      granted: 'notifications.permission.granted',
      denied: 'notifications.permission.denied',
      blocked: 'notifications.permission.blocked',
    },
    actions: {
      requestPermission: 'notifications.actions.requestPermission',
      testLocal: 'notifications.actions.testLocal',
      testRemote: 'notifications.actions.testRemote',
      refresh: 'notifications.actions.refresh',
      settings: 'notifications.actions.settings',
    },
    status: {
      checking: 'notifications.status.checking',
      enabled: 'notifications.status.enabled',
      disabled: 'notifications.status.disabled',
      connected: 'notifications.status.connected',
      disconnected: 'notifications.status.disconnected',
    },
    alerts: {
      success: 'notifications.alerts.success',
      error: 'notifications.alerts.error',
      permissionDenied: 'notifications.alerts.permissionDenied',
      testSent: 'notifications.alerts.testSent',
    }
  },

  // Test notification translation keys
  TEST_NOTIFICATION_KEYS: {
    local: {
      title: 'notifications.test.local.title',
      body: 'notifications.test.local.body',
      data: { type: 'test_local' },
    },
    remote: {
      title: 'notifications.test.remote.title',
      body: 'notifications.test.remote.body',
      data: { type: 'test_remote' },
    },
  },

  // UI Constants
  UI: {
    borderRadius: 16,
    spacing: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 24,
    },
    colors: {
      success: '#10B981',
      error: '#EF4444', 
      warning: '#F59E0B',
      info: '#3B82F6',
    }
  }
} as const; 
import { storage } from '@/lib/storage';

/**
 * Utility to completely clear all session data
 * Use this if you have session persistence issues
 */
export const clearAllSessionData = () => {
  try {
    console.log('🗑️ Clearing all session data...');
    
    // Clear all auth storage
    storage.auth.clearAll();
    console.log('✅ Auth storage cleared');
    
    // Clear state storage (includes Zustand stores)
    storage.state.clearAll();
    console.log('✅ State storage cleared');
    
    // Clear cache
    storage.cache.clearAll();
    console.log('✅ Cache cleared');
    
    console.log('✅ All session data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing session data:', error);
  }
}; 
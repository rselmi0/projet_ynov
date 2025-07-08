import { Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { AppleProviderButtonProps } from '../../types/auth';


export function AppleProviderButton({
  onPress,
  loading = false,
  disabled = false,
  className = '',
}: AppleProviderButtonProps) {
  const { signInWithApple } = useAuth();

  const handlePress = onPress || signInWithApple;

  if (Platform.OS === 'ios')
    return (
      <TouchableOpacity
        style={[styles.button, (disabled || loading) && styles.disabled]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}>
        <Ionicons name="logo-apple" size={20} color="white" style={styles.icon} />
        <Text style={styles.text}>{loading ? 'Connecting...' : 'Connect with Apple'}</Text>
      </TouchableOpacity>
    );
  return <>{/* Apple Sign In is only available on iOS */}</>;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 50,
    width: '100%',
  },
  disabled: {
    backgroundColor: '#666666',
    opacity: 0.6,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

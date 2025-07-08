import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { GoogleProviderButtonProps } from '../../types/auth';

export function GoogleProviderButton({
  onPress,
  loading = false,
  disabled = false,
  className = '',
}: GoogleProviderButtonProps) {
  const { signInWithGoogle } = useAuth();

  const handlePress = onPress || signInWithGoogle;

  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.disabled]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      <Ionicons name="logo-google" size={20} style={styles.icon} />
      <Text style={styles.text}>{loading ? 'Connecting...' : 'Connect with Google'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#dadce0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#3c4043',
    fontSize: 16,
    fontWeight: '600',
  },
});

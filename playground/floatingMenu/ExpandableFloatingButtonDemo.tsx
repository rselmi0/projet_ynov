import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { ExpandableFloatingButton } from './ExpandableFloatingButton';
import { 
  Home, 
  Settings, 
  Bell, 
  User, 
  Camera, 
  MessageCircle 
} from 'lucide-react-native';

/**
 * Demo simple pour tester le ExpandableFloatingButton
 */
export const ExpandableFloatingButtonDemo: React.FC = () => {
  // Handle menu actions
  const handleMenuAction = (action: string) => {
    Alert.alert('Action Selected', `You selected: ${action}`);
  };

  // Custom content for the floating menu
  const menuContent = (
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>Quick Actions</Text>
      
      <View style={styles.actionsGrid}>
        {/* First row */}
        <View style={styles.actionRow}>
          <MenuAction
            icon={<Home size={20} color="#ffffff" />}
            label="Home"
            onPress={() => handleMenuAction('Home')}
          />
          <MenuAction
            icon={<Camera size={20} color="#ffffff" />}
            label="Camera"
            onPress={() => handleMenuAction('Camera')}
          />
          <MenuAction
            icon={<MessageCircle size={20} color="#ffffff" />}
            label="Messages"
            onPress={() => handleMenuAction('Messages')}
          />
        </View>

        {/* Second row */}
        <View style={styles.actionRow}>
          <MenuAction
            icon={<Settings size={20} color="#ffffff" />}
            label="Settings"
            onPress={() => handleMenuAction('Settings')}
          />
          <MenuAction
            icon={<Bell size={20} color="#ffffff" />}
            label="Notifications"
            onPress={() => handleMenuAction('Notifications')}
          />
          <MenuAction
            icon={<User size={20} color="#ffffff" />}
            label="Profile"
            onPress={() => handleMenuAction('Profile')}
          />
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Special action */}
      <Pressable 
        style={styles.specialAction}
        onPress={() => handleMenuAction('Special Action')}
      >
        <Text style={styles.specialActionText}>Special Action</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>ExpandableFloatingButton Demo</Text>
        <Text style={styles.subtitle}>
          Tap the floating button to open/close the menu. Drag it around when collapsed.
        </Text>
      </View>

      {/* Floating Button */}
      <ExpandableFloatingButton
        size={56}
        expandedWidth={340}
        expandedHeight={380}
        onToggle={() => {
          console.log('Menu toggled');
        }}
      >
        {menuContent}
      </ExpandableFloatingButton>
    </View>
  );
};

/**
 * Individual menu action component
 */
interface MenuActionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const MenuAction: React.FC<MenuActionProps> = ({ icon, label, onPress }) => (
  <Pressable style={styles.menuAction} onPress={onPress}>
    <View style={styles.actionIcon}>
      {icon}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Menu content styles
  menuContent: {
    width: '100%',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionsGrid: {
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  menuAction: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  specialAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  specialActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
}); 
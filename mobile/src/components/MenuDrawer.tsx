/**
 * Menu Drawer Component
 * Side menu with app options
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

interface MenuItem {
  label: string;
  icon: string;
  onPress: () => void;
  danger?: boolean;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  visible,
  onClose,
  navigation,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            onClose();
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      label: 'My Reports',
      icon: '📋',
      onPress: () => {
        navigation.navigate('MyReports');
        onClose();
      },
    },
    {
      label: 'Settings',
      icon: '⚙️',
      onPress: () => {
        navigation.navigate('Settings');
        onClose();
      },
    },
    {
      label: 'Help & Support',
      icon: '❓',
      onPress: () => {
        Alert.alert('Help & Support', 'Contact support at support@safenet.app');
        onClose();
      },
    },
    {
      label: 'About SafeNet',
      icon: 'ℹ️',
      onPress: () => {
        Alert.alert(
          'About SafeNet',
          'SafeNet v1.0.0\n\nA public safety alert platform for African communities.'
        );
        onClose();
      },
    },
    {
      label: 'Logout',
      icon: '🚪',
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.drawer}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  item.danger && styles.menuItemDanger,
                ]}
                onPress={item.onPress}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.menuLabel,
                    item.danger && styles.menuLabelDanger,
                  ]}
                >
                  {item.label}
                </Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '75%',
    maxWidth: 320,
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    ...Typography.h3,
    color: Colors.textInverse,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  closeIcon: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemDanger: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.md,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 30,
  },
  menuLabel: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    flex: 1,
  },
  menuLabelDanger: {
    color: Colors.error,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.textTertiary,
  },
});

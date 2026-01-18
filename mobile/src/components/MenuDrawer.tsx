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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

interface MenuItem {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  danger?: boolean;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '75%',
    maxWidth: 320,
    backgroundColor: colors.glassBg,
    borderLeftWidth: 1,
    borderLeftColor: colors.glassBorder,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
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
    backgroundColor: colors.neonCyan,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    ...Typography.h3,
    color: colors.textInverse,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  menuItemDanger: {
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    marginTop: Spacing.md,
  },
  menuIcon: {
    marginRight: Spacing.md,
    width: 24,
  },
  menuLabel: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  menuLabelDanger: {
    color: colors.error,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
});

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  visible,
  onClose,
  navigation,
}) => {
  const { colors } = useTheme();
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
      iconName: 'document-text-outline',
      onPress: () => {
        navigation.navigate('MyReports');
        onClose();
      },
    },
    {
      label: 'Settings',
      iconName: 'settings-outline',
      onPress: () => {
        navigation.navigate('Settings');
        onClose();
      },
    },
    {
      label: 'Help & Support',
      iconName: 'help-circle-outline',
      onPress: () => {
        Alert.alert('Help & Support', 'Contact support at support@safenet.app');
        onClose();
      },
    },
    {
      label: 'About SafeNet',
      iconName: 'information-circle-outline',
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
      iconName: 'log-out-outline',
      onPress: handleLogout,
      danger: true,
    },
  ];

  const dynamicStyles = createStyles(colors);

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
        <View style={dynamicStyles.drawer}>
          <View style={dynamicStyles.header}>
            <View style={dynamicStyles.userInfo}>
              <View style={dynamicStyles.avatar}>
                <Text style={dynamicStyles.avatarText}>
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={dynamicStyles.userDetails}>
                <Text style={dynamicStyles.userName}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text style={dynamicStyles.userEmail}>{user?.email}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={dynamicStyles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={dynamicStyles.menu} showsVerticalScrollIndicator={false}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  dynamicStyles.menuItem,
                  item.danger && dynamicStyles.menuItemDanger,
                ]}
                onPress={item.onPress}
              >
                <Ionicons 
                  name={item.iconName} 
                  size={24} 
                  color={item.danger ? colors.error : colors.textPrimary}
                  style={dynamicStyles.menuIcon}
                />
                <Text
                  style={[
                    dynamicStyles.menuLabel,
                    item.danger && dynamicStyles.menuLabelDanger,
                  ]}
                >
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

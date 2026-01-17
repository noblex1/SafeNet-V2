/**
 * Profile Screen
 * User profile and account settings
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Button } from '../components/Button';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
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
          },
        },
      ]
    );
  };

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={dynamicStyles.userCard}>
          <View style={dynamicStyles.avatar}>
            <Text style={dynamicStyles.avatarText}>
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
              {user?.lastName?.[0]?.toUpperCase() || ''}
            </Text>
          </View>
          <Text style={dynamicStyles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={dynamicStyles.userEmail}>{user?.email}</Text>
          <Text style={dynamicStyles.userPhone}>{user?.phone}</Text>
          <TouchableOpacity style={dynamicStyles.editButton}>
            <Text style={dynamicStyles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={dynamicStyles.menuSection}>
          <TouchableOpacity
            style={dynamicStyles.menuItem}
            onPress={() => navigation.navigate('MyReports')}
          >
            <Text style={dynamicStyles.menuIcon}>📋</Text>
            <Text style={dynamicStyles.menuLabel}>My Reports</Text>
            <Text style={dynamicStyles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={dynamicStyles.menuIcon}>⚙️</Text>
            <Text style={dynamicStyles.menuLabel}>Settings</Text>
            <Text style={dynamicStyles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.menuItem}
            onPress={() =>
              Alert.alert(
                'Help & Support',
                'Contact us at support@safenet.app'
              )
            }
          >
            <Text style={dynamicStyles.menuIcon}>❓</Text>
            <Text style={dynamicStyles.menuLabel}>Help & Support</Text>
            <Text style={dynamicStyles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.menuItem}
            onPress={() =>
              Alert.alert(
                'About',
                'SafeNet v1.0.0\n\nA public safety alert platform for African communities.'
              )
            }
          >
            <Text style={dynamicStyles.menuIcon}>ℹ️</Text>
            <Text style={dynamicStyles.menuLabel}>About SafeNet</Text>
            <Text style={dynamicStyles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={dynamicStyles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={dynamicStyles.logoutButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...Typography.h1,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  userCard: {
    backgroundColor: colors.surface,
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    ...Typography.h1,
    color: colors.textInverse,
    fontWeight: '700',
  },
  userName: {
    ...Typography.h3,
    color: colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  userPhone: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: Spacing.md,
  },
  editButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    ...Typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  menuSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 30,
  },
  menuLabel: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  logoutSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  logoutButton: {
    borderColor: colors.error,
  },
});

/**
 * Settings Screen
 * User settings and preferences
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Button } from '../components/Button';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const { user, logout } = useAuth();
  
  // Notification settings
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(false);
  const [smsFallback, setSmsFallback] = useState(true);
  
  // General settings
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

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

  const SettingItem: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    iconColor?: string;
  }> = ({ icon, title, subtitle, value, onPress, rightComponent, iconColor }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Text style={[styles.settingIcon, iconColor && { color: iconColor }]}>{icon}</Text>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {rightComponent}
        {onPress && <Text style={styles.settingArrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>📱</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.profileLocation}>Accra, Ghana</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          
          <View style={styles.sectionCard}>
            <SettingItem
              icon="📢"
              title="Emergency Alerts"
              subtitle="High priority safety warnings"
              iconColor={Colors.error}
              rightComponent={
                <Switch
                  value={emergencyAlerts}
                  onValueChange={setEmergencyAlerts}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                />
              }
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="🔔"
              title="Community Updates"
              subtitle="Local reports and news"
              iconColor={Colors.info}
              rightComponent={
                <Switch
                  value={communityUpdates}
                  onValueChange={setCommunityUpdates}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                />
              }
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="💬"
              title="SMS Fallback"
              subtitle="Receive alerts via SMS if offline"
              iconColor="#FF9500"
              rightComponent={
                <Switch
                  value={smsFallback}
                  onValueChange={setSmsFallback}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                />
              }
            />
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL</Text>
          
          <View style={styles.sectionCard}>
            <SettingItem
              icon="🌐"
              title="Language"
              value={language}
              onPress={() => {
                Alert.alert('Language', 'Language selection coming soon!');
              }}
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="📍"
              title="Location Permissions"
              onPress={() => {
                Alert.alert('Location Permissions', 'Manage location permissions in device settings');
              }}
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="🌙"
              title="Dark Mode"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                />
              }
            />
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP INFO</Text>
          
          <View style={styles.sectionCard}>
            <SettingItem
              icon="ℹ️"
              title="About SafeNet"
              onPress={() => {
                Alert.alert(
                  'About SafeNet',
                  'SafeNet v1.2.4 (Beta)\n\nA public safety alert platform for African communities.'
                );
              }}
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="🔒"
              title="Privacy Policy"
              onPress={() => {
                Alert.alert('Privacy Policy', 'Privacy policy coming soon!');
              }}
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="📱"
              title="Version"
              value="v1.2.4 (Beta)"
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="danger"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  profileLocation: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
  },
  editButtonText: {
    ...Typography.bodySmall,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  // Section
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.overline,
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.lg,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 30,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  settingSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingValue: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  settingArrow: {
    fontSize: 20,
    color: Colors.textTertiary,
    marginLeft: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.lg + 30 + Spacing.md, // Icon width + margins
  },
  // Logout
  logoutSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
});

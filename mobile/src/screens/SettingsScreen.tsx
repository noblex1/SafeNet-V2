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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Button } from '../components/Button';

interface SettingsScreenProps {
  navigation: any;
}

const createStyles = (colors: ReturnType<typeof getColors>) => StyleSheet.create({
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
  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  profileLocation: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: colors.primary,
  },
  editButtonText: {
    ...Typography.bodySmall,
    color: colors.textInverse,
    fontWeight: '600',
  },
  // Section
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.overline,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.lg,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
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
  settingTextContainer: {
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingIcon: {
    marginRight: Spacing.md,
    width: 30,
  },
  settingTitle: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  settingSubtitle: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 12,
  },
  settingValue: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    marginRight: Spacing.xs,
  },
  settingArrow: {
    fontSize: 20,
    color: colors.textTertiary,
    marginLeft: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: Spacing.lg + 30 + Spacing.md, // Icon width + margins
  },
});

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const { user, logout } = useAuth();
  const { theme, colors, toggleTheme } = useTheme();
  const dynamicStyles = createStyles(colors);
  
  // Notification settings
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(false);
  const [smsFallback, setSmsFallback] = useState(true);
  
  // General settings
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
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    iconColor?: string;
  }> = ({ iconName, title, subtitle, value, onPress, rightComponent, iconColor }) => (
    <TouchableOpacity
      style={dynamicStyles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={dynamicStyles.settingLeft}>
        <Ionicons
          name={iconName}
          size={24}
          color={iconColor || colors.textPrimary}
          style={dynamicStyles.settingIcon}
        />
        <View style={dynamicStyles.settingTextContainer}>
          <Text style={dynamicStyles.settingTitle}>{title}</Text>
          {subtitle && <Text style={dynamicStyles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={dynamicStyles.settingRight}>
        {value && <Text style={dynamicStyles.settingValue}>{value}</Text>}
        {rightComponent}
        {onPress && <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
          <View style={dynamicStyles.profileCard}>
          <View style={dynamicStyles.avatarContainer}>
            <View style={dynamicStyles.avatar}>
              {user?.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  style={dynamicStyles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person-outline" size={26} color="#0a0a0a" />
              )}
            </View>
            <View style={dynamicStyles.onlineIndicator} />
          </View>
          <View style={dynamicStyles.profileInfo}>
            <Text style={dynamicStyles.profileName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={dynamicStyles.profileLocation}>Accra, Ghana</Text>
          </View>
          <TouchableOpacity
            style={dynamicStyles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={dynamicStyles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>NOTIFICATIONS</Text>
          
          <View style={dynamicStyles.sectionCard}>
            <SettingItem
              iconName="alert-circle-outline"
              title="Emergency Alerts"
              subtitle="High priority safety warnings"
              iconColor={colors.error}
              rightComponent={
                <Switch
                  value={emergencyAlerts}
                  onValueChange={setEmergencyAlerts}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              }
            />
            
            <View style={dynamicStyles.divider} />
            
            <SettingItem
              iconName="notifications-outline"
              title="Community Updates"
              subtitle="Local reports and news"
              iconColor={colors.info}
              rightComponent={
                <Switch
                  value={communityUpdates}
                  onValueChange={setCommunityUpdates}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              }
            />
            
            <View style={dynamicStyles.divider} />
            
            <SettingItem
              iconName="chatbubble-ellipses-outline"
              title="SMS Fallback"
              subtitle="Receive alerts via SMS if offline"
              iconColor="#FF9500"
              rightComponent={
                <Switch
                  value={smsFallback}
                  onValueChange={setSmsFallback}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              }
            />
          </View>
        </View>

        {/* General Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>GENERAL</Text>
          
          <View style={dynamicStyles.sectionCard}>
            <SettingItem
              iconName="globe-outline"
              title="Language"
              value={language}
              onPress={() => {
                Alert.alert('Language', 'Language selection coming soon!');
              }}
            />
            
            <View style={dynamicStyles.divider} />
            
            <SettingItem
              iconName="location-outline"
              title="Location Permissions"
              onPress={() => {
                Alert.alert('Location Permissions', 'Manage location permissions in device settings');
              }}
            />
            
            <View style={dynamicStyles.divider} />
            
            <SettingItem
              iconName={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
              title="Dark Mode"
              rightComponent={
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              }
            />
          </View>
        </View>

        {/* App Info Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>APP INFO</Text>
          
          <View style={dynamicStyles.sectionCard}>
            <SettingItem
              iconName="information-circle-outline"
              title="About SafeNet"
              onPress={() => {
                Alert.alert(
                  'About SafeNet',
                  'SafeNet v1.2.4 (Beta)\n\nA public safety alert platform for African communities.'
                );
              }}
            />
            
            <View style={dynamicStyles.divider} />
            
            <SettingItem
              iconName="lock-closed-outline"
              title="Privacy Policy"
              onPress={() => {
                Alert.alert('Privacy Policy', 'Privacy policy coming soon!');
              }}
            />
            
            <View style={dynamicStyles.divider} />
            
            <SettingItem
              iconName="phone-portrait-outline"
              title="Version"
              value="v1.2.4 (Beta)"
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={dynamicStyles.logoutSection}>
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
  content: {
    flex: 1,
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
  section: {
    marginBottom: Spacing.lg,
  },
  logoutSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
});

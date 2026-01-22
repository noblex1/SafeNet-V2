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
  Modal,
  Pressable,
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
  // About SafeNet Full Screen
  aboutFullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  aboutHeader: {
    backgroundColor: colors.primary,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  aboutBackButton: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  aboutCloseButton: {
    marginLeft: Spacing.md,
    padding: Spacing.xs,
  },
  aboutHeaderContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  aboutTitle: {
    ...Typography.h3,
    color: colors.textInverse,
    fontWeight: '700',
    marginBottom: Spacing.xs / 2,
  },
  aboutVersion: {
    ...Typography.bodySmall,
    color: colors.textInverse,
    opacity: 0.9,
  },
  aboutContent: {
    flex: 1,
  },
  aboutContentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  aboutDescription: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  aboutFeatures: {
    marginTop: Spacing.md,
  },
  aboutFeatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  aboutFeatureIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  aboutFeatureText: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  aboutHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  aboutFooter: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutFooterText: {
    ...Typography.bodySmall,
    color: colors.textTertiary,
  },
  aboutFooterIcon: {
    color: colors.primary,
  },
  // Privacy Policy Full Screen
  privacyFullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  privacyHeader: {
    backgroundColor: colors.primary,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  privacyBackButton: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  privacyCloseButton: {
    marginLeft: Spacing.md,
    padding: Spacing.xs,
  },
  privacyHeaderContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  privacyTitle: {
    ...Typography.h3,
    color: colors.textInverse,
    fontWeight: '700',
    marginBottom: Spacing.xs / 2,
  },
  privacySubtitle: {
    ...Typography.bodySmall,
    color: colors.textInverse,
    opacity: 0.9,
  },
  privacyContent: {
    flex: 1,
  },
  privacyContentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  privacySection: {
    marginBottom: Spacing.lg,
  },
  privacySectionTitle: {
    ...Typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  privacySectionTitleFirst: {
    ...Typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    marginTop: 0,
  },
  privacyText: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  privacyList: {
    marginLeft: Spacing.md,
    marginBottom: Spacing.md,
  },
  privacyListItem: {
    ...Typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
  },
  privacyBullet: {
    color: colors.primary,
    marginRight: Spacing.sm,
    fontWeight: 'bold',
  },
  privacyHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  privacyFooter: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  privacyFooterText: {
    ...Typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
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
  
  // Modal state
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
              onPress={() => setShowAboutModal(true)}
            />
            
            <View style={dynamicStyles.divider} />
            
            <SettingItem
              iconName="lock-closed-outline"
              title="Privacy Policy"
              onPress={() => setShowPrivacyModal(true)}
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

      {/* About SafeNet Modal */}
      <Modal
        visible={showAboutModal}
        animationType="slide"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={dynamicStyles.aboutFullScreen}>
              <View style={dynamicStyles.aboutHeader}>
                <TouchableOpacity
                  style={dynamicStyles.aboutBackButton}
                  onPress={() => setShowAboutModal(false)}
                >
                  <Ionicons name="arrow-back" size={24} color={colors.textInverse} />
                </TouchableOpacity>
                <View style={dynamicStyles.aboutHeaderContent}>
                  <Text style={dynamicStyles.aboutTitle}>SafeNet</Text>
                  <Text style={dynamicStyles.aboutVersion}>v1.2.4 (Beta)</Text>
                </View>
                <TouchableOpacity
                  style={dynamicStyles.aboutCloseButton}
                  onPress={() => setShowAboutModal(false)}
                >
                  <Ionicons name="close" size={24} color={colors.textInverse} />
                </TouchableOpacity>
              </View>
              
              <ScrollView
                style={dynamicStyles.aboutContent}
                contentContainerStyle={dynamicStyles.aboutContentContainer}
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                bounces={true}
              >
                <Text style={dynamicStyles.aboutDescription}>
                  SafeNet is a comprehensive public safety alert platform designed to help communities report, verify, and respond to incidents such as missing persons, kidnappings, stolen vehicles, and natural disasters.
                </Text>
                
                <View style={dynamicStyles.aboutFeatures}>
                  <View style={dynamicStyles.aboutFeatureRow}>
                    <Ionicons 
                      name="location" 
                      size={18} 
                      color={colors.primary} 
                      style={dynamicStyles.aboutFeatureIcon}
                    />
                    <Text style={dynamicStyles.aboutFeatureText}>
                      <Text style={dynamicStyles.aboutHighlight}>Real-time Reporting:</Text> Report incidents with location, photos, and detailed information instantly.
                    </Text>
                  </View>
                  
                  <View style={dynamicStyles.aboutFeatureRow}>
                    <Ionicons 
                      name="checkmark-circle" 
                      size={18} 
                      color={colors.primary} 
                      style={dynamicStyles.aboutFeatureIcon}
                    />
                    <Text style={dynamicStyles.aboutFeatureText}>
                      <Text style={dynamicStyles.aboutHighlight}>Verified Alerts:</Text> View only verified safety alerts from trusted authorities in your community.
                    </Text>
                  </View>
                  
                  <View style={dynamicStyles.aboutFeatureRow}>
                    <Ionicons 
                      name="lock-closed" 
                      size={18} 
                      color={colors.primary} 
                      style={dynamicStyles.aboutFeatureIcon}
                    />
                    <Text style={dynamicStyles.aboutFeatureText}>
                      <Text style={dynamicStyles.aboutHighlight}>Blockchain Security:</Text> All verifications are recorded immutably on the Sui blockchain for transparency and trust.
                    </Text>
                  </View>
                  
                  <View style={dynamicStyles.aboutFeatureRow}>
                    <Ionicons 
                      name="people" 
                      size={18} 
                      color={colors.primary} 
                      style={dynamicStyles.aboutFeatureIcon}
                    />
                    <Text style={dynamicStyles.aboutFeatureText}>
                      <Text style={dynamicStyles.aboutHighlight}>Community-Driven:</Text> Built for African communities to enhance public safety and emergency response.
                    </Text>
                  </View>
                </View>
              </ScrollView>
              
              <View style={dynamicStyles.aboutFooter}>
                <Text style={dynamicStyles.aboutFooterText}>Built by SafeNet for African communities</Text>
              </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={dynamicStyles.privacyFullScreen}>
              <View style={dynamicStyles.privacyHeader}>
                <TouchableOpacity
                  style={dynamicStyles.privacyBackButton}
                  onPress={() => setShowPrivacyModal(false)}
                >
                  <Ionicons name="arrow-back" size={24} color={colors.textInverse} />
                </TouchableOpacity>
                <View style={dynamicStyles.privacyHeaderContent}>
                  <Text style={dynamicStyles.privacyTitle}>Privacy Policy</Text>
                  <Text style={dynamicStyles.privacySubtitle}>Your data, your control</Text>
                </View>
                <TouchableOpacity
                  style={dynamicStyles.privacyCloseButton}
                  onPress={() => setShowPrivacyModal(false)}
                >
                  <Ionicons name="close" size={24} color={colors.textInverse} />
                </TouchableOpacity>
              </View>
              
              <ScrollView
                style={dynamicStyles.privacyContent}
                contentContainerStyle={dynamicStyles.privacyContentContainer}
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                bounces={true}
              >
                <View style={dynamicStyles.privacySection}>
                  <Text style={dynamicStyles.privacyText}>
                    At SafeNet, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our public safety alert platform.
                  </Text>
                </View>

                <View style={dynamicStyles.privacySection}>
                  <Text style={dynamicStyles.privacySectionTitleFirst}>1. Information We Collect</Text>
                  <Text style={dynamicStyles.privacyText}>
                    We collect information that you provide directly to us, including:
                  </Text>
                  <View style={dynamicStyles.privacyList}>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Account information (name, email, phone number)
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Incident reports (location, description, photos)
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Device information and usage data
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Location data (with your permission)
                    </Text>
                  </View>
                </View>

                <View style={dynamicStyles.privacySection}>
                  <Text style={dynamicStyles.privacySectionTitle}>2. How We Use Your Information</Text>
                  <Text style={dynamicStyles.privacyText}>
                    We use the information we collect to:
                  </Text>
                  <View style={dynamicStyles.privacyList}>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Process and verify incident reports
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Send you safety alerts and notifications
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Improve our services and user experience
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Ensure platform security and prevent fraud
                    </Text>
                  </View>
                </View>

                <View style={dynamicStyles.privacySection}>
                  <Text style={dynamicStyles.privacySectionTitle}>3. Blockchain & Data Security</Text>
                  <Text style={dynamicStyles.privacyText}>
                    <Text style={dynamicStyles.privacyHighlight}>Privacy-First Approach:</Text> We use blockchain technology to ensure transparency and immutability of verified incidents. However, we only store cryptographic hashes on the blockchain - no personal information or sensitive data is stored on-chain.
                  </Text>
                  <Text style={dynamicStyles.privacyText}>
                    All personal data is encrypted and stored securely in our databases, accessible only to authorized personnel and systems.
                  </Text>
                </View>

                <View style={dynamicStyles.privacySection}>
                  <Text style={dynamicStyles.privacySectionTitle}>4. Data Sharing & Disclosure</Text>
                  <Text style={dynamicStyles.privacyText}>
                    We do not sell your personal information. We may share your information only in the following circumstances:
                  </Text>
                  <View style={dynamicStyles.privacyList}>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> With verified authorities for incident verification and response
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> When required by law or legal process
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> To protect the rights, property, or safety of SafeNet users
                    </Text>
                  </View>
                </View>

                <View style={dynamicStyles.privacySection}>
                  <Text style={dynamicStyles.privacySectionTitle}>5. Your Rights</Text>
                  <Text style={dynamicStyles.privacyText}>
                    You have the right to:
                  </Text>
                  <View style={dynamicStyles.privacyList}>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Access and update your personal information
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Delete your account and associated data
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Opt-out of non-essential communications
                    </Text>
                    <Text style={dynamicStyles.privacyListItem}>
                      <Text style={dynamicStyles.privacyBullet}>•</Text> Request a copy of your data
                    </Text>
                  </View>
                </View>

                <View style={dynamicStyles.privacySection}>
                  <Text style={dynamicStyles.privacySectionTitle}>6. Data Retention</Text>
                  <Text style={dynamicStyles.privacyText}>
                    We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Incident reports may be retained longer for safety and verification purposes, but personal identifiers are anonymized where possible.
                  </Text>
                </View>

                <View style={dynamicStyles.privacySection}>
                  <Text style={dynamicStyles.privacySectionTitle}>7. Contact Us</Text>
                  <Text style={dynamicStyles.privacyText}>
                    If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
                  </Text>
                  <Text style={[dynamicStyles.privacyText, { color: colors.primary, fontWeight: '600' }]}>
                    privacy@safenet.app
                  </Text>
                </View>

                <View style={dynamicStyles.privacySection}>
                  <Text style={dynamicStyles.privacyText}>
                    <Text style={dynamicStyles.privacyHighlight}>Last Updated:</Text> {new Date().getFullYear()}
                  </Text>
                </View>
              </ScrollView>
              
              <View style={dynamicStyles.privacyFooter}>
                <Text style={dynamicStyles.privacyFooterText}>
                  Your privacy matters to us
                </Text>
              </View>
        </View>
      </Modal>
    </View>
  );
};


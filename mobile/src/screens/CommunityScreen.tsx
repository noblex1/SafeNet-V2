/**
 * Community Screen
 * Community features and engagement
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface CommunityScreenProps {
  navigation: any;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Community</Text>
        <Text style={dynamicStyles.headerSubtitle}>
          Connect with your community and stay safe together
        </Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Community Stats */}
        <View style={dynamicStyles.statsContainer}>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statNumber}>1,234</Text>
            <Text style={dynamicStyles.statLabel}>Active Users</Text>
          </View>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statNumber}>567</Text>
            <Text style={dynamicStyles.statLabel}>Verified Reports</Text>
          </View>
          <View style={dynamicStyles.statCard}>
            <Text style={dynamicStyles.statNumber}>89</Text>
            <Text style={dynamicStyles.statLabel}>Resolved</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={dynamicStyles.actionCard}
            onPress={() => navigation.navigate('ReportIncident')}
          >
            <Text style={dynamicStyles.actionIcon}>📝</Text>
            <View style={dynamicStyles.actionContent}>
              <Text style={dynamicStyles.actionTitle}>Report an Incident</Text>
              <Text style={dynamicStyles.actionDescription}>
                Help keep your community safe
              </Text>
            </View>
            <Text style={dynamicStyles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.actionCard}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={dynamicStyles.actionIcon}>📋</Text>
            <View style={dynamicStyles.actionContent}>
              <Text style={dynamicStyles.actionTitle}>View All Alerts</Text>
              <Text style={dynamicStyles.actionDescription}>
                See verified incidents in your area
              </Text>
            </View>
            <Text style={dynamicStyles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Community Guidelines */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Community Guidelines</Text>
          <View style={dynamicStyles.guidelineCard}>
            <Text style={dynamicStyles.guidelineText}>
              • Report only verified incidents{'\n'}
              • Be respectful and accurate{'\n'}
              • Help verify community reports{'\n'}
              • Keep personal information private
            </Text>
          </View>
        </View>

        {/* Safety Tips */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Safety Tips</Text>
          <View style={dynamicStyles.tipCard}>
            <Text style={dynamicStyles.tipIcon}>💡</Text>
            <Text style={dynamicStyles.tipText}>
              Always verify information before sharing. Report suspicious
              activities immediately to authorities.
            </Text>
          </View>
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
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    ...Typography.h2,
    color: colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: colors.textPrimary,
    marginBottom: Spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
  },
  actionArrow: {
    fontSize: 24,
    color: colors.textTertiary,
  },
  guidelineCard: {
    backgroundColor: colors.primaryLight + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  guidelineText: {
    ...Typography.bodySmall,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  tipText: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});

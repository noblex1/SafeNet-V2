/**
 * Incident Card Component
 * Displays incident information in a card format
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Incident, IncidentType, IncidentStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface IncidentCardProps {
  incident: Incident;
  onPress: () => void;
}

const getIncidentTypeConfig = (type: IncidentType, colors: ReturnType<typeof import('../theme/colors').getColors>) => {
  const configs: Record<IncidentType, { label: string; icon: string; color: string }> = {
    [IncidentType.MISSING_PERSON]: {
      label: 'MISSING PERSON',
      icon: '🔍',
      color: colors.success,
    },
    [IncidentType.KIDNAPPING]: {
      label: 'KIDNAPPING',
      icon: '🚨',
      color: colors.error,
    },
    [IncidentType.STOLEN_VEHICLE]: {
      label: 'TRAFFIC INCIDENT',
      icon: '🚧',
      color: colors.warning,
    },
    [IncidentType.NATURAL_DISASTER]: {
      label: 'URGENT DISASTER',
      icon: '🏠',
      color: colors.error,
    },
  };
  return configs[type] || { label: type, icon: '📋', color: colors.textSecondary };
};

const getTimeAgo = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}m ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 120,
    height: '100%',
    minHeight: 140,
    backgroundColor: colors.border,
  },
  contentSection: {
    flex: 1,
    padding: Spacing.lg,
  },
  contentSectionFull: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  typeIcon: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },
  typeText: {
    ...Typography.overline,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusVerified,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  verifiedIcon: {
    fontSize: 12,
    color: colors.success,
    marginRight: Spacing.xs,
    fontWeight: 'bold',
  },
  verifiedText: {
    ...Typography.overline,
    fontSize: 10,
    color: colors.success,
    fontWeight: '700',
  },
  title: {
    ...Typography.h4,
    marginBottom: Spacing.sm,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  description: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  footerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  timeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  timeText: {
    ...Typography.caption,
    color: colors.textTertiary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    ...Typography.caption,
    color: colors.textTertiary,
    flex: 1,
  },
  detailsLink: {
    ...Typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  activeText: {
    ...Typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
  },
});

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onPress }) => {
  const { colors } = useTheme();
  const hasImages = incident.images && incident.images.length > 0;
  const firstImage = hasImages ? incident.images[0] : null;
  const typeConfig = getIncidentTypeConfig(incident.type, colors);
  const isVerified = incident.status === IncidentStatus.VERIFIED;
  const timeAgo = getTimeAgo(incident.createdAt);
  const dynamicStyles = createStyles(colors);

  return (
    <TouchableOpacity style={dynamicStyles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={dynamicStyles.cardContent}>
        {/* Image Section - Only show if image exists */}
        {firstImage && (
          <Image
            source={{ uri: firstImage }}
            style={dynamicStyles.cardImage}
            resizeMode="cover"
          />
        )}

        {/* Content Section */}
        <View style={[dynamicStyles.contentSection, !firstImage && dynamicStyles.contentSectionFull]}>
          {/* Header with Type and Verified Badge */}
          <View style={dynamicStyles.header}>
            <View style={[dynamicStyles.typeContainer, { backgroundColor: typeConfig.color + '15' }]}>
              <Text style={dynamicStyles.typeIcon}>{typeConfig.icon}</Text>
              <Text style={[dynamicStyles.typeText, { color: typeConfig.color }]}>
                {typeConfig.label}
              </Text>
            </View>
            {isVerified && (
              <View style={dynamicStyles.verifiedBadge}>
                <Text style={dynamicStyles.verifiedIcon}>✓</Text>
                <Text style={dynamicStyles.verifiedText}>VERIFIED</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={dynamicStyles.title} numberOfLines={2}>
            {incident.title}
          </Text>

          {/* Description */}
          <Text style={dynamicStyles.description} numberOfLines={3}>
            {incident.description}
          </Text>

          {/* Footer */}
          <View style={dynamicStyles.footer}>
            <View style={dynamicStyles.footerLeft}>
              {timeAgo && (
                <View style={dynamicStyles.timeContainer}>
                  <Text style={dynamicStyles.timeIcon}>🕐</Text>
                  <Text style={dynamicStyles.timeText}>{timeAgo}</Text>
                </View>
              )}
              <View style={dynamicStyles.locationContainer}>
                <Text style={dynamicStyles.locationIcon}>📍</Text>
                <Text style={dynamicStyles.location} numberOfLines={1}>
                  {incident.location.address}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onPress}>
              <Text style={dynamicStyles.detailsLink}>
                {incident.type === IncidentType.STOLEN_VEHICLE ? 'View Map' : 'Details >'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Badge for Missing Person */}
          {incident.type === IncidentType.MISSING_PERSON && isVerified && (
            <View style={dynamicStyles.activeBadge}>
              <Text style={dynamicStyles.activeText}>ACTIVE</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

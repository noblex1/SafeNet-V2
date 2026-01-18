/**
 * Incident Card Component
 * Displays incident information in a card format
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  const configs: Record<IncidentType, { label: string; iconName: keyof typeof Ionicons.glyphMap; color: string }> = {
    [IncidentType.MISSING_PERSON]: {
      label: 'MISSING PERSON',
      iconName: 'search-outline',
      color: colors.success,
    },
    [IncidentType.KIDNAPPING]: {
      label: 'KIDNAPPING',
      iconName: 'alert-circle-outline',
      color: colors.error,
    },
    [IncidentType.STOLEN_VEHICLE]: {
      label: 'TRAFFIC INCIDENT',
      iconName: 'car-outline',
      color: colors.warning,
    },
    [IncidentType.NATURAL_DISASTER]: {
      label: 'URGENT DISASTER',
      iconName: 'warning-outline',
      color: colors.error,
    },
  };
  return configs[type] || { label: type, iconName: 'document-text-outline', color: colors.textSecondary };
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
    // Glassmorphism effect
    backgroundColor: colors.glassBg,
    borderRadius: BorderRadius.xl, // Rounded-2xl (20px)
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    // Subtle shadow/glow
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 120,
    minHeight: 140,
    backgroundColor: colors.border,
  },
  contentSection: {
    flex: 1,
    padding: Spacing.lg,
    minWidth: 0, // Allow flex shrink
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
    borderWidth: 1,
    borderColor: colors.neonCyan + '40', // 40 = ~25% opacity
  },
  verifiedIcon: {
    color: colors.neonCyan,
    marginRight: Spacing.xs,
  },
  verifiedText: {
    ...Typography.overline,
    fontSize: 10,
    color: colors.neonCyan,
    fontWeight: '700',
  },
  title: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  description: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: Spacing.xs,
    flexWrap: 'wrap',
  },
  footerLeft: {
    flex: 1,
    marginRight: Spacing.sm,
    minWidth: 0, // Allow flex shrink
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    flexWrap: 'wrap',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  timeIcon: {
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
    minWidth: 0, // Allow flex shrink
  },
  locationIcon: {
    marginRight: 4,
    flexShrink: 0,
  },
  location: {
    ...Typography.caption,
    color: colors.textTertiary,
    flex: 1,
    minWidth: 0, // Allow text wrapping
  },
  detailsLink: {
    ...Typography.bodySmall,
    color: colors.neonCyan,
    fontWeight: '600',
  },
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neonCyan,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  activeText: {
    ...Typography.caption,
    color: '#0a0a0a', // Dark text on neon
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
              <Ionicons 
                name={typeConfig.iconName} 
                size={14} 
                color={typeConfig.color}
                style={dynamicStyles.typeIcon}
              />
              <Text style={[dynamicStyles.typeText, { color: typeConfig.color }]}>
                {typeConfig.label}
              </Text>
            </View>
            {isVerified && (
              <View style={dynamicStyles.verifiedBadge}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={12} 
                  color={colors.neonCyan}
                  style={dynamicStyles.verifiedIcon}
                />
                <Text style={dynamicStyles.verifiedText}>VERIFIED</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={dynamicStyles.title} numberOfLines={2}>
            {incident.title}
          </Text>

          {/* Description - Allow full text with proper wrapping */}
          <Text style={dynamicStyles.description} numberOfLines={4}>
            {incident.description}
          </Text>

          {/* Footer - Better layout for metadata */}
          <View style={dynamicStyles.footer}>
            <View style={dynamicStyles.footerLeft}>
              {/* Time and Location in separate rows for better readability */}
              {timeAgo && (
                <View style={dynamicStyles.metadataRow}>
                  <View style={dynamicStyles.timeContainer}>
                    <Ionicons 
                      name="time-outline" 
                      size={14} 
                      color={colors.textTertiary}
                      style={dynamicStyles.timeIcon}
                    />
                    <Text style={dynamicStyles.timeText}>{timeAgo}</Text>
                  </View>
                </View>
              )}
              <View style={dynamicStyles.locationContainer}>
                <Ionicons 
                  name="location-outline" 
                  size={14} 
                  color={colors.textTertiary}
                  style={dynamicStyles.locationIcon}
                />
                <Text style={dynamicStyles.location} numberOfLines={2}>
                  {incident.location.address}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onPress} style={{ flexShrink: 0 }}>
              <Text style={dynamicStyles.detailsLink}>
                {incident.type === IncidentType.STOLEN_VEHICLE ? 'View Map' : 'Details'}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color={colors.neonCyan}
                style={{ marginTop: -2 }}
              />
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

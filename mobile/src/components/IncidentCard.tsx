/**
 * Incident Card Component
 * Displays incident information in a card format
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Incident, IncidentType, IncidentStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface IncidentCardProps {
  incident: Incident;
  onPress: () => void;
}

const getIncidentTypeConfig = (type: IncidentType) => {
  const configs: Record<IncidentType, { label: string; icon: string; color: string }> = {
    [IncidentType.MISSING_PERSON]: {
      label: 'MISSING PERSON',
      icon: '🔍',
      color: Colors.success,
    },
    [IncidentType.KIDNAPPING]: {
      label: 'KIDNAPPING',
      icon: '🚨',
      color: Colors.error,
    },
    [IncidentType.STOLEN_VEHICLE]: {
      label: 'TRAFFIC INCIDENT',
      icon: '🚧',
      color: Colors.warning,
    },
    [IncidentType.NATURAL_DISASTER]: {
      label: 'URGENT DISASTER',
      icon: '🏠',
      color: Colors.error,
    },
  };
  return configs[type] || { label: type, icon: '📋', color: Colors.textSecondary };
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


export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onPress }) => {
  const hasImages = incident.images && incident.images.length > 0;
  const firstImage = hasImages ? incident.images[0] : null;
  const typeConfig = getIncidentTypeConfig(incident.type);
  const isVerified = incident.status === IncidentStatus.VERIFIED;
  const timeAgo = getTimeAgo(incident.createdAt);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        {/* Image Section - Only show if image exists */}
        {firstImage && (
          <Image
            source={{ uri: firstImage }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        )}

        {/* Content Section */}
        <View style={[styles.contentSection, !firstImage && styles.contentSectionFull]}>
          {/* Header with Type and Verified Badge */}
          <View style={styles.header}>
            <View style={[styles.typeContainer, { backgroundColor: typeConfig.color + '15' }]}>
              <Text style={styles.typeIcon}>{typeConfig.icon}</Text>
              <Text style={[styles.typeText, { color: typeConfig.color }]}>
                {typeConfig.label}
              </Text>
            </View>
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
                <Text style={styles.verifiedText}>VERIFIED</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {incident.title}
          </Text>

          {/* Description */}
          <Text style={styles.description} numberOfLines={3}>
            {incident.description}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              {timeAgo && (
                <View style={styles.timeContainer}>
                  <Text style={styles.timeIcon}>🕐</Text>
                  <Text style={styles.timeText}>{timeAgo}</Text>
                </View>
              )}
              <View style={styles.locationContainer}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.location} numberOfLines={1}>
                  {incident.location.address}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onPress}>
              <Text style={styles.detailsLink}>
                {incident.type === IncidentType.STOLEN_VEHICLE ? 'View Map' : 'Details >'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Badge for Missing Person */}
          {incident.type === IncidentType.MISSING_PERSON && isVerified && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>ACTIVE</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 120,
    height: '100%',
    minHeight: 140,
    backgroundColor: Colors.border,
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
    backgroundColor: Colors.statusVerified,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  verifiedIcon: {
    fontSize: 12,
    color: Colors.success,
    marginRight: Spacing.xs,
    fontWeight: 'bold',
  },
  verifiedText: {
    ...Typography.overline,
    fontSize: 10,
    color: Colors.success,
    fontWeight: '700',
  },
  title: {
    ...Typography.h4,
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
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
    color: Colors.textTertiary,
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
    color: Colors.textTertiary,
    flex: 1,
  },
  detailsLink: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  activeText: {
    ...Typography.caption,
    color: Colors.textInverse,
    fontWeight: '700',
  },
});

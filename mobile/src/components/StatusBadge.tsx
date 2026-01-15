/**
 * Status Badge Component
 * Displays incident status with appropriate colors
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IncidentStatus } from '../types';
import { Colors } from '../theme/colors';

interface StatusBadgeProps {
  status: IncidentStatus;
  size?: 'small' | 'medium';
}

const getStatusConfig = (status: IncidentStatus) => {
  switch (status) {
    case IncidentStatus.PENDING:
      return {
        label: 'Pending',
        backgroundColor: Colors.statusPending,
        textColor: Colors.warning,
      };
    case IncidentStatus.VERIFIED:
      return {
        label: 'Verified',
        backgroundColor: Colors.statusVerified,
        textColor: Colors.success,
      };
    case IncidentStatus.FALSE:
      return {
        label: 'False',
        backgroundColor: Colors.statusFalse,
        textColor: Colors.error,
      };
    case IncidentStatus.RESOLVED:
      return {
        label: 'Resolved',
        backgroundColor: Colors.statusResolved,
        textColor: Colors.info,
      };
    default:
      return {
        label: 'Unknown',
        backgroundColor: Colors.border,
        textColor: Colors.textSecondary,
      };
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const config = getStatusConfig(status);
  
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
        size === 'small' && styles.badgeSmall,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: config.textColor },
          size === 'small' && styles.badgeTextSmall,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextSmall: {
    fontSize: 10,
  },
});

/**
 * Status Badge Component
 * Displays incident status with appropriate colors
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IncidentStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

interface StatusBadgeProps {
  status: IncidentStatus;
  size?: 'small' | 'medium';
}

const getStatusConfig = (status: IncidentStatus, colors: ReturnType<typeof import('../theme/colors').getColors>) => {
  switch (status) {
    case IncidentStatus.PENDING:
      return {
        label: 'Pending',
        backgroundColor: colors.statusPending,
        textColor: colors.warning,
      };
    case IncidentStatus.VERIFIED:
      return {
        label: 'Verified',
        backgroundColor: colors.statusVerified,
        textColor: colors.success,
      };
    case IncidentStatus.FALSE:
      return {
        label: 'False',
        backgroundColor: colors.statusFalse,
        textColor: colors.error,
      };
    case IncidentStatus.RESOLVED:
      return {
        label: 'Resolved',
        backgroundColor: colors.statusResolved,
        textColor: colors.info,
      };
    default:
      return {
        label: 'Unknown',
        backgroundColor: colors.border,
        textColor: colors.textSecondary,
      };
  }
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

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const { colors } = useTheme();
  const config = getStatusConfig(status, colors);
  
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

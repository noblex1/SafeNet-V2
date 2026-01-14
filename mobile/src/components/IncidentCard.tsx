/**
 * Incident Card Component
 * Displays incident information in a card format
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Incident, IncidentType, IncidentStatus } from '../types';

interface IncidentCardProps {
  incident: Incident;
  onPress: () => void;
}

const getIncidentTypeLabel = (type: IncidentType): string => {
  const labels: Record<IncidentType, string> = {
    [IncidentType.MISSING_PERSON]: 'Missing Person',
    [IncidentType.KIDNAPPING]: 'Kidnapping',
    [IncidentType.STOLEN_VEHICLE]: 'Stolen Vehicle',
    [IncidentType.NATURAL_DISASTER]: 'Natural Disaster',
  };
  return labels[type] || type;
};

const getStatusLabel = (status: IncidentStatus): string => {
  const labels: Record<IncidentStatus, string> = {
    [IncidentStatus.PENDING]: 'Pending',
    [IncidentStatus.VERIFIED]: 'Verified',
    [IncidentStatus.FALSE]: 'False',
    [IncidentStatus.RESOLVED]: 'Resolved',
  };
  return labels[status] || 'Unknown';
};

const getStatusColor = (status: IncidentStatus): string => {
  const colors: Record<IncidentStatus, string> = {
    [IncidentStatus.PENDING]: '#FF9500',
    [IncidentStatus.VERIFIED]: '#34C759',
    [IncidentStatus.FALSE]: '#FF3B30',
    [IncidentStatus.RESOLVED]: '#007AFF',
  };
  return colors[status] || '#999';
};

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{getIncidentTypeLabel(incident.type)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(incident.status) + '20' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(incident.status) }]}
          >
            {getStatusLabel(incident.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {incident.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {incident.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.location} numberOfLines={1}>
          📍 {incident.location.address}
        </Text>
        {incident.createdAt && (
          <Text style={styles.date}>
            {new Date(incident.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

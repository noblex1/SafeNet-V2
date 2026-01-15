/**
 * Incident Detail Screen
 * Displays detailed information about a specific incident
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Incident, IncidentType, IncidentStatus } from '../types';
import { incidentService } from '../services/incidentService';
import { apiService } from '../services/api';

interface IncidentDetailScreenProps {
  route: { params: { incidentId: string } };
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

export const IncidentDetailScreen: React.FC<IncidentDetailScreenProps> = ({
  route,
}) => {
  const { incidentId } = route.params;
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadIncident();
  }, [incidentId]);

  const loadIncident = async () => {
    try {
      setError(null);
      const data = await incidentService.getIncidentById(incidentId);
      setIncident(data);
    } catch (err: any) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
      console.error('Error loading incident:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !incident) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Incident not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>
            {getIncidentTypeLabel(incident.type)}
          </Text>
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

      <Text style={styles.title}>{incident.title}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionContent}>{incident.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.sectionContent}>
          📍 {incident.location.address}
        </Text>
        {incident.location.coordinates && (
          <Text style={styles.coordinates}>
            Coordinates: {incident.location.coordinates.lat.toFixed(6)},{' '}
            {incident.location.coordinates.lng.toFixed(6)}
          </Text>
        )}
      </View>

      {incident.verificationNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Notes</Text>
          <Text style={styles.sectionContent}>
            {incident.verificationNotes}
          </Text>
        </View>
      )}

      {/* Show images only when incident is verified */}
      {incident.status === IncidentStatus.VERIFIED && incident.images && incident.images.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images ({incident.images.length})</Text>
          <View style={styles.imagesGrid}>
            {incident.images.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(imageUrl)}
                style={styles.imageContainer}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reported</Text>
        <Text style={styles.sectionContent}>
          {incident.createdAt
            ? new Date(incident.createdAt).toLocaleString()
            : 'Unknown'}
        </Text>
      </View>

      {incident.verifiedAt && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verified</Text>
          <Text style={styles.sectionContent}>
            {new Date(incident.verifiedAt).toLocaleString()}
          </Text>
        </View>
      )}

      {incident.blockchainTxId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Blockchain Transaction</Text>
          <Text style={styles.blockchainText}>{incident.blockchainTxId}</Text>
        </View>
      )}

      {/* Image Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeContainer: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
  },
  coordinates: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  blockchainText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  imageContainer: {
    width: (Dimensions.get('window').width - 64) / 3, // 3 columns with padding
    height: (Dimensions.get('window').width - 64) / 3,
    marginRight: 8,
    marginBottom: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

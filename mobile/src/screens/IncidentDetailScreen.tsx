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
import { Ionicons } from '@expo/vector-icons';
import { Incident, IncidentType, IncidentStatus } from '../types';
import { incidentService } from '../services/incidentService';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';
import { StatusBadge } from '../components/StatusBadge';

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

const window = Dimensions.get('window');

const getIncidentTypeConfig = (
  type: IncidentType,
  colors: ReturnType<typeof import('../theme/colors').getColors>
) => {
  const configs: Record<
    IncidentType,
    { label: string; iconName: keyof typeof Ionicons.glyphMap; color: string }
  > = {
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
  return configs[type] || { label: getIncidentTypeLabel(type), iconName: 'document-text-outline', color: colors.textSecondary };
};

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: Spacing.lg,
      paddingBottom: Spacing.xxxl,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xxl,
      backgroundColor: colors.background,
    },
    errorText: {
      ...Typography.body,
      color: colors.error,
      textAlign: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    typePill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.glassBg,
      flexShrink: 1,
    },
    typeText: {
      ...Typography.overline,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.5,
      flexShrink: 1,
    },
    title: {
      ...Typography.h2,
      color: colors.textPrimary,
      marginBottom: Spacing.xl,
    },
    section: {
      backgroundColor: colors.glassBg,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    sectionTitle: {
      ...Typography.overline,
      fontSize: 11,
      color: colors.textTertiary,
      marginBottom: Spacing.sm,
      letterSpacing: 1,
      fontWeight: '700',
    },
    sectionContent: {
      ...Typography.body,
      color: colors.textPrimary,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    coordinates: {
      ...Typography.caption,
      color: colors.textTertiary,
      marginTop: Spacing.xs,
    },
    blockchainText: {
      ...Typography.caption,
      color: colors.textSecondary,
      fontFamily: 'monospace',
    },
    imagesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: Spacing.sm,
      gap: Spacing.sm,
    },
    imageContainer: {
      width: (window.width - (Spacing.lg * 2) - (Spacing.sm * 2)) / 3, // 3 columns + gaps
      height: (window.width - (Spacing.lg * 2) - (Spacing.sm * 2)) / 3,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.94)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCloseButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 1,
      backgroundColor: colors.glassBg,
      borderColor: colors.glassBorder,
      borderWidth: 1,
      borderRadius: BorderRadius.full,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalImage: {
      width: window.width,
      height: window.height,
    },
  });

export const IncidentDetailScreen: React.FC<IncidentDetailScreenProps> = ({
  route,
}) => {
  const { colors } = useTheme();
  const dynamicStyles = createStyles(colors);
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
      <View style={dynamicStyles.centerContainer}>
        <ActivityIndicator size="large" color={colors.neonCyan} />
      </View>
    );
  }

  if (error || !incident) {
    return (
      <View style={dynamicStyles.centerContainer}>
        <Text style={dynamicStyles.errorText}>{error || 'Incident not found'}</Text>
      </View>
    );
  }

  const typeConfig = getIncidentTypeConfig(incident.type, colors);

  return (
    <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
      <View style={dynamicStyles.header}>
        <View style={[dynamicStyles.typePill, { backgroundColor: typeConfig.color + '15' }]}>
          <Ionicons
            name={typeConfig.iconName}
            size={14}
            color={typeConfig.color}
            style={{ marginRight: Spacing.xs }}
          />
          <Text style={[dynamicStyles.typeText, { color: typeConfig.color }]} numberOfLines={1}>
            {typeConfig.label}
          </Text>
        </View>
        <StatusBadge status={incident.status} />
      </View>

      <Text style={dynamicStyles.title}>{incident.title}</Text>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Description</Text>
        <Text style={dynamicStyles.sectionContent}>{incident.description}</Text>
      </View>

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Location</Text>
        <View style={dynamicStyles.locationRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.textTertiary}
            style={{ marginTop: 2, marginRight: Spacing.sm }}
          />
          <Text style={[dynamicStyles.sectionContent, { flex: 1 }]}>
            {incident.location.address}
          </Text>
        </View>
        {incident.location.coordinates && (
          <Text style={dynamicStyles.coordinates}>
            Coordinates: {incident.location.coordinates.lat.toFixed(6)},{' '}
            {incident.location.coordinates.lng.toFixed(6)}
          </Text>
        )}
      </View>

      {incident.verificationNotes && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Verification Notes</Text>
          <Text style={dynamicStyles.sectionContent}>
            {incident.verificationNotes}
          </Text>
        </View>
      )}

      {/* Show images only when incident is verified */}
      {incident.status === IncidentStatus.VERIFIED && incident.images && incident.images.length > 0 && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Images ({incident.images.length})</Text>
          <View style={dynamicStyles.imagesGrid}>
            {incident.images.map((imageUrl, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(imageUrl)}
                style={dynamicStyles.imageContainer}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={dynamicStyles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Reported</Text>
        <Text style={dynamicStyles.sectionContent}>
          {incident.createdAt
            ? new Date(incident.createdAt).toLocaleString()
            : 'Unknown'}
        </Text>
      </View>

      {incident.verifiedAt && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Verified</Text>
          <Text style={dynamicStyles.sectionContent}>
            {new Date(incident.verifiedAt).toLocaleString()}
          </Text>
        </View>
      )}

      {incident.blockchainTxId && (
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Blockchain Transaction</Text>
          <Text style={dynamicStyles.blockchainText}>{incident.blockchainTxId}</Text>
        </View>
      )}

      {/* Image Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={dynamicStyles.modalContainer}>
          <TouchableOpacity
            style={dynamicStyles.modalCloseButton}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={dynamicStyles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

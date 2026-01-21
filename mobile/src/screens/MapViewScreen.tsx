/**
 * Map View Screen
 * Displays incidents on a map
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Incident } from '../types';
import { incidentService } from '../services/incidentService';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';

// Conditionally import react-native-maps (not available on web)
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  try {
    // @ts-ignore - react-native-maps is not available on web
    const maps = require('react-native-maps');
    MapView = maps.default || maps;
    Marker = maps.Marker;
    PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  } catch (e) {
    // react-native-maps not available (e.g., on web)
    console.warn('react-native-maps not available:', e);
  }
}

interface MapViewScreenProps {
  navigation: any;
}

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      flex: 1,
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
    legend: {
      position: 'absolute',
      bottom: Spacing.xl,
      left: Spacing.xl,
      right: Spacing.xl,
      backgroundColor: colors.glassBg,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
    },
    legendText: {
      ...Typography.bodySmall,
      color: colors.textPrimary,
      fontWeight: '600',
    },
  });

const MapViewScreen: React.FC<MapViewScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 9.0820, // Default to Nigeria center
    longitude: 8.6753,
    latitudeDelta: 5.0,
    longitudeDelta: 5.0,
  });

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setError(null);
      const alerts = await incidentService.getVerifiedAlerts();
      setIncidents(alerts.filter((incident) => incident.location.coordinates));
      
      // Set map region to first incident if available
      if (alerts.length > 0 && alerts[0].location.coordinates) {
        const firstIncident = alerts[0];
        setRegion({
          latitude: firstIncident.location.coordinates!.lat,
          longitude: firstIncident.location.coordinates!.lng,
          latitudeDelta: 2.0,
          longitudeDelta: 2.0,
        });
      }
    } catch (err: any) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
      console.error('Error loading incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (incident: Incident) => {
    navigation.navigate('IncidentDetail', { incidentId: incident._id });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.neonCyan} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Web fallback: Show list view instead of map
  if (Platform.OS === 'web' || !MapView) {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
          <View style={[styles.legend, { position: 'relative', marginBottom: Spacing.md }]}>
            <Text style={styles.legendText}>
              {incidents.length} verified incident{incidents.length !== 1 ? 's' : ''} found
            </Text>
          </View>
          {incidents.length === 0 ? (
            <View style={styles.centerContainer}>
              <Ionicons name="map-outline" size={64} color={colors.textTertiary} />
              <Text style={[styles.errorText, { marginTop: Spacing.md, color: colors.textTertiary }]}>
                No incidents with location data available
              </Text>
            </View>
          ) : (
            incidents.map((incident) => {
              if (!incident.location.coordinates) return null;
              return (
                <TouchableOpacity
                  key={incident._id}
                  style={[
                    {
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: BorderRadius.md,
                      padding: Spacing.md,
                      marginBottom: Spacing.sm,
                    },
                  ]}
                  onPress={() => handleMarkerPress(incident)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
                    <Ionicons name="location" size={20} color={colors.neonCyan} />
                    <Text style={[Typography.body, { color: colors.textPrimary, marginLeft: Spacing.xs, flex: 1 }]}>
                      {incident.title}
                    </Text>
                  </View>
                  <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
                    {incident.description.substring(0, 100)}
                    {incident.description.length > 100 ? '...' : ''}
                  </Text>
                  <Text style={[Typography.caption, { color: colors.textTertiary, marginTop: Spacing.xs }]}>
                    Lat: {incident.location.coordinates.lat.toFixed(4)}, Lng: {incident.location.coordinates.lng.toFixed(4)}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    );
  }

  // Native: Show map view
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {incidents.map((incident) => {
          if (!incident.location.coordinates) return null;
          
          return (
            <Marker
              key={incident._id}
              coordinate={{
                latitude: incident.location.coordinates.lat,
                longitude: incident.location.coordinates.lng,
              }}
              title={incident.title}
              description={incident.description.substring(0, 50) + '...'}
              onPress={() => handleMarkerPress(incident)}
            />
          );
        })}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendText}>
          {incidents.length} verified incident{incidents.length !== 1 ? 's' : ''} on map
        </Text>
      </View>
    </View>
  );
};

export default MapViewScreen;

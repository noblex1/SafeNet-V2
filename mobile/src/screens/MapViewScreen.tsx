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
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Incident } from '../types';
import { incidentService } from '../services/incidentService';
import { apiService } from '../services/api';

interface MapViewScreenProps {
  navigation: any;
}

const MapViewScreen: React.FC<MapViewScreenProps> = ({ navigation }) => {
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
        <ActivityIndicator size="large" color="#007AFF" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});

export default MapViewScreen;

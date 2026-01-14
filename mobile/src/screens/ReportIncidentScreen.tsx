/**
 * Report Incident Screen
 * Form for reporting new incidents
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { IncidentType, CreateIncidentData } from '../types';
import { incidentService } from '../services/incidentService';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  validateIncidentTitle,
  validateIncidentDescription,
  validateLocation,
} from '../utils/validation';
import { apiService } from '../services/api';

interface ReportIncidentScreenProps {
  navigation: any;
}

const INCIDENT_TYPES: { label: string; value: IncidentType }[] = [
  { label: 'Missing Person', value: IncidentType.MISSING_PERSON },
  { label: 'Kidnapping', value: IncidentType.KIDNAPPING },
  { label: 'Stolen Vehicle', value: IncidentType.STOLEN_VEHICLE },
  { label: 'Natural Disaster', value: IncidentType.NATURAL_DISASTER },
];

export const ReportIncidentScreen: React.FC<ReportIncidentScreenProps> = ({
  navigation,
}) => {
  const [formData, setFormData] = useState<CreateIncidentData>({
    type: IncidentType.MISSING_PERSON,
    title: '',
    description: '',
    location: {
      address: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    if (field === 'address') {
      setFormData({
        ...formData,
        location: { ...formData.location, address: value },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get your current location'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        const addressString = `${address.street || ''} ${address.city || ''} ${address.region || ''}`.trim();
        
        setFormData({
          ...formData,
          location: {
            address: addressString || `${latitude}, ${longitude}`,
            coordinates: { lat: latitude, lng: longitude },
          },
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location');
    } finally {
      setGettingLocation(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const titleValidation = validateIncidentTitle(formData.title);
    if (!titleValidation.valid) {
      newErrors.title = titleValidation.message || 'Invalid title';
    }

    const descriptionValidation = validateIncidentDescription(formData.description);
    if (!descriptionValidation.valid) {
      newErrors.description = descriptionValidation.message || 'Invalid description';
    }

    const locationValidation = validateLocation(formData.location.address);
    if (!locationValidation.valid) {
      newErrors.address = locationValidation.message || 'Invalid location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await incidentService.createIncident(formData);
      Alert.alert(
        'Success',
        'Incident reported successfully. It will be reviewed by authorities.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = apiService.getErrorMessage(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Report Incident</Text>
          <Text style={styles.subtitle}>
            Provide details about the incident you want to report
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Incident Type</Text>
            <View style={styles.typeContainer}>
              {INCIDENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    formData.type === type.value && styles.typeButtonActive,
                  ]}
                  onPress={() => updateField('type', type.value)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === type.value && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Title"
              placeholder="Brief title for the incident"
              value={formData.title}
              onChangeText={(text) => updateField('title', text)}
              error={errors.title}
              maxLength={200}
            />

            <Input
              label="Description"
              placeholder="Provide detailed description (minimum 20 characters)"
              value={formData.description}
              onChangeText={(text) => updateField('description', text)}
              error={errors.description}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={2000}
            />

            <View style={styles.locationContainer}>
              <Input
                label="Location"
                placeholder="Enter location address"
                value={formData.location.address}
                onChangeText={(text) => updateField('address', text)}
                error={errors.address}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={getCurrentLocation}
                disabled={gettingLocation}
              >
                <Text style={styles.locationButtonText}>
                  {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Submit Report"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  typeButtonTextActive: {
    color: '#FFF',
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  submitButton: {
    marginTop: 8,
  },
});

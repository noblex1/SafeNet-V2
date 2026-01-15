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
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
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
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

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

  const pickImages = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Camera roll permission is required to add images'
        );
        return;
      }

      // Check how many images can still be added
      const remainingSlots = 5 - selectedImages.length;
      if (remainingSlots <= 0) {
        Alert.alert('Limit Reached', 'You can add a maximum of 5 images');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        setSelectedImages([...selectedImages, ...newImages].slice(0, 5));
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
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
      await incidentService.createIncident(formData, selectedImages.length > 0 ? selectedImages : undefined);
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Report Incident</Text>
            <Text style={styles.subtitle}>
              Help keep your community safe by reporting incidents
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Incident Type</Text>
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
            </View>

            <View style={styles.section}>
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
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <Input
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
                <Text style={styles.locationButtonIcon}>📍</Text>
                <Text style={styles.locationButtonText}>
                  {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Images (Optional) {selectedImages.length > 0 && `(${selectedImages.length}/5)`}
              </Text>
              <TouchableOpacity
                style={[
                  styles.addImageButton,
                  selectedImages.length >= 5 && styles.addImageButtonDisabled,
                ]}
                onPress={pickImages}
                disabled={selectedImages.length >= 5}
              >
                <Text style={styles.addImageButtonIcon}>📷</Text>
                <Text style={styles.addImageButtonText}>
                  {selectedImages.length >= 5 ? 'Maximum 5 images' : 'Add Images'}
                </Text>
              </TouchableOpacity>

              {selectedImages.length > 0 && (
                <View style={styles.imagesGrid}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Image source={{ uri }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Text style={styles.removeImageText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
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
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  content: {
    flex: 1,
  },
  headerSection: {
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.border,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.textInverse,
  },
  locationButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  locationButtonIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  locationButtonText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  addImageButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addImageButtonDisabled: {
    opacity: 0.5,
    borderColor: Colors.border,
  },
  addImageButtonIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  addImageButtonText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  removeImageText: {
    color: Colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

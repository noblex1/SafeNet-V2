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
  ToastAndroid,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import { useTheme } from '../context/ThemeContext';
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

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.label,
    color: colors.textPrimary,
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
    backgroundColor: colors.border,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.textInverse,
  },
  locationButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  locationButtonIcon: {
    marginRight: Spacing.sm,
  },
  locationButtonText: {
    ...Typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  addImageButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addImageButtonDisabled: {
    opacity: 0.5,
    borderColor: colors.border,
  },
  addImageButtonIcon: {
    marginRight: Spacing.sm,
  },
  addImageButtonText: {
    ...Typography.bodyMedium,
    color: colors.primary,
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
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  removeImageText: {},
});

export const ReportIncidentScreen: React.FC<ReportIncidentScreenProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();
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
      const message = 'Incident reported successfully. It will be reviewed by authorities.';

      // Toast (Android) / fallback alert (iOS + web)
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', message);
      }

      // Go back immediately; Home screen will auto-refresh on focus
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = apiService.getErrorMessage(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = createStyles(colors);

  return (
    <KeyboardAvoidingView
      style={dynamicStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={dynamicStyles.content}>
          <View style={dynamicStyles.headerSection}>
            <Text style={dynamicStyles.title}>Report Incident</Text>
            <Text style={dynamicStyles.subtitle}>
              Help keep your community safe by reporting incidents
            </Text>
          </View>

          <View style={dynamicStyles.form}>
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Incident Type</Text>
              <View style={dynamicStyles.typeContainer}>
              {INCIDENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    dynamicStyles.typeButton,
                    formData.type === type.value && dynamicStyles.typeButtonActive,
                  ]}
                  onPress={() => updateField('type', type.value)}
                >
                  <Text
                    style={[
                      dynamicStyles.typeButtonText,
                      formData.type === type.value && dynamicStyles.typeButtonTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
              </View>
            </View>

            <View style={dynamicStyles.section}>
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

            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>Location</Text>
              <Input
                placeholder="Enter location address"
                value={formData.location.address}
                onChangeText={(text) => updateField('address', text)}
                error={errors.address}
              />
              <TouchableOpacity
                style={dynamicStyles.locationButton}
                onPress={getCurrentLocation}
                disabled={gettingLocation}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={colors.neonCyan}
                  style={dynamicStyles.locationButtonIcon}
                />
                <Text style={dynamicStyles.locationButtonText}>
                  {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.sectionTitle}>
                Images (Optional) {selectedImages.length > 0 && `(${selectedImages.length}/5)`}
              </Text>
              <TouchableOpacity
                style={[
                  dynamicStyles.addImageButton,
                  selectedImages.length >= 5 && dynamicStyles.addImageButtonDisabled,
                ]}
                onPress={pickImages}
                disabled={selectedImages.length >= 5}
              >
                <Ionicons
                  name="camera-outline"
                  size={18}
                  color={colors.neonCyan}
                  style={dynamicStyles.addImageButtonIcon}
                />
                <Text style={dynamicStyles.addImageButtonText}>
                  {selectedImages.length >= 5 ? 'Maximum 5 images' : 'Add Images'}
                </Text>
              </TouchableOpacity>

              {selectedImages.length > 0 && (
                <View style={dynamicStyles.imagesGrid}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={dynamicStyles.imageWrapper}>
                      <Image source={{ uri }} style={dynamicStyles.imagePreview} />
                      <TouchableOpacity
                        style={dynamicStyles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close" size={18} color={colors.textInverse} />
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
              style={dynamicStyles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

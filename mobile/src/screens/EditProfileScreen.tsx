/**
 * Edit Profile Screen
 * Allows users to edit their profile information
 */

import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { apiService } from '../services/api';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface EditProfileScreenProps {
  navigation: any;
}

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...Typography.h1,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    ...Typography.h1,
    color: colors.textInverse,
    fontWeight: '700',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neonCyan,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.label,
    color: colors.textPrimary,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: Spacing.md,
  },
});

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
}) => {
  const { user, updateProfile, uploadProfilePicture } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dynamicStyles = createStyles(colors);

  // Update profile picture when user changes
  useEffect(() => {
    setProfilePicture(user?.profilePicture);
  }, [user?.profilePicture]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length > 50) {
      newErrors.firstName = 'First name must be 50 characters or less';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length > 50) {
      newErrors.lastName = 'Last name must be 50 characters or less';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
      });

      const message = 'Profile updated successfully';

      // Toast (Android) / fallback alert (iOS + web)
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        Alert.alert('Success', message);
      }

      // Navigate back
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = apiService.getErrorMessage(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const getInitials = () => {
    const first = formData.firstName?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || 'U';
    const last = formData.lastName?.[0]?.toUpperCase() || user?.lastName?.[0]?.toUpperCase() || '';
    return `${first}${last}`;
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Camera roll permission is required to upload profile picture'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for profile picture
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfilePicture(imageUri);
        
        // Upload immediately
        setUploadingImage(true);
        try {
          await uploadProfilePicture(imageUri);
          const message = 'Profile picture updated successfully';
          if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
          } else {
            Alert.alert('Success', message);
          }
        } catch (error: any) {
          const errorMessage = apiService.getErrorMessage(error);
          Alert.alert('Error', errorMessage);
          // Revert to original picture on error
          setProfilePicture(user?.profilePicture);
        } finally {
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  return (
    <KeyboardAvoidingView
      style={dynamicStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView
        style={dynamicStyles.content}
        contentContainerStyle={dynamicStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Avatar */}
        <View style={dynamicStyles.profileCard}>
          <View style={dynamicStyles.avatarContainer}>
            <View style={dynamicStyles.avatar}>
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={dynamicStyles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={dynamicStyles.avatarText}>{getInitials()}</Text>
              )}
              {uploadingImage && (
                <View style={dynamicStyles.uploadingOverlay}>
                  <ActivityIndicator size="small" color={colors.textInverse} />
                </View>
              )}
            </View>
            <TouchableOpacity
              style={dynamicStyles.editAvatarButton}
              onPress={pickImage}
              disabled={uploadingImage}
            >
              <Ionicons name="camera" size={16} color="#0a0a0a" />
            </TouchableOpacity>
          </View>
          <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
            Tap camera icon to change photo
          </Text>
          <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: Spacing.xs }]}>
            {user?.email}
          </Text>
        </View>

        {/* Form */}
        <View style={dynamicStyles.form}>
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Personal Information</Text>
            
            <Input
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={(text) => updateField('firstName', text)}
              error={errors.firstName}
              maxLength={50}
              autoCapitalize="words"
            />

            <Input
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChangeText={(text) => updateField('lastName', text)}
              error={errors.lastName}
              maxLength={50}
              autoCapitalize="words"
            />

            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(text) => updateField('phone', text)}
              error={errors.phone}
              keyboardType="phone-pad"
            />
          </View>

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            style={dynamicStyles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

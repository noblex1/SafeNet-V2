/**
 * Login Screen
 * User authentication screen
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
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { validateEmail } from '../utils/validation';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      // Navigation will be handled by AuthContext state change
    } catch (error: any) {
      const errorMessage = apiService.getErrorMessage(error);
      Alert.alert('Login Failed', errorMessage);
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
          {/* Logo/Icon Section */}
          <View style={dynamicStyles.logoContainer}>
            <View style={dynamicStyles.logoCircle}>
              <Text style={dynamicStyles.logoText}>🛡️</Text>
            </View>
          </View>

          <Text style={dynamicStyles.title}>Welcome Back</Text>
          <Text style={dynamicStyles.subtitle}>Sign in to continue using SafeNet</Text>

          <View style={dynamicStyles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <View style={dynamicStyles.registerContainer}>
              <Text style={dynamicStyles.registerText}>Don't have an account? </Text>
              <Text
                style={dynamicStyles.registerLink}
                onPress={() => navigation.navigate('Register')}
              >
                Sign Up
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.xxl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    color: colors.textPrimary,
  },
  subtitle: {
    ...Typography.bodySmall,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
  },
  registerText: {
    ...Typography.bodySmall,
    color: colors.textSecondary,
  },
  registerLink: {
    ...Typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
});

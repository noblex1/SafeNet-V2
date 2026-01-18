/**
 * Reusable Button Component
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { BorderRadius, Spacing } from '../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  button: {
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.lg, // Rounded-2xl equivalent (16px)
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    overflow: 'hidden',
  },
  primary: {
    // Gradient-like effect using background color with glow
    backgroundColor: colors.neonCyan,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  secondary: {
    // Glass-effect with neon-cyan border
    backgroundColor: colors.glassBg,
    borderWidth: 1.5,
    borderColor: colors.neonCyan,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.neonCyan,
  },
  danger: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  primaryText: {
    color: '#0a0a0a', // Dark text on neon cyan
  },
  secondaryText: {
    color: colors.neonCyan,
  },
  outlineText: {
    color: colors.neonCyan,
  },
  dangerText: {
    color: colors.textInverse,
  },
});

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const dynamicStyles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[
        dynamicStyles.button,
        dynamicStyles[variant],
        isDisabled && dynamicStyles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'outline'
              ? colors.primary
              : variant === 'danger'
              ? colors.textInverse
              : colors.textInverse
          }
        />
      ) : (
        <Text style={[dynamicStyles.text, dynamicStyles[`${variant}Text`], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

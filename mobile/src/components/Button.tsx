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

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  button: {
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.success,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.textInverse,
  },
  secondaryText: {
    color: colors.textInverse,
  },
  outlineText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.textInverse,
  },
});

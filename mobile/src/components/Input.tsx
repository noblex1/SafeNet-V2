/**
 * Reusable Input Component
 */

import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  ...props
}) => {
  const { colors } = useTheme();
  const dynamicStyles = createStyles(colors);

  return (
    <View style={[dynamicStyles.container, containerStyle]}>
      {label && <Text style={dynamicStyles.label}>{label}</Text>}
      <TextInput
        style={[dynamicStyles.input, error && dynamicStyles.inputError]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.label,
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
});

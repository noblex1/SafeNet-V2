/**
 * Floating Action Button Component
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Spacing } from '../theme/spacing';

interface FloatingActionButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

const createStyles = (colors: ReturnType<typeof import('../theme/colors').getColors>) => StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  icon: {
    fontSize: 32,
    color: colors.textInverse,
    fontWeight: '300',
  },
});

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  style,
  children,
}) => {
  const { colors } = useTheme();
  const dynamicStyles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[dynamicStyles.fab, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {children || <Text style={dynamicStyles.icon}>+</Text>}
    </TouchableOpacity>
  );
};

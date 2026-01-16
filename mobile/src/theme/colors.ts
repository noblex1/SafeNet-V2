/**
 * SafeNet Color Palette
 * Calm, trustworthy, safety-oriented colors
 * Supports both light and dark themes
 */

export type Theme = 'light' | 'dark';

const LightColors = {
  // Primary - Calm safety green/teal
  primary: '#10B981', // Emerald green - trustworthy, safe
  primaryDark: '#059669',
  primaryLight: '#D1FAE5',
  
  // Status Colors
  success: '#10B981', // Verified
  warning: '#F59E0B', // Pending - amber
  error: '#EF4444', // Critical/False
  info: '#3B82F6', // Resolved - blue
  
  // Backgrounds
  background: '#F9FAFB', // Light neutral
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // Text
  textPrimary: '#111827', // Dark gray
  textSecondary: '#6B7280', // Medium gray
  textTertiary: '#9CA3AF', // Light gray
  textInverse: '#FFFFFF',
  
  // Borders & Dividers
  border: '#E5E7EB',
  divider: '#E5E7EB',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
  
  // Status Badge Backgrounds (with opacity)
  statusPending: '#FEF3C7', // Amber light
  statusVerified: '#D1FAE5', // Green light
  statusFalse: '#FEE2E2', // Red light
  statusResolved: '#DBEAFE', // Blue light
} as const;

const DarkColors = {
  // Primary - Calm safety green/teal (lighter for dark mode)
  primary: '#34D399', // Lighter emerald green for dark mode
  primaryDark: '#10B981',
  primaryLight: '#064E3B',
  
  // Status Colors (adjusted for dark mode)
  success: '#34D399',
  warning: '#FBBF24', // Lighter amber
  error: '#F87171', // Softer red
  info: '#60A5FA', // Lighter blue
  
  // Backgrounds
  background: '#111827', // Dark gray
  surface: '#1F2937', // Slightly lighter dark gray
  surfaceElevated: '#374151', // Even lighter for elevated surfaces
  
  // Text (inverted for dark mode)
  textPrimary: '#F9FAFB', // Light gray
  textSecondary: '#D1D5DB', // Medium light gray
  textTertiary: '#9CA3AF', // Same as light mode
  textInverse: '#111827', // Dark for inverse
  
  // Borders & Dividers (lighter in dark mode)
  border: '#374151',
  divider: '#374151',
  
  // Shadows (lighter shadows in dark mode)
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  
  // Status Badge Backgrounds (darker for dark mode)
  statusPending: '#78350F', // Dark amber
  statusVerified: '#064E3B', // Dark green
  statusFalse: '#7F1D1D', // Dark red
  statusResolved: '#1E3A8A', // Dark blue
} as const;

export const getColors = (theme: Theme) => {
  return theme === 'dark' ? DarkColors : LightColors;
};

// Default export for backward compatibility (light theme)
export const Colors = LightColors;

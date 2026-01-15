/**
 * SafeNet Color Palette
 * Calm, trustworthy, safety-oriented colors
 */

export const Colors = {
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

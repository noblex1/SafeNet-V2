/**
 * SafeNet Color Palette
 * Dark, futuristic cyberpunk/Web3 aesthetic
 * Glassmorphism with neon cyan accents
 */

export type Theme = 'light' | 'dark';

// Cyberpunk color constants
const NEON_CYAN = '#00f5ff';
const NEON_BLUE = '#0066cc';
const ELECTRIC_PURPLE = '#6366f1';
const DARK_SLATE_BASE = 'hsl(220, 27%, 8%)'; // HSL: 220° 27% 8%
const DARK_SLATE_800 = 'hsl(220, 27%, 12%)';
const DARK_SLATE_900 = 'hsl(220, 27%, 10%)';
const NEAR_WHITE = 'hsl(210, 20%, 98%)';

const LightColors = {
  // Primary - Neon cyan for light mode (darker variant)
  primary: '#00a8b5', // Darker cyan for light backgrounds
  primaryDark: '#008a96',
  primaryLight: '#00e5ff',
  
  // Status Colors
  success: '#00f5ff', // Neon cyan - Verified
  warning: '#fbbf24', // Amber - Pending
  error: '#ef4444', // Red - Critical/False
  info: '#0066cc', // Electric blue - Resolved
  
  // Backgrounds - Light mode uses lighter slate
  background: '#f1f5f9', // Light slate
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  
  // Text
  textPrimary: '#0f172a', // Dark slate
  textSecondary: '#475569', // Medium slate
  textTertiary: '#94a3b8', // Light slate
  textInverse: '#ffffff',
  
  // Borders & Dividers
  border: '#e2e8f0',
  divider: '#e2e8f0',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
  
  // Glassmorphism (for light mode - subtle)
  glassBg: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
  
  // Neon glow colors
  neonCyan: NEON_CYAN,
  neonBlue: NEON_BLUE,
  neonPurple: ELECTRIC_PURPLE,
  
  // Status Badge Backgrounds (with opacity)
  statusPending: 'rgba(251, 191, 36, 0.15)',
  statusVerified: 'rgba(0, 245, 255, 0.15)',
  statusFalse: 'rgba(239, 68, 68, 0.15)',
  statusResolved: 'rgba(0, 102, 204, 0.15)',
} as const;

const DarkColors = {
  // Primary - Neon cyan for dark mode
  primary: NEON_CYAN, // #00f5ff
  primaryDark: '#00a8b5',
  primaryLight: '#33ffff',
  
  // Status Colors
  success: NEON_CYAN, // Neon cyan - Verified
  warning: '#fbbf24', // Amber - Pending
  error: '#f87171', // Softer red
  info: '#60a5fa', // Lighter blue
  
  // Backgrounds - Dark slate base
  background: DARK_SLATE_BASE, // hsl(220, 27%, 8%)
  surface: DARK_SLATE_800, // hsl(220, 27%, 12%)
  surfaceElevated: DARK_SLATE_900, // hsl(220, 27%, 10%)
  
  // Text - Near white hierarchy
  textPrimary: NEAR_WHITE, // hsl(210, 20%, 98%)
  textSecondary: 'hsl(210, 20%, 80%)', // Gray-300
  textTertiary: 'hsl(210, 20%, 65%)', // Gray-400
  textInverse: DARK_SLATE_BASE,
  
  // Borders & Dividers
  border: 'rgba(255, 255, 255, 0.1)', // border-white/10
  divider: 'rgba(255, 255, 255, 0.1)',
  
  // Shadows - Cyan glow
  shadow: 'rgba(0, 245, 255, 0.2)',
  shadowDark: 'rgba(0, 245, 255, 0.4)',
  
  // Glassmorphism - Dark mode signature
  glassBg: 'rgba(255, 255, 255, 0.05)', // bg-white/5
  glassBorder: 'rgba(255, 255, 255, 0.1)', // border-white/10
  
  // Neon glow colors
  neonCyan: NEON_CYAN,
  neonBlue: NEON_BLUE,
  neonPurple: ELECTRIC_PURPLE,
  
  // Status Badge Backgrounds (darker for dark mode with neon tints)
  statusPending: 'rgba(251, 191, 36, 0.15)',
  statusVerified: 'rgba(0, 245, 255, 0.15)',
  statusFalse: 'rgba(248, 113, 113, 0.15)',
  statusResolved: 'rgba(96, 165, 250, 0.15)',
} as const;

export const getColors = (theme: Theme) => {
  return theme === 'dark' ? DarkColors : LightColors;
};

// Default export for backward compatibility (light theme)
export const Colors = LightColors;

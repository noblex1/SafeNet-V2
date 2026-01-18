/**
 * SafeNet Typography System
 * Inter font with gradient text support for cyberpunk aesthetic
 * Font weights: 300-700 for body, 900 for headings (Orbitron-style bold)
 */

export const Typography = {
  // Headings - Bold, prominent (simulating Orbitron 900 weight)
  h1: {
    fontSize: 32,
    fontWeight: '900' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '900' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  
  // Body - Inter with 1.6 line-height (24/16 = 1.5, close approximation)
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24, // 1.5 ratio
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20, // ~1.43 ratio
  },
  
  // Labels & Meta
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
} as const;

// Gradient colors for text (used with LinearGradient components)
export const GradientColors = {
  cyanToPurple: ['#22d3ee', '#3b82f6', '#6366f1'], // cyan-400 → blue-500 → purple-600
  cyanToBlue: ['#00f5ff', '#0066cc'], // neon-cyan → electric-blue
} as const;

/**
 * SafeNet Typography System
 * Clear hierarchy for readability and trust
 */

export const Typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    color: '#111827',
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    color: '#111827',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: '#111827',
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: '#111827',
  },
  
  // Body
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: '#111827',
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    color: '#111827',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: '#6B7280',
  },
  
  // Labels & Meta
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    color: '#374151',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: '#9CA3AF',
  },
  overline: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 16,
    color: '#6B7280',
    textTransform: 'uppercase' as const,
  },
} as const;

/**
 * Design Tokens System
 * Centralized design constants for colors, spacing, typography, and components
 * Supports both light and dark modes
 */

// ============================================================================
// COLOR SYSTEM
// ============================================================================

export const colors = {
  // Primary Colors (Letterboxd-inspired blue)
  primary: {
    light: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    dark: {
      50: '#0f172a',
      100: '#0c0e1f',
      200: '#1e293b',
      300: '#334155',
      400: '#475569',
      500: '#64748b',
      600: '#94a3b8',
      700: '#cbd5e1',
      800: '#e2e8f0',
      900: '#f1f5f9',
    },
  },

  // Accent Colors (Letterboxd-inspired gold/amber)
  accent: {
    light: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    dark: {
      50: '#78350f',
      100: '#92400e',
      200: '#b45309',
      300: '#d97706',
      400: '#f59e0b',
      500: '#fbbf24',
      600: '#fcd34d',
      700: '#fde68a',
      800: '#fef3c7',
      900: '#fffbeb',
    },
  },

  // Neutral/Gray
  neutral: {
    light: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    dark: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },

  // Status Colors
  success: {
    light: '#10b981',
    dark: '#34d399',
  },
  warning: {
    light: '#f59e0b',
    dark: '#fbbf24',
  },
  error: {
    light: '#ef4444',
    dark: '#f87171',
  },
  info: {
    light: '#3b82f6',
    dark: '#60a5fa',
  },

  // Semantic Colors
  background: {
    light: '#ffffff',
    dark: '#0f172a',
  },
  foreground: {
    light: '#1e293b',
    dark: '#f1f5f9',
  },
  card: {
    light: '#f0f4ff',
    dark: '#1e293b',
  },
  border: {
    light: '#e2e8f0',
    dark: '#334155',
  },
  muted: {
    light: '#f1f5f9',
    dark: '#1e293b',
  },
} as const;

// ============================================================================
// SPACING SYSTEM (Rem-based)
// ============================================================================

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '5rem',   // 80px
  '5xl': '6rem',   // 96px
} as const;

// Spacing scale as number for calculations (in rem)
export const spacingScale = {
  xs: 0.25,
  sm: 0.5,
  md: 1,
  lg: 1.5,
  xl: 2,
  '2xl': 3,
  '3xl': 4,
  '4xl': 5,
  '5xl': 6,
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'var(--font-geist-mono), "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
  },

  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' },      // 12px
    sm: { size: '0.875rem', lineHeight: '1.25rem' },  // 14px
    base: { size: '1rem', lineHeight: '1.5rem' },     // 16px
    lg: { size: '1.125rem', lineHeight: '1.75rem' },  // 18px
    xl: { size: '1.25rem', lineHeight: '1.75rem' },   // 20px
    '2xl': { size: '1.5rem', lineHeight: '2rem' },    // 24px
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' }, // 30px
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' }, // 36px
    '5xl': { size: '3rem', lineHeight: '1' },         // 48px
  } as const,

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  } as const,

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  } as const,
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.625rem',  // 10px (default, from existing system)
  lg: '0.875rem',  // 14px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Component-specific border radius (design tokens approach)
export const componentRadius = {
  // Cards and containers
  card: 'rounded-lg',      // 14px - larger surfaces
  section: 'rounded-lg',   // 14px - major sections

  // Buttons and interactive elements
  button: 'rounded-md',    // 10px - primary buttons
  smallButton: 'rounded-sm', // 4px - compact buttons

  // Inputs and form elements
  input: 'rounded-sm',     // 4px - form inputs
  select: 'rounded-sm',    // 4px - form selects

  // Special elements
  avatar: 'rounded-full',  // circular avatars
  badge: 'rounded-full',   // circular badges
  pill: 'rounded-full',    // pill-shaped elements

  // Default for UI components
  default: 'rounded-md',   // 10px - fallback
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const components = {
  button: {
    sizes: {
      sm: {
        padding: `${spacingScale.sm}rem ${spacingScale.md}rem`,
        fontSize: typography.fontSize.sm.size,
        lineHeight: typography.fontSize.sm.lineHeight,
      },
      md: {
        padding: `${spacingScale.md}rem ${spacingScale.lg}rem`,
        fontSize: typography.fontSize.base.size,
        lineHeight: typography.fontSize.base.lineHeight,
      },
      lg: {
        padding: `${spacingScale.lg}rem ${spacingScale.xl}rem`,
        fontSize: typography.fontSize.lg.size,
        lineHeight: typography.fontSize.lg.lineHeight,
      },
    },

    variants: {
      primary: {
        light: {
          bg: colors.primary.light[600],
          text: '#ffffff',
          hover: colors.primary.light[700],
          active: colors.primary.light[800],
        },
        dark: {
          bg: colors.primary.light[600],
          text: '#ffffff',
          hover: colors.primary.light[700],
          active: colors.primary.light[800],
        },
      },

      secondary: {
        light: {
          bg: colors.neutral.light[200],
          text: colors.neutral.light[900],
          hover: colors.neutral.light[300],
          active: colors.neutral.light[400],
        },
        dark: {
          bg: colors.neutral.dark[700],
          text: colors.neutral.dark[100],
          hover: colors.neutral.dark[600],
          active: colors.neutral.dark[500],
        },
      },

      ghost: {
        light: {
          bg: 'transparent',
          text: colors.primary.light[600],
          hover: colors.primary.light[50],
          active: colors.primary.light[100],
        },
        dark: {
          bg: 'transparent',
          text: colors.primary.light[400],
          hover: 'rgba(255, 255, 255, 0.1)',
          active: 'rgba(255, 255, 255, 0.2)',
        },
      },

      outline: {
        light: {
          bg: 'transparent',
          border: colors.primary.light[600],
          text: colors.primary.light[600],
          hover: colors.primary.light[50],
          active: colors.primary.light[100],
        },
        dark: {
          bg: 'transparent',
          border: colors.primary.light[400],
          text: colors.primary.light[400],
          hover: 'rgba(255, 255, 255, 0.1)',
          active: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },

  card: {
    // Card styling standard
    borderRadius: 'rounded-lg',  // 14px - consistent with large surfaces
    shadow: 'shadow-sm',         // subtle shadow for depth
    padding: {
      base: 'py-6',              // vertical padding
      content: 'px-6',           // horizontal padding for CardContent
      header: 'px-6',            // horizontal padding for CardHeader
      footer: 'px-6',            // horizontal padding for CardFooter
    },
    gap: 'gap-6',                // space between sections

    colors: {
      light: {
        bg: colors.card.light,
        border: colors.border.light,
        text: colors.foreground.light,
      },
      dark: {
        bg: colors.card.dark,
        border: colors.border.dark,
        text: colors.foreground.dark,
      },
    },
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get spacing value with optional multiplier
 * @example spacing('md') => '1rem'
 * @example spacingValue('md', 2) => '2rem'
 */
export function spacingValue(
  scale: keyof typeof spacing,
  multiplier: number = 1
): string {
  const value = spacingScale[scale];
  return `${value * multiplier}rem`;
}

/**
 * Get color for current mode
 * @example color('primary', isDark, 600) => '#2563eb' or #60a5fa
 */
export function color(
  role: 'primary' | 'accent' | 'neutral',
  isDark: boolean,
  shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 = 500
): string {
  if (role === 'primary') {
    return isDark
      ? colors.primary.dark[shade]
      : colors.primary.light[shade];
  }
  if (role === 'accent') {
    return isDark
      ? colors.accent.dark[shade]
      : colors.accent.light[shade];
  }
  return isDark
    ? colors.neutral.dark[shade]
    : colors.neutral.light[shade];
}

/**
 * Get semantic color for current mode
 * @example semanticColor('background', isDark) => '#ffffff' or '#0f172a'
 */
export function semanticColor(
  role: keyof typeof colors.background | keyof typeof colors.foreground,
  isDark: boolean
): string {
  const colorObj = colors[role as keyof typeof colors] as { dark: string; light: string } | undefined;

  if (!colorObj || typeof colorObj !== 'object' || !('dark' in colorObj)) {
    console.warn(`Color role "${role}" not found in design tokens`);
    return isDark ? colors.foreground.dark : colors.foreground.light;
  }

  return isDark ? colorObj.dark : colorObj.light;
}

/**
 * Get button variant colors
 * @example buttonVariant('primary', isDark, 'hover') => color object
 */
export function buttonVariant(
  variant: keyof typeof components.button.variants,
  isDark: boolean,
  state: 'normal' | 'hover' | 'active' | 'disabled' = 'normal'
) {
  const variantConfig = components.button.variants[variant];
  const modeConfig = isDark ? variantConfig.dark : variantConfig.light;

  if (state === 'hover') {
    return { ...modeConfig, bg: modeConfig.hover };
  }
  if (state === 'active') {
    return { ...modeConfig, bg: modeConfig.active };
  }

  return modeConfig;
}

/**
 * Combine spacing values
 * @example combinedSpacing(['md', 'lg']) => '1rem 1.5rem'
 */
export function combinedSpacing(scales: (keyof typeof spacing)[]): string {
  return scales.map((scale) => spacing[scale]).join(' ');
}

/**
 * Get responsive spacing (vertical then horizontal)
 * @example responsiveSpacing('md', 'lg') => '1rem 1.5rem'
 */
export function responsiveSpacing(vertical: keyof typeof spacing, horizontal: keyof typeof spacing): string {
  return `${spacing[vertical]} ${spacing[horizontal]}`;
}

/**
 * Generate Tailwind class string for button
 * @example buttonClass('md', 'primary', isDark) => className string
 */
export function buttonClass(
  size: keyof typeof components.button.sizes,
  variant: keyof typeof components.button.variants,
  isDark: boolean,
  state: 'normal' | 'hover' | 'active' = 'normal'
): Record<string, string> {
  const sizeConfig = components.button.sizes[size];
  const variantConfig = buttonVariant(variant, isDark, state);

  return {
    padding: sizeConfig.padding,
    fontSize: sizeConfig.fontSize,
    lineHeight: sizeConfig.lineHeight,
    backgroundColor: variantConfig.bg,
    color: variantConfig.text,
  };
}

// ============================================================================
// EXPORT COMPLETE DESIGN SYSTEM
// ============================================================================

export const designTokens = {
  colors,
  spacing,
  spacingScale,
  typography,
  borderRadius,
  componentRadius,
  shadows,
  components,
  // Utility functions
  utilities: {
    spacingValue,
    color,
    semanticColor,
    buttonVariant,
    combinedSpacing,
    responsiveSpacing,
    buttonClass,
  },
} as const;

export default designTokens;

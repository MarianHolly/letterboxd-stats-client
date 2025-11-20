# Design System Guide

## Overview

The design system is centralized in `lib/design-tokens.ts` and provides a complete set of design constants and utility functions for building consistent UI components.

---

## Color System

### Primary Colors (Letterboxd Blue)
Used for primary actions, links, and important UI elements.

```typescript
import { colors } from '@/lib/design-tokens'

colors.primary.light[600]  // #2563eb
colors.primary.dark[600]   // #2563eb (maintained in dark mode for consistency)
```

### Accent Colors (Letterboxd Gold/Amber)
Used for highlights, badges, and secondary accents.

```typescript
colors.accent.light[500]   // #f59e0b
colors.accent.dark[500]    // #fbbf24 (lighter in dark mode)
```

### Neutral Colors (Gray Scale)
Used for text, backgrounds, and borders. 9-step scale from lightest to darkest.

```typescript
colors.neutral.light[50]   // #fafafa (lightest)
colors.neutral.light[900]  // #171717 (darkest)
colors.neutral.dark[50]    // #f8fafc (lightest in dark)
colors.neutral.dark[900]   // #0f172a (darkest in dark)
```

### Status Colors
Pre-defined colors for success, warning, error, and info states.

```typescript
colors.success.light   // #10b981
colors.warning.light   // #f59e0b
colors.error.light     // #ef4444
colors.info.light      // #3b82f6
```

### Semantic Colors
Context-aware colors that change based on light/dark mode.

```typescript
colors.background.light   // #ffffff
colors.background.dark    // #0f172a

colors.foreground.light   // #1e293b (dark slate)
colors.foreground.dark    // #f1f5f9 (light slate)

colors.card.light         // #f0f4ff (light blue tint)
colors.card.dark          // #1e293b (dark slate)
```

---

## Spacing System

**Rem-based scale** for consistent, scalable spacing. Base unit is 0.25rem (4px).

```typescript
import { spacing, spacingValue } from '@/lib/design-tokens'

spacing.xs     // 0.25rem (4px)
spacing.sm     // 0.5rem  (8px)
spacing.md     // 1rem    (16px)
spacing.lg     // 1.5rem  (24px)
spacing.xl     // 2rem    (32px)
spacing['2xl'] // 3rem    (48px)
spacing['3xl'] // 4rem    (64px)
spacing['4xl'] // 5rem    (80px)
spacing['5xl'] // 6rem    (96px)
```

### Spacing Utility Functions

```typescript
// Get spacing value with optional multiplier
spacingValue('md')       // '1rem'
spacingValue('md', 2)    // '2rem'

// Combine multiple spacing values
combinedSpacing(['md', 'lg'])  // '1rem 1.5rem'

// Responsive spacing (vertical, horizontal)
responsiveSpacing('md', 'lg')  // '1rem 1.5rem'
```

---

## Typography

### Font Families

```typescript
import { typography } from '@/lib/design-tokens'

typography.fontFamily.sans    // Geist + system fonts
typography.fontFamily.mono    // Geist Mono + monospace fallbacks
```

### Font Sizes

9-step scale with corresponding line heights for each size.

```typescript
typography.fontSize.xs     // { size: '0.75rem', lineHeight: '1rem' }
typography.fontSize.sm     // { size: '0.875rem', lineHeight: '1.25rem' }
typography.fontSize.base   // { size: '1rem', lineHeight: '1.5rem' }
typography.fontSize.lg     // { size: '1.125rem', lineHeight: '1.75rem' }
typography.fontSize.xl     // { size: '1.25rem', lineHeight: '1.75rem' }
typography.fontSize['2xl'] // { size: '1.5rem', lineHeight: '2rem' }
// ... and so on up to 5xl
```

### Font Weights

```typescript
typography.fontWeight.light      // 300
typography.fontWeight.normal     // 400
typography.fontWeight.medium     // 500
typography.fontWeight.semibold   // 600
typography.fontWeight.bold       // 700
```

### Line Heights

```typescript
typography.lineHeight.tight     // 1.2
typography.lineHeight.normal    // 1.5
typography.lineHeight.relaxed   // 1.75
```

---

## Border Radius

Consistent border radius values for rounded corners.

```typescript
import { borderRadius } from '@/lib/design-tokens'

borderRadius.none     // 0
borderRadius.sm       // 0.25rem (4px)
borderRadius.md       // 0.625rem (10px) - default
borderRadius.lg       // 0.875rem (14px)
borderRadius.xl       // 1rem (16px)
borderRadius['2xl']   // 1.5rem (24px)
borderRadius.full     // 9999px (full circle)
```

---

## Shadows

Elevation shadows for depth and hierarchy.

```typescript
import { shadows } from '@/lib/design-tokens'

shadows.none   // no shadow
shadows.sm     // subtle
shadows.md     // default
shadows.lg     // prominent
shadows.xl     // strong elevation
shadows['2xl'] // maximum elevation
```

---

## Component Variants

Pre-defined component styles using the design system.

### Button Sizes

```typescript
components.button.sizes.sm   // small button
components.button.sizes.md   // medium button (default)
components.button.sizes.lg   // large button
```

### Button Variants

Four predefined button styles with light/dark mode support:

**Primary** - Main action button
- Light: Blue background with white text
- Dark: Blue background with white text

**Secondary** - Secondary action button
- Light: Light gray background with dark text
- Dark: Dark gray background with light text

**Ghost** - Minimal, text-only button
- Light: Transparent with blue text
- Dark: Transparent with light blue text

**Outline** - Bordered button
- Light: Blue border and text, transparent background
- Dark: Light blue border and text, transparent background

### Card Styling

```typescript
components.card.light   // white card with light blue tint background
components.card.dark    // dark card with dark slate background
```

---

## Utility Functions

### Color Functions

```typescript
import { color, semanticColor, buttonVariant } from '@/lib/design-tokens'

// Get color for role with optional shade
color('primary', false, 600)        // light mode, shade 600
color('accent', true, 500)          // dark mode, accent color

// Get semantic color (background, foreground, etc.)
semanticColor('foreground', false)  // light mode text color
semanticColor('card', true)         // dark mode card background

// Get button variant colors
buttonVariant('primary', false)      // primary button, light mode
buttonVariant('secondary', true, 'hover')  // secondary button hover state
```

### Button Class Generation

```typescript
import { buttonClass } from '@/lib/design-tokens'

buttonClass('md', 'primary', false)  // medium primary button for light mode
// Returns: {
//   padding: '1rem 1.5rem',
//   fontSize: '1rem',
//   lineHeight: '1.5rem',
//   backgroundColor: '#2563eb',
//   color: '#ffffff'
// }
```

---

## Usage Examples

### Component Example

```typescript
import { spacing, colors, typography } from '@/lib/design-tokens'

export function MyComponent() {
  return (
    <div
      style={{
        padding: spacing.md,
        backgroundColor: colors.card.light,
        color: colors.foreground.light,
        borderRadius: '0.625rem',
      }}
    >
      <h1 style={{ fontSize: typography.fontSize.xl.size }}>
        Title
      </h1>
    </div>
  )
}
```

### Using Utility Functions

```typescript
import { spacingValue, semanticColor, buttonVariant } from '@/lib/design-tokens'

export function StyledButton() {
  const isDark = true

  const padding = spacingValue('md', 1.5)  // '1.5rem'
  const bgColor = semanticColor('card', isDark)
  const buttonColors = buttonVariant('primary', isDark)

  return (
    <button
      style={{
        padding,
        backgroundColor: buttonColors.bg,
        color: buttonColors.text,
      }}
    >
      Click me
    </button>
  )
}
```

### Responsive Spacing

```typescript
import { responsiveSpacing } from '@/lib/design-tokens'

export function Card() {
  const padding = responsiveSpacing('lg', 'md')  // '1.5rem 1rem'

  return <div style={{ padding }}>Content</div>
}
```

---

## Best Practices

1. **Always use design tokens** - Don't hardcode colors, spacing, or font sizes
2. **Use utility functions** - Let them handle light/dark mode logic
3. **Semantic colors** - Use `semanticColor()` for backgrounds and text instead of hard-coding
4. **Consistent spacing** - Use the spacing scale for all padding, margins, and gaps
5. **Type safety** - Design tokens are fully typed; use TypeScript for IDE hints
6. **Color shades** - When picking a shade, prefer 50, 100, 200, ... 900 scale

---

## Extending the Design System

To add new tokens:

1. Add to appropriate section in `lib/design-tokens.ts`
2. Export the new tokens
3. Update this guide with examples
4. Ensure light/dark mode variants exist

---

## File Location

- **Design Tokens:** `lib/design-tokens.ts`
- **Global Styles:** `app/globals.css`
- **Component Examples:** See component files in `components/`

# Implementation Plan: Dashboard Sections Restructure - Primary Charts

**Feature**: Dashboard Sections Restructure - Primary Charts
**Feature ID**: DASHBOARD-SECTIONS-PRIMARY
**Location**: `.specify/features/dashboard-sections-primary/`

---

## Overview

This plan outlines the approach for restructuring the analytics dashboard into 4 distinct sections with redesigned primary charts. The implementation focuses on creating a reusable section component wrapper, redesigning charts with prototype design system, and ensuring responsive behavior across all viewport sizes.

---

## Architecture & Design Decisions

### 1. Component Structure

#### Section Wrapper Approach
- Create **reusable `section-template.tsx`** component to standardize section layout
- Each section (1-4) will be a separate component importing the template
- Template handles: title, description, empty state logic, spacing
- Charts imported into each section component

**Benefits**:
- DRY principle - avoid repeating section structure
- Consistent styling/spacing across sections
- Easy to modify section appearance globally
- Cleaner section component files

#### Chart Version Strategy
- Create **V2 versions** of existing charts (`release-year-analysis-v2.tsx`)
- Preserve original components for backward compatibility
- After V2 testing is complete, evaluate if original should be replaced
- Allows for safe rollback if issues arise

**Benefits**:
- No disruption to existing functionality
- Can run A/B tests if needed
- Clear versioning for future maintenance
- Easier code review (changes isolated to V2 files)

### 2. Data Flow & State Management

```
useAnalyticsStore
  ├── dataset: MovieDataset
  │   ├── watched: Movie[]
  │   ├── watchlist: Movie[]
  │   └── uploadedFiles: string[]
  └── analytics: AnalyticsOverview
      ├── yearlyBreakdown
      ├── ratingDistribution
      ├── averageRating
      └── ...

App Page (app/analytics/page.tsx)
  └── AnalyticsDashboard
      ├── SectionTemplate (wrapper)
      │   ├── MovieCollectionSection
      │   │   └── ReleaseYearAnalysisV2
      │   ├── ViewingJourneySection (conditional)
      │   │   └── ViewingOverTimeV2
      │   ├── CriticalVoiceSection (conditional)
      │   │   └── RatingDistributionV2
      │   └── DeepDivesSection (conditional)
      │       └── [Future charts]
      └── AnalyticsSidebar (with section nav)
```

**Conditional Rendering Logic**:
```typescript
// Section 1: Always visible (watched.csv required)
showSection1 = uploadedFiles.includes('watched.csv')

// Section 2: Visible if diary.csv with watched dates
showSection2 = uploadedFiles.includes('diary.csv') &&
               movies.some(m => m.watchedDate !== undefined)

// Section 3: Visible if rating data exists
showSection3 = movies.some(m => m.rating !== undefined)

// Section 4: Visible if secondary chart data available
showSection4 = hasGenreData || hasRewatchData || hasLikedData || hasTagData
```

### 3. Design System Integration

#### Color Palette
- Use existing CSS `--chart-*` variables (already defined in codebase)
- Supplement with utility colors:
  - Green: `#22c55e` (success)
  - Red: `#ef4444` (warning)
  - Blue: `#3b82f6` (primary)
  - Violet: `#8b5cf6` (accent)

#### Prototype Design Elements to Extract
1. **From `area-chart.tsx`**:
   - Hatched gradient patterns (`HatchedBackgroundPattern`)
   - Stacked area fills with opacity
   - Badge with trend indicator

2. **From `bar-chart.tsx`**:
   - Dotted background pattern (`DottedBackgroundPattern`)
   - Hover state interactions (opacity change)
   - Highlighted bar styling

3. **From `pie-chart.tsx`**:
   - Label positioning (LabelList)
   - Donut layout with inner radius
   - Aspect ratio constraints

4. **From `radar-chart.tsx`**:
   - Polar grid styling
   - Multiple radar overlays
   - Fillable SVG patterns

#### Dark Mode Implementation
- Check each chart for `dark:` class coverage
- Apply to: text, borders, backgrounds, grid lines, axis text
- Use `dark:stroke-white/10` for grid/borders
- Use `dark:text-white/70` for secondary text
- Test both light and dark themes before release

### 4. Responsive Design Strategy

#### Breakpoints
- **Mobile (≤767px)**:
  - Sidebar hidden (hamburger overlay menu)
  - Full-width charts
  - Single column layout
  - Reduced padding: `px-4`

- **Tablet (768px-1023px)**:
  - Sidebar collapsible
  - Full-width charts when sidebar open
  - Single column layout
  - Medium padding: `px-6`

- **Desktop (≥1024px)**:
  - Sidebar always visible
  - Charts adjust to `calc(100vw - sidebar-width)`
  - Single column layout
  - Full padding: `px-8`

#### Chart Responsiveness
- Use Recharts `ResponsiveContainer` for width/height flexibility
- Maintain aspect ratios: charts scale with parent width
- Height adjusts based on breakpoint:
  - Mobile: `h-[250px]`
  - Tablet: `h-[350px]`
  - Desktop: `h-[400px]`

- Secondary charts (future):
  - Desktop: 2 columns (`grid-cols-2`)
  - Tablet: 1 column (`grid-cols-1`)
  - Mobile: 1 column (`grid-cols-1`)

### 5. Sidebar Navigation Integration

#### Current State
- Sidebar has upload/clear buttons
- Navigation is minimal

#### New State
- Keep upload/clear buttons
- Add "Sections" expandable menu
- Links use smooth scroll-to anchor behavior

#### Implementation
```typescript
// In analytics-sidebar.tsx
<SectionsMenu>
  <SectionLink href="#movie-collection" label="Movie Collection" />
  <SectionLink href="#viewing-journey" label="Viewing Journey" />
  <SectionLink href="#critical-voice" label="Critical Voice" />
  <SectionLink href="#deep-dives" label="Deep Dives" />
</SectionsMenu>

// SectionLink onClick handler
const handleClick = (e) => {
  e.preventDefault()
  const el = document.getElementById(href.slice(1))
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
```

#### Styling
- Expandable/collapsible state (using `<details>` or state)
- Hover highlighting on links
- Active state indication (optional Phase 2)

---

## Implementation Phases

### Phase 1: Foundation Components (2-3 tasks)

**Goal**: Create reusable section wrapper and empty state components

1. **Create `section-template.tsx`**
   - Props: `id`, `title`, `description`, `children`, `showEmptyState`, `emptyStateMessage`
   - Renders: Section container with h2 title, description, and children/empty state
   - Styling: Tailwind classes for spacing, typography, dark mode
   - Empty state: Centered message box with optional icon

2. **Update `analytics-dashboard.tsx`**
   - Modify: Import section components
   - Add: Section components in order (1-4)
   - Maintain: Existing header, spacing, responsive layout

3. **Update `analytics-sidebar.tsx`**
   - Add: Expandable "Sections" menu
   - Add: Smooth scroll-to links for each section
   - Styling: Consistent with existing sidebar design

### Phase 2: Chart Redesigns (3 tasks)

**Goal**: Create V2 chart components with prototype design system

4. **Create `release-year-analysis-v2.tsx`**
   - Base: Copy from `release-year-analysis.tsx`
   - Modifications:
     - Enhanced dark mode support
     - Refined color palette
     - Improved spacing/padding
     - Keep era filter functionality
     - Test with mock and real data

5. **Create `viewing-over-time-v2.tsx`**
   - Base: Copy from `viewing-over-time.tsx`
   - Modifications:
     - Apply area chart design (hatched patterns from prototype)
     - Add gradient fills
     - Dark mode support
     - Responsive height adjustments
     - Test temporal data rendering

6. **Create `rating-distribution-v2.tsx`**
   - Base: Copy from `rating-distribution.tsx`
   - Modifications:
     - Apply bar chart design (from prototype)
     - Color gradient red→green for ratings
     - Add dotted background pattern
     - Dark mode support
     - Enhance stats display layout
     - Test with various rating distributions

### Phase 3: Section Components (4 tasks)

**Goal**: Create individual section components using template and charts

7. **Create `movie-collection-section.tsx`**
   - Import: section-template, ReleaseYearAnalysisV2
   - Props: uploadedFiles, analytics
   - Always visible (watched.csv required)
   - Title: "Which eras of cinema define your taste?"
   - Description: "Release Year & Decade Analysis"
   - Chart: ReleaseYearAnalysisV2
   - Empty state: Not needed (always has data)

8. **Create `viewing-journey-section.tsx`**
   - Import: section-template, ViewingOverTimeV2
   - Props: uploadedFiles, analytics
   - Conditional: diary.csv with watched dates
   - Title: "When do you watch movies most?"
   - Description: "Temporal Viewing Patterns"
   - Chart: ViewingOverTimeV2 (if data available)
   - Empty state: "Upload diary.csv to see viewing timeline. Your diary file contains exact watch dates for temporal analysis."
   - Dark mode tested

9. **Create `critical-voice-section.tsx`**
   - Import: section-template, RatingDistributionV2
   - Props: uploadedFiles, analytics
   - Conditional: rating data available
   - Title: "Are you a harsh critic or generous rater?"
   - Description: "Rating Distribution & Patterns"
   - Chart: RatingDistributionV2 (if data available)
   - Empty state: "Upload ratings.csv or diary.csv to see rating analysis. This file contains your rating data for distribution analysis."
   - Dark mode tested

10. **Create `deep-dives-section.tsx`**
    - Import: section-template
    - Props: uploadedFiles, analytics
    - Placeholder for Phase 2
    - Only renders if secondary chart data available
    - Message: "Additional analysis coming soon"

### Phase 4: Integration & Testing (3 tasks)

**Goal**: Ensure all sections work together, responsive, and properly styled

11. **Test Section Rendering**
    - Desktop (1440px): All sections visible, proper spacing
    - Tablet (768px): Sidebar collapsible, charts responsive
    - Mobile (375px): Sidebar hidden, charts full-width
    - Upload various CSV combinations to test conditional rendering
    - Verify empty states display correctly

12. **Test Dark/Light Mode**
    - Toggle theme on each section
    - Verify text colors, borders, backgrounds adapt
    - Verify chart colors and patterns render correctly
    - Check tooltip styling in both modes
    - Verify no contrast issues (accessibility)

13. **Test Sidebar Navigation**
    - Click section links
    - Verify smooth scroll-to works
    - Verify section IDs are correct
    - Test on mobile (hamburger menu)
    - Test on desktop (expanded menu)

14. **Verify Responsive Behavior**
    - Sidebar collapse/expand: Charts adjust width correctly
    - No layout shifting or overflow
    - Secondary charts (future) planned for responsive grid
    - Charts maintain aspect ratio
    - Touch interactions work on mobile (if applicable)

---

## Technical Specifications

### Section Template Component

```typescript
// components/analytics/sections/section-template.tsx

interface SectionTemplateProps {
  id: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  showEmptyState?: boolean;
  emptyStateMessage?: string;
}

export function SectionTemplate({
  id,
  title,
  description,
  children,
  showEmptyState = false,
  emptyStateMessage = "Data not available",
}: SectionTemplateProps) {
  return (
    <section
      id={id}
      className="space-y-4 scroll-mt-20"
      aria-labelledby={`${id}-title`}
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 id={`${id}-title`} className="text-3xl font-bold text-black dark:text-white">
          {title}
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* Content */}
      {showEmptyState ? (
        <div className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {emptyStateMessage}
          </p>
        </div>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </section>
  );
}
```

### Chart Component Example (ViewingOverTimeV2)

```typescript
// components/charts/viewing-over-time-v2.tsx
// Base: viewing-over-time.tsx
// Modifications:
// - Import HatchedBackgroundPattern from area-chart.tsx prototype
// - Apply gradient fills to areas
// - Add dark mode classes to all text/strokes
// - Adjust sizing: h-[250px] sm:h-[350px] lg:h-[400px]

"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"

interface ViewingOverTimeV2Props {
  data: Record<string, number>; // key: "2024-01", value: count
}

export function ViewingOverTimeV2({ data }: ViewingOverTimeV2Props) {
  // Chart implementation with prototype design
  // - Area with hatched pattern fill
  // - Gradient overlays
  // - Dark mode support
  // - Responsive container
}
```

### Section Component Example (MovieCollectionSection)

```typescript
// components/analytics/sections/movie-collection-section.tsx

"use client"

import { useAnalyticsStore } from "@/hooks/use-analytics-store"
import { SectionTemplate } from "./section-template"
import { ReleaseYearAnalysisV2 } from "@/components/charts/release-year-analysis-v2"

interface MovieCollectionSectionProps {
  uploadedFiles: string[]
}

export function MovieCollectionSection({ uploadedFiles }: MovieCollectionSectionProps) {
  const { analytics } = useAnalyticsStore()

  const hasData = uploadedFiles.includes("watched.csv")

  if (!hasData || !analytics) {
    return null
  }

  return (
    <SectionTemplate
      id="movie-collection"
      title="📽️ Which eras of cinema define your taste?"
      description="Release Year & Decade Analysis"
    >
      <ReleaseYearAnalysisV2 data={analytics.yearlyBreakdown} />
    </SectionTemplate>
  )
}
```

---

## Color Palette Reference

### CSS Variables (Existing)
```css
--chart-1: hsl(221, 83%, 53%) /* Blue */
--chart-2: hsl(188, 94%, 50%) /* Cyan */
--chart-3: hsl(262, 80%, 50%) /* Purple */
--chart-4: hsl(349, 89%, 60%) /* Red/Pink */
--chart-5: hsl(47, 100%, 50%) /* Yellow */
```

### Additional Colors (Tailwind)
```
Success: #22c55e (green-500)
Warning: #f97316 (orange-500)
Error: #ef4444 (red-500)
Neutral: #6b7280 (gray-500)
```

### Dark Mode Mapping
```
Light: bg-white, text-slate-900, border-slate-200
Dark: bg-slate-950, text-white, border-white/10
```

---

## Performance Targets

- Chart render time: <500ms
- Section render time: <200ms
- Responsive layout: <100ms (no jank)
- Lighthouse score: >85
- No layout shifts (CLS)

---

## Testing Strategy

### Unit Testing (Per Component)
- SectionTemplate: Props rendering, empty state logic
- Each chart V2: Data transformation, rendering with mock data
- Sidebar: Navigation links work correctly

### Integration Testing
- All 4 sections render together
- Conditional rendering works based on data availability
- Sidebar navigation scrolls to correct sections
- Chart updates when store data changes

### Responsive Testing
- Desktop (1440px, 1024px): Full sidebar visible
- Tablet (768px): Sidebar collapsible
- Mobile (375px): Sidebar hidden
- Charts resize without breaking

### Accessibility Testing
- Semantic HTML (h2, h3, section elements)
- ARIA labels for interactive elements
- Keyboard navigation works
- Color contrast meets WCAG AA standard

### Dark Mode Testing
- Light theme: All text readable, borders visible
- Dark theme: All text readable, borders visible
- Theme toggle works on all sections
- No hard-coded colors breaking theme

---

## Rollback Plan

If issues arise with V2 charts:
1. Revert V2 component imports in section files
2. Point section components to original charts
3. Keep V2 files for analysis/debugging
4. Document issues and resolution
5. Plan for Phase 2 refinement

---

## File Organization

```
.specify/features/dashboard-sections-primary/
├── spec.md (this document)
├── plan.md (implementation plan)
└── tasks.md (actionable task list)

components/analytics/
├── sections/
│   ├── section-template.tsx (new)
│   ├── movie-collection-section.tsx (new)
│   ├── viewing-journey-section.tsx (new)
│   ├── critical-voice-section.tsx (new)
│   └── deep-dives-section.tsx (new)
├── analytics-dashboard.tsx (modify)
├── analytics-sidebar.tsx (modify)
└── (existing files)

components/charts/
├── release-year-analysis-v2.tsx (new)
├── viewing-over-time-v2.tsx (new)
├── rating-distribution-v2.tsx (new)
└── (existing files)
```

---

## Dependencies & Prerequisites

- ✅ Zustand store with analytics data
- ✅ Recharts charting library
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui components
- ✅ Prototype design files (reference)
- ✅ Existing chart components (to base V2 on)

---

## Success Criteria

- [x] All 4 sections render correctly
- [x] Charts adopt prototype design system
- [x] Dark mode fully implemented
- [x] Responsive on all breakpoints
- [x] Sidebar navigation works
- [x] Empty states display appropriately
- [x] No console errors
- [x] Performance targets met
- [x] Accessibility standards met

---

**Last Updated**: November 28, 2025
**Status**: Ready for Task Generation ✅

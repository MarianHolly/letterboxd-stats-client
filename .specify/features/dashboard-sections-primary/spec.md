# Feature Specification: Dashboard Sections Restructure - Primary Charts

**Feature**: Restructure analytics dashboard into 4 distinct sections with redesigned primary charts
**Feature ID**: DASHBOARD-SECTIONS-PRIMARY
**Priority**: P1 - High Impact UX Enhancement
**Category**: UI/UX

---

## Overview

Transform the current flat analytics dashboard into a structured, section-based layout with 4 distinct sections (Movie Collection, Viewing Journey, Critical Voice, Deep Dives). Each section will feature a full-width primary chart redesigned with the prototype design system (enhanced colors, styling, animations, dark mode support). Secondary charts will be added in future phases. The dashboard will remain responsive to sidebar collapse/expansion and mobile viewports.

---

## User Story

> As a user, I want to navigate my analytics through clearly organized sections with visually appealing charts so that I can understand my viewing patterns in a more intuitive and visually satisfying way.

---

## Feature Goals

1. **Structural Clarity**: Divide dashboard into 4 logical sections with clear titles and descriptions
2. **Visual Enhancement**: Adopt prototype design system (colors, gradients, animations, dark mode)
3. **Progressive Enhancement**: Primary charts only; secondary charts planned for Phase 2
4. **Responsive Design**: Charts adapt to sidebar state and mobile viewports
5. **Conditional Rendering**: Sections display only when required data is available
6. **Navigation**: Sidebar section menu with smooth scroll-to functionality

---

## Acceptance Criteria

### Section Structure & Rendering
- [ ] Dashboard displays 4 sections: Movie Collection, Viewing Journey, Critical Voice, Deep Dives
- [ ] Each section has visible title, description, and section ID for navigation
- [ ] Section 1 (Movie Collection) always displays (requires watched.csv - mandatory)
- [ ] Section 2 (Viewing Journey) displays only if diary.csv with watched dates available
- [ ] Section 3 (Critical Voice) displays only if rating data available (ratings.csv or diary.csv)
- [ ] Section 4 (Deep Dives) displays only if secondary chart data available (future)
- [ ] Empty state displays for sections without required data (no chart rendering)

### Chart Redesign & Design System
- [ ] Charts adopt prototype design (colors, gradients, styling from prototype files)
- [ ] All charts support dark mode (verified on light and dark theme)
- [ ] Charts maintain aspect ratio when sidebar collapses/expands
- [ ] Charts are responsive to viewport changes (desktop/tablet/mobile)
- [ ] No console errors or visual glitches on chart rendering

### Sidebar Navigation
- [ ] Sidebar has expandable "Sections" menu with links to all 4 sections
- [ ] Section links use scroll-to anchors (smooth scroll behavior)
- [ ] Active section link highlights based on scroll position (optional Phase 2)

### Responsive Behavior
- [ ] **Desktop (1024px+)**: Full sidebar visible, charts full-width minus sidebar padding
- [ ] **Tablet (768px-1023px)**: Sidebar collapsible with hamburger menu
- [ ] **Mobile (375px-767px)**: Sidebar disappears, hamburger overlay menu appears
- [ ] Secondary charts (future) display as single column on mobile
- [ ] No layout shifting when sidebar toggled

### Dark/Light Mode
- [ ] Charts render correctly in dark mode (default)
- [ ] Charts render correctly in light mode
- [ ] Text, borders, backgrounds adapt to theme
- [ ] Tooltips and interactive elements respect theme

### Chart-Specific Requirements

#### Section 1: Movie Collection (Primary Chart: ReleaseYearAnalysis)
- [ ] Release year bar chart displays movies by year
- [ ] Era filter tabs (Classic ≤1969, Modern ≥1970, All Years) functional
- [ ] Color gradient from blue (older) to violet (newer)
- [ ] Responsive bar widths and spacing
- [ ] Tooltip shows year and movie count on hover

#### Section 2: Viewing Journey (Primary Chart: ViewingOverTime)
- [ ] Temporal chart displays movies watched over time
- [ ] Prototype area chart design applied (hatched patterns, gradients)
- [ ] Responsive to time range and granularity (if toggleable)
- [ ] Empty state if no watched dates in data

#### Section 3: Critical Voice (Primary Chart: RatingDistribution)
- [ ] Rating bar chart displays distribution of ratings
- [ ] Color gradient red (low) to green (high)
- [ ] Progress bars per rating with counts
- [ ] Stats cards show total ratings and average
- [ ] Responsive layout for stats and chart

### Testing
- [ ] All sections render without console errors
- [ ] Charts render with sample and real data
- [ ] Responsive layout verified on 375px, 768px, 1024px viewports
- [ ] Dark/light mode toggle works on all sections
- [ ] Sidebar collapse/expand doesn't break chart rendering
- [ ] Empty states display with appropriate messaging

---

## Technical Details

### Components to Create

1. **`components/analytics/sections/section-template.tsx`**
   - Reusable section wrapper component
   - Props: id, title, description, children, showEmptyState, emptyStateMessage
   - Renders section container with title/description and chart
   - Handles empty state display

2. **`components/analytics/sections/movie-collection-section.tsx`**
   - Section 1: Movie Collection
   - Imports: ReleaseYearAnalysisV2, section-template
   - Always renders (watched.csv is mandatory)

3. **`components/analytics/sections/viewing-journey-section.tsx`**
   - Section 2: Viewing Journey
   - Imports: ViewingOverTimeV2, section-template
   - Conditional: diary.csv with watched dates
   - Empty state: "Upload diary.csv to see viewing patterns"

4. **`components/analytics/sections/critical-voice-section.tsx`**
   - Section 3: Critical Voice
   - Imports: RatingDistributionV2, section-template
   - Conditional: ratings.csv or diary.csv with ratings
   - Empty state: "Upload ratings.csv to see rating analysis"

5. **`components/analytics/sections/deep-dives-section.tsx`**
   - Section 4: Deep Dives (placeholder for Phase 2)
   - Renders only when secondary chart data available

### Chart Components to Modify (Create V2 Versions)

1. **`components/charts/release-year-analysis-v2.tsx`**
   - Base: `release-year-analysis.tsx`
   - Modifications:
     - Enhance dark mode support
     - Apply prototype color palette
     - Improve styling/spacing
     - Keep era filter functionality

2. **`components/charts/viewing-over-time-v2.tsx`**
   - Base: `viewing-over-time.tsx`
   - Modifications:
     - Apply area chart prototype design (hatched patterns)
     - Add gradient fills
     - Dark mode support
     - Responsive sizing

3. **`components/charts/rating-distribution-v2.tsx`**
   - Base: `rating-distribution.tsx`
   - Modifications:
     - Apply bar chart prototype design
     - Color gradient red→green
     - Add dotted background pattern
     - Dark mode support
     - Improve stats display

4. **`components/charts/diary-monthly-radar-chart-v2.tsx`** (Future Phase 2)
   - Base: `diary-monthly-radar-chart.tsx`
   - Modifications: Apply radar prototype design

### Page/Component Updates

1. **`app/analytics/page.tsx`** (No changes needed - already handles sections wrapper)

2. **`components/analytics/analytics-dashboard.tsx`**
   - Modification: Render section components in order
   - Import: MovieCollectionSection, ViewingJourneySection, CriticalVoiceSection, DeepDivesSection

3. **`components/analytics/analytics-sidebar.tsx`**
   - Modification: Add expandable "Sections" menu
   - Links: Smooth scroll to section IDs
   - Implementation: Simple button/link with onClick scroll handler

### Styling & Colors

**Color Palette (from prototypes)**:
- Primary: `var(--chart-1)` (blue)
- Secondary: `var(--chart-2)` (cyan/teal)
- Accent: `var(--chart-3)` (purple/violet)
- Success: Green (#22c55e)
- Warning: Red (#ef4444)
- Dark backgrounds: `bg-white dark:bg-slate-950`
- Card borders: `border-slate-200 dark:border-white/10`
- Text: `text-slate-900 dark:text-white`

**Design Patterns**:
- Hatched gradient patterns (from area-chart.tsx)
- Dotted background patterns (from bar-chart.tsx)
- Hover opacity transitions (from bar-chart.tsx)
- Color gradients for data representation

---

## Data Requirements & Conditional Logic

### Section 1: Movie Collection
- **Required Data**: `watched.csv` (movies.year)
- **Condition**: Always renders (required file)
- **Chart**: ReleaseYearAnalysisV2

### Section 2: Viewing Journey
- **Required Data**: `diary.csv` (movies.watchedDate)
- **Condition**: `uploadedFiles.includes('diary.csv') && movies.some(m => m.watchedDate)`
- **Chart**: ViewingOverTimeV2
- **Empty State**: "Upload diary.csv to see viewing timeline. Your diary file contains exact watch dates for temporal analysis."

### Section 3: Critical Voice
- **Required Data**: Ratings from `ratings.csv` or `diary.csv` (movies.rating)
- **Condition**: `movies.some(m => m.rating !== undefined)`
- **Chart**: RatingDistributionV2
- **Empty State**: "Upload ratings.csv or diary.csv to see rating analysis. This file contains your rating data for distribution analysis."

### Section 4: Deep Dives
- **Required Data**: Various (depends on available charts)
- **Condition**: At least one secondary chart data available
- **Status**: Placeholder - Phase 2
- **Empty State**: Not shown (section doesn't render)

---

## Empty State Messages

**Generic Format**:
```
[Icon] [Section Title]

[Short description of what data is needed and why]

Current Data: [List of uploaded files relevant to this section]
```

**Example for Section 2**:
```
📅 Viewing Journey

Upload diary.csv to see viewing patterns. Your diary file contains exact watch dates for temporal analysis and viewing consistency tracking.
```

---

## Layout Specifications

### Section Container
```tsx
<section id={id} className="space-y-4 scroll-mt-20">
  <div className="space-y-2">
    <h2 className="text-3xl font-bold">{title}</h2>
    <p className="text-muted-foreground">{description}</p>
  </div>

  {/* Primary Chart or Empty State */}
  <div className="w-full">
    {hasData ? <Chart /> : <EmptyState />}
  </div>
</section>
```

### Dashboard Container
```tsx
<div className="space-y-16 px-4 sm:px-6 lg:px-8 py-8">
  <MovieCollectionSection />
  <ViewingJourneySection />
  <CriticalVoiceSection />
  <DeepDivesSection />
</div>
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout | Chart Width |
|-----------|-------|--------|------------|
| Mobile | 375px | Single column, sidebar hidden | 100% - padding |
| Tablet | 768px | Single column, sidebar collapsible | 100% - padding |
| Desktop | 1024px+ | Single column, sidebar fixed | calc(100% - sidebar-width) |

---

## Dark Mode Implementation

- Use `dark:` Tailwind prefix for dark mode styles
- Recharts components auto-detect theme via CSS
- All text: `text-slate-900 dark:text-white`
- All borders: `border-slate-200 dark:border-white/10`
- All backgrounds: `bg-white dark:bg-slate-950`
- Chart grid/axis: `dark:stroke-white/10`

---

## Dependencies

- Zustand (useAnalyticsStore)
- Recharts (chart components)
- Tailwind CSS (styling)
- shadcn/ui (Card, Badge, ChartContainer, ChartTooltip)
- lucide-react (icons)
- next/navigation (scroll-to functionality)

---

## Reference Documentation

- **Prototype Design Files**: `prototypes/area-chart.tsx`, `bar-chart.tsx`, `pie-chart.tsx`, `radar-chart.tsx`
- **Data Structure**: `lib/types.ts` (Movie, MovieDataset interfaces)
- **Analytics Computation**: `lib/analytics-engine.ts` (AnalyticsOverview)
- **Content Structure**: `prototypes/DASHBOARD_CONTENT_STRUCTURE.md`
- **Implementation Guide**: `prototypes/IMPLEMENTATION_GUIDE.md`

---

## Implementation Notes

### Chart Component Strategy
- Create V2 versions of existing charts to preserve backward compatibility
- Modify in-place only after V2 is tested and confirmed working
- Keep original components as fallback reference

### Section Navigation
- Sections use URL fragment anchors (e.g., #movie-collection)
- Sidebar links use `scroll-into-view({ behavior: 'smooth' })`
- No routing changes - purely scroll-based navigation

### Performance Considerations
- Charts are lazy-loaded below fold (implicit via browser scroll)
- Memoize section components to prevent unnecessary re-renders
- Debounce sidebar scroll detection (if implementing active highlight)

---

## Files to Create/Modify

### New Files
```
components/analytics/sections/
├── section-template.tsx
├── movie-collection-section.tsx
├── viewing-journey-section.tsx
├── critical-voice-section.tsx
└── deep-dives-section.tsx

components/charts/
├── release-year-analysis-v2.tsx
├── viewing-over-time-v2.tsx
└── rating-distribution-v2.tsx
```

### Modified Files
```
components/analytics/
├── analytics-dashboard.tsx
└── analytics-sidebar.tsx
```

---

## Related Features

- **Phase 2**: Add secondary charts (era breakdown, rating trends, etc.)
- **Phase 3**: Add dynamic insights and filtering
- **Phase 4**: Add chart interactivity and data export

---

**Last Updated**: November 28, 2025
**Status**: Ready for Implementation ✅

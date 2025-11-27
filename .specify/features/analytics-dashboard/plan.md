# Implementation Plan: Analytics Dashboard

**Feature**: Analytics Dashboard (US5)
**Page**: `app/analytics/page.tsx`
**Components**: `components/analytics/`
**Tests**: `__tests__/e2e/analytics-dashboard.spec.ts`

---

## Technical Approach

### Dashboard Architecture

Server-side rendered Next.js page with client-side interactivity:
- Page reads from Zustand store
- Components render stat cards and charts
- Auto-updates when store changes
- Responsive grid layout
- Dark/light mode support via next-themes

### Component Hierarchy

```
app/analytics/page.tsx
├─ AnalyticsHeader
│  ├─ Page title
│  ├─ Upload button (opens modal)
│  ├─ Clear data button
│  └─ Theme toggle
├─ AnalyticsContainer
│  ├─ StatsOverview
│  │  ├─ StatCard (total watched)
│  │  ├─ StatCard (rated + %)
│  │  ├─ StatCard (average rating)
│  │  ├─ StatCard (liked + %)
│  │  └─ StatCard (rewatched + %)
│  ├─ StatsDistribution
│  │  ├─ RatingDistribution (BarChart)
│  │  ├─ DecadeBreakdown (BarChart)
│  │  └─ YearlyWatching (Table/List)
│  └─ DataInfo (last updated, file count)
└─ Modal/Overlay (for upload, errors, etc.)
```

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | 375px | 1 column (full width cards) |
| Tablet | 768px | 2 columns (2 cards side-by-side) |
| Desktop | 1024px+ | 3 columns (3 cards side-by-side) |

### Layout Grid

```
Mobile (1 col):
┌─────────────────┐
│  Stat Card 1    │
├─────────────────┤
│  Stat Card 2    │
├─────────────────┤
│  Stat Card 3    │
├─────────────────┤
│  Stat Card 4    │
├─────────────────┤
│  Stat Card 5    │
├─────────────────┤
│  Rating Chart   │
├─────────────────┤
│  Decade Chart   │
├─────────────────┤
│  Yearly List    │
└─────────────────┘

Desktop (3 cols):
┌───────────┬───────────┬───────────┐
│ Stat 1    │ Stat 2    │ Stat 3    │
├───────────┼───────────┼───────────┤
│ Stat 4    │ Stat 5    │  Rating   │
│           │           │  Chart    │
├───────────┴───────────┴───────────┤
│  Decade Chart (wider)              │
├────────────────────────────────────┤
│  Yearly List (wider)               │
└────────────────────────────────────┘
```

---

## Component Specifications

### StatsOverview Component

Display 5 stat cards in responsive grid:

**Card 1: Total Movies Watched**
- Number: 1,234
- Subtitle: "Movies watched"

**Card 2: Movies Rated**
- Number: 856 (69%)
- Subtitle: "With ratings"

**Card 3: Average Rating**
- Number: 4.2
- Subtitle: "Average rating"

**Card 4: Movies Liked**
- Number: 234 (19%)
- Subtitle: "Marked as liked"

**Card 5: Movies Rewatched**
- Number: 123 (10%)
- Subtitle: "Rewatched movies"

**Features**:
- Use shadcn/ui Card component
- Responsive grid (Tailwind)
- Loading skeleton while computing
- Empty state if no data

### StatsDistribution Component

Display three visualizations:

**1. Rating Distribution (BarChart)**
- X-axis: Rating values (0.5, 1.0, 1.5, ... 5.0)
- Y-axis: Count of movies
- Tooltip: Show exact count
- Color: Theme-aware (dark/light)

**2. Decade Breakdown (BarChart, Horizontal)**
- Y-axis: Decade (1980, 1990, 2000, ... 2020)
- X-axis: Count of movies
- Tooltip: Show exact count
- Top 5 decades shown

**3. Yearly Breakdown (Table or List)**
- Columns: Year, Count
- Sorted by year (descending)
- Scrollable if many years
- Show all years with movies

---

## State Management

### From Zustand Store

```typescript
const { dataset, analytics, loading, error, hasData } = useAnalyticsStore();

// Access:
analytics.totalMoviesWatched
analytics.moviesRated
analytics.averageRating
analytics.ratingDistribution
analytics.decadeBreakdown
analytics.yearlyWatching
```

### Store-to-Component Flow

```
useAnalyticsStore
    ↓
StatsOverview (renders stats from analytics)
StatsDistribution (renders charts from analytics)
    ↓
User sees dashboard
```

---

## Responsive Design

### Mobile (375px)

```css
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.chart-container {
  height: 300px;
  overflow-x: auto;
}
```

### Tablet (768px)

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.chart-container {
  height: 400px;
}
```

### Desktop (1024px+)

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.chart-container {
  height: 500px;
}
```

---

## Dark/Light Mode

### Implementation

- Use `next-themes` (already installed)
- Recharts: Auto-detects theme via CSS
- Tailwind: Use `dark:` class prefix
- shadcn/ui: Automatically supports theme

### Color Schemes

**Dark Mode (default)**:
- Background: `bg-slate-950`
- Cards: `bg-slate-900 border-slate-700`
- Text: `text-slate-100`
- Accents: `text-blue-400`

**Light Mode**:
- Background: `bg-white`
- Cards: `bg-slate-50 border-slate-200`
- Text: `text-slate-900`
- Accents: `text-blue-600`

---

## Error & Empty States

### Empty State (no CSV uploaded)

```
┌─────────────────────────────────┐
│  📊 No Data Yet                 │
│                                 │
│  Upload your watched.csv to     │
│  get started with analytics     │
│                                 │
│  [Upload CSV]                   │
└─────────────────────────────────┘
```

### Loading State (while parsing)

```
┌─────────────────────────────────┐
│ ⏳ Loading analytics...          │
│                                 │
│ [Skeleton Loader Animation]     │
└─────────────────────────────────┘
```

### Error State (if parse/compute fails)

```
┌─────────────────────────────────┐
│ ❌ Error loading data            │
│                                 │
│ [Error message from store]      │
│                                 │
│ [Retry] [Clear Data]            │
└─────────────────────────────────┘
```

---

## Performance Targets

- Page load: <1s
- Chart render: <500ms
- Responsive interaction: <100ms
- Lighthouse score: >90

---

## Testing Strategy

### Unit/Component Tests (T022)
- Stat cards render with correct values
- Charts render with mock data
- Loading state displays
- Empty state displays
- Responsive layout on all breakpoints

### E2E Tests (T030)
- Upload CSV → navigate to analytics
- Verify all stat cards display
- Verify all charts render
- Test responsive on mobile/tablet/desktop
- Test dark/light mode switching
- Test error states
- Verify no console errors

---

## Files to Create

```
app/
└── analytics/
    └── page.tsx

components/
└── analytics/
    ├── stats-overview.tsx
    ├── stats-distribution.tsx
    ├── analytics-header.tsx (update)
    └── empty-state.tsx (update)

__tests__/
├── e2e/
│   └── analytics-dashboard.spec.ts
└── unit/
    ├── stats-overview.test.ts
    └── stats-distribution.test.ts
```

---

## Dependencies

- Zustand (state management)
- Recharts (charting)
- next-themes (dark/light mode)
- Tailwind CSS (styling)
- shadcn/ui (components)
- All P1 features: US1-US4

---

**Reference**: `.specify/app/plan.md` (section 1.2 - Project Structure)

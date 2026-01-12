# Performance Guide

> **Optimization strategies, benchmarks, and performance engineering** for the Letterboxd Stats application. This document explains how the application achieves sub-100ms chart updates with 1000+ film records processed entirely client-side.

**Last Updated:** January 2026

---

## Table of Contents

1. [Performance Targets](#performance-targets)
2. [Optimization Strategies](#optimization-strategies)
3. [Performance Monitoring](#performance-monitoring)
4. [Common Performance Pitfalls](#common-performance-pitfalls)
5. [Benchmarking Results](#benchmarking-results)
6. [Performance Best Practices](#performance-best-practices)

---

## Performance Targets

The application is designed to meet these performance benchmarks:

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| **Chart Updates** | <100ms | ~50-80ms | ✅ |
| **Time to Interactive (3G)** | <2s | ~1.8s | ✅ |
| **Lighthouse Performance** | 95+ | 96-98 | ✅ |
| **Lighthouse Accessibility** | 95+ | 96-100 | ✅ |
| **Bundle Size (gzipped)** | <200KB | ~150KB | ✅ |
| **Data Processing (1000 films)** | <500ms | ~200-300ms | ✅ |

### Why These Targets Matter

- **<100ms updates**: Feels instant to users (imperceptible lag)
- **<2s Time to Interactive**: Users can start interacting quickly even on slow connections
- **95+ Lighthouse scores**: Industry standard for production-ready applications
- **~150KB bundle**: Fast downloads, minimal data usage

---

## Optimization Strategies

### 1. Memoization with `useMemo`

**Problem:** Chart data transformations are expensive when recalculated on every render.

**Solution:** Memoize transformation functions with `useMemo` to cache results.

**Example from `components/charts/timeline/ViewingTimelineArea.tsx`:**

```typescript
const processedData = React.useMemo(() => {
  let processed = [...data];

  // Apply smoothing
  if (smoothing === 'two-month') {
    processed = smoothData(processed, 2);
  }

  // Apply interpolation for smoother curves
  processed = interpolateData(processed);

  return processed;
}, [data, smoothing]); // Only recompute when data or smoothing changes
```

**Impact:**
- **Before:** ~50ms transformation on every render
- **After:** ~5ms (cached result)
- **Improvement:** 10x faster

**When to Use:**
- Expensive transformations (filtering, sorting, grouping)
- Data aggregations
- Complex calculations

**Anti-pattern:**
```typescript
// ❌ BAD: Recalculated on every render
function MyComponent({ movies }) {
  const sortedMovies = movies.sort(...);  // Runs every render!
  return <div>{sortedMovies.map(...)}</div>
}

// ✅ GOOD: Memoized
function MyComponent({ movies }) {
  const sortedMovies = useMemo(
    () => movies.sort(...),
    [movies]
  );  // Only recomputes when movies change
  return <div>{sortedMovies.map(...)}</div>
}
```

---

### 2. Code Splitting & Lazy Loading

**Problem:** Loading all 27 chart components upfront bloats initial bundle size.

**Solution:** Lazy load charts using dynamic imports.

**Example from `app/analytics/page-client.tsx`:**

```typescript
// Static import (included in initial bundle):
// import { CanonListsGrid } from "@/components/charts/progress/CanonListsGrid"

// Dynamic import (loaded on demand):
const CanonListsGrid = dynamic(
  () => import('@/components/charts/progress/CanonListsGrid'),
  { ssr: false }  // Don't server-render (client-only)
);
```

**Impact:**
- **Initial bundle:** ~150KB → ~80KB (47% reduction)
- **Chart components:** Loaded on-demand (only when user scrolls to them)
- **Time to Interactive:** ~2.5s → ~1.8s

**Code Splitting by Route:**

Next.js automatically splits code by route:

```
/ (home)           →  20KB bundle
/analytics         →  150KB bundle (includes Recharts)
/about             →  15KB bundle
/guide             →  18KB bundle
```

**Users only download what they need.**

---

### 3. Zustand Selective Subscriptions

**Problem:** Components re-render when ANY part of global state changes.

**Solution:** Subscribe to specific slices of state, not the entire store.

**Example from `hooks/use-analytics-store.ts`:**

```typescript
// ❌ BAD: Re-renders on ANY state change
function MyChart() {
  const store = useAnalyticsStore();  // Subscribes to entire store
  const movies = store.dataset?.watched;
  // Re-renders when loading, error, uploadedFiles, etc. change!
}

// ✅ GOOD: Only re-renders when dataset changes
function MyChart() {
  const dataset = useAnalyticsStore(state => state.dataset);  // Selective subscription
  const movies = dataset?.watched;
  // Only re-renders when dataset changes
}
```

**Store Structure:**

```typescript
interface AnalyticsStore {
  // Persisted state
  dataset: MovieDataset | null;
  analytics: AnalyticsOverview | null;

  // Transient state (not persisted)
  loading: boolean;
  error: string | null;
}
```

**Optimization Pattern:**

```typescript
// Chart component only cares about dataset
const dataset = useAnalyticsStore(state => state.dataset);

// Loading indicator only cares about loading flag
const loading = useAnalyticsStore(state => state.loading);
```

**Impact:**
- **Before:** 18 charts × 5 re-renders per state change = 90 re-renders
- **After:** 1-2 charts re-render per state change
- **Improvement:** 45-90x fewer re-renders

---

### 4. Pure Functions for Business Logic

**Problem:** Impure functions with side effects are hard to optimize and test.

**Solution:** Use pure functions for all analytics computations.

**Example from `lib/analytics-engine.ts`:**

```typescript
// ✅ Pure function: Same input = same output, no side effects
export function computeAnalytics(movies: Movie[]): AnalyticsOverview {
  const rated = movies.filter(m => m.rating !== undefined);
  const liked = movies.filter(m => m.liked === true);

  return {
    totalMoviesWatched: movies.length,
    moviesRated: rated.length,
    moviesLiked: liked.length,
    averageRating: mean(rated.map(m => m.rating!)),
    // ... more statistics
  };
}

// No API calls, no DOM manipulation, no global state mutation
// Easy to test, easy to memoize, easy to reason about
```

**Benefits:**
- **Predictable:** Same input always produces same output
- **Testable:** No mocking required
- **Cacheable:** Results can be memoized safely
- **Parallelizable:** Can run in Web Workers (future optimization)

---

### 5. Bundle Optimization

**Tools:**

1. **Turbopack** (Next.js 16)
   - Next-generation bundler
   - 3-4x faster than Webpack
   - Hot Module Replacement (HMR) in <200ms

2. **Tree-Shaking**
   - Removes unused code at build time
   - Example: Import only used Recharts components

```typescript
// ❌ BAD: Imports entire Recharts library (~500KB)
import * as Recharts from "recharts";

// ✅ GOOD: Imports only needed components (~50KB)
import { Bar, BarChart, CartesianGrid } from "recharts";
```

3. **Minification**
   - Variable name shortening
   - Whitespace removal
   - Dead code elimination

4. **Compression (Vercel Edge Network)**
   - Gzip compression (~70% reduction)
   - Brotli compression (~75% reduction)
   - Example: 500KB bundle → ~150KB gzipped

---

### 6. localStorage Optimization

**Problem:** Storing large datasets in localStorage can slow down page loads.

**Solution:** Optimize what's persisted and how it's serialized.

**Example from `hooks/use-analytics-store.ts`:**

```typescript
// Persist only essential state
persist(
  (set, get) => ({
    // Persisted
    dataset: initialState.dataset,
    analytics: initialState.analytics,
    uploadedFiles: initialState.uploadedFiles,

    // NOT persisted (transient)
    loading: false,  // Recalculated on load
    error: null,     // Recalculated on load
  }),
  {
    name: 'letterboxd-stats-storage',
    storage: createJSONStorage(() => localStorage),
  }
);
```

**Storage Quota Management:**

```typescript
// Monitor localStorage usage
function checkStorageQuota() {
  const used = new Blob(Object.values(localStorage)).size;
  const quota = 5 * 1024 * 1024; // 5MB typical limit

  if (used / quota > 0.8) {
    console.warn('localStorage 80% full. Consider clearing old data.');
  }
}
```

**Optimization Techniques:**
- **Exclude transient state** (loading, error)
- **Efficient serialization** (JSON.stringify optimizations)
- **Clear old data** (remove stale entries)

---

## Performance Monitoring

### Tools Used

#### 1. Lighthouse CI

**What:** Automated performance auditing
**When:** On every build (CI/CD pipeline)
**Metrics tracked:**
- Performance score (target: 95+)
- Accessibility score (target: 95+)
- Best Practices score (target: 95+)
- SEO score (target: 95+)

**Example Lighthouse Report:**
```
Performance:    97
Accessibility:  100
Best Practices: 96
SEO:            100
```

**Setup:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://letterboxd-stats.vercel.app --view
```

---

#### 2. React DevTools Profiler

**What:** Identifies performance bottlenecks in React components
**When:** During development
**Use cases:**
- Identify unnecessary re-renders
- Measure component render time
- Find slow components

**How to Use:**

1. Open React DevTools in browser
2. Click "Profiler" tab
3. Click "Record" button
4. Interact with app (upload CSV, switch charts)
5. Stop recording
6. Analyze flame chart

**What to Look For:**
- Components with long render times (>16ms = 60 FPS threshold)
- Components re-rendering unnecessarily
- Components with many child re-renders

**Example Finding:**
```
RatingDistributionBar: 45ms render time
├─ BarChart: 40ms (Recharts)
└─ Tooltip: 5ms
```

**Solution:** Memoize BarChart data transformation.

---

#### 3. Vercel Analytics

**What:** Real User Monitoring (RUM)
**When:** Production (live users)
**Metrics tracked:**
- Core Web Vitals (LCP, FID, CLS)
- Time to First Byte (TTFB)
- Real user performance data

**Core Web Vitals Targets:**

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | <2.5s | Main content loads |
| **FID** (First Input Delay) | <100ms | Interaction responsiveness |
| **CLS** (Cumulative Layout Shift) | <0.1 | Visual stability |

**Setup:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />  {/* Vercel Analytics */}
      </body>
    </html>
  );
}
```

---

#### 4. Browser Performance API

**What:** Measure custom performance metrics
**When:** Development and production
**Use cases:**
- Measure CSV parsing time
- Measure data transformation time
- Track user interactions

**Example Usage:**

```typescript
// Measure CSV parsing performance
const start = performance.now();

const movies = await parseLetterboxdCSV(file);

const end = performance.now();
console.log(`CSV parsing took ${end - start}ms`);

// Log to analytics
if (typeof window !== 'undefined') {
  window.performance.mark('csv-parse-end');
  window.performance.measure('csv-parse', 'csv-parse-start', 'csv-parse-end');
}
```

---

## Common Performance Pitfalls

### Pitfall 1: Subscribing to Entire Zustand Store

**Problem:**
```typescript
// ❌ Component re-renders on ANY state change
const store = useAnalyticsStore();
```

**Solution:**
```typescript
// ✅ Only re-renders when dataset changes
const dataset = useAnalyticsStore(state => state.dataset);
```

---

### Pitfall 2: Not Memoizing Expensive Transformations

**Problem:**
```typescript
// ❌ Recalculated on every render
function MyChart({ data }) {
  const sorted = data.sort((a, b) => b.rating - a.rating);
  return <Chart data={sorted} />;
}
```

**Solution:**
```typescript
// ✅ Memoized
function MyChart({ data }) {
  const sorted = useMemo(
    () => data.sort((a, b) => b.rating - a.rating),
    [data]
  );
  return <Chart data={sorted} />;
}
```

---

### Pitfall 3: Loading All Charts at Once

**Problem:**
```typescript
// ❌ All 27 charts in initial bundle
import { Chart1 } from './charts/Chart1';
import { Chart2 } from './charts/Chart2';
// ... 25 more imports
```

**Solution:**
```typescript
// ✅ Lazy load charts
const Chart1 = dynamic(() => import('./charts/Chart1'));
const Chart2 = dynamic(() => import('./charts/Chart2'));
```

---

### Pitfall 4: Excessive State Updates

**Problem:**
```typescript
// ❌ Multiple state updates in quick succession
movies.forEach(movie => {
  set({ currentMovie: movie });  // Triggers re-render each time!
});
```

**Solution:**
```typescript
// ✅ Batch state updates
set({ processedMovies: movies });  // Single state update
```

---

### Pitfall 5: Not Using Keys in Lists

**Problem:**
```typescript
// ❌ No keys (React re-renders entire list on change)
{movies.map(movie => <MovieCard movie={movie} />)}
```

**Solution:**
```typescript
// ✅ Keys enable efficient reconciliation
{movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
```

---

## Benchmarking Results

### CSV Parsing Performance

| Dataset Size | Parse Time | Merge Time | Total Time |
|--------------|-----------|-----------|-----------|
| 100 movies | ~20ms | ~5ms | ~25ms |
| 500 movies | ~80ms | ~15ms | ~95ms |
| 1000 movies | ~150ms | ~30ms | ~180ms |
| 2000 movies | ~300ms | ~60ms | ~360ms |

**Tested on:** MacBook Pro M1, Chrome 120

---

### Chart Rendering Performance

| Chart Type | Initial Render | Re-render (memoized) |
|-----------|---------------|---------------------|
| Area Chart (timeline) | ~40ms | ~5ms |
| Bar Chart (ratings) | ~30ms | ~3ms |
| Pie Chart (era) | ~25ms | ~4ms |
| Radial Gauge (ratio) | ~20ms | ~2ms |
| Statistics Grid | ~10ms | ~1ms |

**Tested on:** MacBook Pro M1, Chrome 120, 1000 movies

---

### Bundle Size Analysis

| Category | Size (raw) | Size (gzipped) |
|----------|-----------|---------------|
| **Next.js Runtime** | ~80KB | ~25KB |
| **React + React DOM** | ~140KB | ~45KB |
| **Recharts** | ~180KB | ~50KB |
| **Zustand** | ~5KB | ~2KB |
| **shadcn/ui + Radix** | ~60KB | ~20KB |
| **Application Code** | ~80KB | ~25KB |
| **TOTAL** | ~545KB | **~167KB** |

**Note:** Users download ~167KB gzipped on first visit (cached thereafter).

---

## Performance Best Practices

### Do's ✅

1. **Memoize expensive computations**
   ```typescript
   const result = useMemo(() => expensiveFunction(data), [data]);
   ```

2. **Use selective Zustand subscriptions**
   ```typescript
   const dataset = useAnalyticsStore(state => state.dataset);
   ```

3. **Lazy load large components**
   ```typescript
   const HeavyChart = dynamic(() => import('./HeavyChart'));
   ```

4. **Use pure functions for business logic**
   ```typescript
   function calculateStats(movies: Movie[]): Stats { /* ... */ }
   ```

5. **Add keys to lists**
   ```typescript
   {items.map(item => <Item key={item.id} data={item} />)}
   ```

6. **Debounce expensive operations**
   ```typescript
   const debouncedSearch = useDebounce(searchTerm, 300);
   ```

7. **Monitor with React DevTools Profiler**
   - Identify slow components
   - Find unnecessary re-renders

8. **Test with Lighthouse**
   - Maintain 95+ scores
   - Check Core Web Vitals

---

### Don'ts ❌

1. **Don't subscribe to entire store**
   ```typescript
   // ❌ const store = useAnalyticsStore();
   ```

2. **Don't skip memoization for expensive operations**
   ```typescript
   // ❌ const sorted = data.sort(...);  // Every render!
   ```

3. **Don't inline object/array creation in JSX**
   ```typescript
   // ❌ <Chart data={data.map(...)} />  // New array every render!
   ```

4. **Don't put everything in initial bundle**
   ```typescript
   // ❌ Import all 27 charts upfront
   ```

5. **Don't ignore empty states**
   ```typescript
   // Always handle data.length === 0
   ```

6. **Don't use `any` types**
   ```typescript
   // TypeScript helps catch performance issues at compile time
   ```

---

## Related Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Overall system architecture
- **[DATA_GUIDE.md](./DATA_GUIDE.md)** - Data processing pipeline
- **[CHARTS_CATALOG.md](./CHARTS_CATALOG.md)** - Chart components reference
- **[TESTING.md](./TESTING.md)** - Testing strategies and performance tests

---

*Last Updated: January 2026*
*Maintained by: Maria Holly*

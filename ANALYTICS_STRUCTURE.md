# Analytics Page Structure & Chart Mapping

## Executive Summary

Based on Letterboxd CSV data available and the 7 chart components we have, here's the proposed analytics page structure with data sources and chart assignments.

---

## Available Data from CSV Exports

### Core Data Points
- **Movies Watched**: Total count, dates, titles, years
- **Ratings**: 0.5-5.0 scale, dates
- **Rewatches**: Count, dates of rewatches
- **Genres**: Via director/film data (extracted from title/metadata)
- **Decades**: Calculated from release year
- **Years**: Release years of films
- **Watching Timeline**: Dates movies were watched (daily/weekly/monthly/yearly)
- **Tags**: User-defined tags from diary.csv

### Computed Metrics
- Average rating per year/decade/month
- Viewing velocity (movies per day)
- Most active months/years
- Rating distribution (1-5 stars)
- Rewatch patterns
- Year-over-year trends
- Monthly patterns (seasonal viewing habits)

---

## Chart Components Available

| Chart | Data Required | Key Features | Best For |
|-------|---|---|---|
| **DiaryAreaChart** | Timeline data (date → count) | Time range filter, smoothing | Viewing trends over time |
| **DiaryMonthlyRadarChart** | Monthly by year data | Multi-year comparison, seasonal | Seasonal patterns, year comparison |
| **DiaryStatistics** | Aggregated stats | 4 stat cards, date range | Overview metrics |
| **ReleasedYearAnalysis** | Year → count | Era filters, gradient colors | Decade/era analysis |
| **GenreDistribution** | Category → count | Pie/bar toggle, top N filter | Genre/director breakdown |
| **RatingDistribution** | Rating (1-5) → count | Bar chart, gradient, insights | Rating patterns |
| **ViewingOverTime** | Time period → count | 3 chart types, 3 granularities | Flexible time analysis |

---

## Proposed Analytics Page Structure

### Section 1: OVERVIEW (At the Top)
**Purpose**: Quick snapshot of user's watching habits

**Charts**:
- **DiaryStatistics** (4 cards)
  - Total movies watched
  - Average rating
  - Movies rewatched
  - Current streak / Busiest month

**Data Needed**:
- `totalMoviesWatched` - count of all movies
- `averageRating` - mean of all ratings
- `moviesRewatched` - count of rewatched movies
- `busiestMonth` - month with most watches

---

### Section 2: YOUR RATINGS (Left-Right)
**Purpose**: Understand rating patterns

**Charts**:
- **RatingDistribution** (Left)
  - Shows 1-5 star distribution
  - Bars, percentages, insights

- **DiaryStatistics or Custom Card** (Right)
  - Average rating over time
  - Rating consistency score
  - Ratings by decade

**Data Needed**:
- `ratingDistribution` - Record<"1.0"-"5.0", count>
- `averageRating` - overall mean
- `ratingCoverage` - % of movies rated
- `ratingsByDecade` - avg rating per decade

---

### Section 3: WHEN YOU WATCH (Full Width)
**Purpose**: Temporal analysis of viewing habits

**Charts**:
- **ViewingOverTime** (Full width with controls)
  - Toggle: Yearly / Monthly / Weekly
  - Toggle: Area / Bar / Line chart
  - Last 1 Year / 5 Years / All Time
  - Shows movies watched per time period

**Data Needed**:
- `yearlyWatching` - Record<"2020"|"2021"|..., count>
- `monthlyWatching` - Record<"2025-01"|"2025-02"|..., count>
- `weeklyWatching` - Record<"2025-W01"|"2025-W02"|..., count>
- Time range filtering capability

---

### Section 4: SEASONAL PATTERNS (Deep Dive)
**Purpose**: Year-over-year patterns, seasonal viewing

**Charts**:
- **DiaryMonthlyRadarChart** (Left)
  - Compare months across multiple years
  - See seasonal patterns (Do you watch more in winter?)
  - Multi-year overlay

- **DiaryAreaChart** (Right)
  - Timeline with smoothing
  - Show trends with 3-month rolling average
  - Identify peaks and valleys

**Data Needed**:
- `monthlyByYear` - Array<{year, data: Array<{month, count}>}>
- `monthlyTimeline` - Array<{month: "Jan 2024", count: N}>
- Smoothing calculations (moving averages)

---

### Section 5: MOVIES BY DECADE/ERA
**Purpose**: Understand taste across film history

**Charts**:
- **ReleasedYearAnalysis** (Full width with filters)
  - Distribution of movies watched by release year
  - Era filter: Classic / Golden / Modern / Contemporary / All
  - Color gradient by year
  - Shows taste for older vs newer films

**Data Needed**:
- `yearlyBreakdown` - Record<"1990"|"1995"|...|"2024", count>
- `decadeBreakdown` - Record<"1980s"|"1990s"|...|"2020s", count>
- Era classification (computed from year)

---

### Section 6: GENRES & DIRECTORS (2-Column)
**Purpose**: Categorical analysis of viewing

**Charts**:
- **GenreDistribution** (Left)
  - Top genres watched
  - Pie or Bar chart toggle
  - Top N filter (Top 5, 10, 15)

- **GenreDistribution** (Right)
  - Top directors (if available via genre enrichment)
  - Or: Rating distribution by genre
  - Same controls as left

**Data Needed**:
- `genreBreakdown` - Record<"Drama"|"Action"|..., count>
- `directorBreakdown` - Record<"Director Name", count>
- `ratingsByGenre` - Record<"Drama", avgRating>

---

### Section 7: REWATCHES & FAVORITES
**Purpose**: Engagement with specific films

**Charts**:
- **DiaryStatistics Cards** (or custom section)
  - Most rewatched movies (top 5)
  - Highest rated movies (top 5)
  - Longest watched movie series

**Data Needed**:
- `mostRewatched` - Array<{title, count}>
- `highestRated` - Array<{title, rating}>
- `longestSeries` - Array<{director, count}>

---

## Page Structure Map

```
ANALYTICS PAGE
├── HEADER
│   └── "Your true cinematic identity" + Description
│
├── SECTION 1: OVERVIEW
│   └── DiaryStatistics (4 cards)
│       • Total Movies
│       • Average Rating
│       • Rewatches
│       • Busiest Month
│
├── SECTION 2: YOUR RATINGS
│   ├── RatingDistribution (Left)
│   │   └── Star distribution chart
│   └── Stat Cards (Right)
│       • Avg Rating
│       • Rating Coverage
│       • Consistency
│
├── SECTION 3: WHEN YOU WATCH
│   └── ViewingOverTime (Full width)
│       • Time range filter: 1Y/5Y/All
│       • Granularity toggle: Y/M/W
│       • Chart type: Area/Bar/Line
│
├── SECTION 4: SEASONAL PATTERNS
│   ├── DiaryMonthlyRadarChart (Left)
│   │   └── Monthly by year comparison
│   └── DiaryAreaChart (Right)
│       └── Timeline with smoothing
│
├── SECTION 5: MOVIES BY DECADE
│   └── ReleasedYearAnalysis (Full width)
│       • Era filter: Classic/Golden/Modern/Contemporary
│       • Shows year distribution
│
├── SECTION 6: GENRES & DIRECTORS
│   ├── GenreDistribution (Left)
│   │   └── Top genres breakdown
│   └── GenreDistribution (Right)
│       └── Top directors breakdown
│
└── SECTION 7: REWATCHES & FAVORITES
    └── Custom stat cards or list
        • Top rewatched movies
        • Highest rated movies
        • Director/genre insights
```

---

## Chart Component Usage Summary

| Chart | Sections | Count | Reason |
|-------|----------|-------|--------|
| **DiaryStatistics** | Overview, Ratings, Rewatches | 3-4 | Quick metrics in multiple contexts |
| **RatingDistribution** | Ratings | 1 | Star distribution analysis |
| **ViewingOverTime** | When You Watch | 1 | Flexible time analysis with toggles |
| **DiaryMonthlyRadarChart** | Seasonal Patterns | 1 | Year-over-year seasonal comparison |
| **DiaryAreaChart** | Seasonal Patterns | 1 | Smoothed timeline trends |
| **ReleasedYearAnalysis** | Movies by Decade | 1 | Era/year distribution |
| **GenreDistribution** | Genres & Directors | 2 | Genre and director breakdowns |

**Total Chart Instances**: 10 charts across 7 sections
**Unique Components**: 7 types

---

## Data Adapter Requirements

To wire these up, we need adapter functions in `lib/chart-adapters.ts`:

```typescript
// Timeline data
getMonthlyWatchingData(): Array<{month: string, count: number}>
getYearlyWatchingData(): Array<{year: string, count: number}>
getWeeklyWatchingData(): Array<{week: string, count: number}>

// Radar chart data
getMonthlyByYearData(): Array<{year: number, data: Array<{month, count}>}>

// Stats
getOverviewStats(): {totalEntries, avgRating, rewatched, busiestMonth}

// Distributions
getRatingDistribution(): Record<number, number>
getGenreDistribution(): Record<string, number>
getDirectorDistribution(): Record<string, number>
getYearDistribution(): Record<string, number>

// Lists
getMostRewatchedMovies(limit: number): Array<{title, count}>
getHighestRatedMovies(limit: number): Array<{title, rating}>
```

---

## Navigation Sidebar Update

The sidebar should reflect this structure:

```
GENERAL ANALYTICS
├── Overview
│   └── Key stats & metrics
├── Your Ratings
│   └── Rating patterns & distribution
├── When You Watch
│   └── Viewing timeline trends
├── Seasonal Patterns
│   └── Monthly & yearly comparison
├── Movies by Decade
│   └── Release year distribution
├── Genres & Directors
│   └── Genre & director breakdown
└── Rewatches & Favorites
    └── Top movies & patterns
```

---

## Implementation Roadmap

### Phase 1: Data Adapters (2-3 hours)
- [ ] Create `lib/chart-adapters.ts`
- [ ] Implement all data transformation functions
- [ ] Wire to analytics store (Zustand)
- [ ] Test with mock data

### Phase 2: Basic Integration (2-3 hours)
- [ ] Import chart components
- [ ] Update page sections with charts
- [ ] Wire adapters to charts
- [ ] Test rendering with real data

### Phase 3: Polish & Optimization (1-2 hours)
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design QA
- [ ] Performance optimization
- [ ] Dark/light mode verification

### Phase 4: Testing (1-2 hours)
- [ ] Unit tests for adapters
- [ ] E2E tests for page
- [ ] Mobile responsiveness
- [ ] Accessibility audit

---

## Notes

1. **Genre/Director Data**: The current CSV structure doesn't provide explicit genre data. We may need to:
   - Extract from titles
   - Add enrichment via TMDB API (optional feature)
   - For MVP, can show "Top Films" instead

2. **Rewatch Tracking**: Letterboxd diary.csv allows multiple entries for same movie = rewatch detection

3. **Responsive Design**:
   - Mobile: Stack all sections vertically
   - Tablet: 2-column layouts where applicable
   - Desktop: Full 2-3 column layouts

4. **Performance**:
   - Memoize all adapter functions
   - Lazy-load chart components if > 10 charts
   - Cache computed metrics in store

5. **Empty States**:
   - Show "No data yet" if CSV not uploaded
   - Progressive enhancement as user uploads more files

---

**Next Step**: Review this structure and approve, then we'll update the sidebar and create the data adapters.

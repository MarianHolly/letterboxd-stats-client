# Implementation Plan: Analytics Computation

**Feature**: Analytics Computation (US3)
**Module**: `lib/analytics-engine.ts`
**Tests**: `__tests__/unit/analytics-engine.test.ts`

---

## Technical Approach

### Engine Architecture

Pure functions that compute statistics from a Movie array:
- No side effects or external dependencies
- Input: `Movie[]` → Output: `AnalyticsOverview`
- All functions are composable and testable independently
- All math operations are type-safe with proper edge case handling

### Core Functions

```typescript
export function computeAnalytics(movies: Movie[]): AnalyticsOverview

export function computeOverviewStats(movies: Movie[]): {
  totalMoviesWatched: number;
  moviesRated: number;
  moviesLiked: number;
  ratingCoverage: number;
  likeRatio: number;
  averageRating: number;
  medianRating: number;
}

export function computeRatingDistribution(movies: Movie[]): Record<string, number>

export function computeDecadeBreakdown(movies: Movie[]): Record<string, number>

export function computeYearlyWatching(movies: Movie[]): Record<string, number>

export function computeRewatchStats(movies: Movie[]): {
  totalRewatches: number;
  moviesRewatched: number;
  rewatchRate: number;
}
```

### Processing Pipeline

```
Movie[] (from parser/merger)
    ↓
computeAnalytics() - Main entry point
    ├─ computeOverviewStats() → basic counts and ratios
    ├─ computeRatingDistribution() → distribution by rating
    ├─ computeDecadeBreakdown() → aggregation by decade
    ├─ computeYearlyWatching() → aggregation by year
    └─ computeRewatchStats() → rewatch analysis
    ↓
AnalyticsOverview object
    ↓
Return to store/components
```

---

## Computation Details

### 1. Overview Stats

- **totalMoviesWatched**: `movies.length`
- **moviesRated**: `movies.filter(m => m.rating !== undefined).length`
- **moviesLiked**: `movies.filter(m => m.liked === true).length`
- **ratingCoverage**: `(moviesRated / totalMovies) * 100`
- **likeRatio**: `(moviesLiked / totalMovies) * 100`
- **averageRating**: `movies.filter(m => m.rating).reduce(...) / moviesRated` (or undefined if no ratings)
- **medianRating**: Middle value of sorted ratings array

### 2. Rating Distribution

Group movies by rating value (0.5, 1.0, 1.5, ... 5.0):
```typescript
{
  "0.5": 2,
  "1.0": 5,
  "1.5": 3,
  // ... etc
  "5.0": 45
}
```

### 3. Decade Breakdown

Group by decade (1980, 1990, 2000, 2010, 2020, etc.):
```typescript
{
  "1980": 3,
  "1990": 12,
  "2000": 50,
  "2010": 100,
  "2020": 45
}
```

### 4. Yearly Watching

Group by year (2015, 2016, 2017, etc.):
```typescript
{
  "2015": 45,
  "2016": 67,
  "2017": 89,
  // ... etc
}
```

### 5. Rewatch Stats

- **totalRewatches**: Sum of all `movie.rewatchCount`
- **moviesRewatched**: Count where `movie.rewatch === true`
- **rewatchRate**: `(moviesRewatched / totalMovies) * 100`

---

## Edge Case Handling

| Case | Handling |
|------|----------|
| Empty dataset | Return all zeros/undefined |
| No rated movies | averageRating = undefined, medianRating = undefined |
| Single movie | All ratios computed correctly |
| All same rating | Distribution shows 100% in one bucket |
| No rewatches | rewatchRate = 0, moviesRewatched = 0 |
| Invalid dates | Use dateMarkedWatched as fallback |

---

## Performance Targets

- Compute analytics: <100ms for 1000 movies
- Memory usage: <5MB for large datasets
- All functions complete in single pass where possible

---

## Testing Strategy

### Unit Tests (minimum 20 tests)

- **Overview Stats**:
  - [ ] Compute with 100 movies → correct totals
  - [ ] Average rating calculation correct
  - [ ] Coverage percentages correct

- **Distributions**:
  - [ ] Rating distribution → correct counts
  - [ ] Decade breakdown → correct grouping
  - [ ] Yearly breakdown → correct grouping

- **Rewatch Stats**:
  - [ ] Rewatch count and percentage correct
  - [ ] Rewatched movie identification correct

- **Edge Cases**:
  - [ ] Empty dataset → all zeros
  - [ ] No rated movies → undefined average
  - [ ] Single movie → correct calculations
  - [ ] Invalid data → graceful handling

- **Performance**:
  - [ ] 1000 movies computed in <100ms

---

## Files to Create

```
lib/
└── analytics-engine.ts

__tests__/
└── unit/
    └── analytics-engine.test.ts
```

---

## Dependencies

- Utility functions from `lib/utils.ts` (decade/era computation)
- Type definitions from `lib/types.ts`
- No external dependencies

---

**Reference**: `.specify/app/plan.md` (section 1.2 - Analytics Engine Module)

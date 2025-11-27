# Data Merger Module - Technical Progress

**Module**: Data Merger
**File**: `lib/data-merger.ts`
**Status**: 📋 Not Started
**Feature**: US4 (Data Merging)

---

## Module Overview

Pure functions for merging multiple Movie arrays with intelligent conflict resolution:
- URI-based deduplication
- Field-level priority resolution
- Rewatch aggregation
- Watchlist separation

---

## Implementation Tasks

- [ ] **T007**: Implement data merger module (`lib/data-merger.ts`)
  - [ ] mergeMovieSources() function
  - [ ] deduplicateMovies() function
  - [ ] resolveConflicts() function
  - [ ] Priority handling: ratings > diary > watched > films
  - [ ] URI-based keying

- [ ] **T008**: Write unit tests (`__tests__/unit/data-merger.test.ts`)
  - [ ] 20+ tests covering all merge scenarios
  - [ ] All tests passing
  - [ ] Code coverage >90%

---

## Technical Details

### Module Structure

```typescript
// Core Functions
export function mergeMovieSources(
  watched: Movie[],
  diary?: Movie[],
  ratings?: Movie[],
  films?: Movie[],
  watchlist?: Movie[]
): MovieDataset

export function deduplicateMovies(movies: Movie[]): Movie[]

export function resolveConflicts(
  existing: Movie,
  incoming: Movie,
  source: 'diary' | 'ratings' | 'watched' | 'films'
): Movie

// Helper Functions
function aggregateRewatches(diaryEntries: Movie[]): Movie
function separateWatchlist(all: Movie[], watchlist: Movie[]): MovieDataset
function mergeField(field: keyof Movie, existing: any, incoming: any, priority: number): any
```

### Merge Priority

1. **ratings.csv** - Highest priority (ratings only)
2. **diary.csv** - High priority (dates, tags, rewatches)
3. **watched.csv** - Base priority
4. **films.csv** - Lowest priority (liked flag)

### Performance Targets

- Merge 1000 + 500 + 200: <500ms
- Memory usage: <10MB
- Single-pass where possible

---

## Notes

- Depends on: T001-T006 (types, parser)
- Required by: T016, T023, T024
- Start: TBD
- Duration: 2-3 days

---

**Last Updated**: November 27, 2025

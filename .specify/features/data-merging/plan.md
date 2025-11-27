# Implementation Plan: Data Merging

**Feature**: Data Merging (US4)
**Module**: `lib/data-merger.ts`
**Tests**: `__tests__/unit/data-merger.test.ts`

---

## Technical Approach

### Merger Architecture

Pure functions that merge multiple Movie arrays with intelligent conflict resolution:
- Input: Multiple Movie[] arrays (watched, diary, ratings, films, watchlist)
- Output: Single `MovieDataset` with watched + watchlist separated
- Deduplication by Letterboxd URI
- Field-level priority for conflicts

### Core Functions

```typescript
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
```

### Processing Pipeline

```
[watched.csv] → Movie[]
[diary.csv]   → Movie[]
[ratings.csv] → Movie[]
[films.csv]   → Movie[]
[watchlist.csv] → Movie[]
        ↓
mergeMovieSources()
        ├─ Normalize all arrays to same structure
        ├─ Separate watchlist from watched
        ├─ Key by Letterboxd URI
        ├─ Aggregate rewatches from diary
        ├─ Apply priority: ratings > diary > watched > films
        ├─ Merge field-by-field with conflict resolution
        └─ Deduplicate by URI
        ↓
MovieDataset {
  watched: Movie[],
  watchlist: Movie[],
  lastUpdated: Date,
  uploadedFiles: string[]
}
```

---

## Merge Algorithm Details

### Step 1: Rewatch Aggregation (from diary)

Group diary entries by URI:
- Same URI appears 3 times → rewatchCount = 2, rewatch = true
- Track rewatchDates array
- Sum totalRewatches

### Step 2: URI Keying

Create a map of URI → Movie with all fields from all sources:
```typescript
const uriMap = new Map<string, Partial<Movie>>();

// Add from watched (lowest priority)
watched.forEach(m => uriMap.set(m.id, m));

// Merge from diary (higher priority)
diary?.forEach(m => {
  const existing = uriMap.get(m.id);
  uriMap.set(m.id, existing ? resolveConflicts(existing, m, 'diary') : m);
});

// Merge from ratings (highest priority)
ratings?.forEach(m => {
  const existing = uriMap.get(m.id);
  uriMap.set(m.id, existing ? resolveConflicts(existing, m, 'ratings') : m);
});

// Merge from films (lower priority)
films?.forEach(m => {
  const existing = uriMap.get(m.id);
  uriMap.set(m.id, existing ? resolveConflicts(existing, m, 'films') : m);
});
```

### Step 3: Conflict Resolution (by field)

| Field | Priority | Rule |
|-------|----------|------|
| `rating` | ratings > diary > watched | Use highest priority source |
| `ratingDate` | ratings > diary | Use source with rating |
| `watchedDate` / `dateMarkedWatched` | diary > watched | Use diary if available |
| `tags` | diary > others | Tags only from diary |
| `liked` | films > others | Liked flag from films |
| `rewatch` / `rewatchCount` / `rewatchDates` | diary > others | Aggregated from diary |

### Step 4: Separation

- Watched movies: all entries found in watched.csv or enriched by other sources
- Watchlist movies: only entries found in watchlist.csv (not in watched)

---

## Performance Targets

- Merge 1000 watched + 500 diary + 200 ratings: <500ms
- Memory usage: <10MB for large datasets
- Single pass where possible

---

## Testing Strategy

### Unit Tests (minimum 20 tests)

- **Basic Merge**:
  - [ ] Merge watched.csv only → correct Movie[]
  - [ ] Merge watched + diary → diary enriches watched

- **Conflict Resolution**:
  - [ ] Merge with ratings conflict → ratings.csv rating wins
  - [ ] Merge with date conflict → diary.csv date wins
  - [ ] Merge with rewatch conflict → diary data preserved

- **Deduplication**:
  - [ ] Deduplicate by URI → remove duplicates
  - [ ] Merge rewatches → same URI 3x → rewatchCount=2, rewatch=true

- **Aggregation**:
  - [ ] Rewatch aggregation → correct count and dates
  - [ ] Tag preservation → tags preserved from diary

- **Separation**:
  - [ ] Watchlist separation → watchlist in separate array
  - [ ] Watched/watchlist don't mix → no overlap

- **Edge Cases**:
  - [ ] No optional files → watched only
  - [ ] Empty files → graceful handling
  - [ ] Large dataset → performance <500ms

---

## Files to Create

```
lib/
└── data-merger.ts

__tests__/
└── unit/
    └── data-merger.test.ts
```

---

## Dependencies

- Type definitions from `lib/types.ts`
- CSV parser for individual file parsing
- No external dependencies for merge logic

---

**Reference**: `.specify/app/plan.md` (section 1.2 - Data Merger Module)

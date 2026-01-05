# Data Merger Test Contract

**Module**: `lib/data-merger.ts`
**Test File**: `__tests__/unit/data-merger.test.ts` (43 tests, 11 FAILING ❌)
**Status**: ⚠️ Critical - Failures in rewatch counting and aggregation logic

## Critical Issues

### Issue 1: Rewatch Counting from Diary Entries
**Failing Tests**: 6 tests related to rewatch aggregation
**Problem**: Diary entries not properly counted as rewatches
**Impact**: Analytics showing incorrect movie counts and rewatch statistics

### Issue 2: Rating Assignment from Multiple Sources
**Failing Tests**: 3 tests for rating merges
**Problem**: Ratings from diary.csv and ratings.csv not merging correctly
**Impact**: Analytics coverage calculations incorrect

### Issue 3: Like Status from Films List
**Failing Tests**: 2 tests for likes merging
**Problem**: Liked status not properly assigned from films.csv
**Impact**: Liked movie counts incorrect

---

## Test Specification

### Function: `mergeMovieSources(watched: Movie[], ...sources: Movie[][]): Movie[]`

Merge multiple CSV sources into unified dataset with aggregated data.

**Merge Priority**:
1. watched.csv: Base dataset
2. diary.csv: Add rewatches, ratings, dates
3. ratings.csv: Add ratings for missing movies
4. films.csv: Mark liked status

**Input Contract**:
- watched: Array of Movie objects from parseWatchedCSV
- sources: Variable number of arrays from other parsers
- Matching logic: By title and year (normalized)

**Output Contract**:
- Returns: Single array of unique Movie objects
- Each movie contains aggregated data from all sources
- Rewatch count reflects diary entries
- Rating taken from highest priority source

**Test Scenarios - Rewatch Counting**:
```
❌ Given watched.csv with 1 entry + diary.csv with same movie twice
   Should result in watchCount: 2 and rewatchDates: [date1, date2]

❌ Given 100 diary entries matching 50 watched movies
   Should count rewatches correctly across all movies

❌ Given movies with explicit "Rewatch: Yes" marker in diary
   Should include in watchCount aggregation

❌ Given multiple diary entries same date for same movie
   Should handle duplicates (1 watch per date or aggregate?)

❌ Edge case: 99 rewatches for single movie
   Should handle large watchCount without overflow

❌ Given movies only in diary (no watch entry)
   Should still be counted in merged dataset
```

**Test Scenarios - Rating Assignment**:
```
❌ Given watched (no rating) + diary (4.5) + ratings (5.0)
   Should use highest priority: ratings.csv (5.0)

❌ Given movie in ratings.csv only
   Should add to watched list with rating

❌ Given conflicting ratings in different CSVs
   Should use ratings.csv first, diary.csv as fallback
```

**Test Scenarios - Like Assignment**:
```
❌ Given movie in watched + films
   Should set liked: true

❌ Given movie in films only
   Should create movie entry with liked: true

❌ Given movie only in watched
   Should have liked: undefined or false
```

---

## Root Cause Analysis

### Hypothesis 1: Rewatch Matching Logic
**Suspected Issue**: Movie matching by title+year may fail with:
- Case sensitivity ("The Matrix" vs "the matrix")
- Whitespace differences
- Special characters ("(2009)" vs "(2009)")
- URI-based matching not implemented

**Fix Approach**:
- Implement case-insensitive comparison
- Normalize whitespace and special chars
- Use Letterboxd URI as canonical identifier if available

### Hypothesis 2: Watch Count Logic
**Suspected Issue**: Not incrementing watchCount correctly
- Maybe treating diary entries as separate movies instead of rewatches
- Not properly aggregating multiple dates for same movie
- Off-by-one error in count

**Fix Approach**:
- Group diary entries by movie (deduplicate)
- Count total entries per movie
- Set watchCount = 1 + (diary entries - 1) or similar

### Hypothesis 3: Priority Order
**Suspected Issue**: Ratings/likes not applying in correct priority
- Maybe overwriting data instead of merging
- Skipping existing values instead of fallback logic

**Fix Approach**:
- Implement clear priority: ratings.csv > diary.csv > watches.csv
- Preserve existing values when new source has undefined
- Explicit null-coalescing logic

---

## Test Data Patterns

### Test Pattern 1: Rewatch Verification
```typescript
const watched = [
  { title: "Inception", year: 2010, dateMarkedWatched: "2020-01-01" }
];
const diary = [
  { title: "Inception", year: 2010, dateMarkedWatched: "2020-01-01" },
  { title: "Inception", year: 2010, dateMarkedWatched: "2021-01-15" },
  { title: "Inception", year: 2010, dateMarkedWatched: "2022-06-10" }
];

// Expected merged result:
// watchCount: 3, rewatchDates: [2020-01-01, 2021-01-15, 2022-06-10]
```

### Test Pattern 2: Rating Merge
```typescript
const watched = [{ title: "The Matrix", year: 1999 }]; // no rating
const diary = [{ title: "The Matrix", year: 1999, rating: 4.5 }];
const ratings = [{ title: "The Matrix", year: 1999, rating: 5.0 }];

// Expected: rating: 5.0 (ratings.csv has priority)
```

---

## Coverage Goals

- **Current**: 43 tests (11 failing = 74% pass rate)
- **Target**: 100% tests passing, 95%+ coverage
- **Critical Path**: Rewatch aggregation is foundational
- **Fix Sequence**:
  1. Fix rewatch counting (6 tests)
  2. Fix rating assignment (3 tests)
  3. Fix like status (2 tests)
  4. Verify edge cases (2 tests)

## Test Quality Checklist

- [ ] Rewatch counting aggregates diary entries correctly
- [ ] Watch count matches expected totals
- [ ] Rewatch dates preserved in chronological order
- [ ] Rating priority respected (ratings.csv > diary.csv)
- [ ] Like status applied from films.csv only
- [ ] Matched movies deduplicated in output
- [ ] Edge cases handle large datasets
- [ ] Error cases handled gracefully

**Note**: Checkboxes empty because tests are currently failing. Fill as fixes are implemented.

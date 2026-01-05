# Test Data Model & Fixtures

**Created**: 2026-01-05
**Status**: Reference guide for test data structures and fixtures

## Overview

This document defines the test data model for comprehensive testing. All test fixtures are located in `__tests__/fixtures/` and follow the structure of actual Letterboxd CSV exports. Mock data is designed to be realistic while remaining simple enough for predictable test assertions.

---

## Core Data Entities

### Movie

Represents a single film entry after all CSV merging is complete.

```typescript
interface Movie {
  id: string;                    // Unique identifier (Letterboxd URI or title+year)
  title: string;                 // Movie title
  year: number;                  // Release year (0 if unknown)
  dateMarkedWatched: Date;       // First watch date
  rating?: number;               // User rating (0.5-5.0) or undefined if not rated
  liked?: boolean;               // Whether user marked as liked/favorite
  watchCount?: number;           // Number of rewatches (default 1 for single watch)
  rewatchDates?: Date[];         // Array of rewatch dates
  dateAdded?: Date;              // Date added to user's list
  note?: string;                 // User notes (if any)
}
```

**Validation Rules**:
- title: Non-empty string, max 500 characters
- year: Integer 1800-2100 or 0 for unknown
- rating: Number 0.5-5.0 in 0.5 increments, or undefined
- watchCount: Positive integer (minimum 1)
- rewatchDates: Chronologically sorted array

### AnalyticsData

Aggregated statistics computed from Movie collection.

```typescript
interface AnalyticsData {
  totalMoviesWatched: number;      // Count of unique movies
  totalWatchesCounted: number;     // Total watches including rewatches
  moviesRated: number;             // Count of movies with ratings
  moviesLiked: number;             // Count of liked movies
  ratingCoverage: number;          // Percentage (0-100) of movies rated
  averageRating: number;           // Mean of all ratings (0-5)
  medianRating: number;            // Median of all ratings (0-5)
  decadeBreakdown: Record<string, number>; // Movies per decade (e.g., "2020s": 45)
  yearlyWatching: Record<number, number>;  // Movies per year (e.g., 2023: 25)
  topRatedMovies: Movie[];         // Top 10 rated movies (sorted descending)
  mostRewatchedMovies: Movie[];    // Top 10 most rewatched (sorted by watchCount)
}
```

**Validation Rules**:
- All counts: Non-negative integers
- ratingCoverage: 0-100%
- averageRating, medianRating: 0-5 or 0 if no ratings
- decadeBreakdown keys: Format "YYYY" (e.g., "2020s")
- yearlyWatching keys: Four-digit year integers

### CSVFile

Represents a parsed CSV with identified type and validation status.

```typescript
interface CSVFile {
  fileName: string;        // Original file name (e.g., "watched.csv")
  fileType: 'watched' | 'diary' | 'ratings' | 'films' | 'watchlist' | 'unknown';
  rowCount: number;        // Number of data rows (excluding header)
  isValid: boolean;        // Whether file passed validation
  validationErrors?: string[]; // Array of validation error messages
  parsedData: Movie[];     // Extracted and normalized movie entries
}
```

**Validation Rules**:
- fileName: Must match expected pattern
- fileType: Detected by CSV headers or file name
- rowCount: Non-negative integer
- validationErrors: Only populated if isValid === false

### AppState

Root state managed by Zustand store.

```typescript
interface AppState {
  // Data
  dataset: {
    watched: Movie[];
    diary: Movie[];
    ratings: Movie[];
    films: Movie[];
  } | null;

  // Analytics
  analytics: AnalyticsData | null;

  // UI State
  loading: boolean;
  error: string | null;
  uploadedFiles: string[];        // List of uploaded file names
  lastUpdated: string | null;     // ISO timestamp of last upload

  // Actions
  uploadFiles(files: File[]): Promise<void>;
  clearData(): void;
  setError(error: string | null): void;
  hasData(): boolean;
  totalMovies(): number;
}
```

**State Transitions**:
- Initial: `{ dataset: null, analytics: null, loading: false, error: null, ... }`
- Uploading: `{ loading: true, error: null }`
- Success: `{ loading: false, error: null, dataset: {...}, analytics: {...}, uploadedFiles: [...] }`
- Error: `{ loading: false, error: "User friendly message" }`

---

## Test Fixtures

### Mock CSV Fixtures

Location: `__tests__/fixtures/mock-csvs.ts`

#### MOCK_WATCHED_CSV
- 10 movies watched between 2020-2024
- Mix of years and decades
- Sample structure:
  ```csv
  Title,Year,Watched Date
  The Matrix,1999,2020-01-15
  Inception,2010,2020-02-20
  Parasite,2019,2023-06-10
  [...]
  ```

#### MOCK_DIARY_CSV
- 5 diary entries (subset of watched movies)
- Demonstrates rewatch counting
- Structure:
  ```csv
  Title,Year,Watched Date,Rating
  The Matrix,1999,2021-03-10,4.5
  Inception,2010,2022-01-15,5.0
  [...]
  ```

#### MOCK_RATINGS_CSV
- 8 movies with ratings
- Includes movies not in watched list
- Structure:
  ```csv
  Title,Year,Rating
  The Matrix,1999,4.5
  Godfather,1972,5.0
  [...]
  ```

#### MOCK_FILMS_CSV
- 4 "liked" films (subset of watched)
- Structure:
  ```csv
  Title,Year
  Inception,2010
  Parasite,2019
  [...]
  ```

### Factory Functions

#### createMockMovie(overrides?: Partial<Movie>): Movie
Creates a realistic movie object with sensible defaults.
```typescript
createMockMovie({
  title: "Custom Title",
  year: 2023,
  rating: 4.5
})
```

#### createMockAnalytics(movieCount: number): AnalyticsData
Generates consistent analytics for N movies.

#### createCSVFile(data: string, type: string): CSVFile
Parses CSV string and returns validated CSVFile object.

---

## Test Data Scenarios

### Scenario 1: Single File Upload (watched.csv)
- Input: 10 movies in watched.csv
- Expected Output:
  - dataset.watched: 10 movies
  - analytics.totalMoviesWatched: 10
  - moviesRated: 0 (no ratings)
  - ratingCoverage: 0%

### Scenario 2: Multi-File Merge
- Input: watched (10) + diary (5 overlapping) + ratings (8, some new) + films (4)
- Expected Output:
  - dataset.watched: 10 unique movies
  - 5 movies with rewatches marked
  - 8 movies with ratings assigned
  - 4 movies with liked status
  - analytics properly aggregated

### Scenario 3: Edge Case - Duplicate Movies
- Input: watched.csv with duplicate title/year entries
- Expected Output:
  - Duplicates merged into single entry
  - watchCount incremented for each duplicate
  - Rewatch dates accumulated

### Scenario 4: Edge Case - Missing Data
- Input: CSV with empty columns, missing dates, unknown years
- Expected Output:
  - Movies accepted with defaults (year=0 if unknown)
  - Error message logged but processing continues
  - Movies with missing critical fields rejected

### Scenario 5: Invalid File
- Input: Non-CSV file or corrupted CSV
- Expected Output:
  - Validation fails with specific error message
  - Dataset remains unchanged
  - User shown error: "Could not parse file" or specific column error

---

## Fixture Maintenance

### Guidelines

1. **Keep Fixtures Realistic**: Use actual Letterboxd export structure and data
2. **Document Assumptions**: Comment fixtures with why specific values chosen
3. **Version with Tests**: Update fixtures only when test expectations change
4. **Reuse Across Tests**: Don't duplicate fixture code, use factory functions
5. **Size Appropriately**: Small enough for fast tests, large enough to be realistic

### Common Fixture Patterns

#### Testing Aggregation
```typescript
// 100 movies, 80 rated → 80% coverage
const watched = createMockMovies(100);
const rated = watched.slice(0, 80).map(m => ({...m, rating: 4.5}));
```

#### Testing Decade Distribution
```typescript
// Movies across decades: 10 per decade from 1990s-2020s
const byDecade = {
  "1990s": createMoviesForDecade(1990, 10),
  "2000s": createMoviesForDecade(2000, 10),
  // ...
};
```

#### Testing Error Scenarios
```typescript
// Missing required column
const badCSV = "Title,Year\nThe Matrix,1999"; // No Watched Date

// Empty file
const emptyCSV = "Title,Year,Watched Date\n"; // Header only

// Invalid year
const invalidYear = "The Matrix,unknown,2020-01-01"; // Non-numeric year
```

---

## Test Data Quality Checklist

- [ ] All numeric fields use realistic ranges (year 1800-2100, rating 0.5-5.0)
- [ ] Dates are chronologically consistent
- [ ] Movie titles match common films (recognizable to reviewers)
- [ ] Aggregations match manual calculations (testable)
- [ ] Edge cases covered (empty, large, malformed data)
- [ ] Fixtures are deterministic (same input always produces same output)
- [ ] Fixture size is reasonable (tests complete in <100ms)
- [ ] Documentation explains each fixture's purpose

---

## Database/Storage Considerations

No persistent database or storage layer in tests. All data:
- Stored in memory during tests
- Mocked localStorage for persistence tests
- Cleared between tests via afterEach hooks
- No file I/O or network calls
- Pure functions operate on in-memory data structures

This approach ensures tests are fast, deterministic, and isolated from side effects.

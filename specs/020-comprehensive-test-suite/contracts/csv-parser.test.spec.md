# CSV Parser Test Contract

**Module**: `lib/csv-parser.ts`
**Test File**: `__tests__/unit/csv-parser.test.ts` (43 tests, PASSING)
**Status**: ✅ Complete, maintaining existing coverage

## Test Specification

### Function: `parseWatchedCSV(csv: string): Movie[]`

Parse a watched.csv file and extract movie entries.

**Input Contract**:
- CSV format: string with header row and data rows
- Columns expected: Title, Year, Watched Date (minimum required)
- Encoding: UTF-8

**Output Contract**:
- Returns: Array of Movie objects
- Each movie has: title, year, dateMarkedWatched
- Chronologically sorted by dateMarkedWatched (oldest first)

**Error Handling**:
- Empty file: Return empty array
- Missing columns: Throw error with column names
- Invalid dates: Return date as undefined, log warning
- Invalid year: Set year to 0, continue parsing

**Test Scenarios**:
```
✅ Parses valid watched.csv correctly
✅ Handles missing columns gracefully
✅ Converts dates to Date objects
✅ Sorts by watch date
✅ Returns empty array for empty file
```

---

### Function: `parseDiaryCSV(csv: string): Movie[]`

Parse a diary.csv file with optional ratings and rewatch dates.

**Input Contract**:
- CSV columns: Title, Year, Watched Date (required), Rating (optional)
- Encoding: UTF-8

**Output Contract**:
- Returns: Array of Movie objects with watch/rewatch dates
- rating field: Only if provided in CSV

**Test Scenarios**:
```
✅ Extracts diary entries with dates
✅ Includes ratings when present
✅ Handles multiple entries for same movie
✅ Preserves date precision
```

---

### Function: `parseRatingsCSV(csv: string): Movie[]`

Parse a ratings.csv file.

**Input Contract**:
- CSV columns: Title, Year, Rating (required)
- Rating range: 0.5-5.0 in 0.5 increments

**Output Contract**:
- Returns: Array of Movie objects with rating field only
- Validation: Reject ratings outside valid range

**Test Scenarios**:
```
✅ Extracts ratings for each movie
✅ Validates rating range (0.5-5.0)
✅ Rejects invalid ratings
✅ Handles movies not in watched list
```

---

### Function: `parseFilmsCSV(csv: string): Movie[]`

Parse a films.csv file (liked/favorite films).

**Input Contract**:
- CSV columns: Title, Year (required)
- No other data expected

**Output Contract**:
- Returns: Array of Movie objects with liked: true flag

**Test Scenarios**:
```
✅ Marks movies as liked
✅ Extracts title and year only
✅ Handles duplicate entries
```

---

### Function: `validateCSV(csv: string, expectedType: string): ValidationResult`

Validate CSV format and required columns.

**Input Contract**:
- csv: String content of CSV file
- expectedType: 'watched', 'diary', 'ratings', 'films', 'watchlist'

**Output Contract**:
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

**Test Scenarios**:
```
✅ Validates required columns present
✅ Detects missing critical fields
✅ Warns on non-critical missing data
✅ Reports specific column names in errors
✅ Handles encoding issues gracefully
```

---

## Coverage Goals

- **Current**: 43 tests, 100% function coverage
- **Target**: Maintain 100% unit test coverage
- **Edge Cases Covered**:
  - Empty files
  - Missing columns
  - Invalid date formats
  - Invalid year values
  - Special characters in titles
  - Very long titles (>500 chars)
  - Encoding issues (UTF-8, BOM markers)

## Test Quality Checklist

- [x] All functions have unit tests
- [x] Happy path tested
- [x] Error paths tested
- [x] Edge cases identified and tested
- [x] Input validation verified
- [x] Output format consistent
- [x] No side effects in parsing
- [x] Tests independent and isolated

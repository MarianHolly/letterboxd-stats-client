# Implementation Plan: CSV Parsing

**Feature**: CSV Parsing (US1)
**Module**: `lib/csv-parser.ts`
**Tests**: `__tests__/unit/csv-parser.test.ts`
**Fixtures**: `__tests__/fixtures/mock-csvs.ts`

---

## Technical Approach

### Parser Architecture

Use **PapaParse** with a custom wrapper class `LetterboxdCSVParser` to provide:
- Automatic file type detection (watched, diary, ratings, films, watchlist)
- Schema validation per file type
- Type-safe conversion to Movie objects
- Comprehensive error collection and reporting

### Processing Pipeline

```
File Upload
    ↓
Read File Content
    ↓
Detect CSV Type (from headers)
    ↓
Validate Schema (required columns check)
    ↓
Parse with PapaParse
    ↓
Normalize Data (dates, ratings, trim strings)
    ↓
Convert to Movie Objects
    ↓
Return ParseResult<Movie[]>
```

### Key Functions

```typescript
export function parseLetterboxdCSV(file: File): Promise<ParseResult<Movie[]>>
export function detectCSVType(headers: string[]): CSVType
export function validateCSV(headers: string[]): ValidationError[]
export function parseCSV(content: string, fileType: CSVType): Movie[]
```

### CSV Types Supported

1. **watched.csv** (mandatory)
   - Columns: Date, Name, Year, Letterboxd URI
   - Parsed to: Movie[] with dateMarkedWatched

2. **diary.csv** (optional)
   - Extends watched columns with: Rating, Rewatch, Tags, Watched Date
   - Parsed to: Movie[] with ratings, rewatch flag, tags

3. **ratings.csv** (optional)
   - Columns: Date, Name, Year, Letterboxd URI, Rating
   - Parsed to: Movie[] with rating values

4. **films.csv** (optional)
   - Columns: Date, Name, Year, Letterboxd URI
   - Parsed to: Movie[] with liked flag (if marked in films)

5. **watchlist.csv** (optional)
   - Columns: Date, Name, Year, Letterboxd URI
   - Parsed to: Movie[] (separate from watched)

---

## Error Handling

| Error Type | Example | User Message | Handling |
|-----------|---------|---|---|
| Invalid format | Wrong headers | "Invalid CSV format for [file]" | Show expected columns |
| Missing mandatory file | No watched.csv | "Please upload watched.csv" | Validation gate |
| Corrupted data | Non-ISO date | "Invalid data in row X, field Y" | Log, skip row, continue |
| Empty file | 0 rows | "File is empty" | Return empty Movie[] |

---

## Performance Targets

- Parse 1000 movies: <500ms
- Memory usage: <10MB for large datasets
- Error reporting: <100ms for validation

---

## Testing Strategy

### Unit Tests (minimum 15 tests)

- **Happy Path**:
  - Parse valid watched.csv → correct Movie[] count
  - Parse valid diary.csv with ratings → all fields populated
  - Detect CSV type correctly for all 5 types

- **Edge Cases**:
  - Empty file → empty Movie[]
  - Malformed CSV → collect errors, skip bad rows
  - Missing optional fields → use defaults
  - Invalid dates → skip row or use fallback

- **Performance**:
  - Parse 1000+ movies in <500ms

---

## Files to Create

```
lib/
└── csv-parser.ts

__tests__/
├── unit/
│   └── csv-parser.test.ts
└── fixtures/
    └── mock-csvs.ts  (if not already created)
```

---

**Reference**: `.specify/app/plan.md` (section 1.2 - CSV Parser Module)

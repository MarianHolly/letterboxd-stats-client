# CSV Parser Module - Technical Progress

**Module**: CSV Parser
**File**: `lib/csv-parser.ts`
**Status**: 📋 Not Started
**Feature**: US1 (CSV Parsing)

---

## Module Overview

Wrapper around PapaParse to provide type-safe CSV parsing with:
- Automatic file type detection
- Schema validation
- Error collection
- Type-safe conversion to Movie objects

---

## Implementation Tasks

- [ ] **T005**: Implement CSV parser module (`lib/csv-parser.ts`)
  - [ ] parseLetterboxdCSV() function
  - [ ] detectCSVType() function
  - [ ] validateCSV() function
  - [ ] parseCSV() function
  - [ ] Support all 5 CSV types

- [ ] **T006**: Write unit tests (`__tests__/unit/csv-parser.test.ts`)
  - [ ] 15+ tests covering happy path + edge cases
  - [ ] All tests passing
  - [ ] Code coverage >90%

---

## Technical Details

### Module Structure

```typescript
// Core Functions
export function parseLetterboxdCSV(file: File): Promise<ParseResult<Movie[]>>
export function detectCSVType(headers: string[]): CSVType
export function validateCSV(headers: string[]): ValidationError[]
export function parseCSV(content: string, fileType: CSVType): Movie[]

// Helper Functions
function normalizeDate(dateStr: string): Date | undefined
function normalizeRating(ratingStr: string): number | undefined
function parseWatchedRow(row: WatchedCSVRow): Movie
function parseDiaryRow(row: DiaryCSVRow): Movie
// ... etc for other file types
```

### Performance Targets

- Parse 1000 movies: <500ms
- Memory usage: <10MB
- Error reporting: <100ms

---

## Notes

- Depends on: T001-T004 (types, fixtures)
- Required by: T007, T009, T012, T016
- Start: TBD
- Duration: 2-3 days

---

**Last Updated**: November 27, 2025

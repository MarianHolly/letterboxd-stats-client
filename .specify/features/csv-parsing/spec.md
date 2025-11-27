# Feature Specification: CSV Parsing

**Feature**: Parse Letterboxd CSV files (watched, diary, ratings, films, watchlist)
**User Story**: US1 - Parse CSV Files
**Priority**: P1 - MANDATORY
**Category**: Data Processing - Foundation

---

## Overview

Enable users to upload their Letterboxd CSV export files and have them parsed correctly into structured Movie objects. This is the foundation for all downstream features (storage, analytics, merging).

---

## User Story

> As a user, I want to upload my watched.csv file and have it parsed correctly so that the system recognizes all movies I've watched.

---

## Acceptance Criteria

- [ ] System accepts watched.csv file upload via file picker
- [ ] CSV is parsed without errors (valid columns: Date, Name, Year, Letterboxd URI)
- [ ] Parsed data converts to Movie objects with correct types
- [ ] System shows loading state during parsing
- [ ] System displays error message if file is invalid or missing required columns
- [ ] Empty state guides user if no watched.csv uploaded
- [ ] Parser handles 500+ movies efficiently (<500ms)

---

## Technical Details

- CSV file validation: check for required columns
- Use PapaParse library for robust parsing
- Create wrapper class: `LetterboxdCSVParser`
- Output: Movie[] array with required fields (id, title, year, dateMarkedWatched)
- Error handling: collect parsing errors, display to user

---

## Dependencies

None (foundation task) - This is the first feature to implement.

---

## Test Scenario

- Upload mock watched.csv with 100 movies
- Verify Movie[] array contains correct count
- Verify each Movie has: id (URI), title, year, dateMarkedWatched
- Test edge cases: empty file, malformed rows, missing columns

---

## Related User Stories

- US2: Store & Persist Data (depends on parsed Movie[])
- US4: Merge Multiple CSV Sources (requires multiple file parsing)
- US5: Display Analytics Dashboard (displays data from parsed files)

---

## Implementation Files

**Module**: `.specify/modules/csv-parser/`

**Code Files to Create**:
- `lib/csv-parser.ts` - Main parser implementation
- `__tests__/unit/csv-parser.test.ts` - Unit tests
- `__tests__/fixtures/mock-csvs.ts` - Mock CSV data

---

## Reference

- **App Plan**: `.specify/app/plan.md`
- **Tasks**: `.specify/app/tasks.md` (see T005-T006)

---

**Last Updated**: November 27, 2025

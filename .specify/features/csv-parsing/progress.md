# CSV Parsing Feature - Progress Tracking

**Feature**: CSV Parsing (US1)
**Status**: 📋 Not Started
**Tasks**: T005, T006

---

## Current Phase

⬜ **Phase**: Specification & Planning (COMPLETE)
🔵 **Next**: Implementation (T005-T006)

---

## Completion Checklist

### T005: Implement CSV Parser Module

- [ ] Create `lib/csv-parser.ts`
- [ ] Implement `parseLetterboxdCSV(file: File): Promise<ParseResult<Movie[]>>`
- [ ] Implement `detectCSVType(headers: string[]): CSVType`
- [ ] Implement `validateCSV(headers: string[]): ValidationError[]`
- [ ] Implement `parseCSV(content: string, fileType: CSVType): Movie[]`
- [ ] Handle all 5 CSV types correctly
- [ ] Implement error collection
- [ ] Test with mock data locally

### T006: Write Unit Tests

- [ ] Create `__tests__/unit/csv-parser.test.ts`
- [ ] Write 15+ tests covering:
  - [ ] Valid watched.csv parsing
  - [ ] Valid diary.csv with ratings/rewatches
  - [ ] CSV type detection (all 5 types)
  - [ ] Schema validation
  - [ ] Edge cases (empty, malformed, missing fields)
  - [ ] Performance (<500ms for 1000 movies)
- [ ] All tests passing
- [ ] Code coverage >90%

---

## Blockers

None currently. This is a foundation task.

---

## Notes

- Depends on: T001-T004 (types and fixtures)
- Required by: US2 (storage), US4 (merging), US5 (dashboard)
- Start date: TBD
- Expected duration: 2-3 days (implementation + testing)

---

**Last Updated**: November 27, 2025

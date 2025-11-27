# Data Merging Feature - Progress Tracking

**Feature**: Data Merging (US4)
**Status**: 📋 Not Started
**Tasks**: T007, T008, T023, T024, T025, T026

---

## Current Phase

⬜ **Phase**: Specification & Planning (COMPLETE)
🔵 **Next**: Implementation (T007-T008 for module, T023-T026 for integration)

---

## Completion Checklist

### T007: Implement Data Merger Module

- [ ] Create `lib/data-merger.ts`
- [ ] Implement `mergeMovieSources(watched, diary?, ratings?, films?, watchlist?): MovieDataset`
- [ ] Implement `deduplicateMovies(movies: Movie[]): Movie[]`
- [ ] Implement `resolveConflicts(existing, incoming, source): Movie`
- [ ] Implement merge priority: ratings > diary > watched > films
- [ ] Implement URI-based deduplication
- [ ] Implement rewatch aggregation (group diary entries)
- [ ] Implement field-level conflict resolution
- [ ] Separate watchlist from watched movies
- [ ] Performance target: <500ms for large datasets

### T008: Write Unit Tests

- [ ] Create `__tests__/unit/data-merger.test.ts`
- [ ] Write 20+ tests covering:
  - [ ] Basic merge scenarios (watched only, + diary, + ratings, etc.)
  - [ ] Conflict resolution (ratings overrides, dates, tags, etc.)
  - [ ] Deduplication (by URI, exact duplicates)
  - [ ] Rewatch aggregation (multiple entries, rewatchCount, rewatchDates)
  - [ ] Separation (watchlist separate from watched)
  - [ ] Edge cases (empty files, no optional files, large datasets)
  - [ ] Performance verification (<500ms)
- [ ] All tests passing
- [ ] Code coverage >90%

### T023: Extend Upload Modal for Multiple Files

- [ ] Update `components/layout/upload-modal.tsx`
- [ ] Allow uploading diary.csv (optional)
- [ ] Allow uploading ratings.csv (optional)
- [ ] Allow uploading films.csv (optional)
- [ ] Allow uploading watchlist.csv (optional)
- [ ] Show which files are currently uploaded
- [ ] Allow re-uploading to replace a file
- [ ] Show merge progress/status

### T024: Update Store for Multiple Files

- [ ] Update `hooks/use-analytics-store.ts`
- [ ] Action: `uploadFiles(files: File[])` - parse all, merge with priority
- [ ] Track: Which files contributed to dataset
- [ ] Track: Upload timestamps per file
- [ ] Handle: Re-uploading same file type (replace old with new)
- [ ] Recompute: Analytics after any file change

### T025: Add Merge Visualization

- [ ] Create merge status display (optional component)
- [ ] Show which CSVs contributed to data
- [ ] Show total movies from each source
- [ ] Show merge statistics (conflicts resolved, duplicates removed, etc.)
- [ ] Display in analytics header or sidebar

### T026: Write E2E Tests

- [ ] Create `__tests__/e2e/merge-csvs.spec.ts`
- [ ] Test: Upload watched.csv only → verify analytics
- [ ] Test: Upload watched.csv + diary.csv → verify merge
- [ ] Test: Upload all 5 files → verify watchlist separate
- [ ] Test: Verify ratings.csv overrides diary ratings
- [ ] Test: Verify rewatch aggregation correct
- [ ] All E2E tests passing

---

## Blockers

None currently. Depends on T001-T022 being complete.

---

## Notes

- Depends on: T001-T022 (types, parser, storage, analytics)
- Required by: US5 (dashboard with merged data)
- Start date: TBD
- Expected duration: 4-5 days (module + modal + tests)

---

**Last Updated**: November 27, 2025

# Feature Specification: Data Merging

**Feature**: Merge multiple CSV sources with conflict resolution
**User Story**: US4 - Merge Multiple CSV Sources
**Priority**: P1 - MANDATORY
**Category**: Data Processing

---

## Overview

Enable users to upload multiple Letterboxd CSV files (diary, ratings, films, watchlist) alongside the mandatory watched.csv. Intelligently merge data from all sources with a clear priority system to resolve conflicts and create a unified Movie dataset.

---

## User Story

> As a user, I want to upload multiple CSV files (diary, ratings, films, watchlist) and have them merged correctly so I get a complete picture of my movie data.

---

## Acceptance Criteria

- [ ] System allows uploading diary.csv, ratings.csv, films.csv, watchlist.csv (all optional)
- [ ] watched.csv remains mandatory, others optional
- [ ] Data from multiple files is merged with correct priority (ratings > diary > watched > films)
- [ ] Duplicate movies (same Letterboxd URI) are properly deduplicated
- [ ] Rating conflicts resolved: ratings.csv rating overrides diary.csv rating
- [ ] Watch date conflicts resolved: diary.csv date takes priority
- [ ] Rewatch information from diary.csv is preserved (multiple entries → aggregated)
- [ ] "Liked" flag from films.csv is added to Movie objects
- [ ] Watchlist movies kept separate from watched movies
- [ ] Merge completes efficiently (<500ms for 2000 movies + 200 watchlist)
- [ ] Error message if required columns missing from any file

---

## Technical Details

- Create `DataMerger` module with merge algorithm
- Letterboxd URI as unique identifier (key for deduplication)
- Merge priority: ratings.csv > diary.csv > watched.csv > films.csv
- Rewatch aggregation: group by URI, track rewatchCount and rewatchDates
- Output: `MovieDataset` { watched: Movie[], watchlist: Movie[] }
- Conflict resolution per field documented

---

## Dependencies

- US1 (CSV parsing)
- US2 (data storage)
- T001-T011 (types, modules)

---

## Test Scenario

- Upload watched.csv (100 movies) + diary.csv (80 entries with rewatches) + ratings.csv (50 updated ratings)
- Verify merge: total unique movies is correct
- Verify conflict resolution: one movie with diary rating + ratings rating → uses ratings value
- Verify rewatch handling: same movie appears 3x in diary → Movie.rewatch=true, Movie.rewatchCount=2
- Verify watchlist: 10 unwatched movies stored separately

---

## Merge Priority Rules

| Scenario | Priority | Result |
|----------|----------|--------|
| Same movie in watched + diary | diary > watched | Use diary values (unless overridden) |
| Same movie with ratings conflict | ratings > diary | Use rating from ratings.csv |
| Same movie in diary multiple times | Aggregate | rewatchCount += 1, add to rewatchDates |
| Movie in films.csv | films.csv | Add liked flag if marked |
| Movie in watchlist.csv | Separate | Store in watchlist array, not watched |

---

## Related User Stories

- US1: CSV Parsing (provides Movie[] from each file)
- US2: Data Storage (stores merged MovieDataset)
- US3: Analytics Computation (computes stats from merged data)
- US5: Analytics Dashboard (displays merged analytics)

---

## Implementation Files

**Module**: `.specify/modules/data-merger/`

**Code Files to Create**:
- `lib/data-merger.ts` - Merge logic
- `__tests__/unit/data-merger.test.ts` - Unit tests

---

## Reference

- **App Plan**: `.specify/app/plan.md` (section 1.2 - Data Merger Module)
- **Tasks**: `.specify/app/tasks.md` (see T007-T008, T023-T026)

---

**Last Updated**: November 27, 2025

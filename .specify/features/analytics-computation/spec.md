# Feature Specification: Analytics Computation

**Feature**: Compute basic analytics statistics from movie data
**User Story**: US3 - Compute Basic Analytics Stats
**Priority**: P1 - MANDATORY
**Category**: Analytics - Core

---

## Overview

Transform parsed and merged movie data into comprehensive viewing statistics that power the analytics dashboard. Compute 9 core statistics including counts, ratios, distributions, and rewatches.

---

## User Story

> As a user, I want to see basic statistics about my movie watching (total watched, rated, liked) so that I understand my viewing patterns at a glance.

---

## Acceptance Criteria

- [ ] System computes total movies watched count
- [ ] System computes movies with ratings count
- [ ] System computes movies marked as "liked" count
- [ ] System computes average rating from all rated movies
- [ ] System computes rating distribution (count per rating: 5.0, 4.5, 4.0, etc.)
- [ ] System computes rewatch statistics (count, percentage)
- [ ] System computes decade breakdown (1980s, 1990s, 2000s, etc.)
- [ ] System computes yearly breakdown (count per year)
- [ ] Analytics updates automatically when new CSV uploaded
- [ ] Handles edge cases: zero ratings, single movie, empty dataset

---

## Technical Details

- Create `AnalyticsEngine` module with pure computation functions
- Functions: `computeAnalytics()`, `computeRatingDistribution()`, `computeDecadeBreakdown()`, etc.
- Output: `AnalyticsOverview` object with all 9 statistics
- No side effects - pure functions only
- Performance target: <100ms for 1000 movies

---

## Dependencies

- US1 (Movie[] from parser)
- T001-T011 (types and modules)

---

## Test Scenario

- Load 100 mock movies with various ratings
- Compute analytics
- Verify: totalMoviesWatched, moviesRated, averageRating, etc.
- Test edge case: 0 rated movies (should show 0/undefined for average)

---

## 9 Core Statistics

1. **Total Movies Watched** - Count of all watched movies
2. **Movies Rated** - Count of movies with ratings
3. **Movies Liked** - Count of movies marked as liked
4. **Rating Coverage** - % of movies with ratings
5. **Like Ratio** - % of movies liked
6. **Average Rating** - Mean of all ratings
7. **Rating Distribution** - Count per rating value (0.5-5.0)
8. **Rewatch Statistics** - Count and percentage of rewatched movies
9. **Decade Breakdown** - Count of movies per decade

---

## Related User Stories

- US2: Data Storage (stores computed analytics)
- US5: Analytics Dashboard (displays these statistics)
- US6: Rewatch Tracking (builds on rewatch stats)
- US7: Liked Movies (builds on like stats)

---

## Implementation Files

**Module**: `.specify/modules/analytics-engine/`

**Code Files to Create**:
- `lib/analytics-engine.ts` - Analytics computation
- `__tests__/unit/analytics-engine.test.ts` - Unit tests

---

## Reference

- **App Plan**: `.specify/app/plan.md` (section 1.2 - Analytics Engine Module)
- **Tasks**: `.specify/app/tasks.md` (see T009-T010, T019-T022)

---

**Last Updated**: November 27, 2025

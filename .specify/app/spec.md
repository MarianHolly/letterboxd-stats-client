# Feature Specification: CSV Processing & Analytics Engine

**Feature**: Build complete CSV parsing, data merging, and analytics computation layer for Letterboxd Stats
**Status**: Design Phase Complete, Ready for Implementation
**Date**: November 20, 2025

---

## Overview

Transform Letterboxd CSV export files into a unified Movie dataset with comprehensive viewing analytics. All processing is client-side, data persists in localStorage, and powers the analytics dashboard.

**Core Value**: Users can upload their Letterboxd CSV exports and immediately see their viewing statistics without any backend server or external APIs.

---

## User Stories

### Priority 1 (P1): MVP - Core Data Processing & Basic Analytics

#### US1: Parse CSV Files (Watched Movies)
**Priority**: P1 - MANDATORY
**Category**: Data Processing - Foundation

**User Story**:
> As a user, I want to upload my watched.csv file and have it parsed correctly so that the system recognizes all movies I've watched.

**Acceptance Criteria**:
- [ ] System accepts watched.csv file upload via file picker
- [ ] CSV is parsed without errors (valid columns: Date, Name, Year, Letterboxd URI)
- [ ] Parsed data converts to Movie objects with correct types
- [ ] System shows loading state during parsing
- [ ] System displays error message if file is invalid or missing required columns
- [ ] Empty state guides user if no watched.csv uploaded
- [ ] Parser handles 500+ movies efficiently (<500ms)

**Technical Details**:
- CSV file validation: check for required columns
- Use PapaParse library for robust parsing
- Create wrapper class: `LetterboxdCSVParser`
- Output: Movie[] array with required fields (id, title, year, dateMarkedWatched)
- Error handling: collect parsing errors, display to user

**Dependencies**: None (foundation task)

**Test Scenario**:
- Upload mock watched.csv with 100 movies
- Verify Movie[] array contains correct count
- Verify each Movie has: id (URI), title, year, dateMarkedWatched
- Test edge cases: empty file, malformed rows, missing columns

---

#### US2: Store & Persist Data in Browser
**Priority**: P1 - MANDATORY
**Category**: State Management - Foundation

**User Story**:
> As a user, I want my uploaded data to persist in localStorage so that I don't lose my analytics if I refresh the page.

**Acceptance Criteria**:
- [ ] Parsed movie data is stored in Zustand store
- [ ] Data persists to localStorage automatically
- [ ] Persisted data loads on page refresh
- [ ] User can clear all data and start fresh
- [ ] System handles localStorage quota exceeded gracefully
- [ ] Store tracks which CSV files were uploaded
- [ ] Metadata includes last updated timestamp

**Technical Details**:
- Create Zustand store: `useAnalyticsStore`
- Implement localStorage persistence via Zustand middleware
- Store structure: { dataset, analytics, uploadedFiles, lastUpdated, loading, error }
- Session-based design (ready for Path B: backend integration)
- Quota handling: warn at 80%, graceful degradation

**Dependencies**: US1 (CSV parsing completes first)

**Test Scenario**:
- Parse and store CSV data
- Refresh browser page
- Verify data is restored from localStorage
- Verify metadata is correct (lastUpdated, uploadedFiles)

---

#### US3: Compute Basic Analytics Stats
**Priority**: P1 - MANDATORY
**Category**: Analytics - Core

**User Story**:
> As a user, I want to see basic statistics about my movie watching (total watched, rated, liked) so that I understand my viewing patterns at a glance.

**Acceptance Criteria**:
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

**Technical Details**:
- Create `AnalyticsEngine` module with pure computation functions
- Functions: `computeAnalytics()`, `computeRatingDistribution()`, `computeDecadeBreakdown()`, etc.
- Output: `AnalyticsOverview` object with all 9 statistics
- No side effects - pure functions only
- Performance target: <100ms for 1000 movies

**Dependencies**: US1 (Movie[] from parser)

**Test Scenario**:
- Load 100 mock movies with various ratings
- Compute analytics
- Verify: totalMoviesWatched, moviesRated, averageRating, etc.
- Test edge case: 0 rated movies (should show 0/undefined for average)

---

#### US4: Merge Multiple CSV Sources
**Priority**: P1 - MANDATORY
**Category**: Data Processing

**User Story**:
> As a user, I want to upload multiple CSV files (diary, ratings, films, watchlist) and have them merged correctly so I get a complete picture of my movie data.

**Acceptance Criteria**:
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

**Technical Details**:
- Create `DataMerger` module with merge algorithm
- Letterboxd URI as unique identifier (key for deduplication)
- Merge priority: ratings.csv > diary.csv > watched.csv > films.csv
- Rewatch aggregation: group by URI, track rewatchCount and rewatchDates
- Output: `MovieDataset` { watched: Movie[], watchlist: Movie[] }
- Conflict resolution per field documented

**Dependencies**: US1 (CSV parsing), US2 (storage)

**Test Scenario**:
- Upload watched.csv (100 movies) + diary.csv (80 entries with rewatches) + ratings.csv (50 updated ratings)
- Verify merge: total unique movies is correct
- Verify conflict resolution: one movie with diary rating + ratings rating → uses ratings value
- Verify rewatch handling: same movie appears 3x in diary → Movie.rewatch=true, Movie.rewatchCount=2
- Verify watchlist: 10 unwatched movies stored separately

---

#### US5: Display Basic Analytics Dashboard
**Priority**: P1 - MANDATORY
**Category**: UI/UX

**User Story**:
> As a user, I want to see my analytics displayed on a clean dashboard with stat cards and simple visualizations so I can understand my watching habits.

**Acceptance Criteria**:
- [ ] Analytics page displays stat cards for: total watched, rated, average rating, rewatches
- [ ] Stat cards show clear numbers and percentages
- [ ] Page shows basic distribution visualization (rating distribution as simple chart)
- [ ] Page shows decade breakdown (horizontal bar chart or list)
- [ ] Page shows yearly breakdown (simple table or list)
- [ ] Page is responsive: mobile (375px), tablet (768px), desktop (1920px)
- [ ] Dark mode is default, light mode also works
- [ ] Empty state displayed if no data uploaded
- [ ] Loading state displayed while parsing/computing
- [ ] Error state displays helpful message if something fails
- [ ] No console errors

**Technical Details**:
- Create `components/analytics/stats-overview.tsx` - stat cards layout
- Create `components/analytics/stats-distribution.tsx` - rating distribution visualization
- Use Recharts for basic charts (BarChart, PieChart components)
- Responsive grid layout (Tailwind CSS)
- Dark/light theme support (next-themes)
- Integration: connect to Zustand store for data

**Dependencies**: US2 (data stored), US3 (analytics computed)

**Test Scenario**:
- Upload CSV and navigate to analytics page
- Verify stat cards display correct numbers
- Verify charts render (rating distribution bar chart with 5+ ratings)
- Verify decade breakdown displays top decades
- Verify responsive layout on mobile viewport
- Verify dark mode displays correctly

---

### Priority 2 (P2): Enhanced Features & Polish

#### US6: Support Rewatch Tracking & Display
**Priority**: P2 - NICE TO HAVE
**Category**: Analytics Enhancement

**User Story**:
> As a user, I want to see which movies I've rewatched and understand my rewatch patterns so I can identify my favorite movies.

**Acceptance Criteria**:
- [ ] System tracks movies watched multiple times from diary.csv (Rewatch="Yes")
- [ ] Dashboard shows rewatch percentage and count
- [ ] Page section displays top rewatched movies (if any)
- [ ] Rewatch data aggregated correctly from multiple diary entries
- [ ] Shows movies with multiple watches from diary clearly labeled

**Technical Details**:
- Extended Movie interface: rewatchCount, rewatchDates
- New analytics function: `computeRewatchStats()`
- UI component: `RewatchAnalysis.tsx` showing pie chart or stat cards
- Data already prepared in US4 merge phase

**Dependencies**: US4 (merge includes rewatch data)

---

#### US7: Support "Liked" Movies Display
**Priority**: P2 - NICE TO HAVE
**Category**: Analytics Enhancement

**User Story**:
> As a user, I want to see which movies I marked as "liked" on Letterboxd so I can see my favorite films highlighted.

**Acceptance Criteria**:
- [ ] System reads "liked" status from films.csv
- [ ] Adds liked flag to Movie objects during merge
- [ ] Dashboard shows count and percentage of liked movies
- [ ] Optional UI to filter or highlight liked movies
- [ ] Like ratio displayed in main stats

**Technical Details**:
- Extended Movie interface: liked?: boolean
- Merge logic includes films.csv → liked flag
- Analytics includes: likeRatio, moviesLiked count
- UI: optional highlight in stat cards or separate section

**Dependencies**: US4 (merge handles films.csv)

---

#### US8: Import Tag Information from Diary
**Priority**: P2 - NICE TO HAVE
**Category**: Data Enrichment

**User Story**:
> As a user, I want to preserve the tags I added to movies on Letterboxd so that I can organize my viewing data.

**Acceptance Criteria**:
- [ ] System reads tags from diary.csv (comma-separated values)
- [ ] Tags preserved in Movie.tags array
- [ ] Tags available for future filtering (not MVP but foundation)
- [ ] No errors if tags are empty

**Technical Details**:
- Extended Movie interface: tags?: string[]
- Parser: split comma-separated tags, trim whitespace
- Merge: preserve tags from diary.csv
- Foundation for future filtering features

**Dependencies**: US1 (parser includes tags), US4 (merge preserves tags)

---

### Priority 3 (P3): Future Enhancements

#### US9: Export Analytics as JSON
**Priority**: P3 - FUTURE
**Category**: Data Export

**User Story**:
> As a user, I want to export my analytics and movie data as JSON so I can back it up or use it elsewhere.

**Acceptance Criteria**:
- [ ] Button to export all data as JSON file
- [ ] Export includes Movie[] and AnalyticsOverview
- [ ] JSON is properly formatted and downloadable
- [ ] Filename includes timestamp

**Dependencies**: US3 (analytics exists), US4 (merged data exists)

---

#### US10: Viewing Timeline with Granularity
**Priority**: P3 - FUTURE
**Category**: Visualization Enhancement

**User Story**:
> As a user, I want to see when I watched movies over time with options for yearly, monthly, or weekly views so I can identify my most active watching periods.

**Acceptance Criteria**:
- [ ] Timeline chart displays movies watched per year
- [ ] Optional granularity toggle: yearly → monthly → weekly
- [ ] Identifies peak watching periods
- [ ] Shows earliest and latest watch date

**Dependencies**: US3 (analytics for timeline), requires computed timeline data

---

## Implementation Strategy

### MVP Scope (Phase 1-2 Tasks)
**Goal**: User can upload CSV, see basic analytics in dashboard (1-2 weeks)

**Must Complete**:
- US1: CSV parsing (watched.csv)
- US2: Data storage (Zustand + localStorage)
- US3: Analytics computation (9 core stats)
- US4: Merge multiple CSVs (diary, ratings, films)
- US5: Analytics dashboard UI (stat cards + simple charts)

**Must NOT Include (Post-MVP)**:
- Complex charts (calendar heatmap, detailed timeline)
- Viewing timeline with granularity controls
- Export features
- Advanced filtering
- TMDB enrichment

### Post-MVP (Phase 3+ Tasks - Optional)
- US6: Rewatch tracking UI
- US7: Liked movies display
- US8: Tag support (already in data, just needs UI)
- US9: JSON export
- US10: Advanced timeline visualization

---

## Data Model Summary

### Movie (unified watched movie)
```typescript
interface Movie {
  id: string;                    // Letterboxd URI
  title: string;
  year: number;
  watchedDate?: Date;
  dateMarkedWatched: Date;
  rating?: number;
  ratingDate?: Date;
  rewatch: boolean;
  rewatchCount?: number;
  rewatchDates?: Date[];
  tags?: string[];
  liked?: boolean;
  decade: number;
  era: string;
}
```

### AnalyticsOverview (computed stats)
```typescript
interface AnalyticsOverview {
  totalMoviesWatched: number;
  moviesRated: number;
  moviesLiked: number;
  ratingCoverage: number;
  likeRatio: number;
  averageRating: number;
  medianRating: number;
  ratingDistribution: Record<string, number>;
  totalRewatches: number;
  moviesRewatched: number;
  rewatchRate: number;
  earliestWatchDate?: Date;
  latestWatchDate?: Date;
  trackingSpan?: number;
  decadeBreakdown: Record<string, number>;
  yearlyWatching: Record<string, number>;
}
```

---

## Success Criteria

### MVP Complete When:
- ✅ All P1 user stories (US1-US5) implemented and tested
- ✅ All unit tests pass (csv-parser, data-merger, analytics-engine)
- ✅ All integration tests pass (full pipeline)
- ✅ No console errors
- ✅ Responsive on mobile/tablet/desktop
- ✅ Analytics page displays with real mock data

### Quality Gates:
- [ ] CSV parser handles all 5 file types
- [ ] Data merger produces correct Movie[]
- [ ] Analytics stats are mathematically correct
- [ ] Empty states handled gracefully
- [ ] Error messages are helpful
- [ ] localStorage persistence works across page refreshes

---

## Timeline

**Week 1 (MVP)**:
- Days 1-2: CSV parser + data merger (US1, US4)
- Days 3-4: Analytics engine (US3)
- Days 5: Data storage + dashboard (US2, US5)
- Days 6-7: Testing + refinement

**Week 2+ (Post-MVP)**:
- Rewatch tracking (US6)
- Liked movies (US7)
- Tags (US8)
- Export (US9)
- Advanced timeline (US10)

---

## Testing Requirements

### TDD Approach (Tests First):
1. Write tests for each user story
2. User approves test structure
3. Implement code to pass tests
4. Refactor for clarity

### Test Coverage:
- **Unit**: CSV parser, data merger, analytics engine
- **Integration**: CSV → Movie[] → Analytics pipeline
- **E2E**: User uploads CSV → sees dashboard

### Test Data:
- Mock CSV files in `/mock` folder
- Edge cases: empty ratings, missing dates, duplicates
- Large dataset: 1000+ movies

---

## Dependencies & Blockers

### No External Blockers
- All libraries already installed (PapaParse, Zustand, Recharts, date-fns)
- No backend required
- No API integration needed
- No TMDB enrichment for MVP

### Internal Sequence:
```
US1 (Parse CSV)
  ↓
US2 (Store Data) + US3 (Compute Analytics) [parallel]
  ↓
US4 (Merge Multiple CSVs)
  ↓
US5 (Display Dashboard)
```

---

## Out of Scope (MVP)

❌ TMDB enrichment (genres, directors, actors)
❌ User authentication
❌ Backend API
❌ Calendar heatmap
❌ Advanced filtering
❌ Social sharing
❌ PDF export

---

**Ready for implementation. See plan.md for technical architecture.**

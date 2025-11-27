# Implementation Tasks: CSV Processing & Analytics Engine

**Feature**: Letterboxd Stats - CSV Processing & Analytics Engine
**Branch**: `3-planning` | **Date**: November 20, 2025
**Status**: Ready for Implementation

---

## Task Organization

Tasks are organized by **user story** to enable independent implementation and testing. Each story phase is self-contained and independently testable.

**MVP Scope**: Complete US1-US5 (all P1 user stories) - 7-10 days
**Post-MVP**: US6-US10 (P2-P3) - 5+ days

---

## Phase 1: Setup & Foundation (Required for All Stories)

These tasks establish the project structure and core types needed by all user stories.

- [ ] T001 Create TypeScript type definitions in `lib/types.ts` with all interfaces (Movie, MovieDataset, AnalyticsOverview, CSV row types, ParseResult, AnalyticsStore)
- [ ] T002 Create `lib/utils.ts` with helper functions (parseDate, classifyEra, computeDecade, formatDate)
- [ ] T003 Set up Jest testing infrastructure with test configuration in `jest.config.js`
- [ ] T004 Create test fixtures: Mock CSV file contents in `__tests__/fixtures/mock-csvs.ts`

**Acceptance Criteria**:
- [ ] All TypeScript interfaces compile without errors
- [ ] Helper functions are pure functions with proper exports
- [ ] Jest can discover and run test files
- [ ] Mock data covers all 5 CSV file types with edge cases

**Deliverable**: Project ready to implement individual modules

---

## Phase 2: Foundational Modules (Blocking Prerequisites)

These modules must be completed before user stories can be implemented.

### CSV Parser Module (Foundation for US1)

- [ ] T005 [P] Implement `lib/csv-parser.ts` with PapaParse wrapper class `LetterboxdCSVParser`
  - Function: `parseLetterboxdCSV(file: File): Promise<ParseResult<Movie[]>>`
  - Function: `detectCSVType(headers: string[]): CSVType`
  - Function: `validateCSV(headers: string[]): ValidationError[]`
  - Function: `parseCSV(content: string, fileType: CSVType): Movie[]`
  - Handle all 5 CSV types (watched, diary, ratings, films, watchlist)
  - Error handling: collect parsing errors, return ParseResult with errors array
  - File path: `lib/csv-parser.ts`

- [ ] T006 [P] Write unit tests for CSV parser in `__tests__/unit/csv-parser.test.ts`
  - Test: Parse valid watched.csv (100 movies) → verify Movie[] count and structure
  - Test: Parse valid diary.csv with ratings and rewatches → verify all fields
  - Test: Detect CSV type from headers → correct detection for all 5 types
  - Test: Validate CSV structure → error collection for missing columns
  - Test: Edge cases: empty file, malformed CSV, missing optional fields, invalid dates
  - Test: Performance: parse 1000+ movies in <500ms

**Acceptance Criteria**:
- [ ] All unit tests pass (minimum 15 tests covering happy path + edge cases)
- [ ] CSV parser handles all 5 file types correctly
- [ ] Error messages are helpful and actionable
- [ ] Performance meets <500ms target for 1000 movies
- [ ] No console errors or warnings

---

### Data Merger Module (Foundation for US4)

- [ ] T007 [P] Implement `lib/data-merger.ts` with merge algorithm
  - Function: `mergeMovieSources(watched: Movie[], diary?, ratings?, films?, watchlist?): MovieDataset`
  - Function: `deduplicateMovies(movies: Movie[]): Movie[]`
  - Function: `resolveConflicts(existing: Movie, incoming: Movie, source: string): Movie`
  - Merge priority: ratings > diary > watched > films
  - Letterboxd URI as unique key
  - Rewatch aggregation: group diary entries, compute rewatchCount
  - Handle conflicts per field (rating from ratings.csv, date from diary.csv, etc.)
  - Return MovieDataset { watched: Movie[], watchlist: Movie[] }
  - File path: `lib/data-merger.ts`

- [ ] T008 [P] Write unit tests for data merger in `__tests__/unit/data-merger.test.ts`
  - Test: Merge watched.csv only → correct Movie[] structure
  - Test: Merge watched + diary → diary data enriches watched
  - Test: Merge with ratings conflict → ratings.csv rating wins
  - Test: Merge with date conflict → diary.csv date wins
  - Test: Merge with rewatches → same URI appears 3x in diary → Movie.rewatchCount=2, Movie.rewatch=true
  - Test: Deduplicate by URI → remove exact duplicates
  - Test: Separate watchlist → watchlist movies in separate array
  - Test: Performance: merge 1000 watched + 500 diary + 200 ratings in <500ms

**Acceptance Criteria**:
- [ ] All unit tests pass (minimum 20 tests covering all merge scenarios)
- [ ] Merge priority correctly applied
- [ ] URI deduplication works
- [ ] Rewatch aggregation correct
- [ ] Conflict resolution per field correct
- [ ] Performance <500ms for 1000+ movies

---

### Analytics Engine Module (Foundation for US3)

- [ ] T009 [P] Implement `lib/analytics-engine.ts` with computation functions
  - Function: `computeAnalytics(movies: Movie[]): AnalyticsOverview` (main entry point)
  - Function: `computeOverviewStats(movies: Movie[]): { totalMoviesWatched, moviesRated, averageRating, ... }`
  - Function: `computeRatingDistribution(movies: Movie[]): Record<string, number>`
  - Function: `computeDecadeBreakdown(movies: Movie[]): Record<string, number>`
  - Function: `computeYearlyWatching(movies: Movie[]): Record<string, number>`
  - Function: `computeRewatchStats(movies: Movie[]): { totalRewatches, moviesRewatched, rewatchRate }`
  - All pure functions (no side effects)
  - Handle edge cases: zero ratings, single movie, empty dataset
  - Return complete AnalyticsOverview object
  - File path: `lib/analytics-engine.ts`

- [ ] T010 [P] Write unit tests for analytics engine in `__tests__/unit/analytics-engine.test.ts`
  - Test: Compute overview stats with 100 movies → correct totals and averages
  - Test: Rating distribution → correct count per rating value (0.5-5.0)
  - Test: Decade breakdown → correct aggregation by decade
  - Test: Yearly breakdown → correct aggregation by year
  - Test: Rewatch stats → correct count and percentage
  - Test: Edge case - zero rated movies → show undefined or 0 for average
  - Test: Edge case - single movie → correct calculations
  - Test: Edge case - empty dataset → all zeros or undefined
  - Test: Performance: compute analytics for 1000 movies in <100ms

**Acceptance Criteria**:
- [ ] All unit tests pass (minimum 20 tests covering all analytics)
- [ ] All stats mathematically correct
- [ ] Edge cases handled gracefully
- [ ] Performance <100ms for 1000 movies
- [ ] AnalyticsOverview object complete with all fields

---

### Integration: CSV → Movie[] → Analytics

- [ ] T011 Write integration tests in `__tests__/integration/csv-to-analytics.test.ts`
  - Test: Full pipeline: parse watched.csv → create Movie[] → compute analytics
  - Test: Full pipeline: parse watched + diary + ratings → merge → compute analytics
  - Test: Verify stats are correct after merge (not just parser)
  - Test: Use mock CSV files from fixtures
  - Test: End-to-end with edge cases (rewatches, missing ratings, etc.)

**Acceptance Criteria**:
- [ ] Integration tests pass
- [ ] Full pipeline works correctly
- [ ] All data flows correctly through modules
- [ ] No mismatch between parser, merger, and analytics

---

## Phase 3: User Story US1 - Parse CSV Files

**Goal**: User can upload watched.csv and it's parsed correctly into Movie objects.

### US1 Implementation Tasks

- [ ] T012 [US1] Implement file upload UI in `components/layout/upload-modal.tsx`
  - Feature: Accept watched.csv file picker
  - Feature: Drag-drop support for CSV file
  - Feature: Show loading state while parsing
  - Feature: Display parsing errors if file invalid
  - Feature: Show success confirmation after parse
  - Reference to csv-parser module for validation

- [ ] T013 [US1] Add CSV type detection to upload modal
  - Feature: Detect file type from columns automatically
  - Feature: Validate watched.csv is mandatory
  - Feature: Accept optional enrichment CSVs (diary, ratings, films, watchlist)
  - Feature: Show which files are acceptable

- [ ] T014 [US1] Create empty state component `components/analytics/empty-state.tsx`
  - Feature: Guide user to upload watched.csv if no data
  - Feature: Show helpful instructions
  - Feature: Clear "Upload" button
  - Responsive design (mobile/tablet/desktop)

- [ ] T015 [US1] Write E2E test for CSV upload flow in `__tests__/e2e/upload-csv.spec.ts`
  - Test: Upload mock watched.csv file
  - Test: Verify file is accepted
  - Test: Verify no console errors
  - Test: Verify success message shows

**Acceptance Criteria**:
- [ ] Upload modal accepts watched.csv file
- [ ] File is parsed correctly to Movie[]
- [ ] Error messages displayed if invalid
- [ ] Empty state shown when no data
- [ ] E2E test passes
- [ ] No console errors

**Dependencies**: T001-T006 (types and CSV parser)

**Parallel Opportunity**: T012, T013, T014 can be implemented in parallel

---

## Phase 4: User Story US2 - Store & Persist Data in Browser

**Goal**: Parsed data persists in localStorage and loads on page refresh.

### US2 Implementation Tasks

- [ ] T016 [US2] Implement Zustand store in `hooks/use-analytics-store.ts`
  - Create store: `useAnalyticsStore`
  - State shape: { dataset, analytics, uploadedFiles, lastUpdated, loading, error }
  - Action: `uploadFiles(files: File[]): Promise<void>` - parse and merge CSVs
  - Action: `clearData()` - reset all data
  - Action: `removeFile(filename: string)` - remove one file and recompute
  - Getter: `hasData()` - check if dataset exists
  - Getter: `totalMovies()` - count of watched movies
  - Implement localStorage persistence via Zustand middleware (version: 1)
  - Session-based design (ready for Path B migration)

- [ ] T017 [US2] Add localStorage error handling to store
  - Handle quota exceeded (>5-10MB) gracefully
  - Warn user at 80% quota usage
  - Clear oldest sessions if quota exceeded
  - Log errors to console for debugging

- [ ] T018 [US2] Write unit tests for Zustand store in `__tests__/unit/analytics-store.test.ts`
  - Test: Store initializes with default state
  - Test: uploadFiles() parses CSV and updates state
  - Test: Data persists to localStorage
  - Test: Page refresh loads data from localStorage
  - Test: clearData() resets all state
  - Test: removeFile() removes one file and recomputes
  - Test: hasData() returns correct boolean
  - Test: localStorage quota handling

**Acceptance Criteria**:
- [ ] Zustand store created and functional
- [ ] Data persists to localStorage automatically
- [ ] Data loads from localStorage on refresh
- [ ] All unit tests pass
- [ ] No console errors on localStorage operations
- [ ] Quota exceeded handled gracefully

**Dependencies**: T001-T011 (types, parser, merger, analytics)

**Parallel Opportunity**: T016 and T018 can overlap (write tests while implementing)

---

## Phase 5: User Story US3 - Compute Basic Analytics Stats

**Goal**: Dashboard shows 9 core statistics about user's movies.

### US3 Implementation Tasks

- [ ] T019 [US3] Create stats overview component `components/analytics/stats-overview.tsx`
  - Display stat cards for:
    - Total movies watched
    - Movies rated (count + percentage)
    - Movies liked (count + percentage)
    - Average rating
    - Movies rewatched (count + percentage)
  - Use shadcn/ui Card components
  - Responsive grid layout (mobile: 1 column, tablet: 2 columns, desktop: 3 columns)
  - Loading skeleton while computing
  - Empty state if no data

- [ ] T020 [US3] Create distribution visualization component `components/analytics/stats-distribution.tsx`
  - Rating distribution: Show bar chart of ratings (0.5, 1.0, 1.5, ... 5.0)
  - Decade breakdown: Show horizontal bar chart of decades (1980s, 1990s, 2000s, etc.)
  - Yearly breakdown: Show table/list of movies per year
  - Use Recharts for charts
  - Show helpful labels and tooltips
  - Responsive design

- [ ] T021 [US3] Integrate analytics store with components
  - Connect stats-overview to useAnalyticsStore
  - Connect stats-distribution to useAnalyticsStore
  - Show loading state while computing
  - Show error state if computation fails
  - Auto-update when new data uploaded

- [ ] T022 [US3] Write component tests in `__tests__/unit/stats-overview.test.ts` and `stats-distribution.test.ts`
  - Test: Stats cards render with correct values
  - Test: Charts render with mock data
  - Test: Loading state displays
  - Test: Empty state displays when no data
  - Test: Responsive layout works on mobile/tablet/desktop

**Acceptance Criteria**:
- [ ] Stat cards display all 5 core stats
- [ ] Charts render correctly with data
- [ ] Components responsive on all breakpoints
- [ ] Loading and empty states work
- [ ] All component tests pass
- [ ] No console errors

**Dependencies**: T001-T017 (types, parser, merger, analytics, store, components)

**Parallel Opportunity**: T019 and T020 can be developed in parallel

---

## Phase 6: User Story US4 - Merge Multiple CSV Sources

**Goal**: User can upload multiple CSVs and they merge with correct priority.

### US4 Implementation Tasks

- [ ] T023 [US4] Extend upload modal to accept multiple CSV files
  - Feature: Allow uploading diary.csv, ratings.csv, films.csv, watchlist.csv (all optional)
  - Feature: Show which files were uploaded
  - Feature: Allow re-uploading to replace a file
  - Feature: Show merge progress/status

- [ ] T024 [US4] Update Zustand store to handle multiple file uploads
  - Action: `uploadFiles(files: File[])` - parse all, merge with priority
  - Track: Which files contributed to dataset
  - Track: Upload timestamps per file
  - Handle: Re-uploading same file type (replace old with new)

- [ ] T025 [US4] Add merge visualization to dashboard
  - Optional: Show which CSVs contributed to data
  - Optional: Show total movies from each source
  - Optional: Show merge statistics (conflicts resolved, duplicates removed, etc.)
  - Display in analytics header or sidebar

- [ ] T026 [US4] Write E2E test for multiple file upload in `__tests__/e2e/merge-csvs.spec.ts`
  - Test: Upload watched.csv only → verify analytics
  - Test: Upload watched.csv + diary.csv → verify merge
  - Test: Upload with all 5 files → verify watchlist separate
  - Test: Verify ratings.csv overrides diary ratings
  - Test: Verify rewatch aggregation correct

**Acceptance Criteria**:
- [ ] Upload modal accepts all 5 CSV file types
- [ ] Merge priority correctly applied
- [ ] Watchlist kept separate
- [ ] Conflict resolution works (ratings > diary)
- [ ] E2E tests pass
- [ ] Dashboard shows merged analytics correctly

**Dependencies**: T001-T022 (all previous modules and US1-US3)

**Parallel Opportunity**: T023 and T025 can overlap

---

## Phase 7: User Story US5 - Display Analytics Dashboard

**Goal**: Complete analytics page with all stats and charts integrated.

### US5 Implementation Tasks

- [ ] T027 [US5] Create analytics page layout in `app/analytics/page.tsx`
  - Feature: Header with "Analytics" title
  - Feature: Main content area with stats and charts
  - Feature: Sidebar with navigation (if applicable)
  - Feature: Upload modal accessible from page
  - Feature: Clear data button
  - Responsive grid layout for all components

- [ ] T028 [US5] Add error handling and empty states
  - Display: Empty state if no CSV uploaded
  - Display: Error state if parsing fails
  - Display: Error state if merge fails
  - Display: Error state if analytics computation fails
  - Message: Helpful guidance on what user should do

- [ ] T029 [US5] Test responsive design on all breakpoints
  - Mobile (375px): Single column, touch-friendly buttons
  - Tablet (768px): Two columns, optimized layout
  - Desktop (1920px): Three columns, full information
  - Test: Charts render correctly on all sizes
  - Test: No horizontal scrolling

- [ ] T030 [US5] Write E2E test for complete dashboard in `__tests__/e2e/analytics-dashboard.spec.ts`
  - Test: Upload CSV → navigate to analytics → see dashboard
  - Test: Stat cards show correct values
  - Test: Charts render
  - Test: Responsive on different viewports
  - Test: All interactive elements work (buttons, hover, etc.)
  - Test: No console errors

- [ ] T031 [US5] Validate dark/light mode support
  - Feature: Analytics page respects theme toggle
  - Feature: Charts work in both light and dark modes
  - Feature: Text contrast acceptable in both modes
  - Feature: No missing styles in either theme

**Acceptance Criteria**:
- [ ] Analytics page complete with all components
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark and light mode both work
- [ ] All error and empty states handled
- [ ] E2E tests pass
- [ ] No console errors
- [ ] Dashboard displays correctly with real user CSV data

**Dependencies**: T001-T026 (all previous modules and stories)

---

## Phase 8: Post-MVP Enhancements (Optional)

These tasks are P2-P3 priority and can be deferred until after MVP is complete.

### US6: Rewatch Tracking & Display

- [ ] T032 [US6] Create rewatch analytics component `components/analytics/rewatch-analysis.tsx`
  - Display: Pie chart or stat cards showing rewatched vs first-time
  - Display: List of top 5 most rewatched movies
  - Calculate: Rewatch statistics already in AnalyticsOverview
  - Feature: Show rewatch dates if available

### US7: Liked Movies Display

- [ ] T033 [US7] Add "liked" section to analytics `components/analytics/liked-movies.tsx`
  - Display: Like ratio in stat cards
  - Display: Optional list of liked movies
  - Highlight: Liked movies in charts (color coding)

### US8: Tag Support

- [ ] T034 [US8] Add tag visualization (deferred - data already captured)
  - Foundation: Tags already parsed from diary.csv and stored in Movie.tags
  - Future: Tag filtering UI, tag statistics

### US9: Export as JSON

- [ ] T035 [US9] Add export button to analytics page
  - Feature: Export button that downloads JSON file
  - Content: { movies: Movie[], analytics: AnalyticsOverview }
  - Filename: `letterboxd-stats-${date}.json`

### US10: Advanced Timeline

- [ ] T036 [US10] Create viewing timeline component (deferred)
  - Granularity toggle: yearly → monthly → weekly
  - Chart: Line or area chart of movies watched over time
  - Feature: Identify peak viewing periods

---

## Phase 9: Testing & Quality Assurance

These tasks ensure quality before final release.

- [ ] T037 Test coverage verification
  - Run: `npm test` and check coverage report
  - Target: >80% coverage on lib/ modules
  - Target: >70% coverage on components
  - Add tests for any gaps

- [ ] T038 Performance testing and optimization
  - Measure: CSV parsing time (<500ms for 1000 movies)
  - Measure: Analytics computation time (<100ms)
  - Measure: Lighthouse scores (target: 90+)
  - Optimize: Bundle size, memoization, lazy loading

- [ ] T039 Accessibility testing
  - Verify: Keyboard navigation works
  - Verify: Screen reader compatible
  - Verify: Color contrast meets WCAG AA
  - Add: ARIA labels where needed

- [ ] T040 Cross-browser testing
  - Test: Chrome, Firefox, Safari, Edge
  - Test: All features work on all browsers
  - Test: localStorage works correctly
  - Fix: Any browser-specific issues

- [ ] T041 Manual testing with real user data
  - Test: Upload actual Letterboxd CSVs (not just mocks)
  - Test: Verify analytics accuracy
  - Test: Check for any data edge cases
  - Validate: All calculations correct

---

## Phase 10: Polish & Documentation

Final touches before deployment.

- [ ] T042 Update project README
  - Add: Feature overview
  - Add: How to use guide
  - Add: Tech stack explanation
  - Add: Supported CSV files

- [ ] T043 Add inline code documentation
  - JSDoc comments on all exported functions
  - Comments on complex algorithms
  - Type descriptions

- [ ] T044 Create CHANGELOG.md entry
  - Document: Features in this release
  - Document: Breaking changes (if any)
  - Document: Known limitations

- [ ] T045 Final code review and cleanup
  - Review: All code follows project style guide
  - Review: No dead code or commented-out code
  - Review: Consistent naming conventions
  - Fix: Any remaining issues

- [ ] T046 Prepare for deployment
  - Build: `npm run build` - verify no errors
  - Test: `npm run test` - verify all tests pass
  - Lint: `npm run lint` - fix any issues
  - Ready: Deploy to staging/production

---

## Dependencies & Execution Order

### Phase Sequence (Required Order):
```
Phase 1: Setup
    ↓
Phase 2: Foundational Modules (T005-T011)
    ↓
Phase 3: US1 (T012-T015)
    ↓
Phase 4: US2 (T016-T018)  [can start after T001-T011]
    ↓
Phase 5: US3 (T019-T022)  [can start after T004, T009, T016]
    ↓
Phase 6: US4 (T023-T026)  [requires T007-T010]
    ↓
Phase 7: US5 (T027-T031)  [requires T012-T026]
    ↓
Phase 8-10: Post-MVP & Polish
```

### Parallelizable Tasks:
- **Within Phase 2**: T005, T007, T009 can be developed in parallel (different modules)
- **Within Phase 3**: T012, T013, T014 can be developed in parallel (different components)
- **Within Phase 5**: T019, T020 can be developed in parallel (different components)
- **Within Phase 9**: T037, T038, T039, T040 can be tested in parallel

### Critical Path (Minimum Time):
T001 → T005 → T007 → T009 → T011 → T012 → T016 → T019 → T023 → T027 → T037-T046

---

## MVP Completion Definition

**MVP Complete When**:
- ✅ All Phase 1 tasks done (T001-T004)
- ✅ All Phase 2 tasks done (T005-T011)
- ✅ All Phase 3-7 tasks done (T012-T031) - US1 through US5
- ✅ Quality Assurance Phase done (T037-T041) - Testing & Performance
- ✅ All tests pass
- ✅ No console errors
- ✅ Responsive on mobile/tablet/desktop
- ✅ Dark/light mode both work
- ✅ Analytics show correctly with real mock CSV data

**Post-MVP** (T032-T046): US6-US10 and polish tasks

---

## Implementation Tips

### TDD Approach:
1. **Write test first** (describe expected behavior)
2. **Get user approval** on test structure
3. **Implement code** to pass test
4. **Refactor** for clarity

### Module Development Order:
1. `lib/types.ts` - All interfaces first
2. `lib/csv-parser.ts` + tests - Parse CSV files
3. `lib/data-merger.ts` + tests - Merge data
4. `lib/analytics-engine.ts` + tests - Compute stats
5. `hooks/use-analytics-store.ts` + tests - State management
6. Components - UI built on top of data layer
7. Integration tests - Full pipeline validation

### Testing Strategy:
- Unit tests: Pure functions (parsers, mergers, analytics)
- Component tests: React components with mock data
- Integration tests: Full CSV → Analytics pipeline
- E2E tests: User workflows with actual UI

### Performance Monitoring:
- Track parsing time: target <500ms for 1000 movies
- Track analytics time: target <100ms for 1000 movies
- Monitor bundle size: keep under 200KB gzipped
- Monitor localStorage usage: warn at 5MB

---

## Success Criteria Checklist

- [ ] All P1 user stories (US1-US5) implemented
- [ ] 100+ unit tests written and passing
- [ ] 5+ integration tests written and passing
- [ ] 5+ E2E tests written and passing
- [ ] CSV parser handles all 5 file types
- [ ] Data merger correctly applies priority
- [ ] Analytics engine computes all 9 stats correctly
- [ ] Zustand store persists to localStorage
- [ ] Analytics dashboard displays with responsive design
- [ ] Dark/light mode both functional
- [ ] No console errors
- [ ] Performance targets met (<500ms parse, <100ms analytics)
- [ ] Lighthouse score >90
- [ ] Ready for user testing with real Letterboxd CSV data

---

## Files to Create

```
lib/
├── types.ts              # All TypeScript interfaces
├── csv-parser.ts         # CSV parsing logic
├── data-merger.ts        # Data merge & conflict resolution
├── analytics-engine.ts   # Analytics computations
├── utils.ts              # Helper functions
└── design-tokens.ts      # (already exists)

hooks/
├── use-analytics-store.ts # Zustand store

components/
├── layout/
│   └── upload-modal.tsx  # (update existing)
└── analytics/            # NEW directory
    ├── stats-overview.tsx      # Stat cards
    ├── stats-distribution.tsx  # Charts
    ├── rewatch-analysis.tsx    # Post-MVP
    ├── liked-movies.tsx        # Post-MVP
    └── empty-state.tsx         # (update existing)

__tests__/
├── fixtures/
│   └── mock-csvs.ts            # Mock CSV data
├── unit/
│   ├── csv-parser.test.ts
│   ├── data-merger.test.ts
│   ├── analytics-engine.test.ts
│   ├── analytics-store.test.ts
│   ├── stats-overview.test.ts
│   └── stats-distribution.test.ts
├── integration/
│   └── csv-to-analytics.test.ts
└── e2e/
    ├── upload-csv.spec.ts
    ├── merge-csvs.spec.ts
    └── analytics-dashboard.spec.ts

app/
└── analytics/
    └── page.tsx          # (update with dashboard)
```

---

**Ready to start implementation! Begin with Phase 1 tasks T001-T004.**

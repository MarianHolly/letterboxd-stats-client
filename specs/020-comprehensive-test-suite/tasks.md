# Tasks: Comprehensive Test Suite for Analytics Application

**Input**: Design documents from `/specs/020-comprehensive-test-suite/`
**Prerequisites**: plan.md (technical context), spec.md (6 user stories), research.md (decisions), data-model.md (fixtures)

**Testing Approach**: TDD - Tests written FIRST, validated to FAIL, then implemented to PASS

**Organization**: Tasks grouped by user story to enable independent implementation and validation of each testing area

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6 from spec.md)
- **[Story] Definition**: See spec.md for detailed acceptance criteria

---

## Phase 1: Setup (Test Infrastructure & Baseline)

**Purpose**: Verify vitest environment, establish test patterns, create reusable fixtures

**Checkpoint**: Test infrastructure ready, all tests execute without errors

- [ ] T001 Verify vitest configuration in vitest.config.ts and vitest.setup.ts are complete
- [ ] T002 [P] Create comprehensive mock CSV fixtures in `__tests__/fixtures/mock-csvs.ts` with documented scenarios
- [ ] T003 [P] Create test data factory functions in `__tests__/fixtures/factories.ts` (createMockMovie, createMockAnalytics)
- [ ] T004 [P] Setup localStorage mock testing pattern in vitest.setup.ts with cleanup between tests
- [ ] T005 Verify all 175 existing tests execute successfully: `npm test`
- [ ] T006 Document test structure and patterns in quickstart.md (reference guide)

---

## Phase 2: Foundational (Fix Critical Test Failures)

**Purpose**: Fix 14 failing tests that block all other testing work. These are core data processing tests that all other tests depend on.

**⚠️ CRITICAL**: No new tests can pass until these foundational failures are resolved

**Checkpoint**: All 175 tests passing (0 failures)

### Fix Data Merger Tests (11 failures)

- [ ] T007 [P] Analyze rewatch counting logic failures in `__tests__/unit/data-merger.test.ts` lines showing "expected false to be true"
- [ ] T008 Investigate movie matching logic (title + year normalization) for rewatch aggregation
- [ ] T009 Fix rewatch counting aggregation: Update `lib/data-merger.ts` to correctly count diary entries as rewatches
- [ ] T010 Fix watchCount property: Ensure watchCount = total diary entries for that movie
- [ ] T011 Fix rewatchDates array: Ensure all diary dates preserved and sorted chronologically
- [ ] T012 [P] Verify data-merger fixes with test execution: `npm run test:watch -- data-merger.test.ts` (target: 43/43 passing)
- [ ] T013 Debug rating assignment priority in `lib/data-merger.ts`: ratings.csv > diary.csv > watched.csv
- [ ] T014 Fix like status assignment from films.csv in merge logic
- [ ] T015 Verify all 43 data-merger tests pass

### Fix Profile Merger Tests (3 failures)

- [ ] T016 Analyze profile-merger test failures in `__tests__/unit/profile-merger.test.ts`
- [ ] T017 Fix rating merge: "expected undefined to be 4.5" indicates missing rating assignment
- [ ] T018 Fix like status merge: "expected undefined to be true" indicates missing liked flag
- [ ] T019 Verify all 20 profile-merger tests pass

### Fix Profile Feature Component Tests (7 failures)

- [ ] T020 Analyze profile-feature E2E test failures in `__tests__/integration/profile-feature.test.tsx`
- [ ] T021 Investigate "Unable to find an element with the text: Cinematic Identity" - check component rendering
- [ ] T022 Fix component rendering with merged profile data
- [ ] T023 Verify StatsOverview component displays profile header when profile is provided
- [ ] T024 Verify all 17 profile-feature tests pass

**Foundational Checkpoint**: ✅ All 175 tests passing (11 + 3 + 7 failures resolved = 21 fixes completed)

---

## Phase 3: User Story 1 - CSV Upload and Parsing with File Validation (Priority: P1)

**Goal**: Verify application correctly accepts, parses, and validates Letterboxd CSV files with proper error handling

**Independent Test**: Upload various CSV files (valid, malformed, missing columns) and verify parsing results and error messages are correct

### Tests for CSV Parsing (Write tests FIRST - must fail before implementation)

- [ ] T025 [P] [US1] Unit test: parseWatchedCSV handles valid watched.csv correctly in `__tests__/unit/csv-parser.test.ts`
- [ ] T026 [P] [US1] Unit test: parseWatchedCSV rejects CSV missing required columns in `__tests__/unit/csv-parser.test.ts`
- [ ] T027 [P] [US1] Unit test: parseWatchedCSV handles invalid date formats gracefully in `__tests__/unit/csv-parser.test.ts`
- [ ] T028 [P] [US1] Unit test: parseDiaryCSV matches diary entries to watched movies by title/year in `__tests__/unit/csv-parser.test.ts`
- [ ] T029 [P] [US1] Unit test: validateCSV rejects invalid file formats with specific error messages in `__tests__/unit/csv-parser.test.ts`
- [ ] T030 [P] [US1] Integration test: Upload flow validates watched.csv is mandatory in `__tests__/integration/csv-to-analytics.test.ts`
- [ ] T031 [US1] Integration test: Error handling displays user-friendly message when file invalid in `__tests__/integration/csv-to-analytics.test.ts`

### Implementation for CSV Parsing

- [ ] T032 [P] [US1] Review and validate csv-parser.test.ts has 43 comprehensive tests (already written, status: PASSING)
- [ ] T033 [P] [US1] Review lib/csv-parser.ts implementation for covered edge cases
- [ ] T034 [US1] Add any missing test cases discovered during implementation review
- [ ] T035 [US1] Verify csv-parser.test.ts achieves 100% code coverage for `lib/csv-parser.ts`
- [ ] T036 [US1] Run coverage report: `npm run test:coverage` and document csv-parser coverage

**Checkpoint**: ✅ CSV parsing fully tested and validated. Can upload valid CSVs, reject invalid formats, display clear errors.

---

## Phase 4: User Story 2 - Data Merging and Aggregation (Priority: P1)

**Goal**: Verify multiple CSV files merge correctly with accurate aggregation of rewatches, ratings, and likes

**Independent Test**: Upload watched.csv + diary.csv + ratings.csv + films.csv and verify merged output contains all expected data with correct aggregations

### Tests for Data Merging (Write tests FIRST - must fail before implementation)

- [ ] T037 [P] [US2] Unit test: mergeMovieSources aggregates rewatches from diary entries in `__tests__/unit/data-merger.test.ts`
- [ ] T038 [P] [US2] Unit test: mergeMovieSources assigns ratings with correct priority (ratings.csv > diary.csv) in `__tests__/unit/data-merger.test.ts`
- [ ] T039 [P] [US2] Unit test: mergeMovieSources marks liked status from films.csv only in `__tests__/unit/data-merger.test.ts`
- [ ] T040 [P] [US2] Unit test: mergeMovieSources handles duplicate movie entries correctly in `__tests__/unit/data-merger.test.ts`
- [ ] T041 [P] [US2] Unit test: mergeMovieSources handles edge case - movies in films.csv only in `__tests__/unit/data-merger.test.ts`
- [ ] T042 [US2] Integration test: Full data flow (upload → parse → merge) produces correct aggregated dataset in `__tests__/integration/csv-to-analytics.test.ts`

### Implementation for Data Merging

- [ ] T043 [P] [US2] Verify data-merger fixes from Phase 2 resolve all 11 failing tests
- [ ] T044 [P] [US2] Review data-merger.test.ts (43 tests) for completeness against acceptance scenarios
- [ ] T045 [US2] Add any missing edge case tests discovered during review
- [ ] T046 [US2] Verify data-merger.test.ts achieves 95%+ code coverage for `lib/data-merger.ts`
- [ ] T047 [US2] Add rewatch aggregation tests for large datasets (100+ movies, multiple rewatches)
- [ ] T048 [US2] Run coverage report: `npm run test:coverage` and document data-merger coverage

**Checkpoint**: ✅ Data merging fully tested. Diary entries counted as rewatches, ratings assigned by priority, likes from films list only.

---

## Phase 5: User Story 3 - Analytics Calculations and Statistics Generation (Priority: P1)

**Goal**: Verify analytics calculations (totals, coverage, decade breakdown, yearly trends) computed correctly from merged data

**Independent Test**: Upload sample dataset with known values, calculate analytics, verify metrics match expected results

### Tests for Analytics Calculations (Write tests FIRST - must fail before implementation)

- [ ] T049 [P] [US3] Unit test: generateAnalytics calculates ratings coverage correctly (rated/total * 100) in `__tests__/unit/analytics-engine.test.ts`
- [ ] T050 [P] [US3] Unit test: generateAnalytics generates decade breakdown (movies per decade 1990s-2020s) in `__tests__/unit/analytics-engine.test.ts`
- [ ] T051 [P] [US3] Unit test: generateAnalytics generates yearly watching trends in `__tests__/unit/analytics-engine.test.ts`
- [ ] T052 [P] [US3] Unit test: generateAnalytics calculates average and median ratings correctly in `__tests__/unit/analytics-engine.test.ts`
- [ ] T053 [P] [US3] Unit test: generateAnalytics handles dataset with no ratings gracefully in `__tests__/unit/analytics-engine.test.ts`
- [ ] T054 [US3] Unit test: Analytics calculations are byte-accurate (within 0.01% tolerance for floating point) in `__tests__/unit/analytics-engine.test.ts`
- [ ] T055 [US3] Integration test: Full pipeline (upload → merge → analyze) produces correct analytics in `__tests__/integration/csv-to-analytics.test.ts`

### Implementation for Analytics Calculations

- [ ] T056 [P] [US3] Verify analytics-engine.test.ts (48 tests) are all passing (status: PASSING)
- [ ] T057 [P] [US3] Review analytics-engine.ts implementation for calculation accuracy
- [ ] T058 [US3] Add tests for edge cases: movies with year=0, missing ratings, large datasets
- [ ] T059 [US3] Test decade grouping with movies from all decades (1800s-2100s)
- [ ] T060 [US3] Test yearly breakdown accuracy for all years in dataset
- [ ] T061 [US3] Verify analytics-engine.test.ts achieves 100% code coverage for `lib/analytics-engine.ts`
- [ ] T062 [US3] Run coverage report: `npm run test:coverage` and document analytics-engine coverage

**Checkpoint**: ✅ Analytics calculations fully tested. All metrics accurate: coverage, decade breakdown, yearly trends, ratings distribution.

---

## Phase 6: User Story 4 - State Management and Data Persistence (Priority: P1)

**Goal**: Verify Zustand store correctly manages state, persists to localStorage, and recovers data on app restart

**Independent Test**: Upload data, verify localStorage contents, clear browser data, refresh page, verify data recovery

### Tests for State Management (Write tests FIRST - must fail before implementation)

- [ ] T063 [P] [US4] Unit test: useAnalyticsStore initial state has correct defaults in `__tests__/unit/analytics-store.test.ts`
- [ ] T064 [P] [US4] Unit test: useAnalyticsStore.uploadFiles persists data to localStorage in `__tests__/unit/analytics-store.test.ts`
- [ ] T065 [P] [US4] Unit test: useAnalyticsStore loads data from localStorage on mount in `__tests__/unit/analytics-store.test.ts`
- [ ] T066 [P] [US4] Unit test: useAnalyticsStore.clearData removes data from localStorage in `__tests__/unit/analytics-store.test.ts`
- [ ] T067 [P] [US4] Unit test: useAnalyticsStore handles corrupted localStorage data gracefully in `__tests__/unit/analytics-store.test.ts`
- [ ] T068 [US4] Unit test: useAnalyticsStore maintains loading state during upload in `__tests__/unit/analytics-store.test.ts`
- [ ] T069 [US4] Integration test: State persists across component mount/unmount cycles in `__tests__/integration/csv-to-analytics.test.ts`

### Implementation for State Management

- [ ] T070 [P] [US4] Verify analytics-store.test.ts (27 tests) are all passing (status: PASSING)
- [ ] T071 [P] [US4] Review use-analytics-store.ts hook implementation for proper localStorage integration
- [ ] T072 [US4] Add tests for localStorage quota exceeded scenario
- [ ] T073 [US4] Add tests for data recovery from corrupted localStorage
- [ ] T074 [US4] Test lastUpdated timestamp is set correctly and ISO-formatted
- [ ] T075 [US4] Test uploadedFiles array tracks all uploaded file names
- [ ] T076 [US4] Verify analytics-store.test.ts achieves 100% code coverage for `hooks/use-analytics-store.ts`
- [ ] T077 [US4] Run coverage report: `npm run test:coverage` and document store coverage

**Checkpoint**: ✅ State management fully tested. Data persists to localStorage, recovers on refresh, handles errors gracefully.

---

## Phase 7: User Story 5 - Component Rendering and User Interactions (Priority: P2)

**Goal**: Verify React components render correctly with proper styling and user interactions work as expected

**Independent Test**: Render components with test data, verify DOM output, verify interaction handlers called correctly

### Tests for Component Rendering (Write tests FIRST - must fail before implementation)

- [ ] T078 [P] [US5] Component test: StatsOverview component renders with analytics data in `__tests__/integration/profile-feature.test.tsx`
- [ ] T079 [P] [US5] Component test: AnalyticsDashboard displays all stats cards with correct values in `__tests__/unit/` (new test file)
- [ ] T080 [P] [US5] Component test: Chart components render with data and display tooltips in `__tests__/unit/` (new test file)
- [ ] T081 [P] [US5] Component test: Upload form shows file dropzone and upload button in `__tests__/unit/` (new test file)
- [ ] T082 [P] [US5] Component test: Clear data button shows confirmation dialog before clearing in `__tests__/unit/` (new test file)
- [ ] T083 [US5] Component test: Components render correctly on mobile (375px viewport) in `__tests__/unit/` (new test file)
- [ ] T084 [US5] Component test: Components render correctly on tablet (768px viewport) in `__tests__/unit/` (new test file)
- [ ] T085 [US5] Component test: Components render correctly on desktop (1920px viewport) in `__tests__/unit/` (new test file)

### Implementation for Component Testing

- [ ] T086 [P] [US5] Verify profile-feature.test.tsx fixes from Phase 2 resolve all 7 failing tests
- [ ] T087 [P] [US5] Create new test file `__tests__/unit/components.test.tsx` for component tests
- [ ] T088 [P] [US5] Add StatsOverview component rendering tests with various data scenarios
- [ ] T089 [P] [US5] Add AnalyticsDashboard component rendering tests
- [ ] T090 [P] [US5] Add Chart component rendering tests
- [ ] T091 [P] [US5] Add responsive rendering tests for all components at 3 breakpoints
- [ ] T092 [US5] Add interactive component tests (button clicks, form inputs, dialog interactions)
- [ ] T093 [US5] Test component error states and loading states
- [ ] T094 [US5] Verify component tests achieve 80%+ coverage for all components
- [ ] T095 [US5] Run coverage report: `npm run test:coverage` and document component coverage

**Checkpoint**: ✅ Component rendering fully tested. All components render correctly at all viewport sizes with proper interactions.

---

## Phase 8: User Story 6 - Error Handling and Edge Cases (Priority: P2)

**Goal**: Verify application handles errors gracefully and provides clear feedback, handles edge cases without crashing

**Independent Test**: Trigger error conditions intentionally and verify appropriate error messages displayed and recovery possible

### Tests for Error Handling (Write tests FIRST - must fail before implementation)

- [ ] T096 [P] [US6] Unit test: Empty CSV file rejected with "File is empty" error in `__tests__/unit/csv-parser.test.ts`
- [ ] T097 [P] [US6] Unit test: Missing watched.csv (mandatory) rejected with "watched.csv is required" in `__tests__/unit/` (new test file)
- [ ] T098 [P] [US6] Unit test: Movies with missing year handled gracefully (year=0) in `__tests__/unit/analytics-engine.test.ts`
- [ ] T099 [P] [US6] Unit test: Extremely large dataset (100,000+ movies) processed without crash in `__tests__/unit/` (new test file)
- [ ] T100 [P] [US6] Unit test: CSV with encoding issues (UTF-8, BOM, Latin-1) handled gracefully in `__tests__/unit/csv-parser.test.ts`
- [ ] T101 [P] [US6] Unit test: Duplicate movie entries aggregated correctly (deduplicated) in `__tests__/unit/data-merger.test.ts`
- [ ] T102 [P] [US6] Unit test: Invalid date formats handled without crash in `__tests__/unit/csv-parser.test.ts`
- [ ] T103 [US6] Integration test: File upload error displays user-friendly message in `__tests__/integration/csv-to-analytics.test.ts`
- [ ] T104 [US6] Integration test: localStorage quota exceeded handled gracefully in `__tests__/unit/` (new test file)
- [ ] T105 [US6] Integration test: Corrupted CSV recovers with clear error message in `__tests__/integration/csv-to-analytics.test.ts`

### Implementation for Error Handling

- [ ] T106 [P] [US6] Add comprehensive error scenario tests to `__tests__/unit/error-handling.test.ts` (new file)
- [ ] T107 [P] [US6] Add edge case tests to `__tests__/unit/edge-cases.test.ts` (new file)
- [ ] T108 [P] [US6] Test all error states in Zustand store (error message, error clearing on retry)
- [ ] T109 [P] [US6] Test component error boundaries and error state rendering
- [ ] T110 [US6] Add tests for data recovery after errors (retry logic)
- [ ] T111 [US6] Verify error messages are user-friendly (not technical stack traces)
- [ ] T112 [US6] Test recovery flow: error → user fixes issue → retry succeeds
- [ ] T113 [US6] Verify error handling tests achieve 90%+ coverage for error paths
- [ ] T114 [US6] Run coverage report: `npm run test:coverage` and document error handling coverage

**Checkpoint**: ✅ Error handling fully tested. All error scenarios display clear messages, app recovers gracefully without crashing.

---

## Phase 9: E2E Critical User Journeys (Playwright)

**Purpose**: Test critical user workflows end-to-end with Playwright

**Note**: These are critical paths only (3 journeys), not exhaustive E2E coverage

### Critical Journey Tests

- [ ] T115 [P] E2E test: User uploads watched.csv and sees analytics dashboard in `__tests__/e2e/upload-csv.spec.ts`
- [ ] T116 [P] E2E test: User uploads multiple CSVs (watched + diary + ratings + films) in `__tests__/e2e/merge-csvs.spec.ts`
- [ ] T117 E2E test: User clears data and app returns to initial state in `__tests__/e2e/upload-csv.spec.ts`

### E2E Implementation

- [ ] T118 [P] Review existing E2E test files for coverage gaps
- [ ] T119 [P] Implement E2E upload test with full workflow validation
- [ ] T120 [P] Implement E2E multi-file merge test with data verification
- [ ] T121 Implement E2E clear data test with state reset validation
- [ ] T122 Run E2E tests: `npm run test:e2e` and verify all pass

**Checkpoint**: ✅ Critical E2E journeys tested. Full workflows verified end-to-end.

---

## Phase 10: Coverage Verification & Final Validation

**Purpose**: Achieve 80%+ overall coverage with 95%+ coverage on critical paths

**Checkpoint**: Coverage goals met, all tests passing, documentation complete

- [ ] T123 [P] Run full test suite: `npm test` - verify all 175+ tests passing
- [ ] T124 [P] Generate coverage report: `npm run test:coverage`
- [ ] T125 [P] Document coverage results in coverage-report.md with per-module breakdown
- [ ] T126 [P] Identify any uncovered code paths and determine if intentional
- [ ] T127 Verify critical paths (CSV, merging, analytics) have 95%+ coverage
- [ ] T128 Verify overall coverage meets 80%+ target
- [ ] T129 If coverage gaps found: Add tests or document intentional gaps
- [ ] T130 Run tests in CI mode: `npm run test` (non-watch)
- [ ] T131 Verify no console errors during test execution

**Coverage Checkpoint**: ✅ 80%+ overall coverage achieved, 95%+ on critical paths

---

## Phase 11: Polish & Documentation

**Purpose**: Improvements and documentation that affect multiple test areas

- [ ] T132 [P] Review all test files for consistency in patterns and naming
- [ ] T133 [P] Add descriptive comments to complex test scenarios
- [ ] T134 [P] Document any testing trade-offs or intentional simplifications
- [ ] T135 Update quickstart.md with actual test file locations and patterns used
- [ ] T136 Create test patterns guide in docs/ (how to write new tests for this codebase)
- [ ] T137 Verify vitest.setup.ts has all necessary mocks (localStorage, window APIs, etc.)
- [ ] T138 [P] Run test suite with UI: `npm run test:ui` and verify dashboard works
- [ ] T139 Verify all tests pass with --no-threads flag (sequential mode)
- [ ] T140 Create testing checklist for future contributors

**Polish Checkpoint**: ✅ Test suite complete, documented, ready for team use

---

## Final Validation: Test Suite Completion

- [ ] T141 Run full validation: `npm test`
  - ✅ All tests passing: 175+
  - ✅ No failures: 0
  - ✅ Coverage: 80%+ overall, 95%+ critical paths
  - ✅ No console errors

- [ ] T142 Execute quickstart.md validation: Follow all steps, verify success
- [ ] T143 Commit test suite to repository with message "Complete comprehensive test suite with 80%+ coverage"
- [ ] T144 Create pull request with comprehensive description of test coverage

**Final Status**: ✅ COMPREHENSIVE TEST SUITE COMPLETE

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - **BLOCKS all user stories**
- **Phases 3-8 (User Stories)**: Depend on Phase 2 - can proceed in priority order or parallel
  - Stories within each phase can run in parallel (if staffed)
- **Phase 9 (E2E)**: Depends on Phases 3-8 - can start after Phase 8
- **Phase 10 (Coverage)**: Depends on all test phases - run before polish
- **Phase 11 (Polish)**: Depends on Phase 10 - final phase

### Critical Path (Sequential)

```
Phase 1 (Setup)
  → Phase 2 (Foundational - fix 14 failures)
  → Phase 3-8 (User Stories 1-6 in priority order)
  → Phase 9 (E2E)
  → Phase 10 (Coverage Verification)
  → Phase 11 (Polish)
```

### Parallel Opportunities

**Within Phase 1 (Setup)**:
- T002, T003, T004 can run in parallel (different files)

**Within Phase 2 (Foundational)**:
- T007, T008 can run in parallel (separate analysis)
- T016, T020 can start while T015 still running (different test files)

**Across Phases 3-8 (User Stories)**:
- Once Phase 2 completes, Phases 3-8 can proceed sequentially OR in parallel with team members:
  - Dev A: Phase 3 (CSV Parsing)
  - Dev B: Phase 4 (Data Merging)
  - Dev C: Phase 5 (Analytics)
  - Each story independently testable and deliverable

**Within Each User Story Phase**:
- All [P] marked tests can run in parallel
- Models before services
- All unit tests for a module before integration tests

---

## Parallel Example: Phase 3 (User Story 1 - CSV Parsing)

```bash
# All tests can be written in parallel (different files)
Task T025: parseWatchedCSV test
Task T026: parseWatchedCSV validation test
Task T027: Date handling test
Task T028: parseDiaryCSV test
Task T029: validateCSV test

# Then all tests can run together
npm run test:watch -- csv-parser.test.ts

# Then verification
npm run test:coverage -- csv-parser
```

---

## Implementation Strategy

### MVP Path (User Story 1 Only - Fastest Delivery)

1. ✅ **Phase 1**: Setup (30 min)
2. ✅ **Phase 2**: Fix critical failures (2-3 hours)
3. ✅ **Phase 3**: CSV Parsing complete (1-2 hours)
4. **STOP**: Validate User Story 1 independently
5. **DEPLOY**: MVP with CSV parsing working

### Incremental Delivery (All User Stories)

1. ✅ Phase 1: Setup
2. ✅ Phase 2: Foundational (critical - blocks all stories)
3. → Phase 3: CSV Parsing (P1) - Add value
4. → Phase 4: Data Merging (P1) - Add value
5. → Phase 5: Analytics (P1) - Add value
6. → Phase 6: State Management (P1) - Add value
7. → Phase 7: Components (P2) - Add value
8. → Phase 8: Error Handling (P2) - Add value
9. → Phase 9: E2E - Validate end-to-end
10. → Phase 10: Coverage - Measure quality
11. → Phase 11: Polish - Complete

### Team Parallel Strategy

With 3 developers:

```
Time 1: All 3 devs work on Phase 1 + 2 together (foundational)
Time 2: Phase 2 complete
  Dev A: Phase 3 (CSV Parsing)
  Dev B: Phase 4 (Data Merging)
  Dev C: Phase 5 (Analytics)
Time 3: Phases 3-5 complete in parallel
  Dev A: Phase 6 (State Management)
  Dev B: Phase 7 (Components)
  Dev C: Phase 8 (Error Handling)
Time 4: All stories complete
  Dev A: Phase 9 (E2E)
  Dev B+C: Phase 10 (Coverage)
Time 5: Coverage verified, ready to merge
```

---

## Task Checklist Template

When starting work on a task:

```markdown
- [x] Read task description and understand goal
- [x] Check dependencies (if any)
- [ ] Write test(s) FIRST (if test task)
- [ ] Run test(s) and verify FAIL ❌
- [ ] Implement code to make test(s) PASS ✅
- [ ] Run full test suite: npm test
- [ ] Verify coverage: npm run test:coverage
- [ ] Commit with descriptive message
- [ ] Move to next task
```

---

## Notes

- All paths relative to repository root
- [P] = parallelizable (different files, can run simultaneously)
- [Story] = which user story (US1-US6 maps to spec.md stories)
- Tests written FIRST, validated to FAIL, then implemented to PASS
- Each phase is a complete, independently testable increment
- Stop at any checkpoint to validate independently
- Coverage goals: 80%+ overall, 95%+ critical paths (CSV, merging, analytics)
- Avoid: vague tasks, same file conflicts, cross-story dependencies

---

## Success Criteria (When All Tasks Complete)

✅ All 175+ tests passing (0 failures)
✅ 80%+ overall code coverage achieved
✅ 95%+ critical path coverage (CSV parsing, data merging, analytics)
✅ All 6 user stories independently testable
✅ Error handling verified for all scenarios
✅ Responsive component behavior validated
✅ E2E critical journeys working
✅ Test documentation complete
✅ Team can write new tests following established patterns
✅ Ready for production deployment

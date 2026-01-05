# Feature Specification: Comprehensive Test Suite for Analytics Application

**Feature Branch**: `020-comprehensive-test-suite`
**Created**: 2026-01-05
**Status**: Draft
**Input**: Comprehensive testing specification for Letterboxd Stats Client with Vitest, covering CSV parsing, data merging, analytics, state management, components, and error handling.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - CSV Upload and Parsing with File Validation (Priority: P1)

As a QA Engineer, I need to verify that the application correctly accepts, parses, and validates Letterboxd CSV files (watched.csv, diary.csv, ratings.csv, films.csv) so that data integrity is guaranteed and invalid files are rejected with clear error messages.

**Why this priority**: This is the critical entry point for all data processing. If CSV parsing fails or accepts invalid data, the entire analytics pipeline is compromised. This is the foundation of the application.

**Independent Test**: Can be fully tested by uploading various CSV files (valid, malformed, missing required columns) and verifying parsing results and error messages. Delivers confidence in data quality.

**Acceptance Scenarios**:

1. **Given** a valid watched.csv file, **When** the file is parsed, **Then** all movie entries are extracted with correct fields (Title, Year, Date Watched)
2. **Given** a CSV file missing required columns, **When** the file is parsed, **Then** an error is shown indicating which columns are missing
3. **Given** an invalid CSV format (e.g., corrupted file), **When** the file is uploaded, **Then** parsing fails gracefully with user-friendly error message
4. **Given** a watched.csv file with diary.csv, **When** both files are uploaded together, **Then** diary entries merge correctly with watched movies by ID/title matching

---

### User Story 2 - Data Merging and Aggregation (Priority: P1)

As a QA Engineer, I need to verify that multiple CSV files are correctly merged and aggregated, including rewatch counting, rating assignment, likes aggregation, and film curation, so that the final dataset accurately represents all user data.

**Why this priority**: Data accuracy is critical. Incorrect merging leads to wrong analytics. This directly affects the value users get from the application.

**Independent Test**: Can be fully tested by uploading multiple CSV combinations and verifying merged output contains all expected data points with correct aggregations. Delivers data accuracy confidence.

**Acceptance Scenarios**:

1. **Given** watched.csv with 100 movies and diary.csv with 50 diary entries, **When** merged, **Then** diary entries are matched to watched movies and rewatches are counted correctly
2. **Given** watched.csv and ratings.csv, **When** merged, **Then** ratings are assigned to corresponding movies and unrated movies remain without ratings
3. **Given** watched.csv and films.csv (user's liked films), **When** merged, **Then** liked status is added only to films present in both lists
4. **Given** a movie with multiple diary entries (rewatches), **When** aggregated, **Then** rewatch count equals number of diary entries and dates are preserved

---

### User Story 3 - Analytics Calculations and Statistics Generation (Priority: P1)

As a QA Engineer, I need to verify that analytics calculations (total movies, ratings coverage, decade breakdown, yearly trends, average/median ratings) are computed correctly from merged data, so that the analytics dashboard displays accurate statistics.

**Why this priority**: Analytics are the core value proposition. Incorrect calculations destroy user trust and application credibility.

**Independent Test**: Can be fully tested by uploading sample datasets with known values and verifying calculated metrics match expected results. Delivers analytics accuracy confidence.

**Acceptance Scenarios**:

1. **Given** 100 watched movies with 80 rated, **When** analytics are calculated, **Then** ratings coverage is 80%
2. **Given** movies from decades 2000-2009 (30 movies), 2010-2019 (40 movies), 2020-2029 (30 movies), **When** analytics are calculated, **Then** decade breakdown is { "2000s": 30, "2010s": 40, "2020s": 30 }
3. **Given** movies watched in 2023 (25), 2024 (35), 2025 (40), **When** yearly trends are calculated, **Then** yearly breakdown shows correct counts per year
4. **Given** ratings [5, 4, 3, 4, 5, 5], **When** calculated, **Then** average is 4.33 and median is 4.5

---

### User Story 4 - State Management and Data Persistence (Priority: P1)

As a QA Engineer, I need to verify that Zustand store correctly manages application state, persists data to localStorage, and recovers data on app restart, so that users don't lose their data and the app behaves consistently.

**Why this priority**: Data persistence is critical for user experience. Lost data after refresh is unacceptable. This ensures the application is reliable.

**Independent Test**: Can be fully tested by uploading data, verifying localStorage contents, clearing browser data, refreshing page, and verifying data recovery. Delivers reliability confidence.

**Acceptance Scenarios**:

1. **Given** a user uploads CSV files, **When** upload completes, **Then** data is stored in localStorage with analytics metadata
2. **Given** data exists in localStorage, **When** page is refreshed, **Then** data is loaded from localStorage and visible immediately
3. **Given** localStorage is manually cleared, **When** page is refreshed, **Then** app returns to initial empty state
4. **Given** corrupted or invalid data in localStorage, **When** app loads, **Then** app handles gracefully and clears invalid data

---

### User Story 5 - Component Rendering and User Interactions (Priority: P2)

As a QA Engineer, I need to verify that React components (upload form, stats cards, charts, dashboard) render correctly with proper styling and user interactions work as expected, so that the UI is usable and visually consistent.

**Why this priority**: Component functionality enables users to interact with the application. Critical for usability but depends on data being available first.

**Independent Test**: Can be fully tested by rendering components with test data and verifying DOM output and interaction handlers work. Delivers UI reliability confidence.

**Acceptance Scenarios**:

1. **Given** the upload page is loaded, **When** the page renders, **Then** file dropzone and upload button are visible and accessible
2. **Given** analytics data is available, **When** the dashboard renders, **Then** all stats cards display correct values with proper formatting
3. **Given** the user hovers over a chart, **When** hovering, **Then** tooltip shows data values correctly
4. **Given** the user clicks "Clear Data" button, **When** clicked, **Then** confirmation dialog appears before clearing

---

### User Story 6 - Error Handling and Edge Cases (Priority: P2)

As a QA Engineer, I need to verify that the application handles errors gracefully (file errors, parsing errors, edge cases) and provides clear feedback to users, so that users understand what went wrong and how to fix it.

**Why this priority**: Error handling prevents confusing user experiences and data loss. Important for user confidence but secondary to happy path functionality.

**Independent Test**: Can be fully tested by intentionally triggering error conditions and verifying error messages and state recovery. Delivers robustness confidence.

**Acceptance Scenarios**:

1. **Given** an empty CSV file is uploaded, **When** parsing is attempted, **Then** error message clearly states "File is empty"
2. **Given** watched.csv is not uploaded (mandatory file), **When** upload is submitted, **Then** error message "watched.csv is required" appears
3. **Given** a movie has no year data, **When** analytics are calculated, **Then** movie is handled gracefully (skipped or categorized as "Unknown")
4. **Given** extremely large dataset (100,000+ movies), **When** uploaded, **Then** app does not crash and processing completes successfully

---

### Edge Cases

- What happens when a CSV file has duplicate entries for the same movie?
- How does the system handle movies with missing or invalid date formats?
- What happens when a user uploads 10GB CSV file (system limits)?
- How does the app behave when localStorage quota is exceeded?
- What happens when files have encoding issues (UTF-8 vs Latin-1)?
- How does the system handle circular data dependencies in merges?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST parse watched.csv and extract Title, Year, Watched Date fields correctly
- **FR-002**: System MUST parse diary.csv and match entries to watched movies by title/ID, counting rewatches
- **FR-003**: System MUST parse ratings.csv and merge ratings into watched movies, handling unrated movies gracefully
- **FR-004**: System MUST parse films.csv and mark liked movies, only assigning "liked" to movies in both lists
- **FR-005**: System MUST validate all CSV files and reject invalid formats with specific error messages
- **FR-006**: System MUST calculate total movies watched, ratings coverage percentage, and average/median ratings
- **FR-007**: System MUST generate decade breakdown (movies per decade) from watch dates
- **FR-008**: System MUST generate yearly watching trends (movies per year) from watch dates
- **FR-009**: System MUST persist parsed data and analytics to localStorage after successful upload
- **FR-010**: System MUST recover data from localStorage on page load if available
- **FR-011**: System MUST clear all data from localStorage when user requests clear/reset
- **FR-012**: Zustand store MUST maintain loading, error, and success states during file upload
- **FR-013**: React components MUST render analytics dashboard with stats cards, charts, and breakdowns
- **FR-014**: System MUST provide clear, actionable error messages for all failure scenarios
- **FR-015**: System MUST handle edge cases (empty files, missing columns, malformed data) without crashing
- **FR-016**: System MUST support file uploads via drag-and-drop or file picker
- **FR-017**: System MUST prevent uploads of invalid file types (non-CSV files)
- **FR-018**: System MUST validate that watched.csv is always provided (mandatory file)

### Key Entities

- **Movie**: Represents a single film entry with Title, Year, Watched Date, Rating (optional), Liked (optional), Rewatch Count
- **AnalyticsData**: Aggregated statistics including total movies, ratings coverage, average rating, median rating, decade breakdown, yearly breakdown
- **CSVFile**: Parsed CSV content with identified type (watched, diary, ratings, films) and validation status
- **AppState**: Zustand store containing dataset, analytics, loading flag, error messages, uploaded file list, last update timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Code coverage reaches 80%+ overall, with 95%+ coverage on critical data processing paths (CSV parsing, merging, calculations)
- **SC-002**: All 14 existing failing tests pass after spec implementation
- **SC-003**: 100% of business logic functions have unit tests with documented test scenarios
- **SC-004**: User can upload 5 CSV files and view analytics within 5 seconds on modern hardware
- **SC-005**: Application correctly handles files up to 100MB without memory issues or timeouts
- **SC-006**: All error scenarios display user-friendly error messages in under 1 second
- **SC-007**: Data persists correctly in localStorage and is recoverable after page refresh 100% of the time
- **SC-008**: Component tests verify rendering and interactions for all UI components
- **SC-009**: E2E tests cover critical user journeys: upload → view analytics → clear data
- **SC-010**: Analytics calculations are byte-accurate (within 0.01% tolerance for floating point operations)

## Testing Structure & Organization

### Unit Tests
Location: `__tests__/unit/*.test.ts`
- CSV parser functions
- Data merger utilities
- Analytics calculation functions
- Zustand store actions
- Utility functions

### Integration Tests
Location: `__tests__/integration/*.test.ts`
- End-to-end data flows (upload → parse → merge → calculate)
- Store interactions with multiple operations
- Data persistence and recovery flows

### Component Tests
Location: `__tests__/unit/*.test.ts` (with React Testing Library)
- StatsOverview component
- AnalyticsDashboard component
- Chart components
- Form components

### E2E Tests
Location: `__tests__/e2e/*.spec.ts` (Playwright)
- Upload flow
- Analytics viewing flow
- Clear data flow

## Technical Requirements

- **Test Runner**: Vitest with jsdom environment
- **Component Testing**: @testing-library/react for rendering and interaction testing
- **Mocking Strategy**: Mock all external APIs and browser APIs heavily for unit/integration tests
- **Coverage Tools**: @vitest/coverage-v8 for reporting
- **Assertions**: Vitest expect() API (Jest-compatible)
- **Fixtures**: Mock CSV data in `__tests__/fixtures/` for consistent test scenarios

## Assumptions

1. "Comprehensive" testing means covering unit, integration, and critical E2E paths
2. CSV parsing uses Papa Parse library (observed in dependencies)
3. Zustand store is the single source of truth for application state
4. localStorage is the persistence mechanism (no backend API calls in scope)
5. React Testing Library queries will be used for component testing (standard for React)
6. Playwright is available for E2E tests (already in devDependencies)
7. Test data fixtures will use real CSV format matching Letterboxd's export structure
8. "80%+ coverage" is overall coverage metric, critical paths require 95%+
9. Existing test patterns and conventions should be maintained
10. Tests will be isolated with heavy mocking (no actual file I/O or network calls)

## Success Definition

This specification is complete when:
- All user stories have independent, testable scenarios
- All requirements are measurable and technology-agnostic
- Success criteria provide clear, quantifiable targets
- No implementation details are present in the spec
- Testing approach is clear and comprehensive

# Implementation Plan: Letterboxd Stats - CSV Processing & Analytics Engine

**Branch**: `3-planning` | **Date**: November 20, 2025 | **Spec**: [data-analysis-report.md](.specify/artifacts/data-analysis-report.md)
**Input**: Data analysis and architecture decisions from `.specify/artifacts/`

**Note**: This plan covers Phase 1: Building the data processing pipeline and analytics foundation for the MVP dashboard.

## Summary

Build a complete CSV parsing, data merging, and analytics computation layer that transforms Letterboxd export files into a unified Movie dataset and computes basic viewing statistics. The system is 100% client-side, uses localStorage for persistence, and powers the analytics dashboard with real user data.

**Core Approach:**
1. Accept mandatory `watched.csv` + optional enrichment CSVs (diary, ratings, films, watchlist)
2. Parse all files using PapaParse with custom normalization (hybrid wrapper classes)
3. Merge data with conflict resolution: `ratings.csv > diary.csv > watched.csv > films.csv`
4. Use Letterboxd URI as canonical unique identifier
5. Store merged `Movie[]` dataset in Zustand + localStorage with session-based architecture
6. Compute `AnalyticsOverview` stats for dashboard (counts, ratios, ratings, rewatches, decade/year breakdown)

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16 (App Router)
**Primary Dependencies**: PapaParse (CSV), Zustand (state), Recharts (charts), date-fns (dates)
**Storage**: Browser localStorage only (no backend, no database)
**Testing**: Jest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Browser (Web) - responsive mobile/tablet/desktop
**Project Type**: Frontend-only Next.js application
**Performance Goals**: Parse & merge <500ms for 1000+ movies, analytics computation <100ms
**Constraints**: localStorage quota ~5-10MB, client-side only (no external APIs for MVP)
**Scale/Scope**: Support 500-2000 watched movies per user, 5 CSV files max, single-session per device

## Constitution Check

**GATE: Verify alignment with project constitution**

✅ **Test-Driven Development**: Required
- Tests must be written first for CSV parser, data merger, analytics engine
- All data transformation logic unit tested
- Integration tests for CSV → Movie[] → Analytics flow

✅ **Browser-First, Client-Side Data**: Required
- All parsing/merging/analytics happen in-browser
- Zero server calls for data processing
- localStorage for persistence only
- User data never leaves device

✅ **Modular, Testable Components**: Required
- Separate modules: csv-parser.ts, data-merger.ts, analytics-engine.ts
- Pure functions with clear input/output contracts
- Dependency injection for Zustand store
- No side effects in data transformation

✅ **CSV as Data Foundation**: Required
- Charts designed around CSV-only data
- No TMDB enrichment in MVP (deferred to Path B)
- All 6 core analytics work with CSV data alone

✅ **Responsive & Modern Design**: Required for Analytics page
- Dashboard layout responsive (mobile 375px, tablet 768px, desktop 1920px)
- Dark mode default with light mode support
- Minimalist, high information density

✅ **Testing & Quality Gates**: Required
- Unit tests for all parser/merger/analytics functions
- Integration tests for full pipeline
- Error handling and validation per CSV file
- Empty state handling (missing data scenarios)
- No console errors before deployment

**Gate Status**: ✅ PASS - All constitution requirements satisfied

## Project Structure

### Documentation (this feature)

```text
.specify/artifacts/
├── data-analysis-report.md      # CSV structure & merge strategy analysis
├── documentation.md             # Original project constitution
└── [Phase 1 deliverables below]
    ├── research.md              # Research findings (Phase 0)
    ├── data-model.md            # Entity definitions (Phase 1)
    └── contracts/               # API/function contracts (Phase 1)

specs/3-planning/
├── plan.md                      # This file
├── spec.md                      # Feature specification (auto-generated)
└── tasks.md                     # Sequenced implementation tasks (Phase 2 output)
```

### Source Code (repository root) - Option 1: Single Frontend Project

```text
app/
├── page.tsx                     # Landing page
├── analytics/
│   └── page.tsx                 # Analytics dashboard (powered by CSV data)
├── about/
│   └── page.tsx                 # About page
└── layout.tsx                   # Root layout with theme

lib/
├── types.ts                     # TypeScript interfaces (Movie, MovieDataset, CSV rows, Analytics)
├── csv-parser.ts                # CSV parsing logic (PapaParse wrapper classes)
├── data-merger.ts               # Data merge & conflict resolution
├── analytics-engine.ts          # Analytics computations
└── utils.ts                     # Helper functions (parsing dates, computing decades)

hooks/
├── use-analytics-store.ts       # Zustand store with localStorage persistence
└── use-mobile.ts                # Existing responsive breakpoint hook

components/
├── layout/
│   ├── navigation.tsx           # Header with theme toggle
│   ├── upload-models.tsx        # CSV file upload modal
│   └── theme-provider.tsx       # Theme context setup
├── analytics/
│   ├── analytics-header.tsx     # Dashboard header
│   ├── stats-overview.tsx       # Basic stats cards (NEW)
│   ├── stats-distribution.tsx   # Rating/decade breakdown visualization (NEW)
│   └── empty-state.tsx          # No data state
└── ui/                          # shadcn/ui primitives (already exist)

__tests__/
├── unit/
│   ├── csv-parser.test.ts       # CSV parsing tests
│   ├── data-merger.test.ts      # Data merge tests
│   └── analytics-engine.test.ts # Analytics computation tests
├── integration/
│   └── csv-to-analytics.test.ts # Full pipeline tests
└── e2e/
    └── upload-analytics.spec.ts # Playwright E2E tests
```

**Structure Decision**: Single frontend project (Option 1) - All code in Next.js app, no backend separation. Data processing modules in `lib/`, tests in `__tests__/`, React components in `components/`.

## Complexity Tracking

**No Constitution violations** - Design is intentionally simple:
- Client-side only (no backend complexity)
- Standard Next.js structure (no custom project organization)
- Modular data layer (separates concerns cleanly)
- Tests integrated locally (no separate test infrastructure)

---

# Phase 0: Research & Clarifications

## Research Complete ✅

All clarifications resolved via data analysis report:

| Item | Status | Findings |
|------|--------|----------|
| **CSV Structure** | ✅ Complete | 5 files analyzed: watched (mandatory), diary, ratings, films, watchlist (optional) |
| **Data Model** | ✅ Complete | Movie interface defined with all fields, CSV row types, MovieDataset wrapper |
| **Merge Strategy** | ✅ Complete | URI as key, priority: ratings > diary > watched, aggregate rewatches |
| **Session Design** | ✅ Complete | Zustand + localStorage, session-based for Path B migration |
| **Analytics Scope** | ✅ Complete | MVP: basic stats (counts, ratios, ratings, rewatches, decade/year breakdown) |
| **CSV Parser Approach** | ✅ Complete | Hybrid wrapper classes around PapaParse for type-safety and testability |
| **Error Handling** | ✅ Complete | Validation rules defined per file, edge cases documented |

**Research Output**: `.specify/artifacts/data-analysis-report.md` (comprehensive analysis)

---

# Phase 1: Design & Architecture

## 1.1 Data Model Definition

### Core Entities

**Movie Interface** (unified watched movie)
```typescript
interface Movie {
  id: string;                      // Letterboxd URI (https://boxd.it/...)
  title: string;                   // Movie title
  year: number;                    // Release year

  watchedDate?: Date;              // First watch date (from diary, fallback to watched.csv)
  dateMarkedWatched: Date;         // When added to watched list (from watched.csv)

  rating?: number;                 // Current rating 0.5-5.0 (from ratings.csv priority)
  ratingDate?: Date;               // When rating was made

  rewatch: boolean;                // true if watched multiple times
  rewatchCount?: number;           // Times rewatched (if > 1)
  rewatchDates?: Date[];           // Array of rewatch dates

  tags?: string[];                 // User tags (from diary)
  liked?: boolean;                 // Marked as "liked" (from films.csv)

  decade: number;                  // Computed: 1990, 2000, 2010, etc.
  era: 'classic' | 'golden' | 'modern' | 'contemporary'; // Computed era
}

interface MovieDataset {
  watched: Movie[];                // All watched movies (primary dataset)
  watchlist: Movie[];              // Unwatched movies (separate)
  lastUpdated: Date;
  uploadedFiles: string[];         // Which CSVs contributed to dataset
}

interface AnalyticsOverview {
  // Counts
  totalMoviesWatched: number;
  moviesRated: number;
  moviesLiked: number;

  // Ratios
  ratingCoverage: number;          // % of movies with ratings
  likeRatio: number;               // % of movies liked

  // Rating stats
  averageRating: number;
  medianRating: number;
  ratingDistribution: Record<string, number>; // "5.0": 45, "4.5": 30, etc.

  // Rewatch stats
  totalRewatches: number;          // Sum of all rewatches
  moviesRewatched: number;         // Count of movies rewatched
  rewatchRate: number;             // % of movies rewatched

  // Time-based
  earliestWatchDate?: Date;
  latestWatchDate?: Date;
  trackingSpan?: number;           // Days between earliest/latest

  // Aggregations
  decadeBreakdown: Record<string, number>; // "1990": 50, "2000": 100, etc.
  yearlyWatching: Record<string, number>;  // "2021": 45, "2022": 67, etc.
}
```

### CSV Row Types (Input)
```typescript
interface WatchedCSVRow {
  Date: string;
  Name: string;
  Year: string;
  'Letterboxd URI': string;
}

interface DiaryCSVRow extends WatchedCSVRow {
  Rating: string;       // Empty or "0.5"-"5.0"
  Rewatch: string;      // "Yes" or empty
  Tags: string;         // Comma-separated or empty
  'Watched Date': string; // ISO date or empty
}

interface RatingsCSVRow extends WatchedCSVRow {
  Rating: string;       // Always "0.5"-"5.0"
}

interface FilmsCSVRow extends WatchedCSVRow {}
interface WatchlistCSVRow extends WatchedCSVRow {}
```

**Full schema** with validation rules in Phase 1 deliverable: `data-model.md`

## 1.2 API Contracts / Function Signatures

### CSV Parser Module

```typescript
// lib/csv-parser.ts

/**
 * Parse a single CSV file into typed Movie array
 * Responsible for: format detection, normalization, validation
 */
function parseCSV(
  content: string,
  fileType: 'watched' | 'diary' | 'ratings' | 'films' | 'watchlist'
): ParseResult<Movie[]>

interface ParseResult<T> {
  success: boolean;
  data?: T;
  errors: ParseError[];
}

interface ParseError {
  row: number;
  field: string;
  value: string;
  message: string;
}

/**
 * Main entry point: Parse uploaded file
 */
export function parseLetterboxdCSV(file: File): Promise<ParseResult<Movie[]>>

/**
 * Detect CSV type by analyzing headers
 */
export function detectCSVType(headers: string[]): 'watched' | 'diary' | 'ratings' | 'films' | 'watchlist' | 'unknown'

/**
 * Validate CSV structure before parsing
 */
export function validateCSV(headers: string[]): ValidationError[]
```

### Data Merger Module

```typescript
// lib/data-merger.ts

/**
 * Merge multiple CSV sources with conflict resolution
 * Priority: ratings > diary > watched > films
 * Deduplicate by Letterboxd URI
 */
export function mergeMovieSources(
  watched: Movie[],
  diary?: Movie[],
  ratings?: Movie[],
  films?: Movie[],
  watchlist?: Movie[]
): MovieDataset

/**
 * Deduplicate movies by URI, keeping complete entries
 */
export function deduplicateMovies(movies: Movie[]): Movie[]

/**
 * Resolve conflicts when same movie from multiple sources
 */
export function resolveConflicts(existing: Movie, incoming: Movie, source: 'diary' | 'ratings' | 'watched' | 'films'): Movie
```

### Analytics Engine Module

```typescript
// lib/analytics-engine.ts

/**
 * Compute all analytics from movie dataset
 */
export function computeAnalytics(movies: Movie[]): AnalyticsOverview

/**
 * Individual computation functions (used by computeAnalytics)
 */
export function computeOverviewStats(movies: Movie[]): {
  totalMoviesWatched: number;
  moviesRated: number;
  averageRating: number;
  // ... etc
}

export function computeRatingDistribution(movies: Movie[]): Record<string, number>

export function computeDecadeBreakdown(movies: Movie[]): Record<string, number>

export function computeYearlyWatching(movies: Movie[]): Record<string, number>

export function computeRewatchStats(movies: Movie[]): {
  totalRewatches: number;
  moviesRewatched: number;
  rewatchRate: number;
}
```

### State Management (Zustand Store)

```typescript
// hooks/use-analytics-store.ts

interface AnalyticsStore {
  // Data
  dataset: MovieDataset | null;
  analytics: AnalyticsOverview | null;
  uploadedFiles: File[];

  // State
  loading: boolean;
  error: string | null;

  // Actions
  uploadFiles: (files: File[]) => Promise<void>;
  clearData: () => void;
  removeFile: (filename: string) => Promise<void>;

  // Getters
  hasData: () => boolean;
  totalMovies: () => number;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({ /* implementation */ }),
    {
      name: 'letterboxd-stats-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
```

**Full contracts** with error types and edge cases: `contracts/` directory (Phase 1 output)

## 1.3 Processing Pipeline

```
User Action: Upload CSV Files
    ↓
FileInput → validation (watched.csv required)
    ↓
PapaParse → raw data + headers
    ↓
detectCSVType() → identify file type
    ↓
validateCSV() → check structure
    ↓
parseCSV() → normalize to Movie[]
    ↓
[For each file] → collect Movie[] by source
    ↓
mergeMovieSources() → URI-keyed merge with priority
    ↓
Zustand Store → setState(dataset, analytics)
    ↓
localStorage → persist via Zustand middleware
    ↓
React Components → render analytics dashboard
```

## 1.4 Error Handling Strategy

| Error Type | Example | User Feedback | Technical Handling |
|-----------|---------|---|---|
| Missing mandatory file | No watched.csv | "Please upload watched.csv" | Validation gate before upload |
| Invalid CSV format | Wrong headers | "Invalid CSV format for [file]" | Show column mismatch, suggest correct file |
| Corrupted data | Non-ISO date in Watched Date | "Invalid data in row X, field Y" | Log to console, skip row, continue |
| Merge conflict | Same URI, different years | Use priority order (diary > watched) | Resolve silently, document in metadata |
| localStorage full | >5MB of data | "Data too large, clear browser storage" | Graceful degradation, export option |

**Full error handling spec**: `data-model.md` (Phase 1)

## 1.5 Testing Strategy

### Unit Tests
- **csv-parser.test.ts**: Parse each CSV type, edge cases (empty ratings, missing dates), malformed data
- **data-merger.test.ts**: Merge conflict resolution, URI deduplication, priority ordering
- **analytics-engine.test.ts**: Stat computations (averages, distributions), edge cases (empty dataset, single movie)

### Integration Tests
- **csv-to-analytics.test.ts**: End-to-end CSV → Movie[] → AnalyticsOverview with real mock data

### E2E Tests (Playwright)
- **upload-analytics.spec.ts**: User uploads files → sees analytics dashboard → stats display correctly

**Full test requirements**: `test-plan.md` (Phase 1 output)

---

# Phase 2: Implementation Sequencing

**Status**: Phase 2 planning delegated to `/speckit.tasks` command

Generated output will be in: `specs/3-planning/tasks.md`

Sequence will follow:
1. Create `lib/types.ts` (all interfaces)
2. Implement `lib/csv-parser.ts` with tests
3. Implement `lib/data-merger.ts` with tests
4. Implement `lib/analytics-engine.ts` with tests
5. Create `hooks/use-analytics-store.ts` with localStorage
6. Build `components/analytics/stats-overview.tsx` UI
7. Integrate upload modal with data pipeline
8. E2E testing and refinement

---

# Delivery Checklist

## Phase 1 Complete ✅
- [x] Data analysis complete (data-analysis-report.md)
- [x] Constitution check passed
- [x] Data model designed (Movie, MovieDataset, AnalyticsOverview)
- [x] CSV row types defined
- [x] Function contracts specified
- [x] Processing pipeline mapped
- [x] Error handling strategy documented
- [x] Testing strategy outlined
- [x] Project structure defined

## Phase 2 Pending ⬜
- [ ] Generate `data-model.md` (Phase 1 deliverable)
- [ ] Generate `contracts/` directory (Phase 1 deliverable)
- [ ] Generate `tasks.md` (Phase 2 deliverable via `/speckit.tasks`)
- [ ] Generate `quickstart.md` (Phase 1 deliverable)

---

# Next Command

Run `/speckit.tasks` to generate:
- Sequenced, dependency-ordered tasks
- Time estimates per task
- Acceptance criteria for each
- Task blocking relationships

Command: `/speckit.tasks`

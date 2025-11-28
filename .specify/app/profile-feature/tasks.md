# Implementation Tasks: User Profile CSV Integration

**Feature**: Letterboxd Stats - User Profile CSV Integration
**Branch**: `8-profile-csv` | **Date**: November 28, 2025
**Status**: Ready for Implementation

---

## Task Organization

Tasks are organized by **dependency order**. Each task is self-contained and independently testable. Complete tasks in sequence to avoid blocking.

**MVP Scope**: Complete P1 tasks (T001-T015) for full profile feature - 1-2 days
**Post-MVP**: US5-US6 tasks (T016-T020) for enhancements

---

## Phase 1: Data Model & Utilities (3 tasks)

**Purpose**: Define types and helper functions needed by all tasks
**Status**: Ready to start
**Blocking**: All subsequent phases

### T001: Extend types.ts with profile interfaces

**Description**: Add UserProfile, FavoriteFilm, ProfileCSVRow to lib/types.ts. Update existing types to include profile support.

**Acceptance Criteria**:
- [ ] UserProfile interface with all 10 fields (username required, others optional)
- [ ] FavoriteFilm interface with uri, title, rating, watched
- [ ] ProfileCSVRow interface for raw CSV input (matches Letterboxd export)
- [ ] Update MovieDataset: add `userProfile?: UserProfile`
- [ ] Update CSVType union: add 'profile' type
- [ ] Update UploadedFile interface: handle profile type
- [ ] All TypeScript compiles without errors
- [ ] File: `lib/types.ts`

**Technical Details**:
```typescript
// Add these interfaces:
interface UserProfile {
  username: string;                    // Required
  firstName?: string;
  lastName?: string;
  email?: string;
  location?: string;
  website?: string;
  bio?: string;
  pronoun?: string;
  joinDate?: Date;
  favoriteFilms: FavoriteFilm[];      // 0-4 films
}

interface FavoriteFilm {
  uri: string;                         // https://boxd.it/XXXXX
  title?: string;
  rating?: number;
  watched?: boolean;
}

interface ProfileCSVRow {
  'Date Joined': string;
  Username: string;
  'Given Name': string;
  'Family Name': string;
  'Email Address': string;
  Location: string;
  Website: string;
  Bio: string;
  Pronoun: string;
  'Favorite Films': string;
}

// Update:
type CSVType = 'watched' | 'diary' | 'ratings' | 'films' | 'watchlist' | 'profile' | 'unknown';

interface MovieDataset {
  watched: Movie[];
  watchlist: Movie[] | null;
  userProfile?: UserProfile;           // ← ADD THIS
  lastUpdated: Date;
  uploadedFiles: string[];
}
```

**Dependencies**: None (foundation)

**Test Scenario**:
- TypeScript compilation succeeds
- All interfaces export correctly
- UserProfile validates type checking

---

### T002: Add profile utilities to lib/utils.ts

**Description**: Add helper functions for profile parsing, validation, and formatting to lib/utils.ts.

**Acceptance Criteria**:
- [ ] `isValidLetterboxdFavoriteUri(uri: string): boolean` - validates URI format
- [ ] `parseProfileDate(dateStr: string): Date | undefined` - parses ISO dates
- [ ] `formatProfileFullName(first?: string, last?: string, username: string): string` - returns display name
- [ ] `validateProfileUsername(username: string): ValidationError[]` - validates required username
- [ ] `parseFavoriteFilmsString(str: string): string[]` - split comma-separated URLs
- [ ] `limitFavoriteFilms(films: string[], max: number = 4): string[]` - limit to 4
- [ ] All functions are pure, with no side effects
- [ ] File: `lib/utils.ts`

**Technical Details**:
```typescript
// Add these functions:
export function isValidLetterboxdFavoriteUri(uri: string): boolean {
  // Validate format: https://boxd.it/[A-Za-z0-9]+
}

export function parseProfileDate(dateStr: string): Date | undefined {
  // Parse ISO format: YYYY-MM-DD
}

export function formatProfileFullName(
  firstName?: string,
  lastName?: string,
  username: string
): string {
  // Return "First Last" or username fallback
}

export function validateProfileUsername(username: string): ValidationError[] {
  // Check: required, non-empty, reasonable length
}

export function parseFavoriteFilmsString(csvStr: string): string[] {
  // Split by comma, trim, filter empty
}

export function limitFavoriteFilms(films: string[], max: number = 4): string[] {
  // Return first N films, warn if truncated
}
```

**Dependencies**: T001 (types exist)

**Test Scenario**:
- URI validation: valid/invalid formats
- Date parsing: ISO dates, invalid dates
- Full name formatting: all combinations
- Username validation: required, length
- CSV splitting: commas, spaces, empty
- Film limiting: <4, =4, >4 films

---

### T003: Add mock profile CSV data to test fixtures

**Description**: Add profile CSV mock data to `__tests__/fixtures/mock-csvs.ts` for testing.

**Acceptance Criteria**:
- [ ] Mock profile CSV with all 10 fields (profile_01 content)
- [ ] Mock profile CSV with missing optional fields
- [ ] Mock profile CSV with empty Favorite Films
- [ ] Mock profile CSV with 4 favorite films
- [ ] Mock profile CSV with invalid format (too many favorites)
- [ ] Exported as `MOCK_PROFILE_CSV_*` constants
- [ ] File: `__tests__/fixtures/mock-csvs.ts` (updated)

**Technical Details**:
```typescript
// Add to mock-csvs.ts:
export const MOCK_PROFILE_CSV_FULL = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2022-01-20,Stupel,Marián,Hollý,,,,,He / his,"https://boxd.it/251c, https://boxd.it/1m8W"`

export const MOCK_PROFILE_CSV_MINIMAL = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
,testuser,,,,,,,,""`

export const MOCK_PROFILE_CSV_MANY_FAVORITES = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2025-03-24,contradictio,,,,,,this is mock name for box man with face of another,It / its,"https://boxd.it/251c, https://boxd.it/28Q8, https://boxd.it/1m8W, https://boxd.it/Arw0"`
```

**Dependencies**: T001 (types exist for structure)

**Test Scenario**:
- All mock CSVs parse correctly
- Various field combinations covered
- Edge cases represented

---

## Phase 2: CSV Parser (3 tasks)

**Purpose**: Implement profile CSV parsing
**Status**: Depends on Phase 1
**Blocking**: Phase 3, 4

### T004: Implement parseProfileCSV() in lib/csv-parser.ts

**Description**: Create profile CSV parsing function in lib/csv-parser.ts. Handle header detection, validation, and single-row parsing.

**Acceptance Criteria**:
- [ ] `parseProfileCSV(content: string): ParseResult<UserProfile>` implemented
- [ ] Detects profile CSV by headers
- [ ] Validates required field: Username
- [ ] Parses all 10 fields with correct types
- [ ] Handles missing optional fields (returns undefined)
- [ ] Parses Date Joined to Date object (ISO format)
- [ ] Returns ParseResult with data or errors array
- [ ] Handles malformed CSV gracefully
- [ ] File: `lib/csv-parser.ts` (~80 lines)

**Technical Details**:
```typescript
export function parseProfileCSV(content: string): ParseResult<UserProfile> {
  try {
    const result = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        errors: [{ row: 0, field: 'data', value: '', message: 'No data rows found' }]
      };
    }

    // Profile CSV should have exactly 1 data row
    const row = result.data[0] as ProfileCSVRow;
    const errors: ParseError[] = [];

    // Validate Username (required)
    if (!row.Username?.trim()) {
      errors.push({
        row: 1,
        field: 'Username',
        value: row.Username || '',
        message: 'Username is required'
      });
    }

    // Parse fields
    const userProfile: UserProfile = {
      username: row.Username?.trim() || '',
      firstName: row['Given Name']?.trim(),
      lastName: row['Family Name']?.trim(),
      email: row['Email Address']?.trim(),
      location: row.Location?.trim(),
      website: row.Website?.trim(),
      bio: row.Bio?.trim(),
      pronoun: row.Pronoun?.trim(),
      joinDate: parseProfileDate(row['Date Joined']),
      favoriteFilms: parseProfileFavoriteFilms(row['Favorite Films']),
    };

    return {
      success: errors.length === 0,
      data: userProfile,
      errors
    };
  } catch (error) {
    return {
      success: false,
      errors: [{ row: 0, field: 'parse', value: '', message: `Parse error: ${error.message}` }]
    };
  }
}
```

**Dependencies**: T001 (types), T002 (utilities), T003 (mock data)

**Test Scenario**:
- Parse profile_01.csv → UserProfile with 2 favorites
- Parse minimal profile → only username
- Parse with missing optional fields → undefined values
- Parse invalid format → errors array
- Parse empty Favorite Films → empty array
- Validate username required

---

### T005: Implement parseProfileFavoriteFilms() in lib/csv-parser.ts

**Description**: Create helper function to parse favorite films from comma-separated URI string.

**Acceptance Criteria**:
- [ ] `parseProfileFavoriteFilms(csvStr: string): FavoriteFilm[]` implemented
- [ ] Splits comma-separated URLs correctly
- [ ] Validates each URL format (https://boxd.it/XXXXX)
- [ ] Limits to 4 maximum
- [ ] Returns empty array if input empty
- [ ] Handles whitespace around URLs
- [ ] Handles invalid URLs gracefully
- [ ] File: `lib/csv-parser.ts` (~50 lines)

**Technical Details**:
```typescript
function parseProfileFavoriteFilms(csvStr: string): FavoriteFilm[] {
  if (!csvStr?.trim()) {
    return [];
  }

  const uris = csvStr.split(',').map(u => u.trim()).filter(Boolean);

  // Limit to 4
  const limited = uris.slice(0, 4);

  // If more than 4, warning logged (not in function, in parser)
  if (uris.length > 4) {
    console.warn(`Profile has ${uris.length} favorite films, showing first 4`);
  }

  // Create FavoriteFilm objects
  return limited
    .filter(uri => isValidLetterboxdFavoriteUri(uri))
    .map(uri => ({
      uri,
      title: undefined,
      rating: undefined,
      watched: undefined,
    }));
}
```

**Dependencies**: T001, T002 (utilities for validation), T003 (mock data)

**Test Scenario**:
- Parse "https://boxd.it/251c, https://boxd.it/1m8W" → 2 films
- Parse "https://boxd.it/a, https://boxd.it/b, https://boxd.it/c, https://boxd.it/d, https://boxd.it/e" → 4 films (warn)
- Parse empty string → []
- Parse with spaces → trim correctly
- Parse invalid URI → filter out, not included

---

### T006: Update detectCSVType() to recognize profile.csv in lib/csv-parser.ts

**Description**: Extend CSV type detection to recognize profile CSV format.

**Acceptance Criteria**:
- [ ] `detectCSVType()` returns 'profile' for profile CSV headers
- [ ] Profile detection happens before 'unknown' fallback
- [ ] Update EXPECTED_COLUMNS: add profile headers
- [ ] All existing CSV types still detected correctly
- [ ] File: `lib/csv-parser.ts` (update existing function)

**Technical Details**:
```typescript
// Update EXPECTED_COLUMNS:
const EXPECTED_COLUMNS: Record<CSVType, string[]> = {
  watched: ['Date', 'Name', 'Year', 'Letterboxd URI'],
  diary: ['Date', 'Name', 'Year', 'Letterboxd URI', 'Rating', 'Rewatch', 'Tags', 'Watched Date'],
  ratings: ['Date', 'Name', 'Year', 'Letterboxd URI', 'Rating'],
  films: ['Date', 'Name', 'Year', 'Letterboxd URI'],
  watchlist: ['Date', 'Name', 'Year', 'Letterboxd URI'],
  profile: ['Date Joined', 'Username', 'Given Name', 'Family Name', 'Email Address', 'Location', 'Website', 'Bio', 'Pronoun', 'Favorite Films'],
  unknown: [],
};

// Update detectCSVType():
export function detectCSVType(headers: string[]): CSVType {
  // ... existing code ...

  // Add profile check (after diary, before watched)
  const profileHeaders = EXPECTED_COLUMNS.profile;
  if (profileHeaders.every(col => normalized.includes(col)) && normalized.length === 10) {
    return 'profile';
  }

  // ... rest of function ...
}
```

**Dependencies**: T001 (CSVType updated)

**Test Scenario**:
- Detect profile CSV by headers
- Distinguish from watched (4 cols) vs profile (10 cols)
- Other CSV types still detected correctly

---

## Phase 3: Data Merge & Storage (3 tasks)

**Purpose**: Store profile in dataset and handle replacement
**Status**: Depends on Phase 2
**Blocking**: Phase 4, 5

### T007: Update mergeMovieSources() to handle profile in lib/data-merger.ts

**Description**: Extend data merger to accept and include profile in MovieDataset. Handle profile as singleton (replace, not merge).

**Acceptance Criteria**:
- [ ] `mergeMovieSources()` signature includes `profile?: UserProfile` parameter
- [ ] Profile included in returned MovieDataset
- [ ] uploadedFiles includes 'profile.csv' if profile provided
- [ ] Profile handled as singleton (replaces existing, not merged)
- [ ] Merge logic unchanged for movies
- [ ] File: `lib/data-merger.ts` (~30 lines changed)

**Technical Details**:
```typescript
export function mergeMovieSources(
  watched: Movie[],
  diary?: Movie[],
  ratings?: Movie[],
  films?: Movie[],
  watchlist?: Movie[],
  profile?: UserProfile  // ← ADD THIS
): MovieDataset {
  // ... existing merge logic for movies ...

  // Add profile to dataset
  const userProfile = profile || undefined;

  return {
    watched: mergedWatchedMovies,
    watchlist: watchlistMovies || null,
    userProfile,  // ← ADD THIS
    lastUpdated: new Date(),
    uploadedFiles: [
      'watched.csv',
      diary ? 'diary.csv' : null,
      ratings ? 'ratings.csv' : null,
      films ? 'films.csv' : null,
      watchlist ? 'watchlist.csv' : null,
      profile ? 'profile.csv' : null,  // ← ADD THIS
    ].filter(Boolean) as string[]
  };
}
```

**Dependencies**: T001 (types), T004-T005 (parsers exist)

**Test Scenario**:
- Merge movies + profile → dataset includes both
- Merge movies without profile → dataset has undefined profile
- Merge called multiple times → profile updates correctly
- uploadedFiles includes 'profile.csv'

---

### T008: Update Zustand store to include profile in hooks/use-analytics-store.ts

**Description**: Extend analytics store to manage profile data. Update state shape, upload pipeline, and persistence.

**Acceptance Criteria**:
- [ ] Store state includes `dataset.userProfile` (via MovieDataset)
- [ ] `uploadFiles()` detects and parses profile CSV separately
- [ ] `uploadFiles()` calls merge with profile parameter
- [ ] Profile stored in localStorage via persist middleware
- [ ] Profile loads from localStorage on app startup
- [ ] Profile data available to components via store
- [ ] File: `hooks/use-analytics-store.ts` (~100 lines changed)

**Technical Details**:
```typescript
// In uploadFiles():
// 1. Separate files by type
const filesByType = new Map<string, File[]>();
for (const file of files) {
  const type = detectFileType(file.name);
  if (!filesByType.has(type)) filesByType.set(type, []);
  filesByType.get(type)!.push(file);
}

// 2. Parse profile if exists
let profile: UserProfile | undefined;
if (filesByType.has('profile')) {
  const profileFile = filesByType.get('profile')![0];
  const content = await profileFile.text();
  const parseResult = await parseProfileCSV(content);
  if (parseResult.success) {
    profile = parseResult.data;
  } else {
    // Handle profile parse error
  }
}

// 3. Merge all with profile
const dataset = mergeMovieSources(
  watchedMovies,
  diaryMovies,
  ratingsMovies,
  filmsMovies,
  watchlistMovies,
  profile  // ← ADD THIS
);

// 4. Store and persist
set({ dataset, analytics, loading: false });
```

**Dependencies**: T004-T007 (parsers, merge)

**Test Scenario**:
- Upload movies + profile → both stored
- Profile persists to localStorage
- Reload page → profile restored
- Clear data → profile cleared too

---

### T009: Write tests for profile parsing and storage (Unit tests)

**Description**: Create comprehensive unit tests for profile parser, merge, and store functions.

**Acceptance Criteria**:
- [ ] Test file: `__tests__/unit/profile-parser.test.ts` (~150 lines)
  - [ ] parseProfileCSV() with full data
  - [ ] parseProfileCSV() with missing optional fields
  - [ ] parseProfileCSV() with empty Favorite Films
  - [ ] parseProfileCSV() with invalid username
  - [ ] parseProfileCSV() error cases
  - [ ] parseProfileFavoriteFilms() various inputs
  - [ ] URL validation edge cases
- [ ] Test file: `__tests__/unit/profile-merge.test.ts` (~80 lines)
  - [ ] mergeMovieSources() with profile
  - [ ] mergeMovieSources() without profile
  - [ ] uploadedFiles includes profile
- [ ] Test file: `__tests__/unit/profile-store.test.ts` (~120 lines)
  - [ ] Profile stored in dataset
  - [ ] Profile persisted to localStorage
  - [ ] Profile loaded from localStorage
  - [ ] Clear data clears profile
- [ ] All tests pass
- [ ] Coverage: >85% for profile-related code

**Dependencies**: T004-T008 (all parser/merge/store code)

**Test Scenario**:
- Run `npm test -- profile` → all tests pass
- Coverage report shows >85% for profile code
- Tests can be run independently

---

## Phase 4: UI Components (3 tasks)

**Purpose**: Display profile on dashboard
**Status**: Depends on Phase 3
**Blocking**: Phase 5

### T010: Create ProfileInfo component in components/analytics/profile-info.tsx

**Description**: Create React component to display user's name and "Life in Movies" stat.

**Acceptance Criteria**:
- [ ] Component displays full name or username (fallback)
- [ ] Component displays "Life in Movies: N films watched"
- [ ] Component shows loading skeleton while data loading
- [ ] Component shows empty state if no profile
- [ ] Responsive: mobile, tablet, desktop
- [ ] Dark mode support via `dark:` classes
- [ ] No console errors
- [ ] File: `components/analytics/profile-info.tsx` (~80 lines)

**Technical Details**:
```typescript
"use client";

import { useAnalyticsStore } from "@/hooks/use-analytics-store";
import { formatProfileFullName } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileInfo() {
  const { dataset, loading } = useAnalyticsStore();
  const profile = dataset?.userProfile;
  const totalMovies = dataset?.watched.length || 0;

  if (loading) {
    return <ProfileInfoSkeleton />;
  }

  if (!profile) {
    return null; // Don't show empty state, just hide
  }

  const displayName = formatProfileFullName(
    profile.firstName,
    profile.lastName,
    profile.username
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        {displayName}
      </h2>
      <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
        Life in Movies: <span className="font-semibold">{totalMovies}</span> films watched
      </p>
    </div>
  );
}

function ProfileInfoSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-6 w-72" />
    </div>
  );
}
```

**Dependencies**: T008 (store has profile), T002 (utilities)

**Test Scenario**:
- Render with profile loaded → shows name and stats
- Render without profile → returns null
- Render while loading → shows skeleton
- Test responsive layout
- Test dark mode classes

---

### T011: Create FavoriteFilms component in components/analytics/favorite-films.tsx

**Description**: Create React component to display user's favorite films (up to 4) with title and rating.

**Acceptance Criteria**:
- [ ] Component displays up to 4 favorite films
- [ ] Each film shows: title, rating (if available), watched indicator
- [ ] Component hides if no favorite films
- [ ] Responsive grid: mobile (1 col), tablet (2 col), desktop (4 col)
- [ ] Shows "Not watched yet" for films not in watched list
- [ ] Dark mode support
- [ ] No console errors
- [ ] File: `components/analytics/favorite-films.tsx` (~120 lines)

**Technical Details**:
```typescript
"use client";

import { useAnalyticsStore } from "@/hooks/use-analytics-store";
import { formatRating } from "@/lib/utils";
import { Star, AlertCircle } from "lucide-react";

export function FavoriteFilms() {
  const { dataset } = useAnalyticsStore();
  const profile = dataset?.userProfile;

  if (!profile?.favoriteFilms.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
        Favorite Films
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {profile.favoriteFilms.map((film) => (
          <FavoriteFilmCard key={film.uri} film={film} />
        ))}
      </div>
    </div>
  );
}

function FavoriteFilmCard({ film }: { film: FavoriteFilm }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h4 className="font-semibold text-slate-900 dark:text-slate-50">
        {film.title || "Unknown Title"}
      </h4>
      {film.watched ? (
        <div className="mt-2 flex items-center gap-2">
          <Star className="h-4 w-4" />
          <span>{film.rating ? formatRating(film.rating) : "Not rated"}</span>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-500">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Not watched yet</span>
        </div>
      )}
    </div>
  );
}
```

**Dependencies**: T008 (store has profile and favorites)

**Test Scenario**:
- Render with 4 favorite films → all displayed in grid
- Render with 2 films → both displayed
- Render without profile → returns null
- Test responsive grid
- Test dark mode

---

### T012: Integrate ProfileInfo and FavoriteFilms into analytics dashboard

**Description**: Add profile sections to analytics dashboard layout.

**Acceptance Criteria**:
- [ ] ProfileInfo appears at top of dashboard (above stats)
- [ ] FavoriteFilms appears below main stats (above distributions)
- [ ] Both components integrate seamlessly with existing dashboard
- [ ] Dashboard layout adjusted for profile section
- [ ] Responsive layout maintained
- [ ] File: `components/analytics/analytics-dashboard.tsx` (or similar)

**Dependencies**: T010-T011 (components created)

**Test Scenario**:
- Dashboard renders with profile and favorite films
- Profile section appears at correct position
- Responsive layout maintained

---

## Phase 5: Upload Modal (2 tasks)

**Purpose**: Allow users to upload profile.csv
**Status**: Depends on Phase 3 (store with profile)
**Blocking**: Nothing (final for MVP)

### T013: Update UploadModal to include profile section in components/layout/upload-models.tsx

**Description**: Extend upload modal to accept profile.csv alongside movie CSVs.

**Acceptance Criteria**:
- [ ] Add "User Profile" section to upload modal (separate from movies)
- [ ] Profile section marked as "Optional"
- [ ] Allow single profile.csv file selection
- [ ] Profile file shows upload status (uploading, success, error)
- [ ] Profile file supports drag-and-drop
- [ ] Update `FILE_TYPES` to include profile mapping
- [ ] Update `FILE_DESCRIPTIONS` with profile label/description
- [ ] Profile and movies process together in single upload
- [ ] Error messages for profile-specific issues
- [ ] File: `components/layout/upload-models.tsx` (~150 lines changed)

**Technical Details**:
```typescript
// Add to FILE_TYPES:
const FILE_TYPES = {
  "profile.csv": "profile",
  "watched.csv": "watched",
  // ... rest of existing ...
}

// Add to FILE_DESCRIPTIONS:
const FILE_DESCRIPTIONS = {
  profile: {
    label: "User Profile",
    description: "Optional - Your username, name, and favorite films",
    uploadedDescription: "Your profile loaded with your data",
    required: false,
  },
  // ... rest of existing ...
}

// In upload handler:
// Profile handled same as other files but:
// 1. Only one profile.csv allowed
// 2. Shows confirmation if replacing existing
// 3. Parsed alongside other CSVs
```

**Dependencies**: T008 (store handles profile), T004-T005 (parsers exist)

**Test Scenario**:
- Open upload modal → see "User Profile" section
- Upload profile.csv + watched.csv → both upload
- See profile success status
- Upload profile twice → confirmation dialog (see T014)

---

### T014: Add profile replacement confirmation dialog in components/layout/upload-models.tsx

**Description**: Show confirmation dialog when user tries to replace existing profile.

**Acceptance Criteria**:
- [ ] Dialog appears when uploading new profile with existing one
- [ ] Dialog text: "Profile already exists. Replace?"
- [ ] Cancel button: keep existing profile, skip new upload
- [ ] Replace button: overwrite with new profile
- [ ] Dialog is accessible (keyboard navigation, ARIA)
- [ ] Integrated into upload modal flow
- [ ] File: `components/layout/upload-models.tsx` (~50 lines)

**Technical Details**:
```typescript
// In upload handler, before merge:
if (
  existingProfile &&
  newProfileUpload &&
  uploadedFiles.some(f => f.type === 'profile')
) {
  // Show confirmation dialog
  const confirmed = await showConfirmDialog({
    title: "Replace Profile?",
    description: "A profile already exists. Replace with the new one?",
    confirmText: "Replace",
    cancelText: "Cancel"
  });

  if (!confirmed) {
    // Skip profile upload, use existing
    newProfile = undefined;
  }
}
```

**Dependencies**: T013 (modal with profile section)

**Test Scenario**:
- Upload profile when one exists → dialog appears
- Click Cancel → existing profile kept
- Click Replace → new profile replaces old

---

## Phase 6: Testing (2 tasks)

**Purpose**: Comprehensive test coverage
**Status**: Depends on all implementation tasks
**Blocking**: Nothing (should be done in parallel with coding)

### T015: Write component tests for ProfileInfo and FavoriteFilms

**Description**: Create React Testing Library tests for profile display components.

**Acceptance Criteria**:
- [ ] Test file: `__tests__/unit/profile-info.test.tsx` (~100 lines)
  - [ ] Render with profile data
  - [ ] Display full name correctly
  - [ ] Fallback to username
  - [ ] Show "Life in Movies" stat
  - [ ] Skeleton during loading
  - [ ] Return null if no profile
- [ ] Test file: `__tests__/unit/favorite-films.test.tsx` (~120 lines)
  - [ ] Render favorite films grid
  - [ ] Display up to 4 films
  - [ ] Show title, rating, watched status
  - [ ] Return null if no favorites
  - [ ] Responsive grid classes
  - [ ] Dark mode classes
- [ ] All tests pass
- [ ] Coverage: >85%

**Dependencies**: T010-T011 (components created)

**Test Scenario**:
- Run `npm test -- profile-info` → all pass
- Run `npm test -- favorite-films` → all pass
- Coverage report >85%

---

### T016: Write E2E test for profile upload and display

**Description**: Create Playwright E2E test for complete profile upload workflow.

**Acceptance Criteria**:
- [ ] Test file: `__tests__/e2e/profile-upload.spec.ts` (~150 lines)
- [ ] Test: Upload profile.csv with watched.csv
  - [ ] Open modal
  - [ ] Select profile file
  - [ ] Select watched file
  - [ ] Upload
  - [ ] See success
- [ ] Test: Display profile on dashboard
  - [ ] Navigate to analytics
  - [ ] Verify profile info displayed
  - [ ] Verify favorite films displayed
  - [ ] Verify responsive layout
- [ ] Test: Replace profile
  - [ ] Upload new profile
  - [ ] See confirmation dialog
  - [ ] Confirm replacement
  - [ ] Verify new profile displayed
- [ ] Test: Dark/light mode
  - [ ] Profile displays correctly in both modes
- [ ] All tests pass

**Dependencies**: T010-T014 (all UI code)

**Test Scenario**:
- Run `npm run e2e -- profile-upload` → all tests pass
- Tests cover full user workflow
- Can run on CI/CD pipeline

---

## Phase 7: Post-MVP Enhancements (Optional)

These tasks are for after MVP completion. Not required for initial launch.

### T017: Optional - Link favorite films to Movie objects

**Description**: Add `isFavorite?: boolean` to Movie interface and link during merge.

**Status**: POST-MVP
**Depends on**: MVP complete (T001-T016)

---

### T018: Optional - Show favorite films missing from watched list

**Description**: Detect and warn about favorite films not in watched movies.

**Status**: POST-MVP
**Depends on**: MVP complete

---

## Task Dependencies Graph

```
T001-T003 (Phase 1: Types & Fixtures)
    ↓
T004-T006 (Phase 2: CSV Parser)
    ↓
T007-T009 (Phase 3: Merge & Store)
    ↓
T010-T012 (Phase 4: UI Components)
    ↓
T013-T014 (Phase 5: Upload Modal)
    ↓
T015-T016 (Phase 6: Testing)
    ↓
[MVP COMPLETE]
    ↓
T017-T018 (Phase 7: Post-MVP)
```

## Implementation Checklist

### Before Starting:
- [ ] Reviewed spec.md
- [ ] Reviewed plan.md
- [ ] Created branch `8-profile-csv` (if not already)
- [ ] Understand data model changes

### Phase 1 (Types & Fixtures):
- [ ] T001: Extended types.ts with UserProfile, FavoriteFilm, ProfileCSVRow
- [ ] T002: Added profile utilities to utils.ts
- [ ] T003: Added mock profile CSV data to fixtures

### Phase 2 (Parser):
- [ ] T004: Implemented parseProfileCSV() function
- [ ] T005: Implemented parseProfileFavoriteFilms() helper
- [ ] T006: Updated detectCSVType() to recognize profile

### Phase 3 (Merge & Store):
- [ ] T007: Updated mergeMovieSources() with profile parameter
- [ ] T008: Updated Zustand store for profile state
- [ ] T009: Wrote parser, merge, store unit tests

### Phase 4 (UI):
- [ ] T010: Created ProfileInfo component
- [ ] T011: Created FavoriteFilms component
- [ ] T012: Integrated into analytics dashboard

### Phase 5 (Modal):
- [ ] T013: Updated UploadModal with profile section
- [ ] T014: Added profile replacement confirmation

### Phase 6 (Testing):
- [ ] T015: Component tests for profile display
- [ ] T016: E2E test for upload workflow

### Verification:
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Responsive design verified (375px, 768px, 1920px)
- [ ] Dark mode verified
- [ ] Manual testing with mock data

---

## How to Use This Task List

1. **Start with Phase 1** (T001-T003): Define types and utilities
2. **Complete each phase in order**: Dependencies are listed
3. **Run tests after each phase**: Verify nothing broke
4. **Build and verify**: `npm run build` after major changes
5. **Mark complete**: Check off as you finish
6. **Update progress**: Keep track in this file

---

**Ready to implement. Choose starting task and begin Phase 1!**

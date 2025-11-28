# Implementation Plan: User Profile CSV Integration

**Branch**: `8-profile-csv` | **Date**: November 28, 2025 | **Spec**: `profile-feature/spec.md`

**Input**: User profile.csv analysis from mock files and feature specification

**Note**: This plan covers Phase 1-4 (MVP): Building profile parsing, storage, and display for analytics dashboard.

---

## Summary

Add profile.csv upload support to the analytics engine. Users can upload their Letterboxd profile export to add personal context (username, name, favorite films) to the analytics dashboard. Profile is optional but enhances personalization. All processing is client-side, profile data nests in MovieDataset, and persists via localStorage.

**Core Approach:**
1. Parse profile.csv containing user metadata and up to 4 favorite film URIs
2. Create `UserProfile` object with all fields (username required, others optional)
3. Validate favorite film URLs and optional fields
4. Nest profile in `MovieDataset.userProfile` (connected to movies)
5. Store in Zustand + localStorage alongside movie data
6. Display on dashboard: username/name + "Life in Movies" stat + favorite films
7. Allow profile replacement with confirmation dialog
8. Handle missing favorite films with warnings

---

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16 (App Router)
**Primary Dependencies**: PapaParse (CSV), Zustand (state), date-fns (dates)
**Storage**: Browser localStorage (via Zustand persist middleware)
**Testing**: Jest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Browser (Web) - responsive mobile/tablet/desktop
**Project Type**: Frontend-only Next.js application
**Performance Goals**: Parse <100ms, no impact on existing pipeline
**Constraints**: localStorage quota shared with movie data (~5-10MB total)
**Scale/Scope**: Support 1 profile per session with 0-4 favorite films

---

## Constitution Check

**GATE: Verify alignment with project constitution**

✅ **Test-Driven Development**: Required
- Tests must be written first for profile parser, profile merge, profile components
- Profile parsing logic unit tested
- Component tests for profile display
- Integration tests for CSV → UserProfile → Store → Display flow

✅ **Browser-First, Client-Side Data**: Required
- All profile parsing happens in-browser
- Zero server calls for profile processing
- localStorage for persistence only
- Profile data never leaves device

✅ **Modular, Testable Components**: Required
- Separate profile parsing function in csv-parser.ts
- Pure functions with clear input/output contracts
- Reusable components: profile-info.tsx, favorite-films.tsx
- No side effects in profile transformation

✅ **CSV as Data Foundation**: Required
- Profile designed around CSV-only data
- No API enrichment needed (not Letterboxd API)
- All profile data comes from export file

✅ **Responsive & Modern Design**: Required
- Profile section responsive (mobile, tablet, desktop)
- Dark mode default with light mode support
- Minimalist display of user info

✅ **Testing & Quality Gates**: Required
- Unit tests for all parser/merge/store functions
- Component tests for profile display
- E2E test for upload workflow
- Error handling and validation

**Gate Status**: ✅ PASS - All constitution requirements satisfied

---

## Project Structure

### Documentation (this feature)

```text
.specify/app/profile-feature/
├── spec.md                  # Feature specification (this file)
├── plan.md                  # Implementation plan (this file)
└── tasks.md                 # Sequenced implementation tasks
```

### Source Code Changes

```text
lib/
├── types.ts                 # ADD: UserProfile, FavoriteFilm, ProfileCSVRow types
├── csv-parser.ts            # ADD: parseProfileCSV(), parseProfileFavoriteFilms()
├── data-merger.ts           # ADD: profile merge logic
└── utils.ts                 # ADD: profile validation utilities

hooks/
└── use-analytics-store.ts   # UPDATE: add userProfile to state, update upload pipeline

components/
└── analytics/
    ├── profile-info.tsx     # NEW: Display username and Life in Movies
    └── favorite-films.tsx   # NEW: Display favorite films with details

__tests__/
├── unit/
│   ├── profile-parser.test.ts      # NEW: Profile parsing tests
│   ├── profile-merge.test.ts       # NEW: Profile merge/storage tests
│   ├── profile-info.test.tsx       # NEW: Profile info component tests
│   └── favorite-films.test.tsx     # NEW: Favorite films component tests
├── fixtures/
│   └── mock-csvs.ts                # UPDATE: add profile CSV mock data
└── e2e/
    └── profile-upload.spec.ts      # NEW: Profile upload E2E test

components/layout/
└── upload-models.tsx        # UPDATE: add profile section to modal
```

---

## Phase 1: Data Model Design

### 1.1 New Interfaces

**UserProfile** - Parsed profile object
```typescript
interface UserProfile {
  username: string;                    // Required
  firstName?: string;
  lastName?: string;
  email?: string;
  location?: string;
  website?: string;
  bio?: string;
  pronoun?: string;
  joinDate?: Date;                     // ISO format from CSV Date Joined
  favoriteFilms: FavoriteFilm[];       // 0-4 films
}
```

**FavoriteFilm** - Individual favorite film
```typescript
interface FavoriteFilm {
  uri: string;                         // https://boxd.it/XXXXX
  title?: string;                      // Resolved from Movie[]
  rating?: number;                     // 0.5-5.0 if watched
  watched?: boolean;                   // Derived from movies
}
```

**ProfileCSVRow** - Raw CSV input
```typescript
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
  'Favorite Films': string;            // Comma-separated URLs
}
```

### 1.2 Extended Existing Interfaces

**MovieDataset** - Add profile storage
```typescript
interface MovieDataset {
  watched: Movie[];
  watchlist: Movie[] | null;
  userProfile?: UserProfile;           // ← NEW: Optional profile
  lastUpdated: Date;
  uploadedFiles: string[];             // Include 'profile.csv' if uploaded
}
```

**CSVType** - Add profile type
```typescript
type CSVType = 'watched' | 'diary' | 'ratings' | 'films' | 'watchlist' | 'profile' | 'unknown';
```

---

## Phase 2: CSV Parser Design

### 2.1 Profile CSV Detection

Profile CSV has exactly 10 columns:
```
Date Joined, Username, Given Name, Family Name, Email Address, Location, Website, Bio, Pronoun, Favorite Films
```

Detection logic:
```typescript
function detectProfileCSV(headers: string[]): boolean {
  const normalized = headers.map(h => h.trim());
  const profileHeaders = [
    'Date Joined', 'Username', 'Given Name', 'Family Name', 'Email Address',
    'Location', 'Website', 'Bio', 'Pronoun', 'Favorite Films'
  ];
  return profileHeaders.every(h => normalized.includes(h));
}
```

### 2.2 Profile Parsing Function

```typescript
export function parseProfileCSV(
  content: string
): ParseResult<UserProfile> {
  // 1. Parse CSV with PapaParse
  // 2. Validate headers (all 10 columns present)
  // 3. Extract single row (profile has only 1 data row + headers)
  // 4. Validate Username (required, non-empty)
  // 5. Parse optional fields with type conversion
  // 6. Parse Favorite Films URLs (comma-separated, validate format)
  // 7. Return ParseResult with UserProfile or errors
}
```

### 2.3 Favorite Films Parsing

```typescript
function parseProfileFavoriteFilms(favoriteFilmsStr: string): {
  films: FavoriteFilm[];
  errors: ParseError[];
} {
  // 1. Split by comma, trim whitespace
  // 2. Filter empty strings
  // 3. Validate each URL format: https://boxd.it/[A-Za-z0-9]+
  // 4. Limit to 4 max
  // 5. Return FavoriteFilm[] array and any parsing errors
  // 6. Warn if more than 4 (silently cap at 4)
}
```

### 2.4 Utility Functions

Add to `lib/utils.ts`:
```typescript
function isValidLetterboxdFavoriteUri(uri: string): boolean
function parseProfileDate(dateStr: string): Date | undefined
function formatProfileFullName(first?: string, last?: string): string
function validateProfileUsername(username: string): ValidationError[]
```

---

## Phase 3: Data Merge Design

### 3.1 Profile in Merge Pipeline

Profile is **singleton** - no merging, just replacement:

```typescript
export function mergeMovieSources(
  watched: Movie[],
  diary?: Movie[],
  ratings?: Movie[],
  films?: Movie[],
  watchlist?: Movie[],
  profile?: UserProfile  // ← NEW parameter
): MovieDataset {
  // ... existing merge logic ...

  // Add profile handling:
  const userProfile = profile || undefined;

  return {
    watched: mergedMovies,
    watchlist: watchlistMovies || null,
    userProfile,
    lastUpdated: new Date(),
    uploadedFiles: [
      watched ? 'watched.csv' : null,
      diary ? 'diary.csv' : null,
      ratings ? 'ratings.csv' : null,
      films ? 'films.csv' : null,
      watchlist ? 'watchlist.csv' : null,
      profile ? 'profile.csv' : null,
    ].filter(Boolean) as string[]
  }
}
```

### 3.2 Optional: Link Favorite Films to Movies

**For MVP**: Store favorite films separately (no linking)
**Post-MVP**: Can add `isFavorite?: boolean` to Movie and link during merge

---

## Phase 4: State Management Design

### 4.1 Zustand Store Updates

Add to store state:
```typescript
interface StoreState {
  dataset: MovieDataset | null;      // Already exists, now includes userProfile
  analytics: AnalyticsOverview | null;
  uploadedFiles: string[];
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
}
```

### 4.2 Upload Pipeline

Update `uploadFiles()` to handle profile:

```typescript
async uploadFiles(files: File[]): Promise<void> {
  // 1. Categorize files by type (watched, diary, ratings, films, watchlist, profile)
  // 2. Parse each by type
  // 3. Extract profile if present
  // 4. Check for existing profile (if yes, ask user to confirm replace)
  // 5. Merge all data including profile
  // 6. Compute analytics
  // 7. Store in Zustand + localStorage
}
```

### 4.3 Profile Replacement Logic

```typescript
if (existingProfile && newProfile) {
  // Show confirmation dialog
  // User clicks Replace → update to newProfile
  // User clicks Cancel → keep existing profile, skip new one
}
```

---

## Phase 5: UI Components Design

### 5.1 Profile Info Component

**File**: `components/analytics/profile-info.tsx`

```typescript
export function ProfileInfo() {
  const { dataset, loading } = useAnalyticsStore();
  const profile = dataset?.userProfile;

  if (loading) return <ProfileInfoSkeleton />;
  if (!profile) return <ProfileEmpty />;

  return (
    <div className="profile-section">
      <h2>{getDisplayName(profile)}</h2>  // Full name or username
      <p>Life in Movies: {totalMoviesWatched} films watched</p>
    </div>
  );
}
```

### 5.2 Favorite Films Component

**File**: `components/analytics/favorite-films.tsx`

```typescript
export function FavoriteFilms() {
  const { dataset } = useAnalyticsStore();
  const profile = dataset?.userProfile;

  if (!profile?.favoriteFilms.length) return null;

  return (
    <div className="favorite-films">
      {profile.favoriteFilms.map(film => (
        <FavoriteFilmCard
          key={film.uri}
          film={film}
          watched={film.watched}
          rating={film.rating}
        />
      ))}
    </div>
  );
}
```

### 5.3 Upload Modal Updates

Add profile section to `upload-models.tsx`:

```typescript
// Add profile to FILE_TYPES
const FILE_TYPES = {
  "profile.csv": "profile",
  // ... existing entries
}

// Add profile descriptions
const FILE_DESCRIPTIONS = {
  profile: {
    label: "User Profile",
    description: "Optional - Your username, name, and favorite films",
    required: false,
  },
  // ... existing entries
}

// In upload handler:
// 1. Detect profile file
// 2. Parse profile separately
// 3. Check for existing profile
// 4. Show confirmation if replacing
```

---

## Phase 6: Error Handling

### 6.1 Profile-Specific Errors

```typescript
const ProfileErrors = {
  MISSING_USERNAME: "Profile must include Username",
  INVALID_FAVORITE_URI: "Favorite film URL format invalid (expected https://boxd.it/XXXXX)",
  TOO_MANY_FAVORITES: "Profile has more than 4 favorite films (showing first 4)",
  INVALID_DATE: "Date Joined format invalid",
  PROFILE_REPLACE_CONFIRM: "Profile already exists. Replace?",
  PARSE_ERROR: "Error parsing profile CSV",
};
```

### 6.2 Warning Scenarios

```typescript
// Favorite film not in watched movies
"⚠️ Favorite film 'Movie Title' is not in your watched list"

// Missing optional fields
// (No warning, just store what's available)
```

---

## Complexity Tracking

**Estimated new code**: ~600-700 lines
- Profile interfaces: ~100 lines
- Profile parser: ~150 lines
- Profile merge: ~50 lines
- Zustand store updates: ~100 lines
- UI components: ~150 lines
- Tests: ~250+ lines

**No Constitution violations** - Design is simple:
- Client-side only (no backend complexity)
- Standard data flow (parse → merge → store → display)
- Singleton profile (simpler than array merge)
- Minimal new state (just profile object in dataset)

---

## Testing Strategy

### Phase 1: Unit Tests

**Profile Parser Tests** (`profile-parser.test.ts`)
- Parse valid profile CSV (all fields)
- Parse profile with missing optional fields
- Parse profile with empty Favorite Films
- Validate Username required
- Validate Favorite Films URL format
- Validate too many favorites (>4)
- Parse date formats (ISO, various)
- Error handling: malformed CSV, missing headers

**Profile Merge Tests** (`profile-merge.test.ts`)
- Merge profile with movies
- Replace existing profile
- Favorite films stored correctly
- Profile optional in merge (no profile uploaded)

**Profile Store Tests** (extend `analytics-store.test.ts`)
- Add profile to store state
- Profile persists to localStorage
- Profile loads from localStorage
- Replace profile (new overwrites old)
- Clear profile with data
- uploadedFiles includes 'profile.csv'

### Phase 2: Component Tests

**ProfileInfo Tests** (`profile-info.test.tsx`)
- Render with profile loaded
- Display full name correctly
- Fallback to username if no name
- Display "Life in Movies" stat
- Show skeleton while loading
- Show empty state if no profile

**FavoriteFilms Tests** (`favorite-films.test.tsx`)
- Render 1-4 favorite films
- Show title, rating, watched status
- Hide if no favorites
- Responsive grid layout
- Dark mode support

### Phase 3: Integration Tests

**CSV → Profile → Store → Display** (`profile-integration.test.ts`)
- Upload profile CSV
- Profile stored in dataset
- Profile displays on component
- Favorite films linked to movies
- Full workflow end-to-end

### Phase 4: E2E Tests

**Profile Upload E2E** (`profile-upload.spec.ts`)
- Open upload modal
- Upload profile.csv + watched.csv together
- See success status
- Navigate to analytics
- Verify profile displayed
- Replace profile (confirmation)
- Clear data (profile clears too)

---

## Performance Requirements

| Metric | Target | Notes |
|--------|--------|-------|
| Profile parse | <100ms | Single row CSV, minimal data |
| Favorite film URL validation | <10ms | ~4 URLs max |
| Profile merge | <50ms | Singleton, no complex logic |
| Store update | <100ms | localStorage write included |
| Component render | <100ms | ProfileInfo, FavoriteFilms |

---

## Success Criteria

### MVP Complete When:
- ✅ ProfileCSVRow type defined
- ✅ UserProfile, FavoriteFilm interfaces created
- ✅ parseProfileCSV() implemented and tested
- ✅ Profile stored in MovieDataset.userProfile
- ✅ Profile persists in localStorage
- ✅ ProfileInfo component displays username/name
- ✅ FavoriteFilms component displays up to 4 films
- ✅ Upload modal includes profile section
- ✅ Profile replacement with confirmation works
- ✅ All unit tests pass (>30 tests)
- ✅ All component tests pass
- ✅ E2E test passes
- ✅ No console errors
- ✅ Responsive design verified
- ✅ Dark/light mode support verified

### Quality Gates:
- [ ] Profile parser handles all CSV formats
- [ ] UserProfile objects created with correct types
- [ ] Favorite Films URLs validated
- [ ] Profile replaces (not duplicates)
- [ ] Empty states handled
- [ ] Error messages helpful
- [ ] localStorage persistence works
- [ ] Responsive verified (375px, 768px, 1920px)
- [ ] Dark mode verified

---

## Timeline Estimate

**Phase 1: Types & Utilities** (1-2 hours)
- Define UserProfile, FavoriteFilm, ProfileCSVRow
- Add validation utilities

**Phase 2: Parser** (2-3 hours)
- Implement parseProfileCSV()
- Implement favorite films parsing
- Unit tests

**Phase 3: Merge & Store** (2-3 hours)
- Update merge logic
- Update Zustand store
- Tests

**Phase 4: UI Components** (2-3 hours)
- ProfileInfo component
- FavoriteFilms component
- Component tests

**Phase 5: Upload Modal** (1-2 hours)
- Add profile section
- Confirmation dialog
- E2E test

**Total**: 8-13 hours (1-2 days full-time)

---

**Ready for implementation. See tasks.md for detailed sequential task breakdown.**

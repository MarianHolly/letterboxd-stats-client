# Feature Specification: User Profile CSV Integration

**Feature**: Add profile.csv upload support to enrich analytics with user metadata and favorite films
**Status**: Design Phase Complete, Ready for Implementation
**Date**: November 28, 2025
**Branch**: `8-profile-csv`

---

## Overview

Transform profile.csv export files into a `UserProfile` object containing user metadata (username, name, contact info) and up to 4 favorite film Letterboxd URIs. Profile data is optional but highly valuable for personalizing the analytics dashboard with user context and highlighting their most loved films.

**Core Value**: Users can upload their Letterboxd profile export to add personal context to their viewing statistics. Dashboard displays username and "Life in Movies" metrics, with favorite films showcased separately.

---

## User Stories

### Priority 1 (P1): Profile Integration - MVP Enhancement

#### US1: Parse Profile CSV File
**Priority**: P1 - MANDATORY for profile feature
**Category**: Data Processing

**User Story**:
> As a user, I want to upload my profile.csv file and have it parsed correctly so that my username and favorite films are recognized by the system.

**Acceptance Criteria**:
- [ ] System accepts profile.csv file upload via file picker
- [ ] CSV is parsed without errors (required columns: Username; optional: Given Name, Family Name, Email Address, Location, Website, Bio, Pronoun, Date Joined, Favorite Films)
- [ ] Parsed data converts to UserProfile object with correct types
- [ ] System validates required field: Username (non-empty string)
- [ ] System validates optional Favorite Films: comma-separated Letterboxd URIs (0-4 URLs max)
- [ ] System shows loading state during parsing
- [ ] System displays error message if file is invalid or missing Username
- [ ] Empty state guides user if no profile.csv uploaded
- [ ] Profile parsing completes efficiently (<100ms)

**Technical Details**:
- CSV file validation: check for required columns (Username) and optional Favorite Films
- Use PapaParse library (already configured for other CSVs)
- Create wrapper function: `parseProfileCSV(content: string): ParseResult<UserProfile>`
- Output: Single `UserProfile` object (not array)
- Error handling: collect parsing errors, display to user
- Favorite Films validation: extract URLs, validate format, handle invalid/missing URLs with warnings

**Dependencies**: None (foundation task, parallel with movie CSV tasks)

**Test Scenario**:
- Upload mock profile_01.csv with username and 2 favorite films
- Verify UserProfile object contains: username, firstName, lastName, favoriteFilms array
- Verify Favorite Films URLs are correctly parsed
- Test edge cases: empty Favorite Films, missing optional fields, invalid URL format
- Test performance: <100ms parse time

---

#### US2: Store Profile in Dataset with Movie Data
**Priority**: P1 - MANDATORY
**Category**: State Management

**User Story**:
> As a user, I want my profile to be stored alongside my movie data so that it persists in localStorage and travels with my analytics dataset.

**Acceptance Criteria**:
- [ ] Profile is stored in `MovieDataset.userProfile` (nested, not separate state)
- [ ] Profile data persists to localStorage automatically via Zustand
- [ ] Persisted profile loads on page refresh
- [ ] User can replace profile by uploading new profile.csv (confirmation dialog)
- [ ] User can clear profile along with all data
- [ ] System handles profile + movies together seamlessly
- [ ] uploadedFiles array tracks if profile.csv was uploaded

**Technical Details**:
- Extend `MovieDataset` interface: `userProfile?: UserProfile`
- Profile is singleton (only one per dataset, replaced not merged)
- localStorage versioning bumped if needed for new schema
- Profile optional: `userProfile = undefined` if not uploaded
- Update `uploadedFiles` to include 'profile.csv' when uploaded

**Dependencies**: US1 (profile parsing completes first)

**Test Scenario**:
- Parse and store profile with movies
- Refresh browser page
- Verify profile and movies both restored from localStorage
- Upload new profile.csv
- Verify confirmation dialog appears
- Confirm replace
- Verify new profile data replaces old one

---

#### US3: Display Profile Info on Analytics Dashboard
**Priority**: P1 - MANDATORY
**Category**: UI/UX

**User Story**:
> As a user, I want to see my profile information displayed on the analytics dashboard so that the statistics feel personalized to me.

**Acceptance Criteria**:
- [ ] Dashboard displays user's name (full name if available, fallback to username)
- [ ] Dashboard displays "Life in Movies" metric (total watched count)
- [ ] Dashboard displays favorite films section (if profile uploaded)
- [ ] Favorite films show: title, rating (if exists), visual indicator
- [ ] Favorite films display limit: 4 films maximum
- [ ] If favorite film not in watched movies: warning shown, still displayed
- [ ] Section marked "Not uploaded yet" if no profile
- [ ] Profile section responsive: mobile (stacked), tablet (2 col), desktop (side-by-side)
- [ ] Dark/light mode support for profile display
- [ ] No console errors

**Technical Details**:
- Create `components/analytics/profile-info.tsx` - displays username and Life in Movies stat
- Create `components/analytics/favorite-films.tsx` - displays up to 4 favorite films with details
- Integration point: pull from `dataset.userProfile` via Zustand store
- Responsive design: mobile-first, Tailwind CSS grid layout
- Dark mode: use `dark:` prefixed classes
- Fallback: display empty state if no profile uploaded

**Dependencies**: US2 (profile stored), US1 (profile parsed)

**Test Scenario**:
- Dashboard with profile and movies uploaded
- Verify username displays correctly (full name or fallback)
- Verify "Life in Movies: 45 films" displays
- Verify favorite films section shows up to 4 films
- Click favorite film → verify it links to/highlights in movie list (optional enhancement)
- Verify responsive layout on mobile 375px, tablet 768px, desktop 1920px
- Verify dark mode displays correctly

---

#### US4: Handle Profile Upload in Modal
**Priority**: P1 - MANDATORY
**Category**: UI/UX

**User Story**:
> As a user, I want to upload my profile.csv file alongside my movie CSVs in the upload modal so that all my data uploads in one workflow.

**Acceptance Criteria**:
- [ ] Upload modal includes separate "User Profile" section
- [ ] Profile section allows single profile.csv file selection
- [ ] Profile file shows as uploaded with status indicator
- [ ] If profile already exists: show "Replace?" confirmation before re-uploading
- [ ] Upload modal handles profile + movie CSVs together seamlessly
- [ ] Profile shown as optional in modal UI
- [ ] Error messages for profile-specific issues displayed clearly
- [ ] Modal shows "Not uploaded yet" if no profile currently stored
- [ ] Profile upload status shown with checkmark/loading/error states

**Technical Details**:
- Extend `components/layout/upload-models.tsx` with profile section
- Add profile file type mapping: `profile.csv → 'profile'` type
- Add profile to `FILE_DESCRIPTIONS` with label and descriptions
- Profile file detection by filename or header analysis
- Confirmation dialog on profile replace
- Profile and movies processed together in same upload workflow
- Error handling: validation errors shown in modal UI

**Dependencies**: US1 (profile parsing), US2 (profile storage)

**Test Scenario**:
- Open upload modal
- See "User Profile" section marked as optional
- Upload profile.csv alongside watched.csv
- Both process and upload together
- Verify profile shows success status
- Close modal and re-open
- Upload different profile.csv
- See confirmation dialog "Replace existing profile?"
- Cancel/Confirm actions work correctly

---

### Priority 2 (P2): Enhancements & Polish

#### US5: Link Favorite Films to Movie Analytics
**Priority**: P2 - NICE TO HAVE
**Category**: Analytics Enhancement

**User Story**:
> As a user, I want to see my favorite films highlighted in the main analytics so I can quickly identify how my favorites fit into my overall viewing patterns.

**Acceptance Criteria**:
- [ ] Favorite films are marked with special visual indicator in movie lists (optional)
- [ ] Favorite films appear with stats: rating, watch count, rewatch info
- [ ] Dashboard can show "Favorite Films Stats" card (optional)
- [ ] Filter option: show only favorite films (optional)

**Technical Details**:
- Optional: Add `isFavorite?: boolean` to Movie interface
- Link Movie URIs to favorite film URIs during merge
- Separate section for favorite films analytics (optional)

**Dependencies**: US1-US3 (profile fully integrated)

---

#### US6: Handle Missing Favorite Films Gracefully
**Priority**: P2 - NICE TO HAVE
**Category**: User Experience

**User Story**:
> As a user, I want to see which of my favorite films I haven't watched yet so I can track films I plan to watch.

**Acceptance Criteria**:
- [ ] System warns when favorite film URL not found in watched movies
- [ ] Missing favorites shown separately with "Not yet watched" badge
- [ ] User can dismiss warnings
- [ ] System suggests adding those films to watchlist

**Technical Details**:
- Validation during profile merge: check URIs exist in watched movies
- Display warning toast: "1 favorite film not in your watched movies"
- Store missing URLs separately for future reference

**Dependencies**: US4 (profile upload complete)

---

## Data Model Summary

### UserProfile (New)
```typescript
interface UserProfile {
  username: string;                    // Letterboxd username (required)
  firstName?: string;                  // Given Name (optional)
  lastName?: string;                   // Family Name (optional)
  email?: string;                      // Email Address (optional)
  location?: string;                   // Location (optional)
  website?: string;                    // Website (optional)
  bio?: string;                        // Bio (optional)
  pronoun?: string;                    // Pronoun (optional)
  joinDate?: Date;                     // Date Joined (optional, ISO format)
  favoriteFilms: FavoriteFilm[];      // Array of 0-4 favorite films
}

interface FavoriteFilm {
  uri: string;                         // Letterboxd URI (e.g., https://boxd.it/251c)
  title?: string;                      // Movie title (optional, resolved from watched list)
  rating?: number;                     // Rating if in watched movies (optional)
  watched?: boolean;                   // true if in watched movies (optional)
}
```

### ProfileCSVRow (Input)
```typescript
interface ProfileCSVRow {
  'Date Joined': string;               // ISO date string or empty
  Username: string;                    // Required
  'Given Name': string;                // Optional
  'Family Name': string;               // Optional
  'Email Address': string;             // Optional
  Location: string;                    // Optional
  Website: string;                     // Optional
  Bio: string;                         // Optional
  Pronoun: string;                     // Optional
  'Favorite Films': string;            // Comma-separated URLs, 0-4 max
}
```

### Extended MovieDataset
```typescript
interface MovieDataset {
  watched: Movie[];                    // All watched movies (required)
  watchlist: Movie[] | null;           // Movies to watch (optional)
  userProfile?: UserProfile;           // User profile + favorites (optional)
  lastUpdated: Date;                   // When dataset was last updated
  uploadedFiles: string[];             // Which CSVs contributed ('profile.csv' if uploaded)
}
```

---

## Implementation Strategy

### MVP Scope (Phase 1-2 Tasks)
**Goal**: User can upload profile.csv, see profile on dashboard (1 week)

**Must Complete**:
- US1: Profile CSV parsing
- US2: Profile storage in dataset
- US3: Profile display on dashboard
- US4: Profile upload in modal

**Must NOT Include (Post-MVP)**:
- Favorite films analytics linking (US5)
- Missing films handling (US6)
- Advanced profile features

### Post-MVP (Phase 3+ Tasks - Optional)
- US5: Favorite films highlighting
- US6: Missing films notifications
- Profile picture/avatar support (not in current CSV)
- Social sharing of profile

---

## Success Criteria

### MVP Complete When:
- ✅ Profile CSV parsing works for all 10 fields
- ✅ Profile persists in localStorage with movies
- ✅ Dashboard displays username and Life in Movies stat
- ✅ Favorite films display up to 4 films with ratings
- ✅ Upload modal shows profile section
- ✅ Profile replacement with confirmation works
- ✅ All unit tests pass (profile parser, profile merge, profile store)
- ✅ All component tests pass (profile-info, favorite-films components)
- ✅ E2E test: upload profile → see on dashboard
- ✅ No console errors
- ✅ Responsive on mobile/tablet/desktop
- ✅ Dark/light mode support

### Quality Gates:
- [ ] Profile parser handles all CSV formats
- [ ] UserProfile objects created correctly
- [ ] Favorite films URLs validated
- [ ] Profile replaces not duplicates
- [ ] Empty states handled gracefully
- [ ] Error messages helpful
- [ ] localStorage persistence works
- [ ] Responsive design verified

---

## Out of Scope (MVP)

❌ Profile picture/avatar upload
❌ Multiple profiles per user
❌ Profile synchronization with Letterboxd API
❌ Profile editing interface (users edit in Letterboxd, re-upload CSV)
❌ Favorite films analytics/filtering (defer to US5)
❌ User authentication/backend

---

## Dependencies & Blockers

### No External Blockers
- All libraries already installed (PapaParse, Zustand, date-fns)
- No backend required
- No API integration needed

### Internal Sequence:
```
US1 (Parse Profile CSV)
  ↓
US2 (Store Profile) + US4 (Upload Modal) [parallel]
  ↓
US3 (Display on Dashboard)
  ↓
Optional: US5, US6 (Post-MVP enhancements)
```

---

## Testing Requirements

### TDD Approach (Tests First):
1. Write tests for profile parsing
2. Write tests for profile storage
3. Write component tests for profile display
4. Write E2E test for upload workflow

### Test Coverage:
- **Unit**: Profile parser, profile merge, profile store
- **Component**: profile-info.tsx, favorite-films.tsx
- **Integration**: CSV → UserProfile → Store → Display pipeline
- **E2E**: User uploads profile → sees on dashboard

### Test Data:
- Mock profile CSVs in `__tests__/fixtures/` (profile_01.csv, profile_02.csv)
- Edge cases: no favorites, missing optional fields, invalid URLs
- Performance: <100ms parse time

---

## Related Changes Needed

### Existing files to modify:
1. `lib/types.ts` - Add UserProfile, FavoriteFilm, ProfileCSVRow types; update MovieDataset, CSVType
2. `lib/csv-parser.ts` - Add profile detection and parsing logic
3. `lib/data-merger.ts` - Add profile handling in merge
4. `lib/utils.ts` - Add profile-specific utilities (favorite film URL validation)
5. `hooks/use-analytics-store.ts` - Add profile to store state and upload pipeline
6. `components/layout/upload-models.tsx` - Add profile upload section
7. `lib/error-messages.ts` - Add profile-specific error categories (if needed)

### New files to create:
1. `components/analytics/profile-info.tsx` - Display username and Life in Movies
2. `components/analytics/favorite-films.tsx` - Display favorite films with details
3. `__tests__/unit/profile-parser.test.ts` - Profile parsing tests
4. `__tests__/unit/profile-store.test.ts` - Profile store tests
5. `__tests__/unit/profile-info.test.tsx` - Component tests
6. `__tests__/e2e/profile-upload.spec.ts` - E2E upload test

---

**Ready for implementation. See plan.md for technical architecture and tasks.md for detailed task breakdown.**

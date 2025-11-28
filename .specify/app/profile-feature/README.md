# Profile Feature Implementation Guide

**Feature**: User Profile CSV Integration for Letterboxd Stats
**Status**: Planning Complete ✅ - Ready for Implementation
**Date Created**: November 28, 2025
**Branch**: `8-profile-csv`

---

## Quick Overview

Add support for uploading **profile.csv** files to personalize the analytics dashboard with user information (username, full name, favorite films).

### What Users Get
- ✅ Upload their profile.csv from Letterboxd alongside movie CSVs
- ✅ See their name and "Life in Movies" stat on the dashboard
- ✅ See their favorite films (up to 4) displayed on analytics page
- ✅ Profile persists in browser alongside movie data
- ✅ Replace profile with confirmation dialog

### What Developers Do
**Total**: 6 phases, 16 tasks, ~8-13 hours

1. **Phase 1**: Define types & utilities (3 tasks)
2. **Phase 2**: Implement CSV parser (3 tasks)
3. **Phase 3**: Handle data merge & storage (3 tasks)
4. **Phase 4**: Create UI components (3 tasks)
5. **Phase 5**: Update upload modal (2 tasks)
6. **Phase 6**: Write tests (2 tasks)

---

## Documentation Files

### 📋 `spec.md` (16 KB)
**Feature Specification** - What to build

Contains:
- User stories (US1-US6)
- Acceptance criteria for each story
- Data model design (UserProfile, FavoriteFilm interfaces)
- Success criteria for MVP
- Out-of-scope items
- Quality gates

**Read this first to understand requirements.**

### 📐 `plan.md` (17 KB)
**Implementation Plan** - How to build it

Contains:
- Technical architecture overview
- Phase descriptions (1-6)
- Data model detailed design
- CSV parser design
- Merge & storage strategy
- UI component design
- Error handling strategy
- Testing strategy
- Timeline estimates

**Read this to understand the approach.**

### ✅ `tasks.md` (30 KB)
**Detailed Task Breakdown** - What to code

Contains:
- 16 sequential tasks (T001-T016)
- Each task has:
  - Detailed description
  - Acceptance criteria
  - Technical implementation details
  - Code examples
  - Dependencies
  - Test scenarios
- Task dependency graph
- Implementation checklist
- How to track progress

**Read this to know exactly what to code.**

---

## Key Decisions Made

✅ **UserProfile nested in MovieDataset** (not separate state)
- Profile travels with movies
- Persists together in localStorage
- Clears together on data deletion

✅ **Favorite Films optional** (0-4 URLs)
- Not required for profile upload
- Validated, formatted, limited to 4 max
- Shown with movie details if watched

✅ **Profile is singleton** (one per session)
- New profile replaces old (not merged)
- Confirmation dialog on replace
- Simple 1-1 relationship

✅ **Display on dashboard** (PersonalInfo + FavoriteFilms)
- Username/Full Name at top
- "Life in Movies: N films watched" stat
- Favorite films grid below main stats

✅ **All optional features**
- Profile completely optional
- No required fields in profile CSV except Username
- User can upload just movies without profile
- Graceful handling of missing data

---

## File Structure After Implementation

```
lib/
├── types.ts                          # ✏️ UPDATE: Add UserProfile, FavoriteFilm, ProfileCSVRow
├── csv-parser.ts                     # ✏️ UPDATE: Add parseProfileCSV()
├── data-merger.ts                    # ✏️ UPDATE: Add profile to merge
└── utils.ts                          # ✏️ UPDATE: Add profile utilities

hooks/
└── use-analytics-store.ts            # ✏️ UPDATE: Add profile to store

components/
├── layout/
│   └── upload-models.tsx             # ✏️ UPDATE: Add profile section
└── analytics/
    ├── profile-info.tsx              # 🆕 NEW: Display username + Life in Movies
    └── favorite-films.tsx            # 🆕 NEW: Display favorite films grid

__tests__/
├── unit/
│   ├── profile-parser.test.ts        # 🆕 NEW: Parser tests
│   ├── profile-merge.test.ts         # 🆕 NEW: Merge tests
│   ├── profile-store.test.ts         # 🆕 NEW: Store tests
│   ├── profile-info.test.tsx         # 🆕 NEW: Component tests
│   └── favorite-films.test.tsx       # 🆕 NEW: Component tests
├── fixtures/
│   └── mock-csvs.ts                  # ✏️ UPDATE: Add profile mock data
└── e2e/
    └── profile-upload.spec.ts        # 🆕 NEW: E2E tests

.specify/app/
├── spec.md                           # Original MVP spec (unchanged)
├── plan.md                           # Original MVP plan (unchanged)
├── tasks.md                          # Original MVP tasks (unchanged)
└── profile-feature/                  # 🆕 NEW FEATURE DOCS
    ├── spec.md                       # This feature spec
    ├── plan.md                       # This feature plan
    ├── tasks.md                      # This feature tasks
    └── README.md                     # This file
```

**Legend**: 🆕 = Create new | ✏️ = Modify existing | (nothing) = No change

---

## Data Model Summary

### New Interfaces

```typescript
// User profile from CSV
interface UserProfile {
  username: string;                   // Required
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

// Individual favorite film
interface FavoriteFilm {
  uri: string;                        // https://boxd.it/XXXXX
  title?: string;                     // Resolved from watched movies
  rating?: number;                    // 0.5-5.0
  watched?: boolean;                  // Is it in watched list?
}

// Raw CSV row from Letterboxd export
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
  'Favorite Films': string;           // Comma-separated URLs
}
```

### Updated Interfaces

```typescript
// Add profile to dataset
interface MovieDataset {
  watched: Movie[];
  watchlist: Movie[] | null;
  userProfile?: UserProfile;          // ← NEW: Optional profile
  lastUpdated: Date;
  uploadedFiles: string[];
}

// Add profile type
type CSVType = 'watched' | 'diary' | 'ratings' | 'films' | 'watchlist' | 'profile' | 'unknown';
```

---

## Implementation Order

**Do NOT skip phases or reorder tasks** - dependencies are critical.

### ✅ Phase 1: Types (2-3 hours)
- [ ] T001: Add UserProfile, FavoriteFilm interfaces
- [ ] T002: Add profile utilities (parsing, validation, formatting)
- [ ] T003: Add mock profile CSV data to fixtures

**After Phase 1**: Compile TypeScript, verify no errors

### ✅ Phase 2: Parser (2-3 hours)
- [ ] T004: Implement parseProfileCSV()
- [ ] T005: Implement parseProfileFavoriteFilms()
- [ ] T006: Update detectCSVType() for profile
- [ ] T009 (part 1): Write parser unit tests

**After Phase 2**: Run `npm test -- profile-parser`, all pass

### ✅ Phase 3: Merge & Store (2-3 hours)
- [ ] T007: Update mergeMovieSources() with profile
- [ ] T008: Update Zustand store for profile
- [ ] T009 (part 2-3): Write merge & store tests

**After Phase 3**: Run `npm test -- profile-merge profile-store`, all pass

### ✅ Phase 4: UI Components (2-3 hours)
- [ ] T010: Create ProfileInfo component
- [ ] T011: Create FavoriteFilms component
- [ ] T012: Integrate into dashboard
- [ ] T015: Write component tests

**After Phase 4**: Run `npm test -- profile-info favorite-films`, all pass

### ✅ Phase 5: Upload Modal (1-2 hours)
- [ ] T013: Add profile section to modal
- [ ] T014: Add confirmation dialog

**After Phase 5**: Manual test upload flow

### ✅ Phase 6: E2E Tests (1 hour)
- [ ] T016: Write E2E test for full workflow

**After Phase 6**: Run `npm run e2e -- profile-upload`, all pass

### ✅ MVP Complete
- [ ] All 16 tasks done
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Responsive (375px, 768px, 1920px)
- [ ] Dark mode works
- [ ] Manual testing complete

---

## Quick Start

### 1. Read Documentation (30 min)
- [ ] Read `spec.md` - understand requirements
- [ ] Read `plan.md` - understand approach
- [ ] Read `tasks.md` - understand what to code

### 2. Start Coding (Phase 1)
- [ ] Open `tasks.md` to T001
- [ ] Follow the task description exactly
- [ ] Run tests after each task
- [ ] Mark complete when done

### 3. Move Through Phases
- One phase at a time
- Test after each phase
- Don't skip ahead
- Build regularly: `npm run build`

### 4. Verify MVP Complete
```bash
npm test              # All tests pass?
npm run build         # Build succeeds?
npm run dev           # Manual testing OK?
```

---

## Testing Throughout

### Unit Tests (as you code)
```bash
# After T001-T003:
npm test -- profile-utils

# After T004-T006:
npm test -- profile-parser

# After T007-T008:
npm test -- profile-merge profile-store
npm test -- profile-info favorite-films

# After T013-T014:
# Manual test the modal
```

### Full Test Suite
```bash
npm test              # All tests pass
npm run test:watch   # Watch mode for development
```

### E2E Tests
```bash
npm run e2e           # Run Playwright tests
npm run e2e:ui       # Run with UI
```

---

## Common Questions

### Q: Can I skip Phase X?
**A: No.** Each phase depends on previous ones. T001 types needed for T004 parser, etc.

### Q: What if a task is unclear?
**A: Check the detailed section in tasks.md** - each task has examples and code snippets.

### Q: How do I know if my implementation is right?
**A: Tests tell you.** Write tests first (TDD), code passes tests = correct implementation.

### Q: What about error handling?
**A: Each task includes error scenarios in Test Scenarios section.** Handle all of them.

### Q: How do I handle optional fields?
**A: Use `undefined` for missing optional fields.** Not `null`, not empty string.

### Q: Should profile and movies upload together?
**A: Yes, both in one upload flow.** They merge together into one dataset.

### Q: What if favorite film URL not in watched movies?
**A: Store it but warn user.** Still display in profile, flag as "Not watched yet".

### Q: Can user upload profile twice?
**A: Yes, with confirmation.** Second upload asks "Replace existing profile?" Cancel keeps old, Confirm replaces.

---

## Troubleshooting

### TypeScript Errors
- Make sure T001 types are correct first
- All new types must be exported from `types.ts`
- Run `npm run type-check` to verify

### Test Failures
- Check mock data in T003
- Ensure parseProfileCSV tests pass before moving on
- Run failed test individually: `npm test -- profile-parser`

### Components Not Displaying
- Check Zustand store has profile data
- Use React DevTools to inspect store state
- Verify ProfileInfo/FavoriteFilms components in dashboard

### localStorage Not Persisting
- Check Zustand persist middleware in T008
- Verify store has `persist()` wrapper
- Clear browser storage and try again

### Upload Modal Not Working
- Check FILE_TYPES mapping includes 'profile'
- Verify detectFileType() recognizes profile.csv
- Test with actual profile.csv file from mock folder

---

## Success Checklist

### Before Submitting PR:
- [ ] All 16 tasks completed
- [ ] All unit tests pass: `npm test`
- [ ] All E2E tests pass: `npm run e2e`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Responsive design verified (mobile/tablet/desktop)
- [ ] Dark mode verified
- [ ] Manual testing complete:
  - [ ] Upload profile with movies
  - [ ] See profile info on dashboard
  - [ ] See favorite films displayed
  - [ ] Replace profile with confirmation
  - [ ] Clear data (profile clears too)
  - [ ] localStorage persists profile

---

## File Sizes Estimate

| File | Size | Change |
|------|------|--------|
| `lib/types.ts` | +100 | Update |
| `lib/csv-parser.ts` | +150 | Update |
| `lib/data-merger.ts` | +50 | Update |
| `lib/utils.ts` | +80 | Update |
| `hooks/use-analytics-store.ts` | +100 | Update |
| `components/layout/upload-models.tsx` | +150 | Update |
| `components/analytics/profile-info.tsx` | +80 | New |
| `components/analytics/favorite-films.tsx` | +120 | New |
| **Tests** | +500 | New |
| **Total** | ~1,330 | Lines |

---

## Related Resources

### Original MVP Documentation
- `.specify/app/spec.md` - Original feature spec
- `.specify/app/plan.md` - Original implementation plan
- `.specify/app/tasks.md` - Original task breakdown
- `.specify/app/progress.md` - Original progress tracking

### Code References
- `lib/csv-parser.ts:39-79` - CSV type detection (reference for profile detection)
- `lib/data-merger.ts:1-50` - Movie merge logic (reference for profile merge)
- `hooks/use-analytics-store.ts:80-150` - Store structure (reference for profile state)
- `components/analytics/stats-overview.tsx` - Component pattern (reference for ProfileInfo)

---

## Next Steps

1. **Review the specification**: Read `spec.md` completely
2. **Understand the plan**: Read `plan.md` for approach
3. **Start coding**: Open `tasks.md`, start with T001
4. **Follow each task exactly**: Don't skip steps
5. **Test continuously**: Run tests after each task
6. **Ask questions**: If anything unclear, check the docs

---

**Good luck! You've got a solid plan. Execute it step by step and you'll have profile feature working in 1-2 days.** 🚀

---

**Created**: November 28, 2025
**Status**: Ready for Implementation
**Questions?** Refer to the detailed sections in `spec.md`, `plan.md`, or `tasks.md`

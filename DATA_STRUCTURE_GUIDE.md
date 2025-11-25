# Complete Data Guide: letterboxd-stats-client

## Overview

This document describes the complete data flow in the letterboxd-stats-client application, from CSV imports through analytics computation. It covers what data you receive, how it's processed, and what optional/required fields exist.

---

## CSV Sources: What You Import

Your app supports **5 CSV exports from Letterboxd**:

### 1. **watched.csv** (BASE/REQUIRED)

Minimal tracking of what you've seen.

**Example:**
```csv
Date,Name,Year,Letterboxd URI
2022-01-20,Inception,2010,https://boxd.it/1skk
2022-01-20,The Dark Knight,2008,https://boxd.it/2b0k
```

**Columns:**
- **Date**: When added to watched list
- **Name**: Movie title ✓ **REQUIRED**
- **Year**: Release year ✓ **REQUIRED**
- **Letterboxd URI**: Unique ID ✓ **REQUIRED** (used as primary key)

---

### 2. **diary.csv** (MOST COMPLETE)

Full viewing history with ratings and notes.

**Example:**
```csv
Date,Name,Year,Letterboxd URI,Rating,Rewatch,Tags,Watched Date
2025-11-12,Groundhog Day,1993,https://boxd.it/bGd2fp,5,,,2021-01-02
2025-11-12,Rookies Go to War,1974,https://boxd.it/bGf6PP,4,,,2021-01-05
2025-11-12,Rookies Run Amok,1971,https://boxd.it/bGf77J,4,Yes,,2021-01-05
2025-11-12,The Platform,2019,https://boxd.it/bGd1zt,4,,,2021-01-08
2025-11-12,How to Pull Out a Whale's Tooth,1977,https://boxd.it/bGf7wT,,,,2021-02-06
```

**Base Columns (required):**
- **Date**: When exported/modified
- **Name**: Movie title
- **Year**: Release year
- **Letterboxd URI**: Unique ID

**Extra Columns (all optional):**
- **Rating** (OPTIONAL): `0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0` or empty
- **Rewatch** (OPTIONAL): `"Yes"` or empty
- **Tags** (OPTIONAL): Comma-separated string or empty
- **Watched Date** (OPTIONAL): When you actually watched it (YYYY-MM-DD) or empty

---

### 3. **ratings.csv** (CURRENT RATINGS)

Your most up-to-date ratings - **overrides diary.csv ratings**.

**Structure:**
```csv
Date,Name,Year,Letterboxd URI,Rating
(same as watched.csv)    (same)    (same)    (same)    (0.5-5.0)
```

**Key Difference:**
- Has a **Rating** column that is **NEVER empty** (always 0.5-5.0)
- **Priority**: `ratings.csv` > `diary.csv` (always uses most recent rating)

---

### 4. **films.csv** (LIKED MOVIES)

Movies you marked with a heart ❤️.

**Structure:**
```csv
Date,Name,Year,Letterboxd URI
(same structure as watched.csv)
```

**Purpose:**
- No extra columns
- Used to flag `liked: true` on matching movies

---

### 5. **watchlist.csv** (UNWATCHED)

Movies you want to watch.

**Structure:**
```csv
Date,Name,Year,Letterboxd URI
(same structure as watched.csv)
```

**Key Points:**
- Stored separately in `MovieDataset.watchlist[]`
- Not included in main analytics calculations
- Kept for future reference

---

## Processed Data Structure: What You Work With

### **Movie Interface** (after parsing + merging)

This is the unified data structure created after parsing and merging all CSV sources.

```typescript
interface Movie {
  // ===== REQUIRED FIELDS (always present) =====
  id: string
    // Letterboxd URI (e.g., https://boxd.it/XXX)
    // Unique identifier across all movies
    // Source: Any CSV (Letterboxd URI column)

  title: string
    // Movie title
    // Source: Name column from CSV

  year: number
    // Release year as number
    // Source: Year column from CSV
    // Converted from string to number

  dateMarkedWatched: Date
    // When added to watched list
    // Source: Date column from watched.csv (or diary.csv Date)
    // In ISO format: YYYY-MM-DD

  rewatch: boolean
    // Whether movie was watched multiple times
    // Source: Rewatch column from diary.csv ("Yes" = true, empty = false)
    // Always false if no diary data

  decade: number
    // Computed from year: 1990, 2000, 2010, 2020, etc.
    // Calculated by: Math.floor(year / 10) * 10

  era: 'classic' | 'golden' | 'modern' | 'contemporary'
    // Computed era classification:
    // - 'classic': year <= 1945
    // - 'golden': 1945 < year <= 1970
    // - 'modern': 1970 < year <= 2000
    // - 'contemporary': year > 2000

  // ===== OPTIONAL FIELDS (may not exist) =====
  watchedDate?: Date
    // When you actually watched the movie
    // Source: Watched Date column from diary.csv
    // May differ from dateMarkedWatched
    // undefined if not in diary

  rating?: number
    // Your rating: 0.5, 1.0, 1.5, ... 5.0
    // Source: Rating column from ratings.csv OR diary.csv
    // Priority: ratings.csv > diary.csv
    // undefined if not rated

  ratingDate?: Date
    // When you rated the movie
    // Source: Date column from ratings.csv
    // undefined if not rated

  rewatchCount?: number
    // Number of times rewatched
    // Source: Count of diary entries for same movie
    // undefined if rewatch === false

  rewatchDates?: Date[]
    // All dates when rewatches occurred
    // Source: Watched Date from each diary entry
    // undefined if rewatch === false

  tags?: string[]
    // Your personal tags
    // Source: Tags column from diary.csv (comma-separated)
    // Parsed into array: "Drama,Favorites" => ["Drama", "Favorites"]
    // undefined if no tags

  liked?: boolean
    // Whether in films.csv (marked with heart)
    // Source: films.csv lookup by URI
    // undefined or false if not liked
}
```

**Summary of Fields:**
- ✓ **6 Required fields**: `id`, `title`, `year`, `dateMarkedWatched`, `rewatch`, `decade`, `era`
- ✓ **8 Optional fields**: `watchedDate`, `rating`, `ratingDate`, `rewatchCount`, `rewatchDates`, `tags`, `liked`

---

### **MovieDataset Wrapper**

Container for all processed movies from your Letterboxd exports.

```typescript
interface MovieDataset {
  watched: Movie[]
    // All watched movies
    // This is your primary analytics dataset
    // Used for all dashboard calculations

  watchlist: Movie[]
    // Unwatched movies from watchlist.csv
    // Stored separately
    // Not included in analytics

  lastUpdated: Date
    // When dataset was last processed
    // Updated every time you upload new CSVs

  uploadedFiles: string[]
    // Which CSV types have been uploaded
    // Example: ['watched', 'diary', 'ratings', 'films']
    // Helps track data completeness
}
```

---

### **AnalyticsOverview** (computed statistics from movies)

This object contains all pre-computed statistics displayed in your dashboard.

```typescript
interface AnalyticsOverview {
  // ===== BASIC COUNTS =====
  totalMoviesWatched: number
    // Length of watched array
    // Primary count used everywhere

  moviesRated: number
    // Count of movies where rating !== undefined
    // Only movies with explicit ratings

  moviesLiked: number
    // Count of movies where liked === true
    // Only movies in films.csv

  // ===== PERCENTAGES =====
  ratingCoverage: number
    // (moviesRated / totalMoviesWatched) * 100
    // What % of your movies have ratings?

  likeRatio: number
    // (moviesLiked / totalMoviesWatched) * 100
    // What % of your movies do you like?

  rewatchRate: number
    // (moviesRewatched / totalMoviesWatched) * 100
    // What % of movies did you rewatch?

  // ===== RATING STATISTICS =====
  averageRating: number
    // Mean of all rating values
    // Only includes movies with ratings
    // Example: 3.8

  medianRating: number
    // Median (middle value) of all ratings
    // Less affected by outliers than average

  ratingDistribution: Record<string, number>
    // How many movies for each rating
    // Example:
    // {
    //   "0.5": 2,
    //   "1.0": 5,
    //   "1.5": 8,
    //   "2.0": 12,
    //   "2.5": 18,
    //   "3.0": 25,
    //   "3.5": 32,
    //   "4.0": 45,
    //   "4.5": 38,
    //   "5.0": 52
    // }

  // ===== REWATCH STATISTICS =====
  totalRewatches: number
    // Sum of all rewatchCount values
    // Example: If movie A rewatched 2x, movie B 3x
    //          totalRewatches = 5

  moviesRewatched: number
    // Count of movies where rewatch === true
    // How many unique movies were rewatched?

  // ===== TIME STATISTICS (OPTIONAL) =====
  earliestWatchDate?: Date
    // Oldest movie in your watched list
    // Earliest watchedDate or dateMarkedWatched

  latestWatchDate?: Date
    // Most recent movie in your watched list
    // Latest watchedDate or dateMarkedWatched

  trackingSpan?: number
    // Days between earliest and latest watch
    // How long have you been tracking?

  // ===== BREAKDOWNS BY TIME PERIOD =====
  decadeBreakdown: Record<string, number>
    // Movies grouped by decade
    // Example:
    // {
    //   "1990": 18,
    //   "2000": 42,
    //   "2010": 87,
    //   "2020": 34
    // }

  yearlyWatching: Record<string, number>
    // Movies watched per year
    // Example:
    // {
    //   "2021": 45,
    //   "2022": 67,
    //   "2023": 89,
    //   "2024": 34
    // }
}
```

---

## Data Flow in Your App

Complete pipeline from CSV upload to rendered charts:

```
┌─────────────────────────────────────────────────────────────┐
│              CSV FILES (from Letterboxd export)             │
│                                                              │
│  watched.csv  diary.csv  ratings.csv  films.csv  watchlist  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  CSV Parser & Validator      │
            │  (lib/csv-parser.ts)         │
            │                              │
            │  - Detect CSV type by cols   │
            │  - Validate required fields  │
            │  - Parse each row to object  │
            │  - Type conversion (str→num) │
            └──────────────┬───────────────┘
                           │
                           ▼
         ┌─────────────────────────────────────┐
         │  5 Separate Movie[] Arrays          │
         │                                     │
         │  - watchedMovies[]                  │
         │  - diaryMovies[]                    │
         │  - ratedMovies[]                    │
         │  - likedMovies[]                    │
         │  - watchlistMovies[]                │
         └──────────────┬──────────────────────┘
                        │
                        ▼
          ┌─────────────────────────────────┐
          │  Data Merger                    │
          │  (lib/data-merger.ts)           │
          │                                 │
          │  - Deduplicate by URI           │
          │  - Apply merge priority rules   │
          │  - Aggregate rewatches          │
          │  - Compute derived fields       │
          │  - Validate integrity           │
          └──────────────┬──────────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │  Unified MovieDataset    │
            │                          │
            │  watched: Movie[]        │
            │  watchlist: Movie[]      │
            │  uploadedFiles: str[]    │
            └──────────────┬───────────┘
                           │
                           ▼
              ┌─────────────────────────────┐
              │  Analytics Engine           │
              │  (lib/analytics-engine.ts)  │
              │                             │
              │  - Compute all statistics   │
              │  - Generate distributions   │
              │  - Calculate breakdowns     │
              │  - Derive percentages       │
              └──────────────┬──────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │  AnalyticsOverview Object  │
                │                            │
                │  - Counts (9 different)    │
                │  - Distributions           │
                │  - Time-based breakdowns   │
                │  - Percentages             │
                └──────────────┬─────────────┘
                               │
                               ▼
                 ┌──────────────────────────┐
                 │  Zustand Store (Redux)   │
                 │  (hooks/use-analytics)   │
                 │                          │
                 │  - Persists to storage   │
                 │  - Serves to components  │
                 │  - Manages loading state │
                 └──────────────┬───────────┘
                                │
                                ▼
                   ┌────────────────────────────┐
                   │  7 Chart Components        │
                   │  & Dashboard Pages         │
                   │                            │
                   │  - DiaryStatistics         │
                   │  - DiaryAreaChart          │
                   │  - DiaryMonthlyRadarChart  │
                   │  - GenreDistribution       │
                   │  - RatingDistribution      │
                   │  - ReleasedYearAnalysis    │
                   │  - ViewingOverTime         │
                   └────────────────────────────┘
```

---

## Key Merge Rules

When you upload **multiple CSVs**, conflicts are resolved using a **priority system**:

```
ratings.csv  >  diary.csv  >  watched.csv  >  films.csv
     ↓            ↓             ↓              ↓
  Rating      Rating       Watched Date    Liked Flag
(most       (fairly         (basic          (heart)
 recent)   complete)      tracking)
```

**Example Scenario:**

Movie appears in multiple CSVs with different ratings:
```
diary.csv:   Groundhog Day - Rating: 4.0
ratings.csv: Groundhog Day - Rating: 4.5
```

**Result:** Final movie object uses `rating: 4.5` (from ratings.csv, highest priority)

---

## CSV Fields by Source Matrix

Which fields are required or optional for each CSV type:

| Field | watched.csv | diary.csv | ratings.csv | films.csv | watchlist.csv |
|-------|:-:|:-:|:-:|:-:|:-:|
| **Date** | ✓ Req | ✓ Req | ✓ Req | ✓ Req | ✓ Req |
| **Name** | ✓ Req | ✓ Req | ✓ Req | ✓ Req | ✓ Req |
| **Year** | ✓ Req | ✓ Req | ✓ Req | ✓ Req | ✓ Req |
| **Letterboxd URI** | ✓ Req | ✓ Req | ✓ Req | ✓ Req | ✓ Req |
| **Rating** | — | ✓ Opt | ✓ Req | — | — |
| **Rewatch** | — | ✓ Opt | — | — | — |
| **Tags** | — | ✓ Opt | — | — | — |
| **Watched Date** | — | ✓ Opt | — | — | — |

**Legend:**
- ✓ Req = Required (always present)
- ✓ Opt = Optional (may be empty)
- — = Not applicable for this CSV type

---

## Real Example: Single Movie Through Pipeline

### Input: diary.csv row

```csv
2025-11-12,Groundhog Day,1993,https://boxd.it/bGd2fp,5,,,2021-01-02
```

### Step 1: CSV Parser

Parsed into typed object:
```javascript
{
  Date: "2025-11-12",
  Name: "Groundhog Day",
  Year: "1993",
  "Letterboxd URI": "https://boxd.it/bGd2fp",
  Rating: "5",
  Rewatch: "",
  Tags: "",
  "Watched Date": "2021-01-02"
}
```

### Step 2: Type Conversion & Object Creation

Converted to Movie object:
```javascript
{
  // REQUIRED FIELDS
  id: "https://boxd.it/bGd2fp",           // From URI column
  title: "Groundhog Day",                 // From Name column
  year: 1993,                             // From Year (converted to number)
  dateMarkedWatched: Date(2025-11-12),    // From Date column
  rewatch: false,                         // From Rewatch (empty → false)
  decade: 1990,                           // Computed: Math.floor(1993/10)*10
  era: "modern",                          // Computed: 1993 > 1970

  // OPTIONAL FIELDS
  watchedDate: Date(2021-01-02),          // From "Watched Date" column
  rating: 5,                              // From Rating column (parsed as number)
  ratingDate: undefined,                  // Only if from ratings.csv
  rewatchCount: undefined,                // Only if rewatch===true
  rewatchDates: undefined,                // Only if multiple diary entries
  tags: [],                               // From Tags (empty array)
  liked: false,                           // Only true if in films.csv
}
```

### Step 3: Analytics Computation

Movie contributes to:
```javascript
{
  // Counts
  totalMoviesWatched: +1        // Included in total
  moviesRated: +1               // Has rating field

  // Ratings
  averageRating: +5.0           // Contributes 5.0 to average
  ratingDistribution["5"]: +1   // Incremented

  // Time
  latestWatchDate: 2021-01-02   // If most recent
  yearlyWatching["2021"]: +1    // Watched in 2021
  decadeBreakdown["1990"]: +1   // Released in 1990s

  // Percentages
  ratingCoverage: (moviesRated/total)*100
  averageRating: sum/moviesRated
}
```

---

## Storage & Persistence

### Local Storage

Data is persisted using browser localStorage:
- **Key**: `letterboxd-analytics-store`
- **Format**: JSON serialized MovieDataset + AnalyticsOverview
- **Size limit**: ~5-10MB depending on browser
- **Persistence**: Survives page refresh, tabs, browser restart

### Data Cleanup

Old data is cleared when:
- User clicks "Clear Data" button
- Browser storage is cleared
- localStorage quota exceeded

---

## Error Handling

### CSV Validation Errors

Checked during parsing:
- Missing required columns (Name, Year, URI)
- Invalid date format (expects YYYY-MM-DD)
- Invalid year (not a number)
- Invalid rating (not 0.5-5.0)

### Data Merge Errors

Detected during merge:
- Duplicate movies with conflicting data
- Missing Letterboxd URI (primary key)
- Invalid date values

### Analytics Computation Errors

Safeguards:
- Division by zero (when no ratings exist)
- Empty arrays (when no data uploaded)
- Invalid decade values

---

## Best Practices

### For CSV Exports

1. **Always export watched.csv** - This is your base dataset
2. **Export diary.csv** - Provides watch dates and tags
3. **Export ratings.csv** - Your most current ratings
4. **Export films.csv** - Your liked movies
5. **Optional: watchlist.csv** - For tracking unwatched movies

### For Data Quality

1. **Keep Letterboxd URI intact** - Don't edit exported CSVs manually
2. **Use consistent dates** - Use YYYY-MM-DD format
3. **Update ratings.csv regularly** - For accurate current ratings
4. **Use diary entries** - For more detailed tracking

### For Analytics

1. **Export all CSVs together** - Ensures complete data merge
2. **Re-export after major changes** - When you rate/tag many movies
3. **Check lastUpdated** - Know when your data was last processed

---

## Troubleshooting

### No data appears
- Check if CSV was uploaded (check uploadedFiles array)
- Verify CSV has correct columns (Date, Name, Year, Letterboxd URI)
- Check browser console for parsing errors

### Ratings missing
- Verify rating values are 0.5-5.0
- Check ratings.csv has Rating column
- Ensure no typos in rating values

### Wrong merge results
- Check merge priority (ratings.csv > diary.csv)
- Verify Letterboxd URIs match exactly
- Check for duplicate entries in source CSVs

### Storage issues
- Clear browser cache if data won't load
- Check localStorage quota (try clearing other sites' data)
- Re-upload CSVs if data becomes corrupted

---

## File References

Key implementation files in the codebase:

- **Type Definitions**: `lib/types.ts`
- **CSV Parsing**: `lib/csv-parser.ts`
- **Data Merging**: `lib/data-merger.ts`
- **Analytics Computation**: `lib/analytics-engine.ts`
- **State Management**: `hooks/use-analytics-store.ts`
- **Utilities**: `lib/utils.ts`
- **Mock Data**: `mock/*.csv`
- **Tests**: `__tests__/` directory

---

## Summary

**letterboxd-stats-client** processes Letterboxd CSV exports through a sophisticated pipeline:

1. **Parses** 5 different CSV types with smart type detection
2. **Validates** required fields and data integrity
3. **Merges** data from multiple sources using priority rules
4. **Enriches** with computed fields (decade, era, etc.)
5. **Computes** comprehensive analytics and statistics
6. **Persists** to localStorage for offline access
7. **Serves** data to interactive chart components
8. **Displays** insights through responsive dashboard

The data structure supports optional fields while maintaining data integrity, allowing graceful handling of incomplete exports while still providing rich analytics when complete data is available.

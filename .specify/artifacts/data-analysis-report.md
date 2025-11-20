# Data Analysis & Processing Architecture Report

**Date:** November 20, 2025
**Status:** Design Phase - Data Flow Analysis
**Purpose:** Define CSV structure, data transformations, and final data model

---

## 1. CSV Files Structure Analysis

### 1.1 File Necessity Hierarchy

```
MANDATORY (User must upload):
├── watched.csv          ← Base dataset (all movies watched)

OPTIONAL (Enriches watched.csv):
├── diary.csv           ← Viewing history with ratings & rewatches
├── ratings.csv         ← Most current ratings (overrides diary ratings)
├── films.csv           ← Liked movies
└── watchlist.csv       ← Movies to watch (not yet watched)
```

**Key Principle:** `watched.csv` is the canonical source of truth. All other files add metadata to it.

---

## 2. Individual CSV File Specifications

### 2.1 watched.csv (MANDATORY)

**Purpose:** Complete list of all movies the user has watched
**Row Count:** Typically 500-2000+ entries
**Use:** Base dataset - every movie here is definitely watched

#### Structure:
| Column | Type | Example | Notes |
|--------|------|---------|-------|
| **Date** | YYYY-MM-DD | 2022-01-20 | Date marked as watched on Letterboxd |
| **Name** | String | "Inception" | Movie title |
| **Year** | Integer | 2010 | Release year |
| **Letterboxd URI** | URL Slug | https://boxd.it/1skk | **UNIQUE IDENTIFIER** |

#### Sample Data:
```csv
Date,Name,Year,Letterboxd URI
2022-01-20,Inception,2010,https://boxd.it/1skk
2022-01-20,The Dark Knight,2008,https://boxd.it/2b0k
2022-01-20,The Prestige,2006,https://boxd.it/293w
```

#### Key Insights:
- **Letterboxd URI is the canonical ID** - Same movie may appear with different title capitalizations or year variations
- Multiple entries on same date are possible (batch imports)
- No rating or watch date information in this file - it only records "watched"
- No indication of rewatches in this file

---

### 2.2 diary.csv (OPTIONAL - Most Valuable)

**Purpose:** Detailed viewing log with timestamps, ratings, and rewatch tracking
**Row Count:** Typically 400-600 entries (less than watched.csv - only rated/logged entries)
**Use:** Primary source for ratings, watch dates, rewatches, and tags

#### Structure:
| Column | Type | Example | Nullability | Notes |
|--------|------|---------|-------------|-------|
| **Date** | YYYY-MM-DD | 2025-11-12 | Never null | When logged on Letterboxd (ignore for analytics) |
| **Name** | String | "Groundhog Day" | Never null | Movie title |
| **Year** | Integer | 1993 | Never null | Release year |
| **Letterboxd URI** | URL Slug | https://boxd.it/bGd2fp | Never null | **UNIQUE ID** |
| **Rating** | Decimal 0.5-5.0 | 5 or 3.5 | **CAN BE EMPTY** | User's rating at time of watch |
| **Rewatch** | "Yes" or empty | "Yes" | **CAN BE EMPTY** | Indicates second/third/nth viewing |
| **Tags** | Comma-separated | "action,thriller" | **CAN BE EMPTY** | Custom user tags |
| **Watched Date** | YYYY-MM-DD | 2021-01-02 | **CAN BE EMPTY** | Actual date movie was watched |

#### Sample Data:
```csv
Date,Name,Year,Letterboxd URI,Rating,Rewatch,Tags,Watched Date
2025-11-12,Groundhog Day,1993,https://boxd.it/bGd2fp,5,,,2021-01-02
2025-11-12,Rookies Run Amok,1971,https://boxd.it/bGf77J,4,Yes,,2021-01-05
2025-11-12,The Platform,2019,https://boxd.it/bGd1zt,4,,,2021-01-08
2025-11-12,How to Pull Out a Whale's Tooth,1977,https://boxd.it/bGf7wT,,,,2021-02-06
```

#### Critical Insights:
- **Can have multiple entries for same movie** if watched multiple times (Rewatch="Yes")
- **Watched Date can be null** - Some entries only logged without recording actual watch date
- **Rating can be null** - Some movies watched but not rated
- **Tags are optional** - May be empty
- **Rewatch="Yes" indicates a repeat viewing** (second, third, nth watch)
- **Most authoritative source for:** watch dates, ratings at time of watch, rewatch info
- Row count ≤ watched.csv because not all watched movies are logged in diary

---

### 2.3 ratings.csv (OPTIONAL - Rating Override)

**Purpose:** All ratings the user has made - MOST CURRENT VERSION
**Row Count:** Typically 500-1500 entries
**Use:** Override/supplement diary ratings with most recent ratings

#### Structure:
| Column | Type | Example | Nullability | Notes |
|--------|------|---------|-------------|-------|
| **Date** | YYYY-MM-DD | 2022-01-20 | Never null | When rating was made |
| **Name** | String | "The Father" | Never null | Movie title |
| **Year** | Integer | 2020 | Never null | Release year |
| **Letterboxd URI** | URL Slug | https://boxd.it/m8Ie | Never null | **UNIQUE ID** |
| **Rating** | Decimal 0.5-5.0 | 5 or 3.5 | Never null | User's current rating |

#### Sample Data:
```csv
Date,Name,Year,Letterboxd URI,Rating
2022-01-20,The Father,2020,https://boxd.it/m8Ie,5
2022-01-20,Inception,2010,https://boxd.it/1skk,5
2022-01-21,Once Upon a Time in the West,1968,https://boxd.it/2az4,5
2022-01-26,Lore,2012,https://boxd.it/41Cs,3.5
```

#### Critical Insights:
- **No watch dates** - Only when rating was recorded
- **No rewatch info** - Can't distinguish between first and repeated viewings
- **ALL ratings are populated** (never null)
- **Most recent ratings** - If same movie appears in diary AND ratings.csv, use ratings.csv value
- Can contain half-star ratings (3.5, 4.5, etc.)
- May include movies NOT in watched.csv (user rated something they marked as unwatched)

---

### 2.4 films.csv (OPTIONAL - Liked Movies)

**Purpose:** List of movies the user marked as "liked" on Letterboxd
**Row Count:** Typically 100-300 entries
**Use:** Optional - indicates movies with high affinity

#### Structure:
| Column | Type | Example | Notes |
|--------|------|---------|-------|
| **Date** | YYYY-MM-DD | 2022-01-20 | When added as liked |
| **Name** | String | "The Father" | Movie title |
| **Year** | Integer | 2020 | Release year |
| **Letterboxd URI** | URL Slug | https://boxd.it/m8Ie | **UNIQUE ID** |

#### Sample Data:
```csv
Date,Name,Year,Letterboxd URI
2022-01-20,The Father,2020,https://boxd.it/m8Ie
2022-01-20,Another Round,2020,https://boxd.it/lkba
2022-01-20,Groundhog Day,1993,https://boxd.it/2b3e
```

#### Critical Insights:
- **Subset of watched.csv** - Only movies already watched
- **No rating info** - "Like" is separate from rating
- **No watch dates** - Just the "liked" date
- **Optional enrichment** - Can add "liked" flag to movies for potential future analysis

---

### 2.5 watchlist.csv (OPTIONAL - To Watch)

**Purpose:** Movies user wants to watch but hasn't yet
**Row Count:** Typically 10-100 entries
**Use:** Separate dataset - NOT part of watched movies

#### Structure:
| Column | Type | Example | Notes |
|--------|------|---------|-------|
| **Date** | YYYY-MM-DD | 2025-09-22 | When added to watchlist |
| **Name** | String | "Donnie Brasco" | Movie title |
| **Year** | Integer | 1997 | Release year |
| **Letterboxd URI** | URL Slug | https://boxd.it/1YRA | **UNIQUE ID** |

#### Sample Data:
```csv
Date,Name,Year,Letterboxd URI
2025-09-22,Donnie Brasco,1997,https://boxd.it/1YRA
2025-09-22,The Unbearable Lightness of Being,1988,https://boxd.it/1VKc
2025-09-22,Martyrs,2008,https://boxd.it/1Yqu
```

#### Critical Insights:
- **MUST NOT appear in watched.csv** if accurate - These are unwatched
- **Separate from analytics** - Don't include in "movies watched" stats
- **Can be used for future metrics** - "Watchlist completion rate" or progress tracking
- Optional for MVP - Not needed for core analytics

---

## 3. Data Merge Strategy

### 3.1 Processing Pipeline

```
User Uploads CSVs
    ↓
Validate (watched.csv is mandatory)
    ↓
Parse all files individually
    ↓
Build canonical Movie dataset:
    1. Start with watched.csv (base)
    2. Enrich with diary.csv (ratings, watch dates, rewatches, tags)
    3. Override ratings with ratings.csv (most current)
    4. Add "liked" flag from films.csv
    5. Keep watchlist.csv separate
    ↓
Deduplicate by Letterboxd URI
    ↓
Normalize data (dates, ratings, etc.)
    ↓
Store in Zustand + localStorage
    ↓
Compute analytics from merged Movie[]
```

### 3.2 Merge Priority & Conflict Resolution

**Source Priority (Highest to Lowest):**
```
ratings.csv > diary.csv > watched.csv > films.csv
```

**Resolution Rules by Field:**

| Field | Source Priority | Conflict Handling |
|-------|---|---|
| **id (Letterboxd URI)** | watched.csv | Must match for merge |
| **title (Name)** | diary.csv > watched.csv | Use from diary if available, else watched |
| **year** | diary.csv > watched.csv | Use from diary if available, else watched |
| **rating** | ratings.csv > diary.csv | Use ratings.csv if exists, else diary |
| **watchedDate** | diary.csv > watched.csv | Use from diary if available, else watched.Date |
| **rewatch** | diary.csv | Only source with this info |
| **tags** | diary.csv | Only source with this info |
| **liked** | films.csv | Boolean flag if exists in films.csv |

### 3.3 Multiple Diary Entries (Rewatches)

**Key Issue:** Same movie may appear multiple times in diary.csv with Rewatch="Yes"

#### Options:
```
OPTION A: Store as separate entries
  Movie {
    id: "https://boxd.it/bGd2fp",
    title: "Groundhog Day",
    watches: [
      { date: "2021-01-02", rating: 5, rewatch: false },
      { date: "2021-03-15", rating: 5, rewatch: true },
      { date: "2022-01-10", rating: 5, rewatch: true }
    ]
  }

OPTION B: Aggregate into single entry
  Movie {
    id: "https://boxd.it/bGd2fp",
    title: "Groundhog Day",
    watchedDate: "2021-01-02",  // First watch
    rating: 5,
    rewatchCount: 2,
    allWatchDates: ["2021-01-02", "2021-03-15", "2022-01-10"],
    rewatch: true  // Indicates has been rewatched
  }

OPTION C: Single primary + metadata
  Movie {
    id: "https://boxd.it/bGd2fp",
    title: "Groundhog Day",
    watchedDate: "2021-01-02",  // First watch
    rating: 5,
    rewatch: true,              // Indicates rewatched at least once
    rewatchDates: ["2021-03-15", "2022-01-10"]
  }
```

**Recommendation:** Use **Option C** for MVP - Simple, clean, analytics-ready.

---

## 4. Final Data Model (TypeScript Schema)

### 4.1 Core Movie Interface

```typescript
interface Movie {
  // Core identifiers
  id: string;                      // Letterboxd URI (https://boxd.it/XXX)
  title: string;                   // Movie title
  year: number;                    // Release year

  // Viewing information (from watched.csv as base)
  watchedDate?: Date;              // First time watched (from diary if available, else watched.csv date)
  dateMarkedWatched: Date;         // Date added to watched list (from watched.csv)

  // Rating information
  rating?: number;                 // Current rating 0.5-5.0 (from ratings.csv > diary.csv)
  ratingDate?: Date;               // When rating was made (from ratings.csv or diary date)

  // Rewatch information
  rewatch: boolean;                // true if watched multiple times
  rewatchCount?: number;           // Number of times rewatched (if > 1)
  rewatchDates?: Date[];           // Dates of rewatches (from diary)

  // Optional enrichment
  tags?: string[];                 // User tags (from diary)
  liked?: boolean;                 // true if in films.csv (liked)

  // Computed fields
  decade: number;                  // 1990, 2000, 2010, etc.
  era: 'classic' | 'golden' | 'modern' | 'contemporary'; // Era classification
}

interface MovieDataset {
  // Watched movies (primary analytics dataset)
  watched: Movie[];

  // Unwatched movies (separate)
  watchlist: Movie[];

  // Metadata
  lastUpdated: Date;
  uploadedFiles: string[];         // Which CSVs were uploaded
}
```

### 4.2 CSV Row Types (Before Merge)

```typescript
interface WatchedCSVRow {
  Date: string;                    // YYYY-MM-DD
  Name: string;
  Year: string;                    // Convert to number
  'Letterboxd URI': string;
}

interface DiaryCSVRow {
  Date: string;                    // YYYY-MM-DD (when logged)
  Name: string;
  Year: string;
  'Letterboxd URI': string;
  Rating: string;                  // Empty or "0.5"-"5.0"
  Rewatch: string;                 // "Yes" or empty
  Tags: string;                    // Comma-separated or empty
  'Watched Date': string;          // YYYY-MM-DD or empty
}

interface RatingsCSVRow {
  Date: string;                    // YYYY-MM-DD
  Name: string;
  Year: string;
  'Letterboxd URI': string;
  Rating: string;                  // "0.5"-"5.0"
}

interface FilmsCSVRow {
  Date: string;                    // YYYY-MM-DD
  Name: string;
  Year: string;
  'Letterboxd URI': string;
}

interface WatchlistCSVRow {
  Date: string;                    // YYYY-MM-DD
  Name: string;
  Year: string;
  'Letterboxd URI': string;
}
```

---

## 5. Processing Algorithm

### 5.1 Step-by-Step Merge Algorithm

```typescript
/**
 * Main merge algorithm
 */
function mergeCSVData(
  watched: WatchedCSVRow[],
  diary?: DiaryCSVRow[],
  ratings?: RatingsCSVRow[],
  films?: FilmsCSVRow[],
  watchlist?: WatchlistCSVRow[]
): MovieDataset {

  // Step 1: Initialize from watched.csv (mandatory)
  const movieMap = new Map<string, Movie>();

  watched.forEach(row => {
    movieMap.set(row['Letterboxd URI'], {
      id: row['Letterboxd URI'],
      title: row.Name,
      year: parseInt(row.Year),
      dateMarkedWatched: parseDate(row.Date),
      rewatch: false,
      decade: Math.floor(parseInt(row.Year) / 10) * 10,
      era: classifyEra(parseInt(row.Year))
    });
  });

  // Step 2: Enrich with diary.csv
  if (diary) {
    // Group by URI to handle rewatches
    const diaryByUri = groupBy(diary, 'Letterboxd URI');

    diaryByUri.forEach((entries, uri) => {
      const movie = movieMap.get(uri) || {
        id: uri,
        title: entries[0].Name,
        year: parseInt(entries[0].Year),
        dateMarkedWatched: new Date(), // Fallback
        rewatch: false
      };

      // First entry (primary)
      const firstEntry = entries[0];
      if (firstEntry['Watched Date']) {
        movie.watchedDate = parseDate(firstEntry['Watched Date']);
      }
      if (firstEntry.Rating) {
        movie.rating = parseFloat(firstEntry.Rating);
        movie.ratingDate = parseDate(firstEntry.Date);
      }
      if (firstEntry.Tags) {
        movie.tags = firstEntry.Tags.split(',').map(t => t.trim());
      }

      // Handle rewatches
      if (entries.length > 1) {
        movie.rewatch = true;
        movie.rewatchCount = entries.length - 1;
        movie.rewatchDates = entries.slice(1)
          .map(e => parseDate(e['Watched Date']))
          .filter(d => d !== null);
      }

      movieMap.set(uri, movie);
    });
  }

  // Step 3: Override with ratings.csv (most current)
  if (ratings) {
    ratings.forEach(row => {
      const movie = movieMap.get(row['Letterboxd URI']);
      if (movie) {
        movie.rating = parseFloat(row.Rating);
        movie.ratingDate = parseDate(row.Date);
      }
    });
  }

  // Step 4: Add liked flag from films.csv
  if (films) {
    films.forEach(row => {
      const movie = movieMap.get(row['Letterboxd URI']);
      if (movie) {
        movie.liked = true;
      }
    });
  }

  // Step 5: Process watchlist separately
  const watchlistMovies = (watchlist || []).map(row => ({
    id: row['Letterboxd URI'],
    title: row.Name,
    year: parseInt(row.Year),
    dateMarkedWatched: parseDate(row.Date),
    rewatch: false,
    decade: Math.floor(parseInt(row.Year) / 10) * 10,
    era: classifyEra(parseInt(row.Year))
  }));

  return {
    watched: Array.from(movieMap.values()),
    watchlist: watchlistMovies,
    lastUpdated: new Date(),
    uploadedFiles: [
      'watched.csv',
      ...(diary ? ['diary.csv'] : []),
      ...(ratings ? ['ratings.csv'] : []),
      ...(films ? ['films.csv'] : []),
      ...(watchlist ? ['watchlist.csv'] : [])
    ]
  };
}
```

---

## 6. Data Quality & Edge Cases

### 6.1 Potential Issues & Handling

| Issue | Example | Solution |
|-------|---------|----------|
| **Duplicate URIs with different data** | Same movie, different year in different CSVs | Use URI as key, diary.csv year wins |
| **Empty ratings in diary** | Movie watched but not rated | Set rating to undefined, exclude from rating stats |
| **Missing watched dates** | Entry in diary without actual date | Use watched.csv date as fallback |
| **Watched date in future** | Data entry error | Warn user, use as-is or exclude |
| **Rating outside 0.5-5.0** | Invalid data | Validate and reject with error |
| **Multiple entries same date** | Batch import same day | Acceptable, process normally |
| **Movie in diary not in watched** | Data inconsistency | Add to watched dataset automatically |
| **Movie in ratings not in watched** | Rated but not marked watched | Optional: Include or exclude (decide) |
| **Blank rows or malformed CSV** | CSV parsing errors | Skip row, log warning, continue |

### 6.2 Validation Rules

```typescript
interface ValidationError {
  row: number;
  file: string;
  field: string;
  value: string;
  error: string;
}

// Validation checks per file:

// watched.csv
- Date: Must be valid ISO date
- Name: Must not be empty
- Year: Must be integer 1890-2025
- URI: Must be valid Letterboxd URL

// diary.csv (all above + additional)
- Rating: If present, must be 0.5-5.0
- Watched Date: If present, must be valid date
- Rewatch: Must be "Yes" or empty only
- Tags: Must be comma-separated valid strings

// ratings.csv
- Rating: Must be 0.5-5.0 (never empty)

// films.csv & watchlist.csv
- Same as watched.csv
```

---

## 7. MVP Analytics - What Data Do We Need?

### 7.1 Analytics Page Basic Stats

From the user's directions: **"basic stats such as how many movies person watched, ratio to how many he liked and rated"**

```typescript
interface AnalyticsOverview {
  // Core counts
  totalMoviesWatched: number;                    // All movies in watched dataset
  moviesRated: number;                          // Movies with rating !== undefined
  moviesLiked: number;                          // Movies with liked === true
  moviesWithoutRating: number;                  // totalMovies - moviesRated

  // Ratios
  ratingCoverage: number;                       // moviesRated / totalMovies (%)
  likeRatio: number;                            // moviesLiked / totalMovies (%)
  ratedButNotLiked: number;                     // moviesRated - (moviesRated && moviesLiked)

  // Rating statistics
  averageRating: number;                        // Mean of all ratings
  highestRating: number;                        // Max rating (usually 5)
  lowestRating: number;                         // Min rating (usually 0.5)
  medianRating: number;                         // Middle value
  ratingDistribution: {                         // Count per rating value
    [rating: string]: number;                   // "5.0": 45, "4.5": 30, etc.
  }

  // Viewing patterns
  totalRewatches: number;                       // Sum of rewatchCount
  moviesRewatched: number;                      // Count of movies with rewatch === true
  rewatchRate: number;                          // moviesRewatched / totalMovies (%)
  averageReviewPerMovie: number;                // totalRewatches / totalMovies

  // Time-based
  earliestWatchDate?: Date;                     // Oldest watchedDate
  latestWatchDate?: Date;                       // Newest watchedDate
  trackingSpan?: number;                        // Days between earliest and latest

  // Decade analysis (basic)
  decadeBreakdown: {                            // Count per decade
    [decade: string]: number;                   // "2000": 150, "2010": 200, etc.
  }
  mostWatchedDecade: string;                    // Decade with most movies

  // Timeline (basic)
  yearlyWatching: {                             // Count per year
    [year: string]: number;                     // "2021": 45, "2022": 67, etc.
  }

  // Optional: If computed
  estimatedHoursWatched?: number;               // ~110 min per movie
  averageWatchesPerDay?: number;                // totalMovies / trackingSpan
}
```

### 7.2 What We Don't Need Yet

- TMDB data (genres, directors, actors)
- Complex timeline with granularity (yearly only for MVP)
- Calendar heatmap
- Social sharing
- Export features

---

## 8. Summary - CSV Input to Movie Dataset Transformation

```
INPUT: 5 CSV files (1 mandatory, 4 optional)
         ↓
PARSING: Convert CSV rows to typed objects
         ↓
MERGING: Combine sources with conflict resolution
         URI as key, priority: ratings > diary > watched
         ↓
DEDUPLICATION: Remove exact duplicates
         ↓
ENRICHMENT: Add computed fields (decade, era)
         ↓
VALIDATION: Check data quality
         ↓
OUTPUT: MovieDataset {
  watched: Movie[],      ← Primary analytics dataset
  watchlist: Movie[],    ← Separate (not yet watched)
  metadata: {...}
}
         ↓
STORAGE: Zustand store + localStorage
         ↓
ANALYTICS: Compute AnalyticsOverview from Movie[]
```

---

## 9. Key Decisions Ratified

### ✅ Decision 1: Letterboxd URI as ID
**Why:** Only truly unique identifier across all files, survives title/year variations

### ✅ Decision 2: Rewatch = Aggregated (Option C)
**Why:** Simple, clean analytics, shows if movie was rewatched without complexity of multiple entries

### ✅ Decision 3: Diary for Watch Dates, Ratings.csv for Ratings
**Why:** Diary has actual watch dates, Ratings.csv has most current ratings (user may rate differently over time)

### ✅ Decision 4: watched.csv is Canonical
**Why:** User's authoritative "movies I've watched" list - everything else enriches this

### ✅ Decision 5: Watchlist is Separate Dataset
**Why:** These are NOT watched, analytics should focus on what was watched

### ✅ Decision 6: Basic Analytics for MVP
**Why:** Focus on core value: "How many watched, how many rated, what's the coverage" - all other charts deferred

---

## 10. Next Steps

1. ✅ **Understand data structure** (this document)
2. ⬜ **Create lib/types.ts** with final Movie interface
3. ⬜ **Implement CSV parser** (lib/csv-parser.ts)
4. ⬜ **Implement data merger** (lib/data-merger.ts)
5. ⬜ **Implement analytics engine** (lib/analytics-engine.ts)
6. ⬜ **Build Zustand store** (hooks/use-analytics-store.ts)
7. ⬜ **Create localStorage integration**
8. ⬜ **Build analytics page UI** with basic stats

---

**Document prepared for:** Implementation Planning Phase
**Status:** Ready for /speckit.plan command

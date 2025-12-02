# Data Structure Summary

## Quick Reference

### **What You Get with Full Upload**

```
User uploads 6 CSV files
        ↓
┌─────────────────────────────────────┐
│ APPLICATION RECEIVES                │
├─────────────────────────────────────┤
│                                     │
│ dataset.watched:                    │
│   ├─ ~1000 movies (merged data)    │
│   ├─ Complete movie info            │
│   ├─ Ratings (if rated)             │
│   ├─ Watch dates (if in diary)      │
│   ├─ Rewatch info (if in diary)     │
│   ├─ Tags (if in diary)             │
│   ├─ Liked flag (if in films.csv)   │
│   └─ Computed: decade, era          │
│                                     │
│ dataset.watchlist:                  │
│   ├─ ~200 unwatched movies          │
│   ├─ No ratings                     │
│   └─ Structured like watched movies │
│                                     │
│ dataset.userProfile:                │
│   ├─ Username, name, location       │
│   ├─ Join date                      │
│   └─ 0-4 favorite films             │
│                                     │
│ dataset.uploadedFiles:              │
│   └─ ['watched', 'diary',           │
│       'ratings', 'films',           │
│       'watchlist', 'profile']       │
│                                     │
└─────────────────────────────────────┘
```

---

## Each Movie Contains

```
Movie {
  id: "https://boxd.it/xyz"           (Letterboxd URI)
  title: "The Shawshank Redemption"
  year: 1994
  
  watchedDate: 2020-05-15             (if in diary.csv)
  dateMarkedWatched: 2024-11-15       (from watched.csv)
  
  rating: 5.0                         (from ratings.csv > diary.csv)
  ratingDate: 2024-11-15
  
  rewatch: true                       (if multiple entries in diary)
  rewatchCount: 1                     (number of rewatches)
  rewatchDates: [2023-03-10]
  
  tags: ["classic", "drama"]          (from diary.csv)
  liked: true                         (if in films.csv)
  
  decade: 1990                        (computed)
  era: "modern"                       (computed)
}
```

---

## File Priority (For Conflicts)

```
              RATING PRIORITY
                    ↓
        ratings.csv (ALWAYS WINS)
                    ↓
        diary.csv (if no ratings.csv)
                    ↓
        watched.csv (if no ratings/diary)

        
      WATCHED DATE PRIORITY
                    ↓
        diary.csv (ALWAYS WINS)
                    ↓
        watched.csv (fallback)

        
      TAGS PRIORITY
                    ↓
        diary.csv (ONLY SOURCE)

        
      LIKED FLAG PRIORITY
                    ↓
        films.csv (ONLY SOURCE)
```

---

## Watchlist vs Watched

```
WATCHED MOVIES              WATCHLIST MOVIES
├─ Has rating              ├─ NO rating
├─ Has watchedDate         ├─ NO watchedDate
├─ May have tags           ├─ NO tags
├─ May be liked            ├─ May be liked
├─ Counted as "watched"    └─ Counted as "to watch"
└─ In analytics
```

---

## What Gets Computed

```
From movie.year:

  Decade:
  2024 → 2020 (2020s)
  1999 → 1990 (1990s)
  1985 → 1980 (1980s)

  Era:
  ≤1944      → "classic"
  1945-1969  → "golden"
  1970-1999  → "modern"
  ≥2000      → "contemporary"
```

---

## File Contents at a Glance

| File | Columns | Updates | Notes |
|------|---------|---------|-------|
| **watched.csv** | Date, Name, Year, URI | dateMarkedWatched | REQUIRED |
| **diary.csv** | + Rating, Watched Date, Rewatch, Tags | watchedDate, tags, rating | Most detailed |
| **ratings.csv** | Date, Name, Year, URI, Rating | rating (HIGHEST PRIORITY) | Latest ratings |
| **films.csv** | Date, Name, Year, URI | liked = true | Favorite movies |
| **watchlist.csv** | Date, Name, Year, URI | watchlist[] array | Unwatched movies |
| **profile.csv** | Username, Name, Location, Favorites, etc | userProfile | User metadata |

---

## Charts Can Use

```
WATCHED DATA (from movies):
├─ By Release Year         (movie.year)
├─ By Decade               (computed decade)
├─ By Era                  (computed era)
├─ By Rating               (movie.rating)
├─ By Month Watched        (movie.watchedDate)
├─ By Year Watched         (movie.watchedDate.year)
├─ Likes Count             (movie.liked = true)
├─ Rewatches              (movie.rewatch = true)
├─ With Tags              (movie.tags.length)
└─ Watched Timeline       (dateMarkedWatched)

WATCHLIST DATA (if available):
├─ By Release Year         (movie.year)
├─ By Decade               (computed decade)
├─ By Era                  (computed era)
├─ How Many to Watch      (array.length)
└─ Unwatched by Decade    (groupBy decade)

PROFILE DATA (if available):
├─ Username
├─ Join Date
├─ Favorite Films (0-4)
└─ Location/Website
```

---

## Minimum vs Complete Data

```
MINIMUM UPLOAD (just watched.csv)
│
├─ 1000 watched movies
├─ title, year, id
├─ dateMarkedWatched (when added to watched list)
├─ decade, era (computed)
└─ No ratings, no watch dates, no tags

COMPLETE UPLOAD (all 6 files)
│
├─ 1000 watched movies
│  ├─ All from minimum PLUS
│  ├─ watchedDate (accurate first watch date)
│  ├─ rating (0.5-5.0)
│  ├─ tags (from diary)
│  ├─ rewatch info
│  └─ liked flag
├─ 200 watchlist movies (unwatched)
├─ User profile (name, join date, etc)
└─ All charts work fully
```

---

## Real World Example

```
User: Maria
Letterboxd username: mariacinephile
Join date: May 10, 2018

Files uploaded:
├─ watched.csv (1,234 movies)
│  └─ Date, Name, Year, URI
│
├─ diary.csv (534 entries)
│  └─ Only detailed entries (subset of watched)
│  └─ Includes accurate watch dates
│
├─ ratings.csv (892 ratings)
│  └─ Latest ratings (includes updates after diary)
│
├─ films.csv (156 likes)
│  └─ Favorite movies
│
├─ watchlist.csv (287 movies)
│  └─ Still want to watch
│
└─ profile.csv
   └─ Maria Smith, NYC, 4 favorite films

RESULT:
├─ dataset.watched: 1,234 movies
│  ├─ 892 have ratings (from ratings.csv)
│  ├─ 534 have accurate watch dates (from diary.csv)
│  ├─ 534 have tags (from diary.csv)
│  ├─ Some have rewatch info
│  └─ 156 marked as liked
│
├─ dataset.watchlist: 287 movies
│  └─ Awaiting watch
│
└─ dataset.userProfile:
   ├─ mariacinephile
   ├─ Maria Smith
   ├─ NYC, joined May 10, 2018
   └─ 4 favorite films
```

---

## Using Data in Code

```typescript
// Access store
const { dataset, analytics } = useAnalyticsStore();

// Check what was uploaded
if (dataset?.uploadedFiles.includes('watchlist')) {
  // User has watchlist data
  const unwatched = dataset.watchlist;
}

if (dataset?.uploadedFiles.includes('profile')) {
  // User has profile data
  const username = dataset.userProfile?.username;
}

// Get all watched movies
const allWatched = dataset?.watched || [];

// Filter by specific criteria
const liked = allWatched.filter(m => m.liked);
const rated = allWatched.filter(m => m.rating !== undefined);
const rewatched = allWatched.filter(m => m.rewatch);

// Group by era
const byEra = groupBy(allWatched, m => m.era);

// Calculate stats
const averageRating = allWatched
  .filter(m => m.rating !== undefined)
  .reduce((sum, m) => sum + (m.rating || 0), 0) / ratedCount;
```

---

## Summary

**Minimum:** watched.csv only
- Basic movie list, no detailed analytics

**Recommended:** All 6 files
- Complete movie library with ratings, watch dates, tags
- User profile info
- Watchlist data
- Full analytics capabilities

**File Priority:** ratings.csv > diary.csv > watched.csv
**Storage:** Browser localStorage (no server backup)
**Updates:** Re-upload files when data changes
**Privacy:** User controls all data

---

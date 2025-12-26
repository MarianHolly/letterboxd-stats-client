# Data Structure Guide - Letterboxd Stats

## Overview

This document describes the complete data structure your application receives when users upload Letterboxd CSV exports.

---

## What Information Is Received

### Core Objects

#### **Movie** (Watched Movies)
When a user uploads files, all watched movies are merged into a unified `Movie` object:

```typescript
interface Movie {
  // Core identifiers
  id: string;              // Letterboxd URI (https://boxd.it/XXX)
  title: string;           // Movie title
  year: number;            // Release year

  // Viewing information
  watchedDate?: Date;      // First time watched (from diary if available)
  dateMarkedWatched: Date; // Date added to watched list

  // Rating information
  rating?: number;         // 0.5-5.0 scale (from ratings.csv > diary.csv)
  ratingDate?: Date;       // When rating was made

  // Rewatch information
  rewatch: boolean;        // true if watched multiple times
  rewatchCount?: number;   // Number of times rewatched
  rewatchDates?: Date[];   // Dates of all rewatches

  // Enrichment
  tags?: string[];         // User tags from diary
  liked?: boolean;         // true if in films.csv

  // Computed fields
  decade: number;          // 1990, 2000, 2010, etc.
  era: 'classic' | 'golden' | 'modern' | 'contemporary';
}
```

#### **MovieDataset** (Container)
```typescript
interface MovieDataset {
  watched: Movie[];        // All watched movies (primary dataset)
  watchlist: Movie[];      // Unwatched movies (if watchlist.csv uploaded)
  userProfile?: UserProfile; // User profile data (if profile.csv uploaded)
  lastUpdated: Date;       // When dataset was last updated
  uploadedFiles: string[]; // Which CSVs were uploaded
}
```

---

## CSV Files & Data Mapping

### 1. **watched.csv** (Minimal - Always Required)
Base watched movies list.

**Columns:** Date, Name, Year, Letterboxd URI
**Output:** Base Movie objects with minimum fields
**Note:** Every user must upload this

### 2. **diary.csv** (Detailed - Recommended)
Detailed watching history with watch dates and ratings.

**Columns:** All watched.csv columns + Rating, Watched Date, Rewatch, Tags
**Overwrites:** watchedDate, tags, rating (if ratings.csv not present)
**Priority:** Medium (overridden by ratings.csv)

### 3. **ratings.csv** (Overrides All)
Most current ratings - highest priority.

**Columns:** Date, Name, Year, Letterboxd URI, Rating
**Overwrites:** rating, ratingDate (always wins)
**Note:** Upload this if user has rated movies since diary.csv

### 4. **films.csv** (Favorites)
Movies marked as "liked".

**Columns:** Date, Name, Year, Letterboxd URI
**Data added:** liked: true
**Use case:** Identify favorite movies

### 5. **watchlist.csv** (Not Watched Yet)
Movies on user's watchlist.

**Columns:** Date, Name, Year, Letterboxd URI
**Storage:** Separate array in dataset.watchlist
**Note:** Not mixed with watched movies
**Use:** "How many movies to watch?", "Unwatched movies by decade?"

### 6. **profile.csv** (User Metadata)
User account information.

**Columns:** Date Joined, Username, Given Name, Family Name, Email, Location, Website, Bio, Pronoun, Favorite Films
**Output:** Single UserProfile object
**Note:** Just one row per user

---

## Complete Data Flow Example

### Scenario: User Uploads All 6 Files

**Input:**
- watched.csv (1000 movies)
- diary.csv (500 movies)
- ratings.csv (600 movies)
- films.csv (150 movies)
- watchlist.csv (200 movies)
- profile.csv (1 row)

**Merge Process:**
1. Parse watched.csv → 1000 base Movie objects
2. Merge diary.csv → Update 500 with watchedDate, tags
3. Merge ratings.csv → Update 600 with latest ratings
4. Merge films.csv → Mark 150 as liked
5. Deduplicate by URI
6. Parse watchlist.csv → 200 watchlist movies
7. Parse profile.csv → 1 UserProfile

**Output:**
```
dataset.watched: ~1000 movies (merged, deduplicated)
  - All have: id, title, year, dateMarkedWatched, decade, era
  - Some have: rating, watchedDate, tags, rewatches, liked flag
  
dataset.watchlist: ~200 movies
  - Same structure as watched
  - No ratings (not watched yet)
  
dataset.userProfile:
  - username, name, location, bio, etc.
  - joinDate
  - favoriteFilms (0-4 favorite URIs)
  
dataset.lastUpdated: 2024-12-02T...
dataset.uploadedFiles: ['watched', 'diary', 'ratings', 'films', 'watchlist', 'profile']
```

---

## Merge Priority

When same movie appears in multiple CSVs:

### **For Rating:**
ratings.csv (wins) > diary.csv > watched.csv

**Example:** Movie has 4.5 in diary, 5.0 in ratings → **5.0 is used**

### **For Watched Date:**
diary.csv (wins) > watched.csv

### **For Tags:**
diary.csv (only source)

### **For Liked Flag:**
films.csv (only source)

---

## Computed Fields

After merging:

### **Decade**
```
2024 → 2020 (2020s)
1999 → 1990 (1990s)
```

### **Era**
```
year <= 1944     → 'classic'
1945-1969        → 'golden'
1970-1999        → 'modern'
year >= 2000     → 'contemporary'
```

### **Rewatch Count**
From diary.csv aggregation:
```
3 diary entries for same movie = 1 rewatch, 2 additional watches
```

---

## Watchlist.csv Specifics

### **Structure**
Same as watched.csv: Date, Name, Year, Letterboxd URI

### **Storage**
- Separate: `dataset.watchlist: Movie[]`
- NOT mixed with watched movies

### **Characteristics**
- No rating (unwatched)
- No watchedDate (unwatched)
- dateMarkedWatched = when added to watchlist
- rewatch = false
- No tags (can't tag unwatched)
- May have liked = true

### **Chart Potential**
- "I have 200 movies to watch"
- "Unwatched movies by decade"
- "Watchlist by era"
- "Average year of unwatched movies"

---

## Key Points

### **Minimum Upload**
Just **watched.csv** to start.

### **Best Practice**
Upload all for complete data:
1. watched.csv (base)
2. diary.csv (watch dates)
3. ratings.csv (latest ratings)
4. films.csv (liked movies)
5. watchlist.csv (to watch)
6. profile.csv (user info)

### **Update Frequency**
- New rating? Re-upload ratings.csv
- New like? Re-upload films.csv
- New watch? Re-upload diary.csv
- Added watchlist item? Re-upload watchlist.csv

### **Data Privacy**
- Stored in browser localStorage
- No server backup
- User controls data

---

## Summary Table

| File | Required | Primary Data | Key Field | Overwrites |
|------|----------|--------------|-----------|-----------|
| watched.csv | ✅ Yes | Base watched movies | dateMarkedWatched | - |
| diary.csv | ❌ Optional | Watch details | watchedDate, tags | watched ratings |
| ratings.csv | ❌ Optional | Current ratings | rating | All ratings |
| films.csv | ❌ Optional | Liked movies | liked: true | - |
| watchlist.csv | ❌ Optional | Unwatched movies | Stored separately | - |
| profile.csv | ❌ Optional | User metadata | userProfile | - |

---

/**
 * Mock CSV data for testing
 * Provides sample data for all 5 Letterboxd CSV file types
 */

// ============================================================================
// MOCK watched.csv DATA
// ============================================================================

export const MOCK_WATCHED_CSV = `Date,Name,Year,Letterboxd URI
2022-01-20,Inception,2010,https://boxd.it/1skk
2022-01-20,The Dark Knight,2008,https://boxd.it/2b0k
2022-01-20,The Prestige,2006,https://boxd.it/293w
2022-01-20,Skyfall,2012,https://boxd.it/17Fc
2022-01-20,Casino Royale,2006,https://boxd.it/1alk
2022-02-04,The Shawshank Redemption,1994,https://boxd.it/2aHi
2022-02-04,Rear Window,1954,https://boxd.it/2a6Q
2022-03-15,Groundhog Day,1993,https://boxd.it/2b3e
2022-03-15,Forrest Gump,1994,https://boxd.it/2aKf
2022-04-10,The Matrix,1999,https://boxd.it/2aTf`

export const MOCK_WATCHED_CSV_LARGE = `Date,Name,Year,Letterboxd URI
${Array.from({ length: 100 }, (_, i) => {
  const year = 1950 + (i % 70)
  const id = String(1000 + i)
  return `2022-01-20,Movie ${i + 1},${year},https://boxd.it/${id}`
}).join('\n')}`

// ============================================================================
// MOCK diary.csv DATA
// ============================================================================

export const MOCK_DIARY_CSV = `Date,Name,Year,Letterboxd URI,Rating,Rewatch,Tags,Watched Date
2025-11-12,Groundhog Day,1993,https://boxd.it/2b3e,5,,,2021-01-02
2025-11-12,Rookies Run Amok,1971,https://boxd.it/bGf77J,4,Yes,,2021-01-05
2025-11-12,The Platform,2019,https://boxd.it/bGd1zt,4,,,2021-01-08
2025-11-12,The Brain,1969,https://boxd.it/bGd2CN,4,Yes,,2021-01-16
2025-11-12,How to Pull Out a Whale's Tooth,1977,https://boxd.it/bGf7wT,3,,,2021-02-06
2025-11-12,The Shawshank Redemption,1994,https://boxd.it/2aHi,5,Yes,"drama,classic",2021-03-20
2025-11-12,Inception,2010,https://boxd.it/1skk,5,Yes,"sci-fi",2021-04-15
2025-11-12,The Dark Knight,2008,https://boxd.it/2b0k,5,,"action",2021-05-10
2025-11-12,Rear Window,1954,https://boxd.it/2a6Q,5,,"thriller",2021-06-01
2025-11-12,Forrest Gump,1994,https://boxd.it/2aKf,4,,"drama",2021-07-15
2025-11-12,Unrated Movie,2015,https://boxd.it/unrated1,,,,2021-08-20`

// ============================================================================
// MOCK ratings.csv DATA
// ============================================================================

export const MOCK_RATINGS_CSV = `Date,Name,Year,Letterboxd URI,Rating
2022-01-20,The Father,2020,https://boxd.it/m8Ie,5
2022-01-20,Inception,2010,https://boxd.it/1skk,5
2022-01-21,Once Upon a Time in the West,1968,https://boxd.it/2az4,5
2022-01-23,Split,2016,https://boxd.it/dgSy,4
2022-01-26,Lore,2012,https://boxd.it/41Cs,3.5
2022-02-04,"The Good, the Bad and the Ugly",1966,https://boxd.it/2ape,5
2022-02-04,Rear Window,1954,https://boxd.it/2a6Q,5
2022-02-04,The Shawshank Redemption,1994,https://boxd.it/2aHi,5
2022-02-04,Ocean's Eleven,2001,https://boxd.it/2aZm,4
2022-02-10,The Matrix,1999,https://boxd.it/2aTf,4.5`

// ============================================================================
// MOCK films.csv DATA (Liked movies)
// ============================================================================

export const MOCK_FILMS_CSV = `Date,Name,Year,Letterboxd URI
2022-01-20,The Father,2020,https://boxd.it/m8Ie
2022-01-20,Another Round,2020,https://boxd.it/lkba
2022-01-20,Groundhog Day,1993,https://boxd.it/2b3e
2022-05-31,Reservoir Dogs,1992,https://boxd.it/2agc
2022-07-22,The Prince of Egypt,1998,https://boxd.it/1XGQ
2022-07-22,The Shawshank Redemption,1994,https://boxd.it/2aHi
2022-07-22,Squid Game,2021,https://boxd.it/x1OG
2022-08-15,Inception,2010,https://boxd.it/1skk
2022-09-10,The Dark Knight,2008,https://boxd.it/2b0k
2022-10-05,Rear Window,1954,https://boxd.it/2a6Q`

// ============================================================================
// MOCK watchlist.csv DATA (Unwatched movies)
// ============================================================================

export const MOCK_WATCHLIST_CSV = `Date,Name,Year,Letterboxd URI
2025-09-22,Donnie Brasco,1997,https://boxd.it/1YRA
2025-09-22,The Unbearable Lightness of Being,1988,https://boxd.it/1VKc
2025-09-22,Martyrs,2008,https://boxd.it/1Yqu
2025-09-22,Man Bites Dog,1992,https://boxd.it/1X7Q
2025-09-22,Her,2013,https://boxd.it/4O24
2025-09-22,How to Make Millions Before Grandma Dies,2024,https://boxd.it/FLa4
2025-09-22,The Eight Mountains,2022,https://boxd.it/ufRe
2025-09-22,The Beasts,2022,https://boxd.it/w1L6
2025-09-22,Santa Sangre,1989,https://boxd.it/1FrI
2025-09-22,Kagemusha,1980,https://boxd.it/Qf9A`

// ============================================================================
// EDGE CASE DATA
// ============================================================================

/**
 * CSV with missing optional columns
 */
export const MOCK_WATCHED_CSV_MINIMAL = `Date,Name,Year,Letterboxd URI
2022-01-20,Test Movie 1,2020,https://boxd.it/abc1
2022-01-21,Test Movie 2,2021,https://boxd.it/abc2`

/**
 * CSV with invalid data (bad dates, invalid ratings)
 */
export const MOCK_DIARY_CSV_INVALID = `Date,Name,Year,Letterboxd URI,Rating,Rewatch,Tags,Watched Date
2025-11-12,Valid Movie,2020,https://boxd.it/good1,5,,,2021-01-01
2025-11-12,Invalid Date Movie,2020,https://boxd.it/bad1,4,,,invalid-date
2025-11-12,Invalid Rating Movie,2020,https://boxd.it/bad2,99,,,2021-01-02
2025-11-12,Empty Fields Movie,2020,https://boxd.it/ok1,,,,`

/**
 * CSV with missing required columns
 */
export const MOCK_WATCHED_CSV_INVALID_COLUMNS = `Name,Year,Letterboxd URI
Test Movie,2020,https://boxd.it/test1`

/**
 * Empty CSV
 */
export const MOCK_WATCHED_CSV_EMPTY = `Date,Name,Year,Letterboxd URI`

// ============================================================================
// MOCK profile.csv DATA
// ============================================================================

/**
 * Complete profile with all fields and favorite films
 */
export const MOCK_PROFILE_CSV_FULL = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2022-01-20,Stupel,Marián,Hollý,,,,,He / his,"https://boxd.it/251c, https://boxd.it/1m8W"`

/**
 * Profile with 4 favorite films (maximum)
 */
export const MOCK_PROFILE_CSV_MANY_FAVORITES = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2025-03-24,contradictio,,,,,,this is mock name for box man with face of another,It / its,"https://boxd.it/251c, https://boxd.it/28Q8, https://boxd.it/1m8W, https://boxd.it/Arw0"`

/**
 * Minimal profile with only username (required)
 */
export const MOCK_PROFILE_CSV_MINIMAL = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
,testuser,,,,,,,,""`

/**
 * Profile with no favorite films
 */
export const MOCK_PROFILE_CSV_NO_FAVORITES = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2023-06-15,cinemaloveur,Jean,Dupont,,,,,He / him,""`

/**
 * Profile with invalid favorite film URLs (more than 4)
 */
export const MOCK_PROFILE_CSV_INVALID_FAVORITES = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2021-05-10,filmcritic,,,,,,,"https://boxd.it/a, https://boxd.it/b, https://boxd.it/c, https://boxd.it/d, https://boxd.it/e"`

/**
 * Profile with missing username (invalid)
 */
export const MOCK_PROFILE_CSV_INVALID_NO_USERNAME = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2022-01-20,,John,Doe,,,,,He / him,""`

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all mock CSV files as File objects
 */
export function getMockCSVFiles(): Record<string, File> {
  return {
    watched: new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' }),
    diary: new File([MOCK_DIARY_CSV], 'diary.csv', { type: 'text/csv' }),
    ratings: new File([MOCK_RATINGS_CSV], 'ratings.csv', { type: 'text/csv' }),
    films: new File([MOCK_FILMS_CSV], 'films.csv', { type: 'text/csv' }),
    watchlist: new File([MOCK_WATCHLIST_CSV], 'watchlist.csv', { type: 'text/csv' }),
    profile: new File([MOCK_PROFILE_CSV_FULL], 'profile.csv', { type: 'text/csv' }),
  }
}

/**
 * Count rows in CSV string (excluding header)
 */
export function countCSVRows(csvContent: string): number {
  return csvContent.split('\n').filter((line) => line.trim().length > 0).length - 1 // -1 for header
}

/**
 * Get CSV header row
 */
export function getCSVHeaders(csvContent: string): string[] {
  const firstLine = csvContent.split('\n')[0]
  return firstLine.split(',').map((h) => h.trim())
}

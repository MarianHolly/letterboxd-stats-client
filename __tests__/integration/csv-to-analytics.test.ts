/**
 * Integration tests for full CSV → Movie[] → Analytics pipeline
 * Tests the complete data flow from CSV parsing through analytics computation
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { parseCSVContent } from '../../lib/csv-parser'
import { mergeMovieSources } from '../../lib/data-merger'
import { computeAnalytics } from '../../lib/analytics-engine'
import type { Movie, AnalyticsOverview } from '../../lib/types'

// ============================================================================
// TEST CSV DATA
// ============================================================================

const watchedCSV = `Date,Name,Year,Letterboxd URI
2023-01-15,The Shawshank Redemption,1994,https://boxd.it/movie1
2023-02-10,The Godfather,1972,https://boxd.it/movie2
2023-03-05,Inception,2010,https://boxd.it/movie3`

const diaryCSV = `Date,Name,Year,Letterboxd URI,Rating,Rewatch,Tags,Watched Date
2023-01-15,The Shawshank Redemption,1994,https://boxd.it/movie1,4.5,No,"favorite, prison-drama",2022-12-20
2023-02-10,The Godfather,1972,https://boxd.it/movie2,5.0,Yes,,2023-02-10
2023-02-10,The Godfather,1972,https://boxd.it/movie2,5.0,Yes,,2023-05-15
2023-04-01,Pulp Fiction,1994,https://boxd.it/movie4,4.0,No,,2023-04-01`

const ratingsCSV = `Date,Name,Year,Letterboxd URI,Rating
2023-05-01,The Shawshank Redemption,1994,https://boxd.it/movie1,5.0
2023-03-10,Inception,2010,https://boxd.it/movie3,4.5`

const filmsCSV = `Date,Name,Year,Letterboxd URI
2023-01-15,The Shawshank Redemption,1994,https://boxd.it/movie1
2023-03-05,Inception,2010,https://boxd.it/movie3`

const watchlistCSV = `Date,Name,Year,Letterboxd URI
2023-06-01,The Matrix,1999,https://boxd.it/unwatched1
2023-06-05,Avatar,2009,https://boxd.it/unwatched2`

// ============================================================================
// BASIC PIPELINE TESTS
// ============================================================================

describe('CSV to Analytics Pipeline', () => {
  describe('Single CSV Source (watched.csv)', () => {
    it('should parse watched.csv and compute analytics', () => {
      // Parse CSV
      const parseResult = parseCSVContent(watchedCSV, 'watched')

      expect(parseResult.success).toBe(true)
      expect(parseResult.data).toHaveLength(3)

      // Merge (no other sources)
      const dataset = mergeMovieSources(parseResult.data!)

      expect(dataset.watched).toHaveLength(3)
      expect(dataset.watchlist).toHaveLength(0)
      expect(dataset.uploadedFiles).toEqual(['watched'])

      // Compute analytics
      const analytics = computeAnalytics(dataset.watched)

      expect(analytics.totalMoviesWatched).toBe(3)
      expect(analytics.moviesRated).toBe(0) // No ratings in watched.csv
      expect(analytics.averageRating).toBe(0)
      expect(analytics.decadeBreakdown).toBeDefined()
    })

    it('should correctly parse movie fields', () => {
      const parseResult = parseCSVContent(watchedCSV, 'watched')
      const movies = parseResult.data!

      const movie1 = movies[0]
      expect(movie1.id).toBe('https://boxd.it/movie1')
      expect(movie1.title).toBe('The Shawshank Redemption')
      expect(movie1.year).toBe(1994)
      expect(movie1.decade).toBe(1990)
      expect(movie1.era).toBe('modern')
    })

    it('should handle dates correctly', () => {
      const parseResult = parseCSVContent(watchedCSV, 'watched')
      const movies = parseResult.data!

      // Use getTime() to compare ignoring timezone
      const date1 = movies[0].dateMarkedWatched
      const date2 = movies[1].dateMarkedWatched

      expect(date1?.getFullYear()).toBe(2023)
      expect(date1?.getMonth()).toBe(0) // January is 0
      expect(date1?.getDate()).toBe(15)

      expect(date2?.getFullYear()).toBe(2023)
      expect(date2?.getMonth()).toBe(1) // February is 1
      expect(date2?.getDate()).toBe(10)
    })
  })

  describe('Multiple CSV Sources', () => {
    it('should parse and merge watched + diary CSVs', () => {
      // Parse CSVs
      const watchedResult = parseCSVContent(watchedCSV, 'watched')
      const diaryResult = parseCSVContent(diaryCSV, 'diary')

      expect(watchedResult.success).toBe(true)
      expect(diaryResult.success).toBe(true)

      // Merge
      const dataset = mergeMovieSources(watchedResult.data!, diaryResult.data!)

      // Should have 4 movies (3 from watched + 1 new from diary)
      expect(dataset.watched).toHaveLength(4)
      expect(dataset.uploadedFiles).toContain('watched')
      expect(dataset.uploadedFiles).toContain('diary')

      // Check merge enrichment
      const movie1 = dataset.watched.find((m) => m.id === 'https://boxd.it/movie1')
      expect(movie1?.rating).toBe(4.5) // From diary
      expect(movie1?.tags).toEqual(['favorite', 'prison-drama'])
      // Check watched date (ignoring timezone)
      expect(movie1?.watchedDate?.getFullYear()).toBe(2022)
      expect(movie1?.watchedDate?.getMonth()).toBe(11) // December is 11
      expect(movie1?.watchedDate?.getDate()).toBe(20)

      // Check movie2 (from diary with rewatches)
      const movie2 = dataset.watched.find((m) => m.id === 'https://boxd.it/movie2')
      expect(movie2?.rewatch).toBe(true)
      expect(movie2?.rewatchCount).toBe(1) // 2 entries - 1
    })

    it('should apply ratings priority over diary', () => {
      const watchedResult = parseCSVContent(watchedCSV, 'watched')
      const diaryResult = parseCSVContent(diaryCSV, 'diary')
      const ratingsResult = parseCSVContent(ratingsCSV, 'ratings')

      const dataset = mergeMovieSources(
        watchedResult.data!,
        diaryResult.data!,
        ratingsResult.data!
      )

      // movie1 should have ratings.csv rating (5.0) not diary (4.5)
      const movie1 = dataset.watched.find((m) => m.id === 'https://boxd.it/movie1')
      expect(movie1?.rating).toBe(5.0)

      // movie3 should have ratings from ratings.csv
      const movie3 = dataset.watched.find((m) => m.id === 'https://boxd.it/movie3')
      expect(movie3?.rating).toBe(4.5)
    })

    it('should add liked flag from films.csv', () => {
      const watchedResult = parseCSVContent(watchedCSV, 'watched')
      const filmsResult = parseCSVContent(filmsCSV, 'films')

      const dataset = mergeMovieSources(watchedResult.data!, undefined, undefined, filmsResult.data!)

      // movie1 and movie3 should be liked
      const movie1 = dataset.watched.find((m) => m.id === 'https://boxd.it/movie1')
      const movie3 = dataset.watched.find((m) => m.id === 'https://boxd.it/movie3')

      expect(movie1?.liked).toBe(true)
      expect(movie3?.liked).toBe(true)

      // movie2 should not be liked
      const movie2 = dataset.watched.find((m) => m.id === 'https://boxd.it/movie2')
      expect(movie2?.liked).toBeUndefined()
    })

    it('should separate watchlist from watched movies', () => {
      const watchedResult = parseCSVContent(watchedCSV, 'watched')
      const watchlistResult = parseCSVContent(watchlistCSV, 'watchlist')

      const dataset = mergeMovieSources(watchedResult.data!, undefined, undefined, undefined, watchlistResult.data!)

      expect(dataset.watched).toHaveLength(3)
      expect(dataset.watchlist).toHaveLength(2)

      // Check watchlist movies are separate
      const watchlistIds = dataset.watchlist.map((m) => m.id)
      expect(watchlistIds).toContain('https://boxd.it/unwatched1')
      expect(watchlistIds).toContain('https://boxd.it/unwatched2')

      // Check watched doesn't contain watchlist
      const watchedIds = dataset.watched.map((m) => m.id)
      expect(watchedIds).not.toContain('https://boxd.it/unwatched1')
    })

    it('should merge all sources together with correct priority', () => {
      const watchedResult = parseCSVContent(watchedCSV, 'watched')
      const diaryResult = parseCSVContent(diaryCSV, 'diary')
      const ratingsResult = parseCSVContent(ratingsCSV, 'ratings')
      const filmsResult = parseCSVContent(filmsCSV, 'films')
      const watchlistResult = parseCSVContent(watchlistCSV, 'watchlist')

      const dataset = mergeMovieSources(
        watchedResult.data!,
        diaryResult.data!,
        ratingsResult.data!,
        filmsResult.data!,
        watchlistResult.data!
      )

      // Verify structure
      expect(dataset.watched.length).toBeGreaterThan(0)
      expect(dataset.watchlist).toHaveLength(2)
      expect(dataset.uploadedFiles).toEqual(['watched', 'films', 'diary', 'ratings', 'watchlist'])

      // Verify a fully enriched movie
      const movie1 = dataset.watched.find((m) => m.id === 'https://boxd.it/movie1')
      expect(movie1?.rating).toBe(5.0) // From ratings (highest priority)
      expect(movie1?.liked).toBe(true) // From films
      expect(movie1?.tags).toEqual(['favorite', 'prison-drama']) // From diary
      // Check watched date from diary (ignoring timezone)
      expect(movie1?.watchedDate?.getFullYear()).toBe(2022)
      expect(movie1?.watchedDate?.getMonth()).toBe(11) // December is 11
      expect(movie1?.watchedDate?.getDate()).toBe(20)
    })
  })
})

// ============================================================================
// ANALYTICS COMPUTATION TESTS
// ============================================================================

describe('Analytics Computation', () => {
  it('should compute accurate analytics from merged data', () => {
    const watchedResult = parseCSVContent(watchedCSV, 'watched')
    const diaryResult = parseCSVContent(diaryCSV, 'diary')
    const ratingsResult = parseCSVContent(ratingsCSV, 'ratings')

    const dataset = mergeMovieSources(
      watchedResult.data!,
      diaryResult.data!,
      ratingsResult.data!
    )

    const analytics = computeAnalytics(dataset.watched)

    // Verify counts
    expect(analytics.totalMoviesWatched).toBe(4) // 3 from watched + 1 new from diary
    expect(analytics.moviesRated).toBe(4) // All have ratings after merge
    expect(analytics.ratingCoverage).toBe(100)

    // Verify ratings are correctly applied
    expect(analytics.averageRating).toBeGreaterThan(0)
    expect(analytics.medianRating).toBeGreaterThan(0)

    // Verify decade breakdown
    expect(analytics.decadeBreakdown['1970s']).toBe(1)
    expect(analytics.decadeBreakdown['1990s']).toBe(2)
    expect(analytics.decadeBreakdown['2010s']).toBe(1)
  })

  it('should compute rewatch statistics correctly', () => {
    const watchedResult = parseCSVContent(watchedCSV, 'watched')
    const diaryResult = parseCSVContent(diaryCSV, 'diary')

    const dataset = mergeMovieSources(watchedResult.data!, diaryResult.data!)
    const analytics = computeAnalytics(dataset.watched)

    // movie2 has 2 diary entries, so it's rewatched
    expect(analytics.moviesRewatched).toBe(1)
    expect(analytics.totalRewatches).toBe(1) // 2 entries - 1
  })

  it('should handle edge case: all movies unrated', () => {
    const parseResult = parseCSVContent(watchedCSV, 'watched')
    const dataset = mergeMovieSources(parseResult.data!)
    const analytics = computeAnalytics(dataset.watched)

    expect(analytics.moviesRated).toBe(0)
    expect(analytics.ratingCoverage).toBe(0)
    expect(analytics.averageRating).toBe(0)
    expect(Object.keys(analytics.ratingDistribution)).toHaveLength(0)
  })

  it('should compute tracking span correctly', () => {
    const parseResult = parseCSVContent(watchedCSV, 'watched')
    const dataset = mergeMovieSources(parseResult.data!)
    const analytics = computeAnalytics(dataset.watched)

    // Check earliest date (ignoring timezone)
    expect(analytics.earliestWatchDate?.getFullYear()).toBe(2023)
    expect(analytics.earliestWatchDate?.getMonth()).toBe(0) // January is 0
    expect(analytics.earliestWatchDate?.getDate()).toBe(15)

    // Check latest date (ignoring timezone)
    expect(analytics.latestWatchDate?.getFullYear()).toBe(2023)
    expect(analytics.latestWatchDate?.getMonth()).toBe(2) // March is 2
    expect(analytics.latestWatchDate?.getDate()).toBe(5)

    expect(analytics.trackingSpan).toBe(49) // Days between Jan 15 and Mar 5
  })
})

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

describe('Pipeline Error Handling', () => {
  it('should handle invalid CSV gracefully', () => {
    const invalidCSV = `Invalid,CSV,Format
    1,2,3`

    const result = parseCSVContent(invalidCSV, 'watched')

    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should handle empty CSV', () => {
    const emptyCSV = ''
    const result = parseCSVContent(emptyCSV, 'watched')

    expect(result.success).toBe(false)
  })

  it('should fail merge with no watched.csv', () => {
    expect(() => mergeMovieSources([])).toThrow()
  })

  it('should skip invalid rows in CSV', () => {
    const csvWithErrors = `Date,Name,Year,Letterboxd URI
2023-01-15,The Shawshank Redemption,1994,https://boxd.it/movie1
2023-02-10,Invalid Movie,not-a-year,https://boxd.it/invalid
2023-03-05,Inception,2010,https://boxd.it/movie3`

    const result = parseCSVContent(csvWithErrors, 'watched')

    expect(result.success).toBe(false)
    // Valid rows should still be in data
    expect(result.data?.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// DATA CONSISTENCY TESTS
// ============================================================================

describe('Data Consistency', () => {
  it('should maintain data integrity through pipeline', () => {
    const watchedResult = parseCSVContent(watchedCSV, 'watched')
    const diaryResult = parseCSVContent(diaryCSV, 'diary')
    const ratingsResult = parseCSVContent(ratingsCSV, 'ratings')

    // First merge
    const dataset1 = mergeMovieSources(watchedResult.data!, diaryResult.data!, ratingsResult.data!)
    const analytics1 = computeAnalytics(dataset1.watched)

    // Second merge with same data (should be identical)
    const dataset2 = mergeMovieSources(watchedResult.data!, diaryResult.data!, ratingsResult.data!)
    const analytics2 = computeAnalytics(dataset2.watched)

    expect(analytics1).toEqual(analytics2)
  })

  it('should preserve all movie fields through pipeline', () => {
    const diaryResult = parseCSVContent(diaryCSV, 'diary')
    const movies = diaryResult.data!

    const movie = movies[0]

    // Check all parsed fields are present
    expect(movie.id).toBeDefined()
    expect(movie.title).toBeDefined()
    expect(movie.year).toBeDefined()
    expect(movie.dateMarkedWatched).toBeDefined()
    expect(movie.decade).toBeDefined()
    expect(movie.era).toBeDefined()
    expect(movie.rating).toBeDefined()
    expect(movie.tags).toBeDefined()
  })
})

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('Pipeline Performance', () => {
  it('should process CSV and compute analytics in reasonable time', () => {
    const start = performance.now()

    const watchedResult = parseCSVContent(watchedCSV, 'watched')
    const diaryResult = parseCSVContent(diaryCSV, 'diary')
    const ratingsResult = parseCSVContent(ratingsCSV, 'ratings')

    const dataset = mergeMovieSources(
      watchedResult.data!,
      diaryResult.data!,
      ratingsResult.data!
    )

    const analytics = computeAnalytics(dataset.watched)

    const end = performance.now()

    expect(end - start).toBeLessThan(100) // Should complete in <100ms
    expect(analytics).toBeDefined()
  })

  it('should handle large dataset pipeline efficiently', () => {
    // Generate large CSV content
    let largeCSV = 'Date,Name,Year,Letterboxd URI\n'
    for (let i = 0; i < 500; i++) {
      const date = new Date(2020 + Math.floor(i / 100), (i % 12) + 1, 1)
        .toISOString()
        .split('T')[0]
      largeCSV += `${date},Movie ${i},${1980 + (i % 40)},https://boxd.it/movie${i}\n`
    }

    const start = performance.now()

    const parseResult = parseCSVContent(largeCSV, 'watched')
    const dataset = mergeMovieSources(parseResult.data!)
    const analytics = computeAnalytics(dataset.watched)

    const end = performance.now()

    expect(analytics.totalMoviesWatched).toBe(500)
    expect(end - start).toBeLessThan(500) // <500ms for 500 movies
  })
})

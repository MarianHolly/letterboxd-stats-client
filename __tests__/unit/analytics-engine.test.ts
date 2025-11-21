/**
 * Unit tests for Analytics Engine module
 * Tests all analytics computations and edge cases
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import {
  computeAnalytics,
  computeOverviewStats,
  computeRatingDistribution,
  computeDecadeBreakdown,
  computeYearlyWatching,
  computeRewatchStats,
  computeTimeSpan,
  getTopMoviesByRating,
  getTopRewatchedMovies,
  getMoviesByYear,
  getMoviesByDecade,
  getMoviesByRating,
  getMoviesWithTags,
  getLikedMovies,
  getUnratedMovies,
  computeTagDistribution,
  getRatingsByDecade,
  getRatingsByYear,
  computeViewingVelocity,
  computeRatingConsistency,
} from '../../lib/analytics-engine'
import type { Movie } from '../../lib/types'

// ============================================================================
// TEST DATA FIXTURES
// ============================================================================

const createMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: `https://boxd.it/test${Math.random()}`,
  title: 'Test Movie',
  year: 2020,
  dateMarkedWatched: new Date('2023-01-01'),
  rewatch: false,
  decade: 2020,
  era: 'contemporary',
  ...overrides,
})

const sampleMovies: Movie[] = [
  createMovie({
    id: 'https://boxd.it/1',
    title: 'The Shawshank Redemption',
    year: 1994,
    decade: 1990,
    watchedDate: new Date('2023-01-15'),
    dateMarkedWatched: new Date('2023-01-15'),
    rating: 5.0,
  }),
  createMovie({
    id: 'https://boxd.it/2',
    title: 'The Godfather',
    year: 1972,
    decade: 1970,
    watchedDate: new Date('2023-02-10'),
    dateMarkedWatched: new Date('2023-02-10'),
    rating: 4.5,
  }),
  createMovie({
    id: 'https://boxd.it/3',
    title: 'Inception',
    year: 2010,
    decade: 2010,
    watchedDate: new Date('2023-03-05'),
    dateMarkedWatched: new Date('2023-03-05'),
    rating: 4.5,
  }),
  createMovie({
    id: 'https://boxd.it/4',
    title: 'Pulp Fiction',
    year: 1994,
    decade: 1990,
    watchedDate: new Date('2023-04-01'),
    dateMarkedWatched: new Date('2023-04-01'),
    rating: 4.0,
  }),
  createMovie({
    id: 'https://boxd.it/5',
    title: 'Forrest Gump',
    year: 1994,
    decade: 1990,
    watchedDate: new Date('2023-05-10'),
    dateMarkedWatched: new Date('2023-05-10'),
    rating: 3.5,
  }),
  createMovie({
    id: 'https://boxd.it/6',
    title: 'The Dark Knight',
    year: 2008,
    decade: 2000,
    watchedDate: new Date('2023-06-15'),
    dateMarkedWatched: new Date('2023-06-15'),
    rating: undefined, // Unrated
  }),
  createMovie({
    id: 'https://boxd.it/7',
    title: 'Liked Movie',
    year: 2020,
    decade: 2020,
    watchedDate: new Date('2023-07-20'),
    dateMarkedWatched: new Date('2023-07-20'),
    rating: 4.0,
    liked: true,
  }),
  createMovie({
    id: 'https://boxd.it/8',
    title: 'Tagged Movie',
    year: 2015,
    decade: 2010,
    watchedDate: new Date('2023-08-10'),
    dateMarkedWatched: new Date('2023-08-10'),
    rating: 3.5,
    tags: ['sci-fi', 'action'],
  }),
  createMovie({
    id: 'https://boxd.it/9',
    title: 'Rewatched Movie',
    year: 2000,
    decade: 2000,
    watchedDate: new Date('2023-01-01'),
    dateMarkedWatched: new Date('2023-01-01'),
    rating: 4.5,
    rewatch: true,
    rewatchCount: 2,
    rewatchDates: [
      new Date('2023-03-01'),
      new Date('2023-06-01'),
    ],
  }),
]

// ============================================================================
// OVERVIEW STATISTICS TESTS
// ============================================================================

describe('computeOverviewStats', () => {
  it('should compute correct counts and ratios', () => {
    const stats = computeOverviewStats(sampleMovies)

    expect(stats.totalMoviesWatched).toBe(9)
    expect(stats.moviesRated).toBe(8) // All except movie 6
    expect(stats.moviesLiked).toBe(1) // Only movie 7
    expect(stats.ratingCoverage).toBe(88.9) // 8/9 * 100
    expect(stats.likeRatio).toBe(11.1) // 1/9 * 100
  })

  it('should compute correct average rating', () => {
    const stats = computeOverviewStats(sampleMovies)

    // Ratings: 5.0, 4.5, 4.5, 4.0, 3.5, 4.0, 4.5, 4.5 (8 movies)
    // Average: (5.0 + 4.5 + 4.5 + 4.0 + 3.5 + 4.0 + 4.5 + 4.5) / 8 = 33.5 / 8 = 4.1875
    expect(stats.averageRating).toBe(4.2) // Rounded to 1 decimal
  })

  it('should compute correct median rating', () => {
    const stats = computeOverviewStats(sampleMovies)

    // Sorted: 3.5, 3.5, 4.0, 4.0, 4.5, 4.5, 4.5, 5.0
    // Median: (4.0 + 4.5) / 2 = 4.25
    expect(stats.medianRating).toBe(4.3) // Rounded
  })

  it('should return zeros for empty movies', () => {
    const stats = computeOverviewStats([])

    expect(stats.totalMoviesWatched).toBe(0)
    expect(stats.moviesRated).toBe(0)
    expect(stats.averageRating).toBe(0)
    expect(stats.medianRating).toBe(0)
  })

  it('should handle all unrated movies', () => {
    const unrated = sampleMovies.map((m) => ({
      ...m,
      rating: undefined,
    }))

    const stats = computeOverviewStats(unrated)

    expect(stats.moviesRated).toBe(0)
    expect(stats.ratingCoverage).toBe(0)
    expect(stats.averageRating).toBe(0)
  })

  it('should handle single movie', () => {
    const single = [sampleMovies[0]]
    const stats = computeOverviewStats(single)

    expect(stats.totalMoviesWatched).toBe(1)
    expect(stats.moviesRated).toBe(1)
    expect(stats.ratingCoverage).toBe(100)
    expect(stats.averageRating).toBe(5.0)
  })
})

// ============================================================================
// RATING DISTRIBUTION TESTS
// ============================================================================

describe('computeRatingDistribution', () => {
  it('should compute correct distribution', () => {
    const dist = computeRatingDistribution(sampleMovies)

    expect(dist['3.5']).toBe(2) // Movies 5 and 8
    expect(dist['4.0']).toBe(2) // Movies 4 and 7
    expect(dist['4.5']).toBe(3) // Movies 2, 3, 9
    expect(dist['5.0']).toBe(1) // Movie 1
  })

  it('should exclude unrated movies', () => {
    const dist = computeRatingDistribution(sampleMovies)

    expect(Object.values(dist).reduce((a, b) => a + b, 0)).toBe(8) // Not 9
  })

  it('should return empty object for no ratings', () => {
    const unrated = sampleMovies.map((m) => ({
      ...m,
      rating: undefined,
    }))

    const dist = computeRatingDistribution(unrated)

    expect(Object.keys(dist).length).toBe(0)
  })

  it('should include all possible ratings', () => {
    const movies = [
      createMovie({ rating: 0.5 }),
      createMovie({ rating: 1.0 }),
      createMovie({ rating: 1.5 }),
      createMovie({ rating: 2.0 }),
      createMovie({ rating: 2.5 }),
      createMovie({ rating: 3.0 }),
      createMovie({ rating: 3.5 }),
      createMovie({ rating: 4.0 }),
      createMovie({ rating: 4.5 }),
      createMovie({ rating: 5.0 }),
    ]

    const dist = computeRatingDistribution(movies)

    expect(Object.keys(dist)).toHaveLength(10)
    expect(Object.values(dist).every((v) => v === 1)).toBe(true)
  })
})

// ============================================================================
// DECADE BREAKDOWN TESTS
// ============================================================================

describe('computeDecadeBreakdown', () => {
  it('should compute correct decade breakdown', () => {
    const breakdown = computeDecadeBreakdown(sampleMovies)

    expect(breakdown['1970s']).toBe(1)
    expect(breakdown['1990s']).toBe(3)
    expect(breakdown['2000s']).toBe(2)
    expect(breakdown['2010s']).toBe(2)
    expect(breakdown['2020s']).toBe(1)
  })

  it('should return empty object for empty movies', () => {
    const breakdown = computeDecadeBreakdown([])
    expect(breakdown).toEqual({})
  })

  it('should handle single decade', () => {
    const singleDecade = sampleMovies.filter((m) => m.decade === 1990)
    const breakdown = computeDecadeBreakdown(singleDecade)

    expect(Object.keys(breakdown)).toHaveLength(1)
    expect(breakdown['1990s']).toBe(3)
  })
})

// ============================================================================
// YEARLY BREAKDOWN TESTS
// ============================================================================

describe('computeYearlyWatching', () => {
  it('should compute correct yearly breakdown', () => {
    const breakdown = computeYearlyWatching(sampleMovies)

    expect(breakdown['2023']).toBe(9)
  })

  it('should use watchedDate if available', () => {
    const movies = [
      createMovie({
        watchedDate: new Date('2022-01-01'),
        dateMarkedWatched: new Date('2023-01-01'),
      }),
    ]

    const breakdown = computeYearlyWatching(movies)

    expect(breakdown['2022']).toBe(1)
    expect(breakdown['2023']).toBeUndefined()
  })

  it('should fallback to dateMarkedWatched', () => {
    const movies = [
      createMovie({
        watchedDate: undefined,
        dateMarkedWatched: new Date('2022-06-15'),
      }),
    ]

    const breakdown = computeYearlyWatching(movies)

    expect(breakdown['2022']).toBe(1)
  })

  it('should handle movies across multiple years', () => {
    const movies = [
      createMovie({ watchedDate: new Date('2020-01-01') }),
      createMovie({ watchedDate: new Date('2021-06-15') }),
      createMovie({ watchedDate: new Date('2022-12-31') }),
      createMovie({ watchedDate: new Date('2023-03-10') }),
    ]

    const breakdown = computeYearlyWatching(movies)

    expect(breakdown['2020']).toBe(1)
    expect(breakdown['2021']).toBe(1)
    expect(breakdown['2022']).toBe(1)
    expect(breakdown['2023']).toBe(1)
  })
})

// ============================================================================
// REWATCH STATISTICS TESTS
// ============================================================================

describe('computeRewatchStats', () => {
  it('should compute correct rewatch statistics', () => {
    const stats = computeRewatchStats(sampleMovies)

    expect(stats.moviesRewatched).toBe(1) // Only movie 9
    expect(stats.totalRewatches).toBe(2) // Movie 9 has rewatchCount: 2
    expect(stats.rewatchRate).toBe(11.1) // 1/9 * 100
  })

  it('should handle no rewatches', () => {
    const noRewatches = sampleMovies.map((m) => ({
      ...m,
      rewatch: false,
      rewatchCount: undefined,
    }))

    const stats = computeRewatchStats(noRewatches)

    expect(stats.moviesRewatched).toBe(0)
    expect(stats.totalRewatches).toBe(0)
    expect(stats.rewatchRate).toBe(0)
  })

  it('should handle multiple rewatched movies', () => {
    const movies = [
      createMovie({ rewatch: true, rewatchCount: 1 }),
      createMovie({ rewatch: true, rewatchCount: 2 }),
      createMovie({ rewatch: true, rewatchCount: 3 }),
    ]

    const stats = computeRewatchStats(movies)

    expect(stats.moviesRewatched).toBe(3)
    expect(stats.totalRewatches).toBe(6) // 1 + 2 + 3
    expect(stats.rewatchRate).toBe(100)
  })

  it('should return zeros for empty movies', () => {
    const stats = computeRewatchStats([])

    expect(stats.moviesRewatched).toBe(0)
    expect(stats.totalRewatches).toBe(0)
    expect(stats.rewatchRate).toBe(0)
  })
})

// ============================================================================
// TIME SPAN TESTS
// ============================================================================

describe('computeTimeSpan', () => {
  it('should compute correct time span', () => {
    const span = computeTimeSpan(sampleMovies)

    expect(span.earliestWatchDate).toEqual(new Date('2023-01-01'))
    expect(span.latestWatchDate).toEqual(new Date('2023-08-10'))
    expect(span.trackingSpan).toBe(221) // Days between Jan 1 and Aug 10
  })

  it('should handle single movie', () => {
    const single = [sampleMovies[0]]
    const span = computeTimeSpan(single)

    expect(span.trackingSpan).toBe(0) // Same date
  })

  it('should return empty for empty movies', () => {
    const span = computeTimeSpan([])

    expect(span.earliestWatchDate).toBeUndefined()
    expect(span.latestWatchDate).toBeUndefined()
    expect(span.trackingSpan).toBeUndefined()
  })
})

// ============================================================================
// MAIN ANALYTICS TESTS
// ============================================================================

describe('computeAnalytics', () => {
  it('should compute complete analytics overview', () => {
    const analytics = computeAnalytics(sampleMovies)

    expect(analytics.totalMoviesWatched).toBe(9)
    expect(analytics.moviesRated).toBe(8)
    expect(analytics.moviesLiked).toBe(1)
    expect(analytics.ratingCoverage).toBe(88.9)
    expect(analytics.likeRatio).toBe(11.1)
    expect(analytics.averageRating).toBeGreaterThan(0)
    expect(analytics.medianRating).toBeGreaterThan(0)
    expect(Object.keys(analytics.ratingDistribution).length).toBeGreaterThan(0)
    expect(Object.keys(analytics.decadeBreakdown).length).toBeGreaterThan(0)
    expect(Object.keys(analytics.yearlyWatching).length).toBeGreaterThan(0)
    expect(analytics.moviesRewatched).toBe(1)
    expect(analytics.totalRewatches).toBe(2)
    expect(analytics.trackingSpan).toBeGreaterThan(0)
  })

  it('should handle empty movies', () => {
    const analytics = computeAnalytics([])

    expect(analytics.totalMoviesWatched).toBe(0)
    expect(analytics.averageRating).toBe(0)
    expect(Object.keys(analytics.ratingDistribution)).toHaveLength(0)
  })

  it('should compute consistent results on repeated calls', () => {
    const result1 = computeAnalytics(sampleMovies)
    const result2 = computeAnalytics(sampleMovies)

    expect(result1).toEqual(result2)
  })
})

// ============================================================================
// UTILITY FUNCTION TESTS
// ============================================================================

describe('Utility Functions', () => {
  describe('getTopMoviesByRating', () => {
    it('should return top rated movies', () => {
      const top = getTopMoviesByRating(sampleMovies, 3)

      expect(top).toHaveLength(3)
      expect(top[0].rating).toBe(5.0)
      expect(top[1].rating).toBe(4.5)
    })

    it('should exclude unrated movies', () => {
      const top = getTopMoviesByRating(sampleMovies, 10)

      expect(top.every((m) => m.rating !== undefined)).toBe(true)
    })
  })

  describe('getTopRewatchedMovies', () => {
    it('should return top rewatched movies', () => {
      const top = getTopRewatchedMovies(sampleMovies, 5)

      expect(top[0].rewatch).toBe(true)
      expect(top[0].rewatchCount).toBeGreaterThan(0)
    })

    it('should return empty for no rewatches', () => {
      const noRewatches = sampleMovies.map((m) => ({
        ...m,
        rewatch: false,
      }))

      const top = getTopRewatchedMovies(noRewatches)

      expect(top).toHaveLength(0)
    })
  })

  describe('getMoviesByYear', () => {
    it('should return movies from specific year', () => {
      const movies2023 = getMoviesByYear(sampleMovies, 2023)

      expect(movies2023.length).toBeGreaterThan(0)
      expect(
        movies2023.every((m) => {
          const year = (m.watchedDate || m.dateMarkedWatched).getFullYear()
          return year === 2023
        })
      ).toBe(true)
    })

    it('should return empty for year with no movies', () => {
      const movies2025 = getMoviesByYear(sampleMovies, 2025)
      expect(movies2025).toHaveLength(0)
    })
  })

  describe('getMoviesByDecade', () => {
    it('should return movies from specific decade', () => {
      const movies1990s = getMoviesByDecade(sampleMovies, 1990)

      expect(movies1990s).toHaveLength(3)
      expect(movies1990s.every((m) => m.decade === 1990)).toBe(true)
    })
  })

  describe('getMoviesByRating', () => {
    it('should return movies with specific rating', () => {
      const rated45 = getMoviesByRating(sampleMovies, 4.5)

      expect(rated45).toHaveLength(3)
      expect(rated45.every((m) => m.rating === 4.5)).toBe(true)
    })
  })

  describe('getMoviesWithTags', () => {
    it('should return only tagged movies', () => {
      const tagged = getMoviesWithTags(sampleMovies)

      expect(tagged.length).toBeGreaterThan(0)
      expect(tagged.every((m) => m.tags && m.tags.length > 0)).toBe(true)
    })
  })

  describe('getLikedMovies', () => {
    it('should return only liked movies', () => {
      const liked = getLikedMovies(sampleMovies)

      expect(liked).toHaveLength(1)
      expect(liked[0].liked).toBe(true)
    })
  })

  describe('getUnratedMovies', () => {
    it('should return unrated movies', () => {
      const unrated = getUnratedMovies(sampleMovies)

      expect(unrated).toHaveLength(1) // Movie 6
      expect(unrated[0].rating).toBeUndefined()
    })
  })
})

// ============================================================================
// ADVANCED ANALYTICS TESTS
// ============================================================================

describe('Advanced Analytics', () => {
  describe('computeTagDistribution', () => {
    it('should compute tag frequency', () => {
      const tags = computeTagDistribution(sampleMovies)

      expect(tags['sci-fi']).toBe(1)
      expect(tags['action']).toBe(1)
    })

    it('should handle no tags', () => {
      const noTags = sampleMovies.map((m) => ({ ...m, tags: undefined }))
      const tags = computeTagDistribution(noTags)

      expect(Object.keys(tags)).toHaveLength(0)
    })
  })

  describe('getRatingsByDecade', () => {
    it('should compute average ratings by decade', () => {
      const ratings = getRatingsByDecade(sampleMovies)

      expect(ratings['1990s']).toBeDefined()
      expect(ratings['1990s'].average).toBeGreaterThan(0)
      expect(ratings['1990s'].count).toBe(3)
    })
  })

  describe('getRatingsByYear', () => {
    it('should compute average ratings by year', () => {
      const ratings = getRatingsByYear(sampleMovies)

      expect(ratings['2023']).toBeDefined()
      expect(ratings['2023'].count).toBe(8) // Rated movies only
    })
  })

  describe('computeViewingVelocity', () => {
    it('should compute movies per day', () => {
      const velocity = computeViewingVelocity(sampleMovies)

      expect(velocity).toBeGreaterThan(0)
      expect(velocity).toBeLessThan(1) // Less than 1 movie per day
    })

    it('should return 0 for single movie', () => {
      const single = [sampleMovies[0]]
      const velocity = computeViewingVelocity(single)

      expect(velocity).toBe(0)
    })
  })

  describe('computeRatingConsistency', () => {
    it('should compute standard deviation', () => {
      const consistency = computeRatingConsistency(sampleMovies)

      expect(consistency).toBeGreaterThan(0)
      expect(consistency).toBeLessThan(1)
    })

    it('should return 0 for all same ratings', () => {
      const sameRatings = sampleMovies.map((m) => ({
        ...m,
        rating: 4.0,
      }))

      const consistency = computeRatingConsistency(sameRatings)

      expect(consistency).toBe(0)
    })

    it('should return 0 for no ratings', () => {
      const unrated = sampleMovies.map((m) => ({
        ...m,
        rating: undefined,
      }))

      const consistency = computeRatingConsistency(unrated)

      expect(consistency).toBe(0)
    })
  })
})

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('Performance', () => {
  it('should compute analytics for 1000 movies in <100ms', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) =>
      createMovie({
        id: `https://boxd.it/${i}`,
        year: 1900 + (i % 120),
        watchedDate: new Date(2020 + Math.floor(i / 250), i % 12, 1),
        rating: (0.5 + (i % 10) * 0.5),
      })
    )

    const start = performance.now()
    computeAnalytics(largeDataset)
    const end = performance.now()

    const duration = end - start

    expect(duration).toBeLessThan(100) // Target: <100ms
  })
})

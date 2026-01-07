/**
 * Test data factory functions
 * Generate consistent, realistic test data for all test scenarios
 */

import type { Movie, MovieDataset, UserProfile } from '@/lib/types'

/**
 * Create a mock Movie object with defaults and optional overrides
 * @example
 * createMockMovie() // Returns movie with all defaults
 * createMockMovie({ title: 'Custom', rating: 4.5 }) // Override specific fields
 */
export function createMockMovie(overrides?: Partial<Movie>): Movie {
  const defaults: Movie = {
    id: `https://boxd.it/${Math.random().toString(36).substr(2, 6)}`,
    title: 'Test Movie',
    year: 2020,
    watchedDate: new Date('2020-01-15'),
    dateMarkedWatched: new Date('2020-01-15'),
    rating: undefined,
    ratingDate: undefined,
    rewatch: false,
    rewatchCount: 1,
    rewatchDates: [],
    tags: [],
    liked: false,
    decade: 2020,
    era: 'contemporary',
  }

  return { ...defaults, ...overrides }
}

/**
 * Create N mock movies for a given decade
 * Useful for testing decade breakdown calculations
 */
export function createMoviesForDecade(startYear: number, count: number): Movie[] {
  const decade = Math.floor(startYear / 10) * 10
  return Array.from({ length: count }, (_, i) => {
    const year = startYear + (i % 10)
    const month = (i % 12) + 1
    const day = (i % 28) + 1
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    return createMockMovie({
      id: `https://boxd.it/${String(decade)}${String(i).padStart(4, '0')}`,
      title: `${decade}s Movie ${i + 1}`,
      year,
      watchedDate: new Date(dateStr),
      dateMarkedWatched: new Date(dateStr),
      decade,
    })
  })
}

/**
 * Create N mock movies with varying ratings
 * Useful for testing analytics calculations
 */
export function createMoviesWithRatings(count: number, ratingPattern?: number[]): Movie[] {
  const ratings = ratingPattern || [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]

  return Array.from({ length: count }, (_, i) => {
    const rating = ratings[i % ratings.length]
    const year = 1990 + (i % 30)
    const month = (i % 12) + 1
    const day = (i % 28) + 1
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    return createMockMovie({
      id: `https://boxd.it/rated${String(i).padStart(4, '0')}`,
      title: `Rated Movie ${i + 1}`,
      year,
      rating,
      ratingDate: new Date(dateStr),
      watchedDate: new Date(dateStr),
      dateMarkedWatched: new Date(dateStr),
    })
  })
}

/**
 * Create N mock movies with rewatches
 * Useful for testing rewatch counting and aggregation
 */
export function createMoviesWithRewatches(count: number): Movie[] {
  return Array.from({ length: count }, (_, i) => {
    const rewatchCount = (i % 5) + 1 // 1-5 rewatches
    const baseYear = 2015 + (i % 10)
    const baseMonth = (i % 12) + 1
    const baseDay = (i % 28) + 1
    const baseDateStr = `${baseYear}-${String(baseMonth).padStart(2, '0')}-${String(baseDay).padStart(2, '0')}`

    const rewatchDates = Array.from({ length: rewatchCount }, (_, j) => {
      const yearOffset = j
      const watchYear = baseYear + yearOffset
      return new Date(`${watchYear}-${String(baseMonth).padStart(2, '0')}-${String(baseDay).padStart(2, '0')}`)
    })

    return createMockMovie({
      id: `https://boxd.it/rewatch${String(i).padStart(4, '0')}`,
      title: `Rewatch Movie ${i + 1}`,
      year: baseYear,
      rewatch: rewatchCount > 1,
      rewatchCount,
      rewatchDates,
      watchedDate: new Date(baseDateStr),
      dateMarkedWatched: new Date(baseDateStr),
    })
  })
}

/**
 * Create a mock MovieDataset
 * Complete dataset with all movie arrays
 */
export function createMockDataset(options?: {
  watchedCount?: number
  watchlistCount?: number
  hasUserProfile?: boolean
}): MovieDataset {
  const { watchedCount = 10, watchlistCount = 0, hasUserProfile = false } = options || {}

  const watched = Array.from({ length: watchedCount }, (_, i) =>
    createMockMovie({
      id: `https://boxd.it/movie${String(i).padStart(4, '0')}`,
      title: `Movie ${i + 1}`,
      year: 1990 + (i % 30),
    })
  )

  const watchlist = Array.from({ length: watchlistCount }, (_, i) =>
    createMockMovie({
      id: `https://boxd.it/unwatched${String(i).padStart(4, '0')}`,
      title: `Unwatched Movie ${i + 1}`,
      year: 2023 + (i % 3),
    })
  )

  return {
    watched,
    watchlist,
    userProfile: hasUserProfile ? createMockUserProfile() : undefined,
    lastUpdated: new Date(),
    uploadedFiles: ['watched.csv', 'diary.csv'],
  }
}

/**
 * Create a mock UserProfile
 */
export function createMockUserProfile(overrides?: Partial<UserProfile>): UserProfile {
  const defaults: UserProfile = {
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    location: 'Test City',
    website: 'https://example.com',
    bio: 'Test bio',
    pronoun: 'they/them',
    joinDate: new Date('2020-01-01'),
    favoriteFilms: [
      { uri: 'https://boxd.it/1skk', title: 'Inception', rating: 5, watched: true },
      { uri: 'https://boxd.it/2b0k', title: 'The Dark Knight', rating: 5, watched: true },
    ],
  }

  return { ...defaults, ...overrides }
}

/**
 * Create test data for a complete workflow
 * Simulates: upload → parse → merge → analyze
 */
export function createCompleteTestDataset(): {
  watched: Movie[]
  diary: Movie[]
  ratings: Movie[]
  films: Movie[]
  expected: { totalMovies: number; ratedCount: number; likedCount: number; rewatch: boolean }
} {
  const watched = [
    createMockMovie({
      id: 'https://boxd.it/1skk',
      title: 'Inception',
      year: 2010,
      watchedDate: new Date('2020-01-15'),
      dateMarkedWatched: new Date('2020-01-15'),
    }),
    createMockMovie({
      id: 'https://boxd.it/2b0k',
      title: 'The Dark Knight',
      year: 2008,
      watchedDate: new Date('2020-02-20'),
      dateMarkedWatched: new Date('2020-02-20'),
    }),
    createMockMovie({
      id: 'https://boxd.it/2aHi',
      title: 'The Shawshank Redemption',
      year: 1994,
      watchedDate: new Date('2020-03-10'),
      dateMarkedWatched: new Date('2020-03-10'),
    }),
  ]

  const diary = [
    createMockMovie({
      id: 'https://boxd.it/1skk',
      title: 'Inception',
      year: 2010,
      rating: 5,
      ratingDate: new Date('2020-01-15'),
      watchedDate: new Date('2020-01-15'),
      dateMarkedWatched: new Date('2020-01-15'),
    }),
    createMockMovie({
      id: 'https://boxd.it/1skk',
      title: 'Inception',
      year: 2010,
      rewatchDates: [new Date('2021-06-10')],
      watchedDate: new Date('2021-06-10'),
      dateMarkedWatched: new Date('2021-06-10'),
    }),
  ]

  const ratings = [
    createMockMovie({
      id: 'https://boxd.it/2b0k',
      title: 'The Dark Knight',
      year: 2008,
      rating: 4.5,
    }),
  ]

  const films = [
    createMockMovie({
      id: 'https://boxd.it/1skk',
      title: 'Inception',
      year: 2010,
      liked: true,
    }),
  ]

  return {
    watched,
    diary,
    ratings,
    films,
    expected: {
      totalMovies: 3,
      ratedCount: 2,
      likedCount: 1,
      rewatch: true,
    },
  }
}

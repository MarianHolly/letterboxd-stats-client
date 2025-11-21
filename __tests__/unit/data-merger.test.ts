/**
 * Unit tests for Data Merger module
 * Tests CSV merging, conflict resolution, and deduplication
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import {
  mergeMovieSources,
  deduplicateMovies,
  resolveConflicts,
  updateDataset,
} from '../../lib/data-merger'
import type { Movie, MovieDataset } from '../../lib/types'

// ============================================================================
// TEST DATA FIXTURES
// ============================================================================

const createMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 'https://boxd.it/test1',
  title: 'Test Movie',
  year: 2020,
  dateMarkedWatched: new Date('2023-01-01'),
  rewatch: false,
  decade: 2020,
  era: 'contemporary',
  ...overrides,
})

const watchedMovies: Movie[] = [
  createMovie({
    id: 'https://boxd.it/movie1',
    title: 'The Shawshank Redemption',
    year: 1994,
    dateMarkedWatched: new Date('2023-01-15'),
  }),
  createMovie({
    id: 'https://boxd.it/movie2',
    title: 'The Godfather',
    year: 1972,
    dateMarkedWatched: new Date('2023-02-10'),
  }),
  createMovie({
    id: 'https://boxd.it/movie3',
    title: 'Inception',
    year: 2010,
    dateMarkedWatched: new Date('2023-03-05'),
  }),
]

const diaryMovies: Movie[] = [
  createMovie({
    id: 'https://boxd.it/movie1',
    title: 'The Shawshank Redemption',
    year: 1994,
    watchedDate: new Date('2022-12-20'),
    dateMarkedWatched: new Date('2023-01-15'),
    rating: 4.5,
    tags: ['favorite', 'prison-drama'],
    rewatch: false,
  }),
  createMovie({
    id: 'https://boxd.it/movie2',
    title: 'The Godfather',
    year: 1972,
    watchedDate: new Date('2023-02-10'),
    rating: 5.0,
    rewatch: true,
    rewatchCount: 1,
    rewatchDates: [new Date('2023-02-10')],
  }),
  createMovie({
    id: 'https://boxd.it/movie4',
    title: 'Pulp Fiction',
    year: 1994,
    watchedDate: new Date('2023-04-01'),
    rating: 4.0,
    rewatch: false,
  }),
]

const ratingsMovies: Movie[] = [
  createMovie({
    id: 'https://boxd.it/movie1',
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 5.0, // Override diary rating
    ratingDate: new Date('2023-05-01'),
  }),
  createMovie({
    id: 'https://boxd.it/movie3',
    title: 'Inception',
    year: 2010,
    rating: 4.5,
    ratingDate: new Date('2023-03-10'),
  }),
]

const filmsMovies: Movie[] = [
  createMovie({
    id: 'https://boxd.it/movie1',
    title: 'The Shawshank Redemption',
    year: 1994,
    liked: true,
  }),
  createMovie({
    id: 'https://boxd.it/movie3',
    title: 'Inception',
    year: 2010,
    liked: true,
  }),
]

const watchlistMovies: Movie[] = [
  createMovie({
    id: 'https://boxd.it/unwatched1',
    title: 'The Matrix',
    year: 1999,
    dateMarkedWatched: new Date('2023-06-01'),
  }),
  createMovie({
    id: 'https://boxd.it/unwatched2',
    title: 'Avatar',
    year: 2009,
    dateMarkedWatched: new Date('2023-06-05'),
  }),
]

// ============================================================================
// DEDUPLICATION TESTS
// ============================================================================

describe('deduplicateMovies', () => {
  it('should remove exact duplicates', () => {
    const movies: Movie[] = [
      createMovie({ id: 'https://boxd.it/m1', title: 'Movie 1' }),
      createMovie({ id: 'https://boxd.it/m1', title: 'Movie 1' }),
      createMovie({ id: 'https://boxd.it/m2', title: 'Movie 2' }),
    ]

    const result = deduplicateMovies(movies)

    expect(result).toHaveLength(2)
    expect(result.map((m) => m.id)).toEqual([
      'https://boxd.it/m1',
      'https://boxd.it/m2',
    ])
  })

  it('should keep entry with more complete data when duplicates exist', () => {
    const incomplete = createMovie({
      id: 'https://boxd.it/m1',
      title: 'Movie 1',
    })
    const complete = createMovie({
      id: 'https://boxd.it/m1',
      title: 'Movie 1',
      rating: 4.5,
      tags: ['tag1'],
      liked: true,
    })

    const movies = [incomplete, complete]
    const result = deduplicateMovies(movies)

    expect(result).toHaveLength(1)
    expect(result[0].rating).toBe(4.5)
    expect(result[0].tags).toEqual(['tag1'])
    expect(result[0].liked).toBe(true)
  })

  it('should handle empty array', () => {
    const result = deduplicateMovies([])
    expect(result).toEqual([])
  })

  it('should preserve unique movies', () => {
    const result = deduplicateMovies(watchedMovies)
    expect(result).toHaveLength(3)
    expect(result.map((m) => m.id)).toEqual([
      'https://boxd.it/movie1',
      'https://boxd.it/movie2',
      'https://boxd.it/movie3',
    ])
  })
})

// ============================================================================
// CONFLICT RESOLUTION TESTS
// ============================================================================

describe('resolveConflicts', () => {
  it('should apply ratings priority from ratings.csv', () => {
    const existing = createMovie({
      id: 'https://boxd.it/m1',
      rating: 4.0,
    })
    const incoming = createMovie({
      id: 'https://boxd.it/m1',
      rating: 5.0,
    })

    const result = resolveConflicts(existing, incoming, 'ratings')

    expect(result.rating).toBe(5.0)
  })

  it('should apply watched date priority from diary.csv', () => {
    const diaryDate = new Date('2022-01-01')
    const existing = createMovie({
      id: 'https://boxd.it/m1',
      watchedDate: undefined,
    })
    const incoming = createMovie({
      id: 'https://boxd.it/m1',
      watchedDate: diaryDate,
    })

    const result = resolveConflicts(existing, incoming, 'diary')

    expect(result.watchedDate).toEqual(diaryDate)
  })

  it('should preserve tags from diary.csv', () => {
    const existing = createMovie({ id: 'https://boxd.it/m1' })
    const incoming = createMovie({
      id: 'https://boxd.it/m1',
      tags: ['favorite', 'rewatch'],
    })

    const result = resolveConflicts(existing, incoming, 'diary')

    expect(result.tags).toEqual(['favorite', 'rewatch'])
  })

  it('should aggregate rewatch information from diary', () => {
    const existing = createMovie({
      id: 'https://boxd.it/m1',
      rewatch: false,
    })
    const incoming = createMovie({
      id: 'https://boxd.it/m1',
      rewatch: true,
      rewatchCount: 2,
      rewatchDates: [
        new Date('2023-01-01'),
        new Date('2023-02-01'),
      ],
    })

    const result = resolveConflicts(existing, incoming, 'diary')

    expect(result.rewatch).toBe(true)
    expect(result.rewatchCount).toBe(2)
    expect(result.rewatchDates).toHaveLength(2)
  })

  it('should add liked flag from films.csv', () => {
    const existing = createMovie({
      id: 'https://boxd.it/m1',
      liked: undefined,
    })
    const incoming = createMovie({
      id: 'https://boxd.it/m1',
      liked: true,
    })

    const result = resolveConflicts(existing, incoming, 'films')

    expect(result.liked).toBe(true)
  })

  it('should not override existing rating with diary if diary rating is undefined', () => {
    const existing = createMovie({
      id: 'https://boxd.it/m1',
      rating: 4.0,
    })
    const incoming = createMovie({
      id: 'https://boxd.it/m1',
      rating: undefined,
    })

    const result = resolveConflicts(existing, incoming, 'diary')

    expect(result.rating).toBe(4.0)
  })

  it('should fill in missing watched.csv fields only', () => {
    const existing = createMovie({
      id: 'https://boxd.it/m1',
      watchedDate: new Date('2023-01-01'),
    })
    const incoming = createMovie({
      id: 'https://boxd.it/m1',
      watchedDate: new Date('2022-01-01'), // Different, but shouldn't override
      rating: 4.5,
    })

    const result = resolveConflicts(existing, incoming, 'watched')

    expect(result.watchedDate).toEqual(new Date('2023-01-01')) // Keep existing
    expect(result.rating).toBeUndefined() // Not set by watched
  })
})

// ============================================================================
// MERGE FUNCTION TESTS
// ============================================================================

describe('mergeMovieSources', () => {
  it('should throw error if watched.csv is empty', () => {
    expect(() => mergeMovieSources([])).toThrow(
      'watched.csv is mandatory - no movies to process'
    )
  })

  it('should merge watched.csv only', () => {
    const result = mergeMovieSources(watchedMovies)

    expect(result.watched).toHaveLength(3)
    expect(result.watchlist).toHaveLength(0)
    expect(result.uploadedFiles).toEqual(['watched'])
    expect(result.lastUpdated).toBeInstanceOf(Date)
  })

  it('should merge watched.csv with diary.csv', () => {
    const result = mergeMovieSources(watchedMovies, diaryMovies)

    expect(result.watched).toHaveLength(4) // 3 from watched + 1 new from diary
    expect(result.uploadedFiles).toEqual(['watched', 'diary'])

    // Check movie1 has diary enrichment
    const movie1 = result.watched.find((m) => m.id === 'https://boxd.it/movie1')
    expect(movie1?.rating).toBe(4.5)
    expect(movie1?.tags).toEqual(['favorite', 'prison-drama'])
    expect(movie1?.watchedDate).toEqual(new Date('2022-12-20'))
  })

  it('should apply ratings priority over diary', () => {
    const result = mergeMovieSources(watchedMovies, diaryMovies, ratingsMovies)

    // movie1 should have ratings.csv rating (5.0) not diary (4.5)
    const movie1 = result.watched.find((m) => m.id === 'https://boxd.it/movie1')
    expect(movie1?.rating).toBe(5.0)
  })

  it('should add liked flag from films.csv', () => {
    const result = mergeMovieSources(watchedMovies, undefined, undefined, filmsMovies)

    const movie1 = result.watched.find((m) => m.id === 'https://boxd.it/movie1')
    const movie3 = result.watched.find((m) => m.id === 'https://boxd.it/movie3')

    expect(movie1?.liked).toBe(true)
    expect(movie3?.liked).toBe(true)

    // movie2 should not have liked flag
    const movie2 = result.watched.find((m) => m.id === 'https://boxd.it/movie2')
    expect(movie2?.liked).toBeUndefined()
  })

  it('should separate watchlist from watched movies', () => {
    const result = mergeMovieSources(watchedMovies, undefined, undefined, undefined, watchlistMovies)

    expect(result.watched).toHaveLength(3)
    expect(result.watchlist).toHaveLength(2)
    expect(result.uploadedFiles).toContain('watchlist')

    const watchlistIds = result.watchlist.map((m) => m.id)
    expect(watchlistIds).toContain('https://boxd.it/unwatched1')
    expect(watchlistIds).toContain('https://boxd.it/unwatched2')
  })

  it('should merge all sources together', () => {
    const result = mergeMovieSources(
      watchedMovies,
      diaryMovies,
      ratingsMovies,
      filmsMovies,
      watchlistMovies
    )

    expect(result.watched.length).toBeGreaterThan(0)
    expect(result.watchlist).toHaveLength(2)
    expect(result.uploadedFiles).toEqual(['watched', 'films', 'diary', 'ratings', 'watchlist'])

    // Verify a fully merged movie has all enrichments
    const movie1 = result.watched.find((m) => m.id === 'https://boxd.it/movie1')
    expect(movie1?.rating).toBe(5.0) // From ratings (highest priority)
    expect(movie1?.liked).toBe(true) // From films
    expect(movie1?.tags).toEqual(['favorite', 'prison-drama']) // From diary
  })

  it('should handle rewatch aggregation', () => {
    const rewatchDiary: Movie[] = [
      createMovie({
        id: 'https://boxd.it/movie1',
        watchedDate: new Date('2022-01-01'),
        rewatch: false,
      }),
      createMovie({
        id: 'https://boxd.it/movie1',
        watchedDate: new Date('2023-01-01'),
        rewatch: true,
      }),
      createMovie({
        id: 'https://boxd.it/movie1',
        watchedDate: new Date('2023-06-01'),
        rewatch: true,
      }),
    ]

    const result = mergeMovieSources(watchedMovies, rewatchDiary)

    const movie1 = result.watched.find((m) => m.id === 'https://boxd.it/movie1')
    expect(movie1?.rewatch).toBe(true)
    expect(movie1?.rewatchCount).toBe(2) // 3 entries - 1 = 2 rewatches
    expect(movie1?.rewatchDates).toHaveLength(2)
  })

  it('should preserve diary entries not in watched', () => {
    const result = mergeMovieSources(watchedMovies, diaryMovies)

    // movie4 (Pulp Fiction) is in diary but not watched
    const movie4 = result.watched.find((m) => m.id === 'https://boxd.it/movie4')
    expect(movie4).toBeDefined()
    expect(movie4?.title).toBe('Pulp Fiction')
    expect(movie4?.rating).toBe(4.0)
  })

  it('should deduplicate final watched movies', () => {
    const duplicateWatched = [
      ...watchedMovies,
      createMovie({
        id: 'https://boxd.it/movie1',
        title: 'The Shawshank Redemption',
        year: 1994,
        rating: 3.5, // Lower priority source, should be overridden
      }),
    ]

    const result = mergeMovieSources(duplicateWatched)

    const movie1Entries = result.watched.filter((m) => m.id === 'https://boxd.it/movie1')
    expect(movie1Entries).toHaveLength(1) // Only one entry despite duplicates
  })
})

// ============================================================================
// UPDATE DATASET TESTS
// ============================================================================

describe('updateDataset', () => {
  let existingDataset: MovieDataset

  beforeEach(() => {
    existingDataset = mergeMovieSources(watchedMovies)
  })

  it('should update with new watched movies', () => {
    const newWatched = [
      ...watchedMovies,
      createMovie({
        id: 'https://boxd.it/newmovie',
        title: 'New Movie',
        year: 2024,
      }),
    ]

    const result = updateDataset(existingDataset, newWatched)

    expect(result.watched).toHaveLength(4)
    const newMovie = result.watched.find((m) => m.id === 'https://boxd.it/newmovie')
    expect(newMovie).toBeDefined()
  })

  it('should preserve existing data if no new data provided', () => {
    const result = updateDataset(existingDataset)

    expect(result.watched).toHaveLength(3)
    expect(result.uploadedFiles).toEqual(['watched'])
  })

  it('should merge new ratings with existing dataset', () => {
    const result = updateDataset(existingDataset, undefined, undefined, ratingsMovies)

    const movie1 = result.watched.find((m) => m.id === 'https://boxd.it/movie1')
    expect(movie1?.rating).toBe(5.0)
  })

  it('should update lastUpdated timestamp', () => {
    const before = new Date()
    const result = updateDataset(existingDataset, watchedMovies)
    const after = new Date()

    expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(after.getTime())
  })
})

// ============================================================================
// EDGE CASES
// ============================================================================

describe('Edge Cases', () => {
  it('should handle movies with missing optional fields', () => {
    const minimal: Movie[] = [
      {
        id: 'https://boxd.it/m1',
        title: 'Minimal Movie',
        year: 2000,
        dateMarkedWatched: new Date(),
        rewatch: false,
        decade: 2000,
        era: 'contemporary',
      },
    ]

    const result = mergeMovieSources(minimal)

    expect(result.watched).toHaveLength(1)
    expect(result.watched[0].rating).toBeUndefined()
    expect(result.watched[0].tags).toBeUndefined()
  })

  it('should handle null/undefined values gracefully', () => {
    const result = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined)

    expect(result.watched).toHaveLength(3)
    expect(result.watchlist).toHaveLength(0)
    expect(result.uploadedFiles).toEqual(['watched'])
  })

  it('should handle empty arrays for optional CSVs', () => {
    const result = mergeMovieSources(watchedMovies, [], [], [], [])

    expect(result.watched).toHaveLength(3)
    expect(result.watchlist).toHaveLength(0)
  })

  it('should maintain data integrity through multiple merges', () => {
    const first = mergeMovieSources(watchedMovies)
    const second = mergeMovieSources(first.watched, diaryMovies)

    const movie1 = second.watched.find((m) => m.id === 'https://boxd.it/movie1')
    expect(movie1?.tags).toEqual(['favorite', 'prison-drama'])
  })

  it('should handle very large number of rewatches', () => {
    const manyRewatches: Movie[] = []
    for (let i = 0; i < 100; i++) {
      manyRewatches.push(
        createMovie({
          id: 'https://boxd.it/movie1',
          watchedDate: new Date(2020 + Math.floor(i / 12), i % 12, 1),
          rewatch: i > 0,
        })
      )
    }

    const result = mergeMovieSources(watchedMovies, manyRewatches)

    const movie1 = result.watched.find((m) => m.id === 'https://boxd.it/movie1')
    expect(movie1?.rewatchCount).toBe(99) // 100 - 1
    expect(movie1?.rewatchDates).toHaveLength(99)
  })
})

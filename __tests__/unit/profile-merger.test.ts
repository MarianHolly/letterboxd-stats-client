/**
 * Unit tests for Profile integration with Data Merger
 * Tests merging profile data with movie datasets
 */

import { describe, it, expect } from '@jest/globals'
import { mergeMovieSources } from '@/lib/data-merger'
import type { Movie, UserProfile, MovieDataset } from '@/lib/types'

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

const createProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  username: 'testuser',
  favoriteFilms: [],
  ...overrides,
})

const watchedMovies: Movie[] = [
  createMovie({
    id: 'https://boxd.it/movie1',
    title: 'The Shawshank Redemption',
    year: 1994,
  }),
  createMovie({
    id: 'https://boxd.it/movie2',
    title: 'The Godfather',
    year: 1972,
  }),
  createMovie({
    id: 'https://boxd.it/movie3',
    title: 'Inception',
    year: 2010,
  }),
]

describe('Profile Merger Integration', () => {
  // ============================================================================
  // BASIC PROFILE MERGING
  // ============================================================================

  describe('mergeMovieSources - Profile integration', () => {
    it('should include profile in merged dataset when provided', () => {
      const profile = createProfile({
        username: 'cinemaloveur',
        firstName: 'Jean',
        lastName: 'Dupont',
      })

      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)

      expect(dataset.userProfile).toBeDefined()
      expect(dataset.userProfile?.username).toBe('cinemaloveur')
      expect(dataset.userProfile?.firstName).toBe('Jean')
      expect(dataset.userProfile?.lastName).toBe('Dupont')
    })

    it('should set userProfile to undefined when no profile provided', () => {
      const dataset = mergeMovieSources(watchedMovies)

      expect(dataset.userProfile).toBeUndefined()
    })

    it('should track profile as uploaded file', () => {
      const profile = createProfile({ username: 'testuser' })

      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)

      expect(dataset.uploadedFiles).toContain('profile')
    })

    it('should NOT track profile as uploaded file when not provided', () => {
      const dataset = mergeMovieSources(watchedMovies)

      expect(dataset.uploadedFiles).not.toContain('profile')
    })

    it('should preserve all profile fields in merged dataset', () => {
      const profile = createProfile({
        username: 'filmcritic',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        location: 'New York',
        website: 'https://example.com',
        bio: 'Film enthusiast and critic',
        pronoun: 'He / him',
        joinDate: new Date('2020-01-01'),
        favoriteFilms: [
          {
            uri: 'https://boxd.it/abc',
            title: 'Test Film 1',
            rating: 5.0,
            watched: true,
          },
        ],
      })

      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)
      const mergedProfile = dataset.userProfile

      expect(mergedProfile?.username).toBe('filmcritic')
      expect(mergedProfile?.firstName).toBe('John')
      expect(mergedProfile?.lastName).toBe('Smith')
      expect(mergedProfile?.email).toBe('john@example.com')
      expect(mergedProfile?.location).toBe('New York')
      expect(mergedProfile?.website).toBe('https://example.com')
      expect(mergedProfile?.bio).toBe('Film enthusiast and critic')
      expect(mergedProfile?.pronoun).toBe('He / him')
      expect(mergedProfile?.joinDate).toEqual(new Date('2020-01-01'))
      expect(mergedProfile?.favoriteFilms).toHaveLength(1)
      expect(mergedProfile?.favoriteFilms[0].uri).toBe('https://boxd.it/abc')
    })
  })

  // ============================================================================
  // PROFILE WITH OTHER SOURCES
  // ============================================================================

  describe('mergeMovieSources - Profile with diary, ratings, films', () => {
    it('should merge profile alongside diary data', () => {
      const profile = createProfile({ username: 'testuser' })
      const diaryMovies: Movie[] = [
        createMovie({
          id: 'https://boxd.it/movie1',
          watchedDate: new Date('2023-01-01'),
          rating: 4.5,
        }),
      ]

      const dataset = mergeMovieSources(watchedMovies, diaryMovies, undefined, undefined, undefined, profile)

      expect(dataset.userProfile?.username).toBe('testuser')
      expect(dataset.watched[0].rating).toBe(4.5)
    })

    it('should merge profile alongside ratings data', () => {
      const profile = createProfile({ username: 'rater' })
      const ratingsMovies: Movie[] = [
        createMovie({
          id: 'https://boxd.it/movie1',
          rating: 5.0,
        }),
      ]

      const dataset = mergeMovieSources(watchedMovies, undefined, ratingsMovies, undefined, undefined, profile)

      expect(dataset.userProfile?.username).toBe('rater')
      expect(dataset.watched[0].rating).toBe(5.0)
    })

    it('should merge profile alongside films data', () => {
      const profile = createProfile({ username: 'filmlover' })
      const filmsMovies: Movie[] = [
        createMovie({
          id: 'https://boxd.it/movie1',
          liked: true,
        }),
      ]

      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, filmsMovies, undefined, profile)

      expect(dataset.userProfile?.username).toBe('filmlover')
      expect(dataset.watched[0].liked).toBe(true)
    })

    it('should merge profile with all sources combined', () => {
      const profile = createProfile({
        username: 'completeuser',
        favoriteFilms: [{ uri: 'https://boxd.it/fav1' }],
      })
      const diaryMovies: Movie[] = [createMovie({ id: 'https://boxd.it/movie1' })]
      const ratingsMovies: Movie[] = [createMovie({ id: 'https://boxd.it/movie2' })]
      const filmsMovies: Movie[] = [createMovie({ id: 'https://boxd.it/movie3' })]
      const watchlistMovies: Movie[] = [createMovie({ id: 'https://boxd.it/movie4' })]

      const dataset = mergeMovieSources(
        watchedMovies,
        diaryMovies,
        ratingsMovies,
        filmsMovies,
        watchlistMovies,
        profile
      )

      expect(dataset.userProfile?.username).toBe('completeuser')
      expect(dataset.watched).toHaveLength(3)
      expect(dataset.watchlist).toHaveLength(1)
      expect(dataset.uploadedFiles).toContain('diary')
      expect(dataset.uploadedFiles).toContain('ratings')
      expect(dataset.uploadedFiles).toContain('films')
      expect(dataset.uploadedFiles).toContain('watchlist')
      expect(dataset.uploadedFiles).toContain('profile')
    })
  })

  // ============================================================================
  // PROFILE SINGLETON BEHAVIOR
  // ============================================================================

  describe('mergeMovieSources - Profile singleton pattern', () => {
    it('should store exactly one profile per dataset', () => {
      const profile = createProfile({
        username: 'onlyuser',
        firstName: 'Only',
      })

      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)

      expect(dataset.userProfile).toBeDefined()
      expect(typeof dataset.userProfile).toBe('object')
      expect(dataset.userProfile?.username).toBe('onlyuser')
    })

    it('should overwrite profile when new profile merged', () => {
      const profile1 = createProfile({ username: 'user1' })
      const profile2 = createProfile({ username: 'user2' })

      // First merge
      let dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile1)
      expect(dataset.userProfile?.username).toBe('user1')

      // Second merge should replace first profile
      dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile2)
      expect(dataset.userProfile?.username).toBe('user2')
    })
  })

  // ============================================================================
  // PROFILE WITH FAVORITE FILMS
  // ============================================================================

  describe('mergeMovieSources - Favorite films', () => {
    it('should preserve favorite films from profile', () => {
      const profile = createProfile({
        username: 'user',
        favoriteFilms: [
          { uri: 'https://boxd.it/fav1', title: 'Film 1' },
          { uri: 'https://boxd.it/fav2', title: 'Film 2' },
          { uri: 'https://boxd.it/fav3', title: 'Film 3' },
        ],
      })

      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)

      expect(dataset.userProfile?.favoriteFilms).toHaveLength(3)
      expect(dataset.userProfile?.favoriteFilms[0].uri).toBe('https://boxd.it/fav1')
      expect(dataset.userProfile?.favoriteFilms[1].uri).toBe('https://boxd.it/fav2')
      expect(dataset.userProfile?.favoriteFilms[2].uri).toBe('https://boxd.it/fav3')
    })

    it('should preserve maximum 4 favorite films', () => {
      const profile = createProfile({
        username: 'user',
        favoriteFilms: [
          { uri: 'https://boxd.it/fav1' },
          { uri: 'https://boxd.it/fav2' },
          { uri: 'https://boxd.it/fav3' },
          { uri: 'https://boxd.it/fav4' },
        ],
      })

      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)

      expect(dataset.userProfile?.favoriteFilms).toHaveLength(4)
    })

    it('should handle empty favorite films array', () => {
      const profile = createProfile({
        username: 'user',
        favoriteFilms: [],
      })

      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)

      expect(Array.isArray(dataset.userProfile?.favoriteFilms)).toBe(true)
      expect(dataset.userProfile?.favoriteFilms).toHaveLength(0)
    })
  })

  // ============================================================================
  // DATASET STRUCTURE VERIFICATION
  // ============================================================================

  describe('mergeMovieSources - Output structure', () => {
    it('should return MovieDataset with userProfile field', () => {
      const profile = createProfile()
      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)

      expect(dataset).toHaveProperty('watched')
      expect(dataset).toHaveProperty('watchlist')
      expect(dataset).toHaveProperty('userProfile')
      expect(dataset).toHaveProperty('uploadedFiles')
      expect(dataset).toHaveProperty('lastUpdated')
    })

    it('should maintain watched and watchlist movies when profile merged', () => {
      const profile = createProfile()

      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)

      expect(dataset.watched).toHaveLength(3)
      expect(dataset.watched[0].title).toBe('The Shawshank Redemption')
      expect(dataset.watched[1].title).toBe('The Godfather')
      expect(dataset.watched[2].title).toBe('Inception')
    })

    it('should set lastUpdated timestamp', () => {
      const profile = createProfile()

      const beforeMerge = new Date()
      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, profile)
      const afterMerge = new Date()

      expect(dataset.lastUpdated).toBeInstanceOf(Date)
      expect(dataset.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeMerge.getTime())
      expect(dataset.lastUpdated.getTime()).toBeLessThanOrEqual(afterMerge.getTime())
    })
  })

  // ============================================================================
  // OPTIONAL PROFILE
  // ============================================================================

  describe('mergeMovieSources - Profile optional behavior', () => {
    it('should work without profile (backward compatibility)', () => {
      const dataset = mergeMovieSources(watchedMovies)

      expect(dataset.watched).toHaveLength(3)
      expect(dataset.userProfile).toBeUndefined()
      expect(dataset.uploadedFiles).not.toContain('profile')
    })

    it('should accept undefined profile explicitly', () => {
      const dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, undefined, undefined)

      expect(dataset.userProfile).toBeUndefined()
    })

    it('should allow profile with any other combination of sources', () => {
      const profile = createProfile()

      // Profile + diary only
      let dataset = mergeMovieSources(watchedMovies, [], undefined, undefined, undefined, profile)
      expect(dataset.userProfile).toBeDefined()

      // Profile + ratings only
      dataset = mergeMovieSources(watchedMovies, undefined, [], undefined, undefined, profile)
      expect(dataset.userProfile).toBeDefined()

      // Profile + watchlist only
      dataset = mergeMovieSources(watchedMovies, undefined, undefined, undefined, [], profile)
      expect(dataset.userProfile).toBeDefined()
    })
  })
})

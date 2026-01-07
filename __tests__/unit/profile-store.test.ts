/**
 * Unit tests for Analytics Store profile integration
 * Tests profile upload, persistence, and store actions
 */

import { useAnalyticsStore } from '@/hooks/use-analytics-store'
import type { UserProfile, Movie } from '@/lib/types'
import { mergeMovieSources } from '@/lib/data-merger'

// Helper to create test data
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

const testWatchedMovies: Movie[] = [
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
]

describe('Analytics Store - Profile Integration', () => {
  beforeEach(() => {
    // Clear store state before each test
    useAnalyticsStore.setState({
      dataset: null,
      analytics: null,
      uploadedFiles: [],
      lastUpdated: null,
      loading: false,
      error: null,
    })
  })

  // ============================================================================
  // PROFILE DATA MANAGEMENT (via direct state manipulation)
  // ============================================================================

  describe('Profile state management', () => {
    it('should store profile in dataset when merged', () => {
      const profile = createProfile({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      })

      const dataset = mergeMovieSources(testWatchedMovies, undefined, undefined, undefined, undefined, profile)

      // Simulate storing in state
      useAnalyticsStore.setState({
        dataset,
        uploadedFiles: ['watched.csv', 'profile.csv'],
        lastUpdated: new Date().toISOString(),
      })

      const state = useAnalyticsStore.getState()
      expect(state.dataset?.userProfile).toBeDefined()
      expect(state.dataset?.userProfile?.username).toBe('testuser')
      expect(state.dataset?.userProfile?.firstName).toBe('Test')
      expect(state.uploadedFiles).toContain('profile.csv')
    })

    it('should preserve favorite films in stored profile', () => {
      const profile = createProfile({
        username: 'user',
        favoriteFilms: [
          { uri: 'https://boxd.it/fav1', title: 'Film 1' },
          { uri: 'https://boxd.it/fav2', title: 'Film 2' },
        ],
      })

      const dataset = mergeMovieSources(testWatchedMovies, undefined, undefined, undefined, undefined, profile)

      useAnalyticsStore.setState({ dataset })

      const state = useAnalyticsStore.getState()
      expect(state.dataset?.userProfile?.favoriteFilms).toHaveLength(2)
      expect(state.dataset?.userProfile?.favoriteFilms[0].uri).toBe('https://boxd.it/fav1')
    })

    it('should handle profile with all optional fields', () => {
      const profile = createProfile({
        username: 'fulluser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        location: 'New York',
        website: 'https://example.com',
        bio: 'A bio',
        pronoun: 'He / him',
        joinDate: new Date('2020-01-01'),
        favoriteFilms: [{ uri: 'https://boxd.it/fav' }],
      })

      const dataset = mergeMovieSources(testWatchedMovies, undefined, undefined, undefined, undefined, profile)

      useAnalyticsStore.setState({ dataset })

      const state = useAnalyticsStore.getState()
      const stored = state.dataset?.userProfile
      expect(stored?.username).toBe('fulluser')
      expect(stored?.firstName).toBe('John')
      expect(stored?.lastName).toBe('Doe')
      expect(stored?.email).toBe('john@example.com')
      expect(stored?.location).toBe('New York')
      expect(stored?.website).toBe('https://example.com')
      expect(stored?.bio).toBe('A bio')
      expect(stored?.pronoun).toBe('He / him')
      expect(stored?.joinDate).toEqual(new Date('2020-01-01'))
      expect(stored?.favoriteFilms).toHaveLength(1)
    })
  })

  // ============================================================================
  // PROFILE SINGLETON BEHAVIOR
  // ============================================================================

  describe('Profile singleton pattern in store', () => {
    it('should store exactly one profile per dataset', () => {
      const profile1 = createProfile({ username: 'user1' })

      const dataset = mergeMovieSources(testWatchedMovies, undefined, undefined, undefined, undefined, profile1)

      useAnalyticsStore.setState({ dataset })

      const state = useAnalyticsStore.getState()
      expect(state.dataset?.userProfile?.username).toBe('user1')
    })

    it('should replace profile when new one set in state', () => {
      const profile1 = createProfile({ username: 'user1' })
      const profile2 = createProfile({ username: 'user2' })

      const dataset1 = mergeMovieSources(testWatchedMovies, undefined, undefined, undefined, undefined, profile1)
      useAnalyticsStore.setState({ dataset: dataset1 })
      expect(useAnalyticsStore.getState().dataset?.userProfile?.username).toBe('user1')

      const dataset2 = mergeMovieSources(testWatchedMovies, undefined, undefined, undefined, undefined, profile2)
      useAnalyticsStore.setState({ dataset: dataset2 })
      expect(useAnalyticsStore.getState().dataset?.userProfile?.username).toBe('user2')
    })

    it('should clear profile when clearData called', () => {
      const profile = createProfile({ username: 'testuser' })

      const dataset = mergeMovieSources(testWatchedMovies, undefined, undefined, undefined, undefined, profile)

      useAnalyticsStore.setState({ dataset })
      expect(useAnalyticsStore.getState().dataset?.userProfile).toBeDefined()

      useAnalyticsStore.getState().clearData()

      const state = useAnalyticsStore.getState()
      expect(state.dataset).toBeNull()
      expect(state.dataset?.userProfile).toBeUndefined()
    })
  })

  // ============================================================================
  // DATA STRUCTURE VERIFICATION
  // ============================================================================

  describe('Store structure with profile', () => {
    it('should maintain all dataset fields when profile included', () => {
      const profile = createProfile()

      const dataset = mergeMovieSources(testWatchedMovies, undefined, undefined, undefined, undefined, profile)

      useAnalyticsStore.setState({ dataset })

      const state = useAnalyticsStore.getState()
      expect(state.dataset?.watched).toBeDefined()
      expect(state.dataset?.watchlist).toBeDefined()
      expect(state.dataset?.userProfile).toBeDefined()
      expect(state.dataset?.uploadedFiles).toBeDefined()
      expect(state.dataset?.lastUpdated).toBeDefined()
    })

    it('should work without profile (backward compatibility)', () => {
      const dataset = mergeMovieSources(testWatchedMovies)

      useAnalyticsStore.setState({ dataset })

      const state = useAnalyticsStore.getState()
      expect(state.dataset?.watched).toBeDefined()
      expect(state.dataset?.userProfile).toBeUndefined()
    })

    it('should preserve watched and watchlist movies with profile', () => {
      const profile = createProfile()

      const dataset = mergeMovieSources(testWatchedMovies, undefined, undefined, undefined, undefined, profile)

      useAnalyticsStore.setState({ dataset })

      const state = useAnalyticsStore.getState()
      expect(state.dataset?.watched).toHaveLength(2)
      expect(state.dataset?.watched[0].title).toBe('The Shawshank Redemption')
      expect(state.dataset?.watched[1].title).toBe('The Godfather')
    })
  })
})

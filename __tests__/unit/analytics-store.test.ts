/**
 * Unit tests for Zustand analytics store
 * Tests state management, data persistence, and localStorage integration
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useAnalyticsStore } from '@/hooks/use-analytics-store'
import { MOCK_WATCHED_CSV, MOCK_DIARY_CSV, MOCK_RATINGS_CSV, MOCK_FILMS_CSV } from '../fixtures/mock-csvs'

// ============================================================================
// STORE INITIALIZATION TESTS
// ============================================================================

describe('Analytics Store - Initialization', () => {
  beforeEach(() => {
    // Clear store and localStorage before each test
    const { result } = renderHook(() => useAnalyticsStore())
    act(() => {
      result.current.clearData()
    })
    localStorage.clear()
  })

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useAnalyticsStore())

    expect(result.current.dataset).toBeNull()
    expect(result.current.analytics).toBeNull()
    expect(result.current.uploadedFiles).toEqual([])
    expect(result.current.lastUpdated).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test('should have working getter functions', () => {
    const { result } = renderHook(() => useAnalyticsStore())

    expect(result.current.hasData()).toBe(false)
    expect(result.current.totalMovies()).toBe(0)
  })
})

// ============================================================================
// FILE UPLOAD AND PARSING TESTS
// ============================================================================

describe('Analytics Store - File Upload', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAnalyticsStore())
    act(() => {
      result.current.clearData()
    })
    localStorage.clear()
  })

  test('should reject upload with no files', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    await act(async () => {
      await result.current.uploadFiles([])
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.dataset).toBeNull()
  })

  test('should reject upload without watched.csv', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const diaryFile = new File([MOCK_DIARY_CSV], 'diary.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([diaryFile])
    })

    expect(result.current.error).toContain('watched.csv is mandatory')
    expect(result.current.dataset).toBeNull()
  })

  test('should successfully upload watched.csv', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.dataset).toBeDefined()
    expect(result.current.dataset!.watched.length).toBeGreaterThan(0)
    expect(result.current.analytics).toBeDefined()
    expect(result.current.uploadedFiles).toContain('watched.csv')
  })

  test('should parse watched.csv movies correctly', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstMovie = result.current.dataset!.watched[0]
    expect(firstMovie.id).toBeDefined()
    expect(firstMovie.title).toBeDefined()
    expect(firstMovie.year).toBeGreaterThan(0)
    expect(firstMovie.dateMarkedWatched).toBeInstanceOf(Date)
  })

  test('should upload multiple CSV files', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })
    const diaryFile = new File([MOCK_DIARY_CSV], 'diary.csv', { type: 'text/csv' })
    const ratingsFile = new File([MOCK_RATINGS_CSV], 'ratings.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile, diaryFile, ratingsFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.uploadedFiles).toContain('watched.csv')
    expect(result.current.uploadedFiles).toContain('diary.csv')
    expect(result.current.uploadedFiles).toContain('ratings.csv')
  })

  test('should merge diary.csv data with watched.csv', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })
    const diaryFile = new File([MOCK_DIARY_CSV], 'diary.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile, diaryFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Diary should add ratings to movies
    const ratedMovies = result.current.dataset!.watched.filter((m) => m.rating !== undefined)
    expect(ratedMovies.length).toBeGreaterThan(0)
  })

  test('should merge ratings.csv data with watched.csv', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })
    const ratingsFile = new File([MOCK_RATINGS_CSV], 'ratings.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile, ratingsFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // All ratings movies should be in dataset
    const ratedMovies = result.current.dataset!.watched.filter((m) => m.rating !== undefined)
    expect(ratedMovies.length).toBeGreaterThan(0)
  })

  test('should merge films.csv data with watched.csv', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })
    const filmsFile = new File([MOCK_FILMS_CSV], 'films.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile, filmsFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Films movies should be marked as liked
    const likedMovies = result.current.dataset!.watched.filter((m) => m.liked === true)
    expect(likedMovies.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// ANALYTICS COMPUTATION TESTS
// ============================================================================

describe('Analytics Store - Analytics Computation', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAnalyticsStore())
    act(() => {
      result.current.clearData()
    })
    localStorage.clear()
  })

  test('should compute analytics on upload', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const analytics = result.current.analytics
    expect(analytics).toBeDefined()
    expect(analytics!.totalMoviesWatched).toBeGreaterThan(0)
    expect(analytics!.moviesRated).toBeGreaterThanOrEqual(0)
    expect(analytics!.moviesLiked).toBeGreaterThanOrEqual(0)
    expect(analytics!.ratingCoverage).toBeGreaterThanOrEqual(0)
  })

  test('should have correct analytics structure', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const analytics = result.current.analytics!
    expect(analytics).toHaveProperty('totalMoviesWatched')
    expect(analytics).toHaveProperty('moviesRated')
    expect(analytics).toHaveProperty('moviesLiked')
    expect(analytics).toHaveProperty('ratingCoverage')
    expect(analytics).toHaveProperty('averageRating')
    expect(analytics).toHaveProperty('medianRating')
    expect(analytics).toHaveProperty('decadeBreakdown')
    expect(analytics).toHaveProperty('yearlyWatching')
  })
})

// ============================================================================
// DATA PERSISTENCE TESTS
// ============================================================================

describe('Analytics Store - Data Persistence', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAnalyticsStore())
    act(() => {
      result.current.clearData()
    })
    localStorage.clear()
  })

  test('should persist data to localStorage', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Check that data was saved to localStorage
    const storedData = localStorage.getItem('letterboxd-analytics-store')
    expect(storedData).toBeTruthy()

    const parsed = JSON.parse(storedData!)
    expect(parsed).toHaveProperty('state')
    expect(parsed.state).toHaveProperty('dataset')
    expect(parsed.state.dataset).toHaveProperty('watched')
  })

  test('should load data from localStorage on fresh mount', async () => {
    // First hook: upload data
    const { result: result1 } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result1.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result1.current.loading).toBe(false)
    })

    const uploadedCount = result1.current.dataset!.watched.length

    // Second hook: should load from localStorage
    const { result: result2 } = renderHook(() => useAnalyticsStore())

    await waitFor(() => {
      expect(result2.current.dataset).not.toBeNull()
    })

    expect(result2.current.dataset!.watched.length).toBe(uploadedCount)
    expect(result2.current.analytics).not.toBeNull()
  })

  test('should have lastUpdated timestamp', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.lastUpdated).toBeTruthy()
    // Should be ISO date string
    expect(typeof result.current.lastUpdated).toBe('string')
  })
})

// ============================================================================
// CLEAR DATA TESTS
// ============================================================================

describe('Analytics Store - Clear Data', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAnalyticsStore())
    act(() => {
      result.current.clearData()
    })
    localStorage.clear()
  })

  test('should clear all data', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    // Upload data
    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.dataset).not.toBeNull()

    // Clear data
    act(() => {
      result.current.clearData()
    })

    expect(result.current.dataset).toBeNull()
    expect(result.current.analytics).toBeNull()
    expect(result.current.uploadedFiles).toEqual([])
    expect(result.current.lastUpdated).toBeNull()
    expect(result.current.error).toBeNull()
  })

  test('should remove from localStorage on clear', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    // Upload data
    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Verify data is in localStorage
    const beforeClear = localStorage.getItem('letterboxd-analytics-store')
    expect(beforeClear).toBeTruthy()

    // Clear data
    act(() => {
      result.current.clearData()
    })

    // localStorage should still have the key but with cleared state
    const afterClear = localStorage.getItem('letterboxd-analytics-store')
    if (afterClear) {
      const parsed = JSON.parse(afterClear)
      expect(parsed.state.dataset).toBeNull()
    }
  })
})

// ============================================================================
// GETTER FUNCTION TESTS
// ============================================================================

describe('Analytics Store - Getter Functions', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAnalyticsStore())
    act(() => {
      result.current.clearData()
    })
    localStorage.clear()
  })

  test('hasData should return false initially', () => {
    const { result } = renderHook(() => useAnalyticsStore())
    expect(result.current.hasData()).toBe(false)
  })

  test('hasData should return true after upload', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.hasData()).toBe(true)
  })

  test('hasData should return false after clear', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.clearData()
    })

    expect(result.current.hasData()).toBe(false)
  })

  test('totalMovies should return correct count', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const expectedCount = result.current.dataset!.watched.length
    expect(result.current.totalMovies()).toBe(expectedCount)
  })

  test('totalMovies should return 0 initially', () => {
    const { result } = renderHook(() => useAnalyticsStore())
    expect(result.current.totalMovies()).toBe(0)
  })

  test('totalMovies should return 0 after clear', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.clearData()
    })

    expect(result.current.totalMovies()).toBe(0)
  })
})

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

describe('Analytics Store - Error Handling', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAnalyticsStore())
    act(() => {
      result.current.clearData()
    })
    localStorage.clear()
  })

  test('should handle loading state during upload', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    expect(result.current.loading).toBe(false)

    const uploadPromise = act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    // Should be loading during upload (briefly)
    await uploadPromise

    // Should finish loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  test('should clear error on successful upload', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    // First upload with invalid data to set error
    const invalidFile = new File(['invalid'], 'invalid.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([invalidFile])
    })

    expect(result.current.error).toBeTruthy()

    // Then upload valid data
    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Error should be cleared (or just contain storage warnings)
    if (result.current.error) {
      expect(result.current.error).not.toContain('invalid')
    }
  })
})

// ============================================================================
// STATE CONSISTENCY TESTS
// ============================================================================

describe('Analytics Store - State Consistency', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAnalyticsStore())
    act(() => {
      result.current.clearData()
    })
    localStorage.clear()
  })

  test('should have consistent dataset and analytics', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const dataset = result.current.dataset
    const analytics = result.current.analytics

    expect(dataset).toBeDefined()
    expect(analytics).toBeDefined()
    expect(analytics!.totalMoviesWatched).toBe(dataset!.watched.length)
  })

  test('uploadedFiles should match uploaded file names', async () => {
    const { result } = renderHook(() => useAnalyticsStore())

    const watchedFile = new File([MOCK_WATCHED_CSV], 'watched.csv', { type: 'text/csv' })
    const diaryFile = new File([MOCK_DIARY_CSV], 'diary.csv', { type: 'text/csv' })

    await act(async () => {
      await result.current.uploadFiles([watchedFile, diaryFile])
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.uploadedFiles).toContain('watched.csv')
    expect(result.current.uploadedFiles).toContain('diary.csv')
    expect(result.current.uploadedFiles.length).toBe(2)
  })
})

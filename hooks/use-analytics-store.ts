/**
 * Zustand store for analytics data persistence
 * Handles state management, CSV parsing/merging, and localStorage persistence
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movie, MovieDataset, AnalyticsOverview, AnalyticsStore } from '@/lib/types'
import { parseLetterboxdCSV } from '@/lib/csv-parser'
import { mergeMovieSources, deduplicateMovies } from '@/lib/data-merger'
import { computeAnalytics } from '@/lib/analytics-engine'

// ============================================================================
// TYPES
// ============================================================================

/**
 * Persisted state shape (what gets saved to localStorage)
 */
interface PersistedState {
  dataset: MovieDataset | null
  analytics: AnalyticsOverview | null
  uploadedFiles: string[] // Store filenames only, not File objects
  lastUpdated: string | null // ISO date string
}

/**
 * Store state including transient fields
 */
interface StoreState extends PersistedState {
  loading: boolean
  error: string | null
}

/**
 * Store actions
 */
interface StoreActions {
  uploadFiles: (files: File[]) => Promise<void>
  clearData: () => void
  removeFile: (filename: string) => Promise<void>
  hasData: () => boolean
  totalMovies: () => number
}

type AnalyticsStoreType = StoreState & StoreActions

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useAnalyticsStore = create<AnalyticsStoreType>()(
  persist(
    (set, get) => ({
      // Initial state
      dataset: null,
      analytics: null,
      uploadedFiles: [],
      lastUpdated: null,
      loading: false,
      error: null,

      // ========================================================================
      // ACTIONS
      // ========================================================================

      /**
       * Upload and parse multiple CSV files
       * 1. Parse each file with CSV parser
       * 2. Separate by CSV type
       * 3. Merge all parsed data
       * 4. Compute analytics
       * 5. Save to state (and localStorage via middleware)
       */
      uploadFiles: async (files: File[]) => {
        set({ loading: true, error: null })

        try {
          if (!files || files.length === 0) {
            set({ error: 'No files provided' })
            return
          }

          // Store parsed data by type
          let watchedMovies: Movie[] = []
          let diaryMovies: Movie[] = []
          let ratingsMovies: Movie[] = []
          let filmsMovies: Movie[] = []
          let watchlistMovies: Movie[] = []

          const uploadedFileNames: string[] = []
          const errors: string[] = []

          // Parse each file
          for (const file of files) {
            try {
              const result = await parseLetterboxdCSV(file)

              if (result.success && result.data) {
                uploadedFileNames.push(file.name)

                // Categorize by filename
                const fileName = file.name.toLowerCase()
                if (fileName === 'watched.csv') {
                  watchedMovies = result.data
                } else if (fileName === 'diary.csv') {
                  diaryMovies = result.data
                } else if (fileName === 'ratings.csv') {
                  ratingsMovies = result.data
                } else if (fileName === 'films.csv') {
                  filmsMovies = result.data
                } else if (fileName === 'watchlist.csv') {
                  watchlistMovies = result.data
                }
              } else {
                errors.push(`${file.name}: ${result.errors[0]?.message || 'Unknown error'}`)
              }
            } catch (err) {
              errors.push(
                `${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`
              )
            }
          }

          // At least watched.csv is required
          if (watchedMovies.length === 0) {
            set({
              error: errors.length > 0
                ? errors.join('; ')
                : 'watched.csv is mandatory - please upload it',
              loading: false,
            })
            return
          }

          // Merge all sources
          const dataset = mergeMovieSources(
            watchedMovies,
            diaryMovies.length > 0 ? diaryMovies : undefined,
            ratingsMovies.length > 0 ? ratingsMovies : undefined,
            filmsMovies.length > 0 ? filmsMovies : undefined,
            watchlistMovies.length > 0 ? watchlistMovies : undefined
          )

          // Compute analytics
          const analytics = computeAnalytics(dataset.watched)

          // Update state
          set({
            dataset,
            analytics,
            uploadedFiles: uploadedFileNames,
            lastUpdated: new Date().toISOString(),
            loading: false,
            error: errors.length > 0 ? errors.join('; ') : null,
          })
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Unknown error during upload',
            loading: false,
          })
        }
      },

      /**
       * Clear all data from store and localStorage
       */
      clearData: () => {
        set({
          dataset: null,
          analytics: null,
          uploadedFiles: [],
          lastUpdated: null,
          error: null,
        })
      },

      /**
       * Remove a single uploaded file and recompute analytics
       */
      removeFile: async (filename: string) => {
        set({ loading: true, error: null })

        try {
          const currentState = get()

          if (!currentState.dataset) {
            set({ error: 'No data to remove from', loading: false })
            return
          }

          // For now, this clears all data
          // In a more complete implementation, would track source file for each movie
          // and only remove movies from that file
          currentState.clearData()
          set({ loading: false })
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Error removing file',
            loading: false,
          })
        }
      },

      /**
       * Check if store has data
       */
      hasData: () => {
        const state = get()
        return state.dataset !== null && state.dataset.watched.length > 0
      },

      /**
       * Get total watched movies
       */
      totalMovies: () => {
        const state = get()
        return state.dataset?.watched.length ?? 0
      },
    }),
    {
      name: 'letterboxd-analytics-store', // localStorage key
      version: 1,

      // ======================================================================
      // PERSISTENCE CONFIG
      // ======================================================================

      // Customize what gets persisted (exclude loading/error flags)
      partialize: (state) => ({
        dataset: state.dataset,
        analytics: state.analytics,
        uploadedFiles: state.uploadedFiles,
        lastUpdated: state.lastUpdated,
      }),

      // Deserialize function to reconstruct Date objects
      onRehydrateStorage: () => (state) => {
        if (state && state.lastUpdated) {
          // Convert ISO string back to Date for consistency
          // (Dates will be strings in localStorage, that's OK)
        }
      },
    }
  )
)

// ============================================================================
// SELECTORS (Optional utility hooks for common queries)
// ============================================================================

export const useDataset = () => useAnalyticsStore((state) => state.dataset)
export const useAnalytics = () => useAnalyticsStore((state) => state.analytics)
export const useStoreLoading = () => useAnalyticsStore((state) => state.loading)
export const useStoreError = () => useAnalyticsStore((state) => state.error)

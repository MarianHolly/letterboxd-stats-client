/**
 * Types for Canon/Famous Movie Lists
 * These lists represent curated collections like IMDb Top 250, Oscar winners, etc.
 */

import type { Movie } from '@/lib/types'

/**
 * A single movie in a canon list
 * Minimal data needed for matching with user's watched movies
 */
export interface CanonMovie {
  title: string
  year: number
}

/**
 * A curated movie list (e.g., IMDb Top 250, Oscar Best Picture)
 */
export interface CanonList {
  id: string // Unique identifier (e.g., 'imdb_top_250')
  title: string // Full title (e.g., 'IMDb Top 250')
  shortTitle: string // Short version for display (e.g., 'IMDb Top 250')
  sourceUrl: string // Original source URL
  totalMovies: number // Total count in list
  movies: CanonMovie[] // All movies in the list
}

/**
 * User's progress through a canon list
 * Calculated by matching user's watched movies against a canon list
 */
export interface CanonProgress {
  listId: string // References CanonList.id
  listTitle: string // Display name
  totalMovies: number // Total in canon list
  watchedCount: number // How many user has watched
  completionPercentage: number // 0-100
  watchedMovies: Movie[] // User's watched movies from this list
  unwatchedMovies: CanonMovie[] // Movies not yet watched
}

/**
 * Collection of all canon lists with user progress
 */
export interface CanonComparison {
  lists: CanonProgress[]
  overallStats: {
    totalLists: number
    averageCompletion: number // Average % across all lists
    mostCompleted: CanonProgress | null
    leastCompleted: CanonProgress | null
  }
}

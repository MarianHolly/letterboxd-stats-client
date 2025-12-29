/**
 * Movie matching utilities for canon lists
 * Handles fuzzy matching between user's watched movies and canon list movies
 */

import type { Movie } from '@/lib/types'
import type { CanonMovie } from './types'

/**
 * Normalize a movie title for comparison
 * - Convert to lowercase
 * - Remove leading articles (The, A, An)
 * - Remove special characters and extra spaces
 */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/^(the|a|an)\s+/i, '') // Remove leading articles
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}

/**
 * Check if two movie titles match
 * Uses normalized comparison to handle minor variations
 */
export function titlesMatch(title1: string, title2: string): boolean {
  const normalized1 = normalizeTitle(title1)
  const normalized2 = normalizeTitle(title2)
  return normalized1 === normalized2
}

/**
 * Calculate similarity score between two titles (0-1)
 * Uses simple character-based similarity for fuzzy matching
 */
export function titleSimilarity(title1: string, title2: string): number {
  const norm1 = normalizeTitle(title1)
  const norm2 = normalizeTitle(title2)

  if (norm1 === norm2) return 1.0

  // Simple Jaccard similarity on character bigrams
  const bigrams1 = new Set<string>()
  const bigrams2 = new Set<string>()

  for (let i = 0; i < norm1.length - 1; i++) {
    bigrams1.add(norm1.substring(i, i + 2))
  }

  for (let i = 0; i < norm2.length - 1; i++) {
    bigrams2.add(norm2.substring(i, i + 2))
  }

  const intersection = new Set([...bigrams1].filter(x => bigrams2.has(x)))
  const union = new Set([...bigrams1, ...bigrams2])

  return intersection.size / union.size
}

/**
 * Match a user's movie against a canon movie
 * Returns true if they represent the same film
 */
export function matchMovie(
  userMovie: Movie,
  canonMovie: CanonMovie,
  options: {
    exactYearMatch?: boolean // Require exact year match (default: true)
    similarityThreshold?: number // Min similarity for fuzzy match (default: 0.85)
  } = {}
): boolean {
  const { exactYearMatch = true, similarityThreshold = 0.85 } = options

  // Year must match (or be within 1 year for flexibility)
  const yearMatches = exactYearMatch
    ? userMovie.year === canonMovie.year
    : Math.abs(userMovie.year - canonMovie.year) <= 1

  if (!yearMatches) return false

  // Check title match
  const exactMatch = titlesMatch(userMovie.title, canonMovie.title)
  if (exactMatch) return true

  // Fuzzy match as fallback
  const similarity = titleSimilarity(userMovie.title, canonMovie.title)
  return similarity >= similarityThreshold
}

/**
 * Find all user movies that match a canon list
 * Returns array of matched user movies
 */
export function findMatchedMovies(
  userMovies: Movie[],
  canonMovies: CanonMovie[]
): Movie[] {
  const matched: Movie[] = []

  for (const userMovie of userMovies) {
    for (const canonMovie of canonMovies) {
      if (matchMovie(userMovie, canonMovie)) {
        matched.push(userMovie)
        break // Don't match same user movie multiple times
      }
    }
  }

  return matched
}

/**
 * Find canon movies that user hasn't watched
 * Returns array of unwatched canon movies
 */
export function findUnwatchedMovies(
  userMovies: Movie[],
  canonMovies: CanonMovie[]
): CanonMovie[] {
  const unwatched: CanonMovie[] = []

  for (const canonMovie of canonMovies) {
    const isWatched = userMovies.some(userMovie =>
      matchMovie(userMovie, canonMovie)
    )

    if (!isWatched) {
      unwatched.push(canonMovie)
    }
  }

  return unwatched
}

/**
 * Get match statistics for debugging
 */
export function getMatchStats(
  userMovies: Movie[],
  canonMovies: CanonMovie[]
): {
  totalCanonMovies: number
  matchedCount: number
  unmatchedCount: number
  matchRate: number
} {
  const matched = findMatchedMovies(userMovies, canonMovies)

  return {
    totalCanonMovies: canonMovies.length,
    matchedCount: matched.length,
    unmatchedCount: canonMovies.length - matched.length,
    matchRate: (matched.length / canonMovies.length) * 100
  }
}

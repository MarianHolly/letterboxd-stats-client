/**
 * Analytics Engine for Letterboxd Stats
 * Computes all statistics from a Movie dataset
 *
 * Pure functions - no side effects
 * Performance target: <100ms for 1000 movies
 */

import type { Movie, AnalyticsOverview } from './types'
import { average, median, groupBy, countBy, sum } from './utils'

// ============================================================================
// OVERVIEW STATISTICS
// ============================================================================

/**
 * Compute basic overview statistics
 */
export function computeOverviewStats(movies: Movie[]): {
  totalMoviesWatched: number
  moviesRated: number
  moviesLiked: number
  ratingCoverage: number
  likeRatio: number
  averageRating: number
  medianRating: number
} {
  if (movies.length === 0) {
    return {
      totalMoviesWatched: 0,
      moviesRated: 0,
      moviesLiked: 0,
      ratingCoverage: 0,
      likeRatio: 0,
      averageRating: 0,
      medianRating: 0,
    }
  }

  const totalMoviesWatched = movies.length
  const moviesRated = movies.filter((m) => m.rating !== undefined).length
  const moviesLiked = movies.filter((m) => m.liked === true).length

  const ratings = movies
    .filter((m) => m.rating !== undefined)
    .map((m) => m.rating as number)

  const averageRating = ratings.length > 0 ? average(ratings) : 0
  const medianRating = ratings.length > 0 ? median(ratings) : 0

  const ratingCoverage =
    totalMoviesWatched > 0
      ? Math.round((moviesRated / totalMoviesWatched) * 100 * 10) / 10
      : 0

  const likeRatio =
    totalMoviesWatched > 0
      ? Math.round((moviesLiked / totalMoviesWatched) * 100 * 10) / 10
      : 0

  return {
    totalMoviesWatched,
    moviesRated,
    moviesLiked,
    ratingCoverage,
    likeRatio,
    averageRating: Math.round(averageRating * 10) / 10,
    medianRating: Math.round(medianRating * 10) / 10,
  }
}

// ============================================================================
// RATING DISTRIBUTION
// ============================================================================

/**
 * Compute rating distribution (count per rating value)
 * Ratings are on 0.5-5.0 scale in 0.5 increments
 */
export function computeRatingDistribution(
  movies: Movie[]
): Record<string, number> {
  const ratedMovies = movies.filter((m) => m.rating !== undefined)

  if (ratedMovies.length === 0) {
    return {}
  }

  const distribution: Record<string, number> = {}

  // Initialize all possible rating values
  for (let i = 1; i <= 10; i++) {
    const rating = (i * 0.5).toFixed(1)
    distribution[rating] = 0
  }

  // Count movies per rating
  ratedMovies.forEach((movie) => {
    if (movie.rating !== undefined) {
      const rating = movie.rating.toFixed(1)
      distribution[rating] = (distribution[rating] || 0) + 1
    }
  })

  // Remove zero-count ratings
  Object.keys(distribution).forEach((key) => {
    if (distribution[key] === 0) {
      delete distribution[key]
    }
  })

  return distribution
}

// ============================================================================
// DECADE BREAKDOWN
// ============================================================================

/**
 * Compute breakdown of movies by decade
 */
export function computeDecadeBreakdown(
  movies: Movie[]
): Record<string, number> {
  if (movies.length === 0) {
    return {}
  }

  const breakdown = countBy(movies, (m) => `${m.decade}s`)

  return breakdown
}

// ============================================================================
// YEARLY BREAKDOWN
// ============================================================================

/**
 * Compute breakdown of movies watched per year
 * Uses the watched date if available, otherwise uses dateMarkedWatched
 */
export function computeYearlyWatching(movies: Movie[]): Record<string, number> {
  if (movies.length === 0) {
    return {}
  }

  const breakdown = countBy(movies, (m) => {
    const date = m.watchedDate || m.dateMarkedWatched
    return date ? String(date.getFullYear()) : 'unknown'
  })

  // Remove 'unknown' if it exists and is empty
  if (breakdown['unknown'] === 0) {
    delete breakdown['unknown']
  }

  return breakdown
}

// ============================================================================
// REWATCH STATISTICS
// ============================================================================

/**
 * Compute rewatch statistics
 */
export function computeRewatchStats(movies: Movie[]): {
  totalRewatches: number
  moviesRewatched: number
  rewatchRate: number
} {
  if (movies.length === 0) {
    return {
      totalRewatches: 0,
      moviesRewatched: 0,
      rewatchRate: 0,
    }
  }

  const rewatchedMovies = movies.filter((m) => m.rewatch === true)
  const moviesRewatched = rewatchedMovies.length

  const totalRewatches = rewatchedMovies.reduce(
    (acc, m) => acc + (m.rewatchCount || 0),
    0
  )

  const rewatchRate =
    movies.length > 0
      ? Math.round((moviesRewatched / movies.length) * 100 * 10) / 10
      : 0

  return {
    totalRewatches,
    moviesRewatched,
    rewatchRate,
  }
}

// ============================================================================
// TIME-BASED STATISTICS
// ============================================================================

/**
 * Compute earliest and latest watch dates and tracking span
 */
export function computeTimeSpan(movies: Movie[]): {
  earliestWatchDate?: Date
  latestWatchDate?: Date
  trackingSpan?: number
} {
  if (movies.length === 0) {
    return {}
  }

  const validDates = movies
    .map((m) => m.watchedDate || m.dateMarkedWatched)
    .filter((d): d is Date => d !== undefined)

  if (validDates.length === 0) {
    return {}
  }

  const earliest = new Date(Math.min(...validDates.map((d) => d.getTime())))
  const latest = new Date(Math.max(...validDates.map((d) => d.getTime())))

  const trackingSpan = Math.floor(
    (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    earliestWatchDate: earliest,
    latestWatchDate: latest,
    trackingSpan,
  }
}

// ============================================================================
// MAIN ANALYTICS COMPUTATION
// ============================================================================

/**
 * Compute complete analytics overview from movie dataset
 * This is the main entry point - calls all sub-functions
 */
export function computeAnalytics(movies: Movie[]): AnalyticsOverview {
  // Compute all sub-statistics
  const overview = computeOverviewStats(movies)
  const ratingDist = computeRatingDistribution(movies)
  const decade = computeDecadeBreakdown(movies)
  const yearly = computeYearlyWatching(movies)
  const rewatches = computeRewatchStats(movies)
  const timeSpan = computeTimeSpan(movies)

  return {
    // Counts
    totalMoviesWatched: overview.totalMoviesWatched,
    moviesRated: overview.moviesRated,
    moviesLiked: overview.moviesLiked,

    // Ratios
    ratingCoverage: overview.ratingCoverage,
    likeRatio: overview.likeRatio,

    // Rating stats
    averageRating: overview.averageRating,
    medianRating: overview.medianRating,
    ratingDistribution: ratingDist,

    // Rewatch stats
    totalRewatches: rewatches.totalRewatches,
    moviesRewatched: rewatches.moviesRewatched,
    rewatchRate: rewatches.rewatchRate,

    // Time-based stats
    earliestWatchDate: timeSpan.earliestWatchDate,
    latestWatchDate: timeSpan.latestWatchDate,
    trackingSpan: timeSpan.trackingSpan,

    // Aggregations
    decadeBreakdown: decade,
    yearlyWatching: yearly,
  }
}

// ============================================================================
// UTILITY FUNCTIONS FOR ANALYTICS
// ============================================================================

/**
 * Get top N movies by rating
 */
export function getTopMoviesByRating(
  movies: Movie[],
  limit: number = 10
): Movie[] {
  return movies
    .filter((m) => m.rating !== undefined)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit)
}

/**
 * Get top N rewatched movies
 */
export function getTopRewatchedMovies(
  movies: Movie[],
  limit: number = 10
): Movie[] {
  return movies
    .filter((m) => m.rewatch === true)
    .sort((a, b) => (b.rewatchCount || 0) - (a.rewatchCount || 0))
    .slice(0, limit)
}

/**
 * Get movies watched in a specific year
 */
export function getMoviesByYear(movies: Movie[], year: number): Movie[] {
  return movies.filter((m) => {
    const date = m.watchedDate || m.dateMarkedWatched
    return date && date.getFullYear() === year
  })
}

/**
 * Get movies from a specific decade
 */
export function getMoviesByDecade(movies: Movie[], decade: number): Movie[] {
  return movies.filter((m) => m.decade === decade)
}

/**
 * Get movies with a specific rating
 */
export function getMoviesByRating(
  movies: Movie[],
  rating: number
): Movie[] {
  return movies.filter((m) => m.rating === rating)
}

/**
 * Get tagged movies
 */
export function getMoviesWithTags(movies: Movie[]): Movie[] {
  return movies.filter((m) => m.tags && m.tags.length > 0)
}

/**
 * Get liked movies
 */
export function getLikedMovies(movies: Movie[]): Movie[] {
  return movies.filter((m) => m.liked === true)
}

/**
 * Get unrated movies
 */
export function getUnratedMovies(movies: Movie[]): Movie[] {
  return movies.filter((m) => m.rating === undefined)
}

// ============================================================================
// ADVANCED ANALYTICS
// ============================================================================

/**
 * Compute genre distribution from tags (simple heuristic)
 * Note: This is a placeholder using movie tags, not actual genres
 */
export function computeTagDistribution(movies: Movie[]): Record<string, number> {
  const tagCounts: Record<string, number> = {}

  movies.forEach((movie) => {
    if (movie.tags && movie.tags.length > 0) {
      movie.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  return tagCounts
}

/**
 * Get rating statistics by decade
 */
export function getRatingsByDecade(
  movies: Movie[]
): Record<string, { average: number; count: number }> {
  const grouped = groupBy(movies, (m) => `${m.decade}s`)
  const result: Record<string, { average: number; count: number }> = {}

  grouped.forEach((decadeMovies, decade) => {
    const rated = decadeMovies.filter((m) => m.rating !== undefined)
    if (rated.length > 0) {
      const ratings = rated.map((m) => m.rating as number)
      result[decade] = {
        average: Math.round(average(ratings) * 10) / 10,
        count: rated.length,
      }
    }
  })

  return result
}

/**
 * Get rating statistics by year
 */
export function getRatingsByYear(
  movies: Movie[]
): Record<string, { average: number; count: number }> {
  const grouped = groupBy(movies, (m) => {
    const date = m.watchedDate || m.dateMarkedWatched
    return date ? String(date.getFullYear()) : 'unknown'
  })

  const result: Record<string, { average: number; count: number }> = {}

  grouped.forEach((yearMovies, year) => {
    if (year === 'unknown') return

    const rated = yearMovies.filter((m) => m.rating !== undefined)
    if (rated.length > 0) {
      const ratings = rated.map((m) => m.rating as number)
      result[year] = {
        average: Math.round(average(ratings) * 10) / 10,
        count: rated.length,
      }
    }
  })

  return result
}

/**
 * Compute viewing velocity (movies watched per day on average)
 */
export function computeViewingVelocity(movies: Movie[]): number {
  const timeSpan = computeTimeSpan(movies)

  if (!timeSpan.trackingSpan || timeSpan.trackingSpan === 0) {
    return 0
  }

  return Math.round((movies.length / timeSpan.trackingSpan) * 1000) / 1000 // 3 decimal places
}

/**
 * Compute rating consistency (standard deviation of ratings)
 */
export function computeRatingConsistency(movies: Movie[]): number {
  const ratings = movies
    .filter((m) => m.rating !== undefined)
    .map((m) => m.rating as number)

  if (ratings.length === 0) return 0

  const mean = average(ratings)
  const squaredDiffs = ratings.map((r) => Math.pow(r - mean, 2))
  const variance = average(squaredDiffs)
  const stdDev = Math.sqrt(variance)

  return Math.round(stdDev * 100) / 100
}

/**
 * Analytics Data Transformers for Dashboard Sections
 * Pure functions that transform raw Movie data into chart-ready formats
 *
 * All functions are safe for empty/missing data - return empty arrays/objects
 */

import type { Movie, AnalyticsOverview } from './types'
import { groupBy, average } from './utils'

// ============================================================================
// SECTION 1: YOUR MOVIE TASTE - RELEASE YEAR ANALYSIS
// ============================================================================

/**
 * Transform movies to release year breakdown
 * @returns Record<year as string, count>
 */
export function transformReleaseYearData(movies: Movie[]): Record<string, number> {
  const data: Record<string, number> = {}
  movies.forEach((movie) => {
    const year = String(movie.year)
    data[year] = (data[year] || 0) + 1
  })
  return data
}

/**
 * Transform movies to decade breakdown
 * @returns Array of { decade: "1990s", count }
 */
export function transformReleaseYearToDecades(
  movies: Movie[]
): Array<{ decade: string; count: number }> {
  const decadeMap: Record<string, number> = {}

  movies.forEach((movie) => {
    if (movie.year) {
      const year = parseInt(String(movie.year))
      const decadeStart = Math.floor(year / 10) * 10
      const decadeLabel = `${decadeStart}s`
      decadeMap[decadeLabel] = (decadeMap[decadeLabel] || 0) + 1
    }
  })

  return Object.entries(decadeMap)
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => {
      const yearA = parseInt(a.decade)
      const yearB = parseInt(b.decade)
      return yearA - yearB
    })
}

/**
 * Transform movies to era breakdown with colors
 * @returns Array of { era, count, fill (color) }
 */
export function transformReleaseYearToEras(
  movies: Movie[]
): Array<{ era: string; count: number; fill: string }> {
  const ERA_BOUNDARIES = {
    CLASSIC: { min: 1900, max: 1944, label: 'Classic', color: '#06b6d4' },
    GOLDEN: { min: 1945, max: 1969, label: 'Golden', color: '#0891b2' },
    MODERN: { min: 1970, max: 1999, label: 'Modern', color: '#6366f1' },
    CONTEMPORARY: { min: 2000, max: 2099, label: 'Contemporary', color: '#d946ef' },
  }

  const eraTotals = {
    classic: 0,
    golden: 0,
    modern: 0,
    contemporary: 0,
  }

  movies.forEach((movie) => {
    if (movie.year) {
      const year = parseInt(String(movie.year))
      if (year >= ERA_BOUNDARIES.CLASSIC.min && year <= ERA_BOUNDARIES.CLASSIC.max) {
        eraTotals.classic++
      } else if (year >= ERA_BOUNDARIES.GOLDEN.min && year <= ERA_BOUNDARIES.GOLDEN.max) {
        eraTotals.golden++
      } else if (year >= ERA_BOUNDARIES.MODERN.min && year <= ERA_BOUNDARIES.MODERN.max) {
        eraTotals.modern++
      } else if (
        year >= ERA_BOUNDARIES.CONTEMPORARY.min &&
        year <= ERA_BOUNDARIES.CONTEMPORARY.max
      ) {
        eraTotals.contemporary++
      }
    }
  })

  return [
    { era: ERA_BOUNDARIES.CLASSIC.label, count: eraTotals.classic, fill: ERA_BOUNDARIES.CLASSIC.color },
    { era: ERA_BOUNDARIES.GOLDEN.label, count: eraTotals.golden, fill: ERA_BOUNDARIES.GOLDEN.color },
    { era: ERA_BOUNDARIES.MODERN.label, count: eraTotals.modern, fill: ERA_BOUNDARIES.MODERN.color },
    {
      era: ERA_BOUNDARIES.CONTEMPORARY.label,
      count: eraTotals.contemporary,
      fill: ERA_BOUNDARIES.CONTEMPORARY.color,
    },
  ].filter((item) => item.count > 0)
}

/**
 * Generate insight message about release year preferences
 */
export function computeReleaseYearInsight(
  movies: Movie[],
  eraData: Array<{ era: string; count: number }>
): string {
  if (eraData.length === 0) return ''

  const totalMovies = movies.length
  const topEra = eraData.reduce((max, current) =>
    current.count > max.count ? current : max
  )
  const topEraPercent = Math.round((topEra.count / totalMovies) * 100)

  const eraMessages: Record<string, string> = {
    'Classic': 'classic cinema enthusiast',
    'Golden': 'golden age film lover',
    'Modern': 'modern cinema fan',
    'Contemporary': 'contemporary film enthusiast',
  }

  const message = eraMessages[topEra.era] || 'diverse cinema fan'
  return `You're a ${message} — ${topEraPercent}% of your movies are from the ${topEra.era} era`
}

// ============================================================================
// SECTION 2A: YOUR VIEWING PROFILE - WATCHING TIMELINE
// ============================================================================

/**
 * Transform movies to monthly viewing data
 * @returns Array of { month: "Jan 2024", count }
 */
export function transformMonthlyData(
  movies: Movie[]
): Array<{ month: string; count: number }> {
  const monthMap: Record<string, number> = {}

  movies.forEach((movie) => {
    const date = movie.watchedDate || movie.dateMarkedWatched
    if (date) {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      const monthKey = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
      monthMap[monthKey] = (monthMap[monthKey] || 0) + 1
    }
  })

  return Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
}

/**
 * Transform movies to year-monthly breakdown
 * @returns Array of { year, data: [{ month, count }] }
 */
export function transformYearMonthlyData(
  movies: Movie[]
): Array<{ year: number; data: Array<{ month: string; count: number }> }> {
  const yearMap: Record<number, Record<string, number>> = {}

  movies.forEach((movie) => {
    const date = movie.watchedDate || movie.dateMarkedWatched
    if (date) {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      const year = dateObj.getFullYear()
      const month = dateObj.toLocaleDateString('en-US', { month: 'short' })

      if (!yearMap[year]) yearMap[year] = {}
      yearMap[year][month] = (yearMap[year][month] || 0) + 1
    }
  })

  return Object.entries(yearMap)
    .map(([year, monthData]) => ({
      year: parseInt(year),
      data: Object.entries(monthData).map(([month, count]) => ({ month, count })),
    }))
    .sort((a, b) => a.year - b.year)
}

/**
 * Compute diary statistics (key metrics)
 */
export function transformDiaryStats(
  monthlyData: Array<{ month: string; count: number }>,
  moviesLength: number
): {
  totalEntries: number
  averagePerMonth: number
  busiestMonth: string
  busiestMonthCount: number
  quietestMonth: string
  quietestMonthCount: number
  dateRange: string
} | undefined {
  if (monthlyData.length === 0) return undefined

  const monthlyAverages = monthlyData.map((m) => m.count)
  const averagePerMonth =
    monthlyAverages.length > 0
      ? monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length
      : 0

  const busiestMonth = monthlyData.reduce((max, m) =>
    m.count > max.count ? m : max
  )
  const quietestMonth = monthlyData.reduce((min, m) =>
    m.count < min.count ? m : min
  )

  return {
    totalEntries: moviesLength,
    averagePerMonth: Math.round(averagePerMonth * 10) / 10,
    busiestMonth: busiestMonth?.month || 'Unknown',
    busiestMonthCount: busiestMonth?.count || 0,
    quietestMonth: quietestMonth?.month || 'Unknown',
    quietestMonthCount: quietestMonth?.count || 0,
    dateRange:
      monthlyData.length > 0
        ? `${monthlyData[0].month} - ${monthlyData[monthlyData.length - 1].month}`
        : 'No data',
  }
}

/**
 * Generate insight about viewing habits
 */
export function computeViewingInsight(
  analytics: AnalyticsOverview,
  monthlyData: Array<{ month: string; count: number }>
): string {
  if (!analytics.trackingSpan || monthlyData.length === 0) return ''

  const avgPerDay = analytics.totalMoviesWatched / Math.max(analytics.trackingSpan, 1)

  let viewingType = 'casual'
  if (avgPerDay > 0.5) viewingType = 'consistent'
  if (avgPerDay > 1) viewingType = 'intensive'

  return `You're a ${viewingType} watcher — averaging ${avgPerDay.toFixed(1)} movies per day`
}

// ============================================================================
// SECTION 2B: YOUR VIEWING PROFILE - LIKE TIMELINE
// ============================================================================

/**
 * Transform movies to likes by month
 * @returns Array of { month: "Jan 2024", count }
 */
export function transformLikesByMonth(
  movies: Movie[]
): Array<{ month: string; count: number }> {
  const likedMovies = movies.filter((m) => m.liked === true)
  const monthMap: Record<string, number> = {}

  likedMovies.forEach((movie) => {
    const date = movie.watchedDate || movie.dateMarkedWatched
    if (date) {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      const monthKey = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
      monthMap[monthKey] = (monthMap[monthKey] || 0) + 1
    }
  })

  return Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
}

/**
 * Transform movies to liked vs unliked ratio over time (monthly)
 * @returns Array of { month, liked, unliked }
 */
export function transformLikesVsUnlikesOverTime(
  movies: Movie[]
): Array<{ month: string; liked: number; unliked: number }> {
  const monthMap: Record<string, { liked: number; unliked: number }> = {}

  movies.forEach((movie) => {
    const date = movie.watchedDate || movie.dateMarkedWatched
    if (date) {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      const monthKey = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { liked: 0, unliked: 0 }
      }

      if (movie.liked === true) {
        monthMap[monthKey].liked++
      } else {
        monthMap[monthKey].unliked++
      }
    }
  })

  return Object.entries(monthMap)
    .map(([month, data]) => ({
      month,
      liked: data.liked,
      unliked: data.unliked,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
}

/**
 * Generate insight about like timeline
 */
export function computeLikeTimelineInsight(
  likesByMonth: Array<{ month: string; count: number }>
): string {
  if (likesByMonth.length === 0) return ''

  const totalLikes = likesByMonth.reduce((sum, m) => sum + m.count, 0)
  const avgPerMonth = totalLikes / likesByMonth.length

  return `You've liked ${totalLikes} movies over time — averaging ${Math.round(avgPerMonth)} likes per month`
}

// ============================================================================
// SECTION 3A: LIKES & RATINGS - LIKES ANALYSIS
// ============================================================================

/**
 * Transform movies to liked vs unliked ratio
 * @returns { liked, unliked }
 */
export function transformLikedVsUnliked(movies: Movie[]): { liked: number; unliked: number } {
  const liked = movies.filter((m) => m.liked === true).length
  const unliked = movies.length - liked

  return {
    liked,
    unliked,
  }
}

/**
 * Transform liked movies by decade
 * @returns Array of { decade: "1990s", count }
 */
export function transformLikesByDecade(
  movies: Movie[]
): Array<{ decade: string; count: number }> {
  const likedMovies = movies.filter((m) => m.liked === true)
  const decadeMap: Record<string, number> = {}

  likedMovies.forEach((movie) => {
    const decadeLabel = `${movie.decade}s`
    decadeMap[decadeLabel] = (decadeMap[decadeLabel] || 0) + 1
  })

  return Object.entries(decadeMap)
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => {
      const yearA = parseInt(a.decade)
      const yearB = parseInt(b.decade)
      return yearA - yearB
    })
}

/**
 * Generate insight about likes
 */
export function computeLikeInsight(
  moviesLiked: number,
  totalMovies: number
): string {
  const likePercent = Math.round((moviesLiked / totalMovies) * 100)

  let likeType = 'selective'
  if (likePercent > 50) likeType = 'generous'
  if (likePercent > 70) likeType = 'very generous'
  if (likePercent < 20) likeType = 'highly selective'

  return `You're a ${likeType} liker — you like ${likePercent}% of movies you watch`
}

// ============================================================================
// SECTION 3B: LIKES & RATINGS - RATING PATTERNS
// ============================================================================

/**
 * Transform rating distribution for bar chart
 * @param ratingDist From AnalyticsOverview.ratingDistribution
 * @returns Array of { rating: "5.0", count }
 */
export function transformRatingDistribution(
  ratingDist: Record<string, number>
): Array<{ rating: string; count: number }> {
  return Object.entries(ratingDist)
    .map(([rating, count]) => ({
      rating,
      count,
    }))
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
}

/**
 * Transform ratings by decade
 * @returns Array of { decade: "1990s", avgRating, count }
 */
export function transformRatingByDecade(
  movies: Movie[]
): Array<{ decade: string; avgRating: number; count: number }> {
  const ratedMovies = movies.filter((m) => m.rating !== undefined)

  if (ratedMovies.length === 0) {
    return []
  }

  const grouped = groupBy(ratedMovies, (m) => `${m.decade}s`)
  const result: Array<{ decade: string; avgRating: number; count: number }> = []

  grouped.forEach((decadeMovies, decade) => {
    const ratings = decadeMovies.map((m) => m.rating as number)
    const avgRating = average(ratings)

    result.push({
      decade,
      avgRating: Math.round(avgRating * 10) / 10,
      count: decadeMovies.length,
    })
  })

  return result.sort((a, b) => {
    const yearA = parseInt(a.decade)
    const yearB = parseInt(b.decade)
    return yearA - yearB
  })
}

/**
 * Transform rated vs unrated ratio
 * @returns { rated, unrated }
 */
export function transformRatedVsUnrated(movies: Movie[]): { rated: number; unrated: number } {
  const rated = movies.filter((m) => m.rating !== undefined).length
  const unrated = movies.length - rated

  return {
    rated,
    unrated,
  }
}

/**
 * Generate insight about rating behavior
 */
export function computeRatingInsight(analytics: AnalyticsOverview): string {
  const ratingCoverage = analytics.ratingCoverage
  const avgRating = analytics.averageRating

  let ratingType = 'selective'
  if (ratingCoverage > 80) ratingType = 'thorough'
  if (ratingCoverage > 95) ratingType = 'meticulous'
  if (ratingCoverage < 30) ratingType = 'minimal'

  let ratingTendency = 'balanced'
  if (avgRating > 3.8) ratingTendency = 'generous'
  if (avgRating < 2.5) ratingTendency = 'critical'

  return `You're a ${ratingType} rater — ${ratingCoverage}% of movies rated, averaging ${avgRating}★ (${ratingTendency})`
}

// ============================================================================
// SECTION 4: WATCHLIST INSIGHTS
// ============================================================================

/**
 * Transform watched vs watchlist comparison
 * @returns { watched, watchlist }
 */
export function transformWatchedVsWatchlist(
  watched: Movie[],
  watchlist: Movie[]
): { watched: number; watchlist: number } {
  return {
    watched: watched.length,
    watchlist: watchlist.length,
  }
}

/**
 * Transform watched vs watchlist by decade
 * @returns Array of { decade: "1990s", watched, watchlist }
 */
export function transformWatchlistByDecade(
  watched: Movie[],
  watchlist: Movie[]
): Array<{ decade: string; watched: number; watchlist: number }> {
  const watchedByDecade: Record<string, number> = {}
  const watchlistByDecade: Record<string, number> = {}
  const allDecades = new Set<string>()

  // Group watched by decade
  watched.forEach((movie) => {
    const decade = `${movie.decade}s`
    watchedByDecade[decade] = (watchedByDecade[decade] || 0) + 1
    allDecades.add(decade)
  })

  // Group watchlist by decade
  watchlist.forEach((movie) => {
    const decade = `${movie.decade}s`
    watchlistByDecade[decade] = (watchlistByDecade[decade] || 0) + 1
    allDecades.add(decade)
  })

  // Combine into array
  return Array.from(allDecades)
    .map((decade) => ({
      decade,
      watched: watchedByDecade[decade] || 0,
      watchlist: watchlistByDecade[decade] || 0,
    }))
    .sort((a, b) => {
      const yearA = parseInt(a.decade)
      const yearB = parseInt(b.decade)
      return yearA - yearB
    })
}

/**
 * Generate insight about watchlist
 */
export function computeWatchlistInsight(
  watched: Movie[],
  watchlist: Movie[]
): string {
  const watchlistCount = watchlist.length
  const watchedCount = watched.length

  if (watchlistCount === 0) {
    return "Your watchlist is empty — start adding movies you want to watch!"
  }

  const ratio = watchlistCount / watchedCount
  let collectorType = 'balanced'
  if (ratio > 1) collectorType = 'ambitious'
  if (ratio > 2) collectorType = 'very ambitious'
  if (ratio < 0.5) collectorType = 'minimal'

  return `You're an ${collectorType} watcher — ${watchlistCount} movies to watch vs ${watchedCount} already watched`
}

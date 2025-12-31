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
 * Transform movies to 5-year period breakdown
 * @returns Array of { decade: string (e.g., "1990-1994"), count: number }
 */
export function transformReleaseYearToFiveYearPeriods(
  movies: Movie[]
): Array<{ decade: string; count: number }> {
  const periodMap: Record<string, number> = {}

  movies.forEach((movie) => {
    if (movie.year) {
      const year = parseInt(String(movie.year))
      // Calculate 5-year period (e.g., 1990-1994, 1995-1999)
      const periodStart = Math.floor(year / 5) * 5
      const periodEnd = periodStart + 4
      const periodLabel = `${periodStart}-${periodEnd}`
      periodMap[periodLabel] = (periodMap[periodLabel] || 0) + 1
    }
  })

  return Object.entries(periodMap)
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => {
      const yearA = parseInt(a.decade.split('-')[0])
      const yearB = parseInt(b.decade.split('-')[0])
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
    CONTEMPORARY: { min: 2000, max: 2099, label: 'Current', color: '#d946ef' },
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
 * ONLY includes movies with watchedDate (from diary.csv)
 * Movies without diary dates are excluded to maintain data integrity
 * @returns Array of { month: "Jan 2024", count }
 */
export function transformMonthlyData(
  movies: Movie[]
): Array<{ month: string; count: number }> {
  const monthMap: Record<string, number> = {}

  // Debug: Track rewatch statistics
  let totalInitialWatches = 0
  let totalRewatchesFromDates = 0
  let totalRewatchesFromCount = 0

  movies.forEach((movie) => {
    // Only process movies with watchedDate from diary.csv
    // Do NOT use dateMarkedWatched fallback - we only want diary entries
    const date = movie.watchedDate

    // Count the initial watch
    if (date) {
      try {
        // Handle both Date objects and date strings
        const dateObj = typeof date === 'string' ? new Date(date) : date

        // Validate the date is valid
        if (isNaN(dateObj.getTime())) {
          return // Skip invalid dates
        }

        const monthKey = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
        monthMap[monthKey] = (monthMap[monthKey] || 0) + 1
        totalInitialWatches++
      } catch (error) {
        // Skip movies with date parsing errors
        console.warn('Error parsing date for movie:', movie.title, error)
      }
    }

    // Count all rewatches
    if (movie.rewatchDates && movie.rewatchDates.length > 0) {
      // Case 1: We have explicit rewatch dates
      movie.rewatchDates.forEach((rewatchDate) => {
        try {
          const dateObj = typeof rewatchDate === 'string' ? new Date(rewatchDate) : rewatchDate

          if (isNaN(dateObj.getTime())) {
            return // Skip invalid dates
          }

          const monthKey = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })
          monthMap[monthKey] = (monthMap[monthKey] || 0) + 1
          totalRewatchesFromDates++
        } catch (error) {
          console.warn('Error parsing rewatch date for movie:', movie.title, error)
        }
      })
    } else if (movie.rewatchCount && movie.rewatchCount > 0 && date) {
      // Case 2: Single "Rewatch: Yes" entry - no explicit dates
      // Add rewatchCount to the same month as watchedDate
      try {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        const monthKey = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
        monthMap[monthKey] = (monthMap[monthKey] || 0) + movie.rewatchCount
        totalRewatchesFromCount += movie.rewatchCount
      } catch (error) {
        console.warn('Error counting rewatches for movie:', movie.title, error)
      }
    }
  })

  return Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
}

/**
 * Transform movies to year-monthly breakdown
 * IMPORTANT: Should only be called with movies that have watchedDate set (from diary.csv)
 * @returns Array of { year, data: [{ month, count }] }
 */
export function transformYearMonthlyData(
  movies: Movie[]
): Array<{ year: number; data: Array<{ month: string; count: number }> }> {
  const yearMap: Record<number, Record<string, number>> = {}

  movies.forEach((movie) => {
    // Only process movies with watchedDate from diary.csv
    const date = movie.watchedDate
    if (date) {
      try {
        const dateObj = typeof date === 'string' ? new Date(date) : date

        // Validate the date is valid
        if (isNaN(dateObj.getTime())) {
          return // Skip invalid dates
        }

        const year = dateObj.getFullYear()
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' })

        if (!yearMap[year]) yearMap[year] = {}
        yearMap[year][month] = (yearMap[year][month] || 0) + 1
      } catch (error) {
        // Skip movies with date parsing errors
        console.warn('Error parsing date for movie:', movie.title, error)
      }
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
  movies: Movie[]
): {
  totalUniqueMovies: number
  totalViewingEvents: number
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
      ? Math.floor(monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length)
      : 0

  const busiestMonth = monthlyData.reduce((max, m) =>
    m.count > max.count ? m : max
  )
  const quietestMonth = monthlyData.reduce((min, m) =>
    m.count < min.count ? m : min
  )

  // monthlyData now includes ALL viewing events (initial watches + rewatches)
  const totalViewingEvents = monthlyData.reduce((sum, m) => sum + m.count, 0)

  // Calculate unique movies - only count movies that appear in diary.csv (have watchedDate)
  const totalUniqueMovies = movies.filter(m => m.watchedDate).length

  return {
    totalUniqueMovies,
    totalViewingEvents,
    averagePerMonth, // Already floored above
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
  monthlyData: Array<{ month: string; count: number }>,
  diaryStats?: {
    averagePerMonth: number
    busiestMonth: string
    busiestMonthCount: number
    quietestMonth: string
    quietestMonthCount: number
  }
): string {
  if (!analytics.trackingSpan || monthlyData.length === 0) return ''

  const avgPerDay = analytics.totalMoviesWatched / Math.max(analytics.trackingSpan, 1)
  const avgPerMonth = diaryStats?.averagePerMonth ?? 0

  let viewingType = 'casual'
  let intensity = ''
  if (avgPerDay > 0.5) {
    viewingType = 'consistent'
    intensity = 'a regular rhythm to your watching'
  }
  if (avgPerDay > 1) {
    viewingType = 'intensive'
    intensity = 'an passionate dedication to cinema'
  }
  if (avgPerDay <= 0.5) {
    intensity = 'a relaxed approach to film consumption'
  }

  // Calculate variance in watching patterns
  const counts = monthlyData.map(m => m.count)
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length
  const variance = counts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / counts.length
  const isConsistent = variance < mean * 0.5

  let pattern = ''
  if (isConsistent) {
    pattern = 'You maintain a steady watching schedule throughout the year.'
  } else {
    pattern = `Your watching varies significantly, peaking at ${diaryStats?.busiestMonthCount ?? 0} movies in ${diaryStats?.busiestMonth ?? 'your busiest month'}.`
  }

  return `You're a ${viewingType} watcher with ${intensity}. Averaging ${avgPerMonth.toFixed(1)} movies per month. ${pattern}`
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
    // For diary section: ONLY use watchedDate (from diary.csv)
    const date = movie.watchedDate
    if (date) {
      try {
        const dateObj = typeof date === 'string' ? new Date(date) : date

        // Validate the date is valid
        if (isNaN(dateObj.getTime())) {
          return // Skip invalid dates
        }

        const monthKey = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
        monthMap[monthKey] = (monthMap[monthKey] || 0) + 1
      } catch (error) {
        // Skip movies with date parsing errors
        console.warn('Error parsing date for movie:', movie.title, error)
      }
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
    // For diary section: ONLY use watchedDate (from diary.csv)
    const date = movie.watchedDate
    if (date) {
      try {
        const dateObj = typeof date === 'string' ? new Date(date) : date

        // Validate the date is valid
        if (isNaN(dateObj.getTime())) {
          return // Skip invalid dates
        }

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
      } catch (error) {
        // Skip movies with date parsing errors
        console.warn('Error parsing date for movie:', movie.title, error)
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

/**
 * Transform movies to liked vs total by decade (for stacked chart)
 * @returns Array of { decade: "1990s", total, liked, percentage }
 */
export function transformMostLikedDecade(
  movies: Movie[]
): Array<{ decade: string; total: number; liked: number; percentage: number }> {
  const decadeMap: Record<string, { total: number; liked: number }> = {}

  movies.forEach((movie) => {
    const decadeLabel = `${movie.decade}s`
    if (!decadeMap[decadeLabel]) {
      decadeMap[decadeLabel] = { total: 0, liked: 0 }
    }
    decadeMap[decadeLabel].total++
    if (movie.liked === true) {
      decadeMap[decadeLabel].liked++
    }
  })

  return Object.entries(decadeMap)
    .map(([decade, data]) => ({
      decade,
      total: data.total,
      liked: data.liked,
      percentage: data.total > 0 ? Math.round((data.liked / data.total) * 100) : 0,
    }))
    .sort((a, b) => {
      const yearA = parseInt(a.decade)
      const yearB = parseInt(b.decade)
      return yearA - yearB
    })
}

// ============================================================================
// SECTION 3B: LIKES & RATINGS - RATING PATTERNS
// ============================================================================

/**
 * Transform rating distribution for bar chart
 * Shows all possible ratings (0.5-5.0), even if count is 0
 * @param ratingDist From AnalyticsOverview.ratingDistribution
 * @returns Array of { rating: "5.0", count }
 */
export function transformRatingDistribution(
  ratingDist: Record<string, number>
): Array<{ rating: string; count: number }> {
  // Generate all possible ratings from 0.5 to 5.0 in 0.5 increments
  const allRatings: Array<{ rating: string; count: number }> = []
  for (let i = 0.5; i <= 5.0; i += 0.5) {
    const rating = i.toFixed(1)
    allRatings.push({
      rating,
      count: ratingDist[rating] || 0,
    })
  }
  return allRatings
}

/**
 * Transform liked movies rating distribution
 * Shows how user rates movies they like
 * Includes all possible ratings (0.5-5.0) and a special "Not Rated" bar
 * @returns Array of { rating: "5.0" | "Not Rated", count, isNotRated }
 */
export function transformLikedMoviesRatingDistribution(
  movies: Movie[]
): Array<{ rating: string; count: number; isNotRated?: boolean }> {
  const likedMovies = movies.filter((m) => m.liked === true)

  if (likedMovies.length === 0) {
    return []
  }

  // Count liked movies without ratings
  const likedNotRated = likedMovies.filter((m) => m.rating === undefined).length

  // Filter for movies that are both liked AND rated
  const likedAndRated = likedMovies.filter((m) => m.rating !== undefined)

  // Group by rating
  const ratingMap: Record<string, number> = {}
  likedAndRated.forEach((movie) => {
    const rating = movie.rating!.toFixed(1)
    ratingMap[rating] = (ratingMap[rating] || 0) + 1
  })

  // Generate all possible ratings from 0.5 to 5.0
  const allRatings: Array<{ rating: string; count: number; isNotRated?: boolean }> = []

  // Add "Not Rated" bar first if there are any
  if (likedNotRated > 0) {
    allRatings.push({
      rating: "Not Rated",
      count: likedNotRated,
      isNotRated: true,
    })
  }

  // Add all rating values
  for (let i = 0.5; i <= 5.0; i += 0.5) {
    const rating = i.toFixed(1)
    allRatings.push({
      rating,
      count: ratingMap[rating] || 0,
    })
  }

  return allRatings
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
 * Transform rated movies by decade
 * Returns ALL decades with rated movies (no minimum threshold)
 * Includes average rating and counts for each rating tier
 * @returns Array of { decade, avgRating, totalRated, fiveStars, fourHalfStars, fourStars, hasEnoughData }
 */
export function transformBestRatedDecade(
  movies: Movie[]
): Array<{
  decade: string
  avgRating: number
  totalRated: number
  fiveStars: number
  fourHalfStars: number
  fourStars: number
  hasEnoughData: boolean
}> {
  const ratedMovies = movies.filter((m) => m.rating !== undefined)

  if (ratedMovies.length === 0) {
    return []
  }

  const grouped = groupBy(ratedMovies, (m) => `${m.decade}s`)
  const result: Array<{
    decade: string
    avgRating: number
    totalRated: number
    fiveStars: number
    fourHalfStars: number
    fourStars: number
    hasEnoughData: boolean
  }> = []

  grouped.forEach((decadeMovies, decade) => {
    const ratings = decadeMovies.map((m) => m.rating as number)
    const avgRating = average(ratings)
    const fiveStars = decadeMovies.filter((m) => (m.rating as number) === 5).length
    const fourHalfStars = decadeMovies.filter((m) => (m.rating as number) === 4.5).length
    const fourStars = decadeMovies.filter((m) => (m.rating as number) === 4).length

    result.push({
      decade,
      avgRating: Math.round(avgRating * 10) / 10,
      totalRated: decadeMovies.length,
      fiveStars,
      fourHalfStars,
      fourStars,
      hasEnoughData: decadeMovies.length >= 10, // Flag for filtering
    })
  })

  return result.sort((a, b) => {
    const yearA = parseInt(a.decade)
    const yearB = parseInt(b.decade)
    return yearA - yearB
  })
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

/**
 * Transform movies to taste preference stats
 * @returns { watched, rated, liked }
 */
export function transformTastePreferenceStats(
  movies: Movie[]
): { watched: number; rated: number; liked: number } {
  const watched = movies.length
  const rated = movies.filter((m) => m.rating !== undefined).length
  const liked = movies.filter((m) => m.liked === true).length

  return {
    watched,
    rated,
    liked,
  }
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
 * Transform watchlist data by 5-year periods
 */
export function transformWatchlistByFiveYear(
  watched: Movie[],
  watchlist: Movie[]
): Array<{ period: string; watched: number; watchlist: number }> {
  const watchedByPeriod: Record<string, number> = {}
  const watchlistByPeriod: Record<string, number> = {}
  const allPeriods = new Set<string>()

  // Helper function to get 5-year period from year
  const getFiveYearPeriod = (year: number): string => {
    const startYear = Math.floor(year / 5) * 5
    const endYear = startYear + 4
    return `${startYear}-${endYear}`
  }

  // Group watched by 5-year period
  watched.forEach((movie) => {
    if (movie.year) {
      const period = getFiveYearPeriod(movie.year)
      watchedByPeriod[period] = (watchedByPeriod[period] || 0) + 1
      allPeriods.add(period)
    }
  })

  // Group watchlist by 5-year period
  watchlist.forEach((movie) => {
    if (movie.year) {
      const period = getFiveYearPeriod(movie.year)
      watchlistByPeriod[period] = (watchlistByPeriod[period] || 0) + 1
      allPeriods.add(period)
    }
  })

  // Combine into array
  return Array.from(allPeriods)
    .map((period) => ({
      period,
      watched: watchedByPeriod[period] || 0,
      watchlist: watchlistByPeriod[period] || 0,
    }))
    .sort((a, b) => {
      const yearA = parseInt(a.period.split('-')[0])
      const yearB = parseInt(b.period.split('-')[0])
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

// ============================================================================
// SECTION 5: 2025 YEAR IN REVIEW
// ============================================================================

/**
 * Filter movies watched in 2025
 * @returns Array of movies with watchedDate in 2025
 */
export function filter2025Movies(movies: Movie[]): Movie[] {
  return movies.filter((movie) => {
    if (!movie.watchedDate) return false
    try {
      const dateObj = typeof movie.watchedDate === 'string' ? new Date(movie.watchedDate) : movie.watchedDate
      return dateObj.getFullYear() === 2025
    } catch {
      return false
    }
  })
}

/**
 * Transform 2025 movies to monthly viewing data
 * @returns Array of { month: "Jan 2025", count }
 */
export function transform2025MonthlyData(
  movies: Movie[]
): Array<{ month: string; count: number }> {
  const movies2025 = filter2025Movies(movies)
  return transformMonthlyData(movies2025)
}

/**
 * Compute 2025 specific statistics
 */
export function transform2025Stats(
  movies2025: Movie[]
): {
  totalWatched: number
  avgRating: number
  totalRewatches: number
  totalLiked: number
  monthlyAverage: number
  busiestMonth?: string
  busiestMonthCount?: number
} {
  const monthlyData = transformMonthlyData(movies2025)
  const ratedMovies = movies2025.filter((m) => m.rating !== undefined)
  const rewatchedMovies = movies2025.filter((m) => m.rewatch === true)
  const likedMovies = movies2025.filter((m) => m.liked === true)

  const avgRating =
    ratedMovies.length > 0
      ? Math.round(
          (ratedMovies.reduce((sum, m) => sum + (m.rating || 0), 0) / ratedMovies.length) * 10
        ) / 10
      : 0

  const monthlyAverage =
    monthlyData.length > 0
      ? Math.round(
          (monthlyData.reduce((sum, m) => sum + m.count, 0) / monthlyData.length) * 10
        ) / 10
      : 0

  const busiestMonth = monthlyData.length > 0 ? monthlyData.reduce((max, m) => (m.count > max.count ? m : max)) : undefined

  return {
    totalWatched: movies2025.length,
    avgRating,
    totalRewatches: rewatchedMovies.length,
    totalLiked: likedMovies.length,
    monthlyAverage,
    busiestMonth: busiestMonth?.month,
    busiestMonthCount: busiestMonth?.count,
  }
}

/**
 * Transform rating distribution for 2025 movies
 * @returns Array of { rating: "5.0", count }
 */
export function transform2025RatingDistribution(
  movies2025: Movie[]
): Array<{ rating: string; count: number }> {
  const ratingDist: Record<string, number> = {}

  movies2025.forEach((movie) => {
    if (movie.rating !== undefined) {
      const rating = String(movie.rating)
      ratingDist[rating] = (ratingDist[rating] || 0) + 1
    }
  })

  return Object.entries(ratingDist)
    .map(([rating, count]) => ({
      rating,
      count,
    }))
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
}

/**
 * Transform rewatch data for 2025
 * @returns { rewatched, firstWatch }
 */
export function transform2025RewatchData(
  movies2025: Movie[]
): { rewatched: number; firstWatch: number } {
  const rewatched = movies2025.filter((m) => m.rewatch === true).length
  const firstWatch = movies2025.length - rewatched

  return {
    rewatched,
    firstWatch,
  }
}

/**
 * Transform likes and favorites for 2025
 * @returns { liked, unliked }
 */
export function transform2025LikesAndFavorites(
  movies2025: Movie[]
): { liked: number; unliked: number } {
  const liked = movies2025.filter((m) => m.liked === true).length
  const unliked = movies2025.length - liked

  return {
    liked,
    unliked,
  }
}

/**
 * Generate insight about 2025 viewing year
 */
export function compute2025Insight(
  stats: ReturnType<typeof transform2025Stats>,
  totalMovies: number
): string {
  if (stats.totalWatched === 0) return ''

  const yearPercent = Math.round((stats.totalWatched / totalMovies) * 100)
  const avgRatingText = stats.avgRating > 0 ? ` with an average rating of ${stats.avgRating}★` : ''
  const busiestMonthText =
    stats.busiestMonth && stats.busiestMonthCount
      ? ` Your busiest month was ${stats.busiestMonth} with ${stats.busiestMonthCount} watches.`
      : ''

  return `In 2025, you watched ${stats.totalWatched} movies — that's ${yearPercent}% of your all-time collection${avgRatingText}.${busiestMonthText}`
}

// ============================================================================
// YEARLY COMPARISON - Compare last 5 complete years
// ============================================================================

/**
 * Transform movies to yearly comparison data
 * Compares monthly movie counts across the last 5 complete years
 * Omits incomplete years (e.g., if current year only has data up to April)
 *
 * @param movies - Array of movies with watchedDate
 * @returns Array of { month: "Jan", 2021: 45, 2022: 67, ... } for up to 5 years
 */
export function transformYearlyComparison(
  movies: Movie[]
): Array<{ month: string; [year: string]: string | number }> {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() // 0-11

  // Group movies by year and month
  const yearMonthMap: Record<number, Record<string, number>> = {}

  movies.forEach((movie) => {
    const date = movie.watchedDate
    if (!date) return

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return

      const year = dateObj.getFullYear()
      const monthIndex = dateObj.getMonth()
      const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' })

      if (!yearMonthMap[year]) yearMonthMap[year] = {}
      yearMonthMap[year][monthName] = (yearMonthMap[year][monthName] || 0) + 1
    } catch (error) {
      console.warn('Error parsing date for movie:', movie.title, error)
    }
  })

  // Filter out incomplete years
  const completeYears = Object.keys(yearMonthMap)
    .map(y => parseInt(y))
    .filter(year => {
      // If it's a past year, include it
      if (year < currentYear) return true

      // If it's the current year, only include if we have data for all months up to current month
      if (year === currentYear) {
        const yearData = yearMonthMap[year]
        const monthsWithData = Object.keys(yearData).length

        // Check if we have data for at least the current month
        // If it's early in the year and we only have 1-2 months of data, we might want to include it
        // But if we're in December and only have data up to April, exclude it
        const expectedMonths = currentMonth + 1 // +1 because month is 0-indexed

        // Only include current year if we have recent data (within last 3 months)
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const currentMonthName = allMonths[currentMonth]

        // Check if we have data for current month or the previous month
        return yearData[currentMonthName] !== undefined ||
               (currentMonth > 0 && yearData[allMonths[currentMonth - 1]] !== undefined)
      }

      return false
    })
    .sort((a, b) => b - a) // Sort descending (most recent first)
    .slice(0, 5) // Take only last 5 years

  if (completeYears.length === 0) return []

  // Create the output format: one row per month with columns for each year
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return months.map(month => {
    const row: { month: string; [year: string]: string | number } = { month }

    completeYears.forEach(year => {
      const count = yearMonthMap[year]?.[month] || 0
      row[year.toString()] = count
    })

    return row
  })
}

/**
 * Transform movies to yearly totals with year-over-year change
 * Calculates total movies watched per year and percentage change from previous year
 *
 * @param movies - Array of movies with watchedDate
 * @returns Array of { year: string, total: number, change: number | null }
 *          change is null for the first year (no previous year to compare)
 */
export function transformYearlyTotals(
  movies: Movie[]
): Array<{ year: string; total: number; change: number | null }> {
  // Group movies by year
  const yearTotals: Record<number, number> = {}

  movies.forEach((movie) => {
    const date = movie.watchedDate
    if (!date) return

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return

      const year = dateObj.getFullYear()
      yearTotals[year] = (yearTotals[year] || 0) + 1
    } catch (error) {
      console.warn('Error parsing date for movie:', movie.title, error)
    }
  })

  // Convert to array and sort by year
  const sortedYears = Object.keys(yearTotals)
    .map(y => parseInt(y))
    .sort((a, b) => a - b)

  // Calculate year-over-year changes
  const result = sortedYears.map((year, index) => {
    const total = yearTotals[year]
    let change: number | null = null

    if (index > 0) {
      const prevYear = sortedYears[index - 1]
      const prevTotal = yearTotals[prevYear]

      if (prevTotal > 0) {
        change = Math.round(((total - prevTotal) / prevTotal) * 100)
      }
    }

    return {
      year: year.toString(),
      total,
      change,
    }
  })

  // Limit to last 5 years (same as yearly comparison)
  return result.slice(-5)
}

/**
 * Data Merger for Letterboxd exports
 * Merges multiple CSV sources into a unified Movie dataset with conflict resolution
 *
 * Merge Priority (highest to lowest):
 * 1. ratings.csv - Most current ratings
 * 2. diary.csv - Accurate watch dates and rewatches
 * 3. watched.csv - Base watched movies
 * 4. films.csv - Liked movies (only for 'liked' flag)
 */

import type { Movie, MovieDataset, UserProfile } from './types'
import { groupBy } from './utils'

// ============================================================================
// MERGE UTILITIES
// ============================================================================

/**
 * Generate composite key for matching movies across different CSV files
 * Uses title + year since diary.csv uses diary entry URIs while watched.csv uses film URIs
 */
function getMovieKey(movie: Movie): string {
  return `${movie.title.toLowerCase().trim()}|${movie.year}`
}

/**
 * Deduplicates movies by Letterboxd URI, keeping complete entries
 * When duplicates exist, keeps the one with most data
 */
export function deduplicateMovies(movies: Movie[]): Movie[] {
  const seen = new Map<string, Movie>()

  movies.forEach((movie) => {
    const existing = seen.get(movie.id)

    if (!existing) {
      seen.set(movie.id, movie)
    } else {
      // Keep the entry with more complete data
      const newScore = countMovieFields(movie)
      const existingScore = countMovieFields(existing)

      if (newScore > existingScore) {
        seen.set(movie.id, movie)
      }
    }
  })

  return Array.from(seen.values())
}

/**
 * Count how many fields are populated in a movie (for deduplication scoring)
 */
function countMovieFields(movie: Movie): number {
  let count = 0

  if (movie.title) count++
  if (movie.year) count++
  if (movie.watchedDate) count++
  if (movie.dateMarkedWatched) count++
  if (movie.rating !== undefined) count++
  if (movie.ratingDate) count++
  if (movie.rewatch) count++
  if (movie.rewatchCount) count++
  if (movie.rewatchDates && movie.rewatchDates.length > 0) count++
  if (movie.tags && movie.tags.length > 0) count++
  if (movie.liked) count++

  return count
}

/**
 * Resolve conflicts between two versions of the same movie
 * Applies merge priority: incoming source > existing
 *
 * Priority order:
 * - rating: ratings.csv > diary.csv > watched.csv
 * - watchedDate: diary.csv > watched.csv
 * - tags: diary.csv > watched.csv
 * - liked: films.csv (always set if true)
 * - rewatch/rewatchCount: aggregated from diary.csv
 */
export function resolveConflicts(
  existing: Movie,
  incoming: Movie,
  source: 'diary' | 'ratings' | 'watched' | 'films'
): Movie {
  const merged = { ...existing }

  switch (source) {
    case 'ratings':
      // Ratings.csv has priority for rating
      if (incoming.rating !== undefined) {
        merged.rating = incoming.rating
        merged.ratingDate = incoming.ratingDate
      }
      break

    case 'diary':
      // Diary has priority for watched date and tags
      if (incoming.watchedDate) {
        merged.watchedDate = incoming.watchedDate
      }
      if (incoming.rating !== undefined && merged.rating === undefined) {
        merged.rating = incoming.rating
        merged.ratingDate = incoming.ratingDate
      }
      if (incoming.tags && incoming.tags.length > 0) {
        merged.tags = incoming.tags
      }
      // Aggregate rewatch information
      if (incoming.rewatch) {
        merged.rewatch = true
        if (incoming.rewatchCount) {
          merged.rewatchCount = (merged.rewatchCount || 0) + incoming.rewatchCount
        }
        if (incoming.rewatchDates) {
          merged.rewatchDates = [
            ...(merged.rewatchDates || []),
            ...incoming.rewatchDates,
          ]
        }
      }
      break

    case 'watched':
      // Watched is base - only fill in missing fields
      if (!merged.watchedDate && incoming.watchedDate) {
        merged.watchedDate = incoming.watchedDate
      }
      if (!merged.dateMarkedWatched && incoming.dateMarkedWatched) {
        merged.dateMarkedWatched = incoming.dateMarkedWatched
      }
      break

    case 'films':
      // Films.csv only provides 'liked' flag
      if (incoming.liked) {
        merged.liked = true
      }
      break
  }

  return merged
}

/**
 * Aggregate rewatches from multiple diary entries
 * Groups entries by title+year (not URI, since diary uses entry URIs)
 *
 * Handles two cases:
 * 1. Multiple entries for same movie = each entry is a watch/rewatch
 * 2. Single entry with Rewatch: Yes = explicitly marked as rewatch, count = 1
 */
function aggregateRewatches(diaryMovies: Movie[]): Movie[] {
  const grouped = groupBy(diaryMovies, (movie) => getMovieKey(movie))
  const aggregated: Movie[] = []

  grouped.forEach((entries) => {
    if (entries.length === 0) return

    const base = { ...entries[0] }

    if (entries.length > 1) {
      // Multiple entries for same movie = rewatches
      base.rewatch = true
      base.rewatchCount = entries.length - 1

      // Collect all watch dates
      const allDates = entries
        .map((m) => m.watchedDate || m.dateMarkedWatched)
        .filter((d): d is Date => d !== undefined)
        .sort((a, b) => a.getTime() - b.getTime())

      if (allDates.length > 0) {
        base.watchedDate = allDates[0] // Earliest date
        base.rewatchDates = allDates.slice(1) // Remaining are rewatches
      }
    } else if (entries.length === 1 && entries[0].rewatch) {
      // Single entry explicitly marked as Rewatch: Yes
      // Count is already set to 1 during parsing, just keep it
      base.rewatch = true
      // rewatchCount should already be set from parsing, or default to 1
      if (!base.rewatchCount) {
        base.rewatchCount = 1
      }
    }

    aggregated.push(base)
  })

  // Debug: Count rewatches after aggregation
  const rewatchCount = aggregated.filter(m => m.rewatch && m.rewatchCount).length
  const totalRewatchCount = aggregated.reduce((sum, m) => sum + (m.rewatchCount || 0), 0)
  console.log(`[aggregateRewatches] ${aggregated.length} unique movies, ${rewatchCount} with rewatchCount, total rewatches: ${totalRewatchCount}`)

  return aggregated
}

// ============================================================================
// MAIN MERGE FUNCTION
// ============================================================================

/**
 * Merge multiple CSV sources into unified Movie dataset
 *
 * Priority order: ratings.csv > diary.csv > watched.csv > films.csv
 * Profile is stored as singleton (one-to-one with dataset)
 *
 * Letterboxd URI is used as unique identifier for deduplication
 */
export function mergeMovieSources(
  watched: Movie[],
  diary?: Movie[],
  ratings?: Movie[],
  films?: Movie[],
  watchlist?: Movie[],
  profile?: UserProfile
): MovieDataset {
  // Validate watched.csv is provided (mandatory)
  if (!watched || watched.length === 0) {
    throw new Error('watched.csv is mandatory - no movies to process')
  }

  // Track which files were uploaded
  const uploadedFiles: string[] = ['watched']

  // Start with watched.csv as base
  let merged = [...watched]

  // Merge films.csv first (only provides 'liked' flag, no conflicts)
  if (films && films.length > 0) {
    uploadedFiles.push('films')
    const filmsMap = new Map(films.map((m) => [getMovieKey(m), m]))

    merged = merged.map((movie) => {
      const filmsEntry = filmsMap.get(getMovieKey(movie))
      if (filmsEntry && filmsEntry.liked) {
        return { ...movie, liked: true }
      }
      return movie
    })
  }

  // Merge diary.csv (provides watch dates, tags, rewatch info)
  if (diary && diary.length > 0) {
    uploadedFiles.push('diary')

    // First aggregate rewatches within diary
    const aggregated = aggregateRewatches(diary)
    // Use title+year key instead of URI since diary uses diary entry URIs
    const diaryMap = new Map(aggregated.map((m) => [getMovieKey(m), m]))

    // Debug: Check diary entries before merge
    console.log(`[mergeMovieSources] Diary has ${diaryMap.size} unique movies`)
    console.log(`[mergeMovieSources] Watched has ${merged.length} movies`)

    let matchedCount = 0
    merged = merged.map((movie) => {
      const diaryEntry = diaryMap.get(getMovieKey(movie))
      if (diaryEntry) {
        matchedCount++
        return resolveConflicts(movie, diaryEntry, 'diary')
      }
      return movie
    })

    console.log(`[mergeMovieSources] Matched ${matchedCount} movies from diary to watched`)

    // Debug: Count rewatches after merge
    const rewatchCountAfterMerge = merged.filter(m => m.rewatch && m.rewatchCount).length
    const totalRewatchCount = merged.reduce((sum, m) => sum + (m.rewatchCount || 0), 0)
    console.log(`[mergeMovieSources] After merge: ${rewatchCountAfterMerge} with rewatchCount, total rewatches: ${totalRewatchCount}`)

    // Note: We do NOT add diary entries that aren't in watched.csv
    // All movies in diary.csv should already exist in watched.csv
    // If they don't, they are data errors and should be skipped
  }

  // Merge ratings.csv (highest priority for ratings)
  if (ratings && ratings.length > 0) {
    uploadedFiles.push('ratings')
    const ratingsMap = new Map(ratings.map((m) => [getMovieKey(m), m]))

    merged = merged.map((movie) => {
      const ratingEntry = ratingsMap.get(getMovieKey(movie))
      if (ratingEntry) {
        return resolveConflicts(movie, ratingEntry, 'ratings')
      }
      return movie
    })

    // Note: We do NOT add ratings entries that aren't in watched.csv
    // All movies in ratings.csv should already exist in watched.csv
    // If they don't, they are data errors and should be skipped
  }

  // Separate watchlist from watched
  const watchedFinal: Movie[] = []
  const watchlistFinal: Movie[] = []

  merged.forEach((movie) => {
    // Check if movie came from watchlist.csv
    const isFromWatchlist = watchlist?.some((w) => w.id === movie.id)

    if (isFromWatchlist) {
      watchlistFinal.push(movie)
    } else {
      watchedFinal.push(movie)
    }
  })

  // Add watchlist movies if provided
  if (watchlist && watchlist.length > 0) {
    uploadedFiles.push('watchlist')
    watchlist.forEach((movie) => {
      if (!watchedFinal.some((w) => w.id === movie.id)) {
        watchlistFinal.push(movie)
      }
    })
  }

  // Add profile if provided
  if (profile) {
    uploadedFiles.push('profile')
  }

  // Final deduplication on watched movies
  const watchedDeduplicated = deduplicateMovies(watchedFinal)

  return {
    watched: watchedDeduplicated,
    watchlist: deduplicateMovies(watchlistFinal),
    userProfile: profile,
    uploadedFiles,
    lastUpdated: new Date(),
  }
}

/**
 * Update an existing dataset with new CSV data
 * Re-merges all sources to maintain consistency
 */
export function updateDataset(
  current: MovieDataset,
  newWatched?: Movie[],
  newDiary?: Movie[],
  newRatings?: Movie[],
  newFilms?: Movie[],
  newWatchlist?: Movie[],
  newProfile?: UserProfile
): MovieDataset {
  // Use new data if provided, otherwise use existing
  const watched = newWatched || current.watched
  const diary = newDiary
  const ratings = newRatings
  const films = newFilms
  const watchlist = newWatchlist || current.watchlist
  const profile = newProfile !== undefined ? newProfile : current.userProfile

  return mergeMovieSources(watched, diary, ratings, films, watchlist, profile)
}

/**
 * Remove a specific file from the dataset and recompute
 * Useful for clearing a specific CSV source
 */
export function removeFileFromDataset(
  dataset: MovieDataset,
  fileType: 'diary' | 'ratings' | 'films' | 'watchlist'
): MovieDataset {
  // This would need to track which movies came from which source
  // For now, this is a placeholder for future implementation
  // The store should maintain separate arrays for each source

  throw new Error(
    `Removing ${fileType} not yet implemented. Store individual sources separately.`
  )
}

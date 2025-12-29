/**
 * React hook for calculating user progress on canon movie lists
 */

import { useMemo } from 'react'
import { useDataset } from './use-analytics-store'
import { ALL_CANON_LISTS } from '@/lib/canon/lists'
import { findMatchedMovies, findUnwatchedMovies } from '@/lib/canon/matcher'
import type { CanonProgress, CanonComparison, CanonList } from '@/lib/canon/types'
import type { Movie } from '@/lib/types'

/**
 * Calculate progress for a single canon list
 */
function calculateListProgress(
  list: CanonList,
  userMovies: Movie[]
): CanonProgress {
  const watchedMovies = findMatchedMovies(userMovies, list.movies)
  const unwatchedMovies = findUnwatchedMovies(userMovies, list.movies)
  const watchedCount = watchedMovies.length
  const completionPercentage = (watchedCount / list.totalMovies) * 100

  return {
    listId: list.id,
    listTitle: list.title,
    totalMovies: list.totalMovies,
    watchedCount,
    completionPercentage: Math.round(completionPercentage * 10) / 10, // Round to 1 decimal
    watchedMovies,
    unwatchedMovies
  }
}

/**
 * Hook to get user's progress across all canon lists
 * Returns progress data for each list plus overall statistics
 */
export function useCanonProgress(): CanonComparison | null {
  const dataset = useDataset()

  const comparison = useMemo(() => {
    if (!dataset || dataset.watched.length === 0) {
      return null
    }

    // Calculate progress for each list
    const lists: CanonProgress[] = ALL_CANON_LISTS.map(list =>
      calculateListProgress(list, dataset.watched)
    )

    // Sort by completion percentage (highest first)
    lists.sort((a, b) => b.completionPercentage - a.completionPercentage)

    // Calculate overall stats
    const totalLists = lists.length
    const averageCompletion = lists.reduce((sum, l) => sum + l.completionPercentage, 0) / totalLists
    const mostCompleted = lists[0] || null
    const leastCompleted = lists[lists.length - 1] || null

    return {
      lists,
      overallStats: {
        totalLists,
        averageCompletion: Math.round(averageCompletion * 10) / 10,
        mostCompleted,
        leastCompleted
      }
    }
  }, [dataset])

  return comparison
}

/**
 * Hook to get progress for a specific canon list by ID
 */
export function useCanonListProgress(listId: string): CanonProgress | null {
  const dataset = useDataset()

  const progress = useMemo(() => {
    if (!dataset || dataset.watched.length === 0) {
      return null
    }

    const list = ALL_CANON_LISTS.find(l => l.id === listId)
    if (!list) {
      return null
    }

    return calculateListProgress(list, dataset.watched)
  }, [dataset, listId])

  return progress
}

/**
 * Hook to get basic stats about canon lists (no user data needed)
 */
export function useCanonListsInfo() {
  return useMemo(() => ({
    totalLists: ALL_CANON_LISTS.length,
    lists: ALL_CANON_LISTS.map(l => ({
      id: l.id,
      title: l.title,
      shortTitle: l.shortTitle,
      totalMovies: l.totalMovies
    }))
  }), [])
}

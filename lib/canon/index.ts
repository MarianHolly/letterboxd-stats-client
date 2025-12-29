/**
 * Canon Lists Module - Barrel Export
 * Compare user's watched movies against famous curated lists
 */

// Types
export type { CanonList, CanonMovie, CanonProgress, CanonComparison } from './types'

// Lists data (auto-generated from markdown)
export { ALL_CANON_LISTS, CANON_STATS } from './lists'

// Matching utilities
export {
  normalizeTitle,
  titlesMatch,
  titleSimilarity,
  matchMovie,
  findMatchedMovies,
  findUnwatchedMovies,
  getMatchStats
} from './matcher'

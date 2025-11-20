/**
 * Core TypeScript interfaces for Letterboxd Stats
 * Defines all data structures used throughout the application
 */

// ============================================================================
// MOVIE & DATASET TYPES
// ============================================================================

/**
 * Represents a movie that the user has watched
 * Unified data structure combining information from all CSV sources
 */
export interface Movie {
  // Core identifiers
  id: string; // Letterboxd URI (https://boxd.it/XXX)
  title: string; // Movie title
  year: number; // Release year

  // Viewing information
  watchedDate?: Date; // First time watched (from diary if available, else watched.csv date)
  dateMarkedWatched: Date; // Date added to watched list (from watched.csv)

  // Rating information
  rating?: number; // Current rating 0.5-5.0 (from ratings.csv > diary.csv)
  ratingDate?: Date; // When rating was made

  // Rewatch information
  rewatch: boolean; // true if watched multiple times
  rewatchCount?: number; // Number of times rewatched (if > 1)
  rewatchDates?: Date[]; // Dates of rewatches (from diary)

  // Optional enrichment
  tags?: string[]; // User tags (from diary)
  liked?: boolean; // true if in films.csv (liked)

  // Computed fields
  decade: number; // 1990, 2000, 2010, etc.
  era: 'classic' | 'golden' | 'modern' | 'contemporary'; // Era classification
}

/**
 * Dataset wrapper containing all processed movies
 */
export interface MovieDataset {
  watched: Movie[]; // All watched movies (primary analytics dataset)
  watchlist: Movie[]; // Unwatched movies (separate)
  lastUpdated: Date; // When dataset was last updated
  uploadedFiles: string[]; // Which CSVs were uploaded (watched, diary, ratings, films, watchlist)
}

// ============================================================================
// CSV ROW TYPES (Input from Letterboxd exports)
// ============================================================================

/**
 * Raw row from watched.csv
 * Base structure - minimal but mandatory columns
 */
export interface WatchedCSVRow {
  Date: string; // YYYY-MM-DD
  Name: string;
  Year: string; // Will convert to number
  'Letterboxd URI': string;
}

/**
 * Raw row from diary.csv
 * Most complete data source with watch dates, ratings, rewatches
 */
export interface DiaryCSVRow extends WatchedCSVRow {
  Rating: string; // Empty string or "0.5"-"5.0"
  Rewatch: string; // "Yes" or empty string
  Tags: string; // Comma-separated or empty string
  'Watched Date': string; // YYYY-MM-DD or empty string
}

/**
 * Raw row from ratings.csv
 * Most current ratings - overrides diary ratings
 */
export interface RatingsCSVRow extends WatchedCSVRow {
  Rating: string; // Always "0.5"-"5.0" (never empty)
}

/**
 * Raw row from films.csv
 * Movies marked as "liked"
 */
export interface FilmsCSVRow extends WatchedCSVRow {}

/**
 * Raw row from watchlist.csv
 * Movies to watch (not yet watched)
 */
export interface WatchlistCSVRow extends WatchedCSVRow {}

// ============================================================================
// CSV PARSING TYPES
// ============================================================================

/**
 * CSV file type identification
 */
export type CSVType = 'watched' | 'diary' | 'ratings' | 'films' | 'watchlist' | 'unknown';

/**
 * Result of parsing a CSV file
 */
export interface ParseResult<T> {
  success: boolean;
  data?: T;
  errors: ParseError[];
}

/**
 * Individual parsing error
 */
export interface ParseError {
  row: number;
  field: string;
  value: string;
  message: string;
}

/**
 * CSV validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Complete analytics overview computed from Movie[]
 * Contains all 9 statistics displayed on dashboard
 */
export interface AnalyticsOverview {
  // Counts
  totalMoviesWatched: number; // All movies in watched dataset
  moviesRated: number; // Count of movies with rating !== undefined
  moviesLiked: number; // Count of movies with liked === true

  // Ratios
  ratingCoverage: number; // (moviesRated / totalMoviesWatched) * 100 - %
  likeRatio: number; // (moviesLiked / totalMoviesWatched) * 100 - %

  // Rating statistics
  averageRating: number; // Mean of all ratings
  medianRating: number; // Middle value of all ratings
  ratingDistribution: Record<string, number>; // "5.0": 45, "4.5": 30, etc.

  // Rewatch statistics
  totalRewatches: number; // Sum of all rewatchCount values
  moviesRewatched: number; // Count of movies with rewatch === true
  rewatchRate: number; // (moviesRewatched / totalMoviesWatched) * 100 - %

  // Time-based statistics
  earliestWatchDate?: Date; // Oldest watchedDate
  latestWatchDate?: Date; // Newest watchedDate
  trackingSpan?: number; // Days between earliest and latest watch

  // Aggregations by decade and year
  decadeBreakdown: Record<string, number>; // "1990": 50, "2000": 100, etc.
  yearlyWatching: Record<string, number>; // "2021": 45, "2022": 67, etc.
}

// ============================================================================
// STATE MANAGEMENT (Zustand Store)
// ============================================================================

/**
 * Complete Zustand store state for analytics
 */
export interface AnalyticsStore {
  // Data
  dataset: MovieDataset | null;
  analytics: AnalyticsOverview | null;
  uploadedFiles: File[];

  // State
  loading: boolean;
  error: string | null;

  // Actions
  uploadFiles: (files: File[]) => Promise<void>;
  clearData: () => void;
  removeFile: (filename: string) => Promise<void>;

  // Getters
  hasData: () => boolean;
  totalMovies: () => number;
}

// ============================================================================
// FILE UPLOAD TYPES
// ============================================================================

/**
 * Uploaded file with tracking info
 */
export interface UploadedFile {
  file: File;
  type: CSVType;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Standardized error response
 */
export interface ErrorResponse {
  type: 'validation' | 'parsing' | 'merge' | 'computation' | 'storage';
  message: string;
  details?: string;
  field?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Decade as string (e.g., "1990s", "2000s")
 */
export type DecadeString = '1920s' | '1930s' | '1940s' | '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';

/**
 * Era classification
 */
export type Era = 'classic' | 'golden' | 'modern' | 'contemporary';

/**
 * Time granularity for aggregations
 */
export type Granularity = 'yearly' | 'monthly' | 'weekly';

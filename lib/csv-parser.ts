/**
 * CSV Parser for Letterboxd exports
 * Handles parsing of all 5 CSV file types with validation and error handling
 */

import Papa from 'papaparse'
import type { Movie, CSVType, ParseResult, ParseError, ValidationError, WatchedCSVRow, DiaryCSVRow, RatingsCSVRow, UserProfile, FavoriteFilm, ProfileCSVRow } from './types'
import {
  parseDate,
  parseRating,
  parseTags,
  parseRewatch,
  isValidLetterboxdUri,
  isValidTitle,
  isValidYear,
  computeDecade,
  classifyEra,
  isValidLetterboxdFavoriteUri,
  parseFavoriteFilmsString,
  limitFavoriteFilms,
  validateProfileUsername,
} from './utils'

// ============================================================================
// CSV TYPE DETECTION
// ============================================================================

/**
 * Expected columns for each CSV type
 */
const EXPECTED_COLUMNS: Record<CSVType, string[]> = {
  watched: ['Date', 'Name', 'Year', 'Letterboxd URI'],
  diary: ['Date', 'Name', 'Year', 'Letterboxd URI', 'Rating', 'Rewatch', 'Tags', 'Watched Date'],
  ratings: ['Date', 'Name', 'Year', 'Letterboxd URI', 'Rating'],
  films: ['Date', 'Name', 'Year', 'Letterboxd URI'],
  watchlist: ['Date', 'Name', 'Year', 'Letterboxd URI'],
  profile: ['Date Joined', 'Username', 'Given Name', 'Family Name', 'Email Address', 'Location', 'Website', 'Bio', 'Pronoun', 'Favorite Films'],
  unknown: [],
}

/**
 * Detect CSV type from column headers
 */
export function detectCSVType(headers: string[]): CSVType {
  if (!headers || headers.length === 0) {
    return 'unknown'
  }

  // Normalize headers
  const normalized = headers.map((h) => h.trim())

  // Check profile first (10 columns, very specific)
  if (
    normalized.length === 10 &&
    EXPECTED_COLUMNS.profile.every((col) => normalized.includes(col))
  ) {
    return 'profile'
  }

  // Check exact matches for other specific types
  if (
    normalized.length === 8 &&
    EXPECTED_COLUMNS.diary.every((col) => normalized.includes(col))
  ) {
    return 'diary'
  }

  if (
    normalized.length === 5 &&
    EXPECTED_COLUMNS.ratings.every((col) => normalized.includes(col))
  ) {
    return 'ratings'
  }

  // Check required columns for watched/films/watchlist
  const hasBase = EXPECTED_COLUMNS.watched.every((col) => normalized.includes(col))

  if (hasBase) {
    // If it has 8 columns and includes diary columns, it's diary
    if (normalized.length === 8) {
      return 'diary'
    }
    // If it has 5 columns and includes rating, it's ratings
    if (normalized.length === 5 && normalized.includes('Rating')) {
      return 'ratings'
    }
    // Default to watched (base format)
    return 'watched'
  }

  return 'unknown'
}

/**
 * Validate CSV structure
 */
export function validateCSV(headers: string[]): ValidationError[] {
  const errors: ValidationError[] = []

  if (!headers || headers.length === 0) {
    errors.push({
      field: 'headers',
      message: 'CSV file has no headers',
    })
    return errors
  }

  const normalized = headers.map((h) => h.trim())
  const type = detectCSVType(normalized)

  // Check all expected columns for detected type
  // If unknown, check base columns
  const expectedCols = type === 'unknown' ? EXPECTED_COLUMNS.watched : EXPECTED_COLUMNS[type]

  for (const col of expectedCols) {
    if (!normalized.includes(col)) {
      errors.push({
        field: col,
        message: `Missing required column: ${col}`,
      })
    }
  }

  // If still no specific errors but type is unknown, add a generic error
  if (errors.length === 0 && type === 'unknown') {
    errors.push({
      field: 'headers',
      message: 'Unknown CSV type - missing required columns (Date, Name, Year, Letterboxd URI)',
    })
  }

  return errors
}

// ============================================================================
// CSV PARSING
// ============================================================================

/**
 * Parse watched.csv into Movie array
 */
function parseWatchedCSV(rows: WatchedCSVRow[]): ParseResult<Movie[]> {
  const movies: Movie[] = []
  const errors: ParseError[] = []

  rows.forEach((row, index) => {
    try {
      // Validate required fields
      if (!isValidTitle(row.Name)) {
        errors.push({
          row: index + 2, // +2 for header and 1-based indexing
          field: 'Name',
          value: row.Name,
          message: 'Movie title is empty or invalid',
        })
        return
      }

      if (!isValidYear(row.Year)) {
        errors.push({
          row: index + 2,
          field: 'Year',
          value: String(row.Year),
          message: `Invalid year: "${row.Year}" (must be 1890-2100)`,
        })
        return
      }

      if (!isValidLetterboxdUri(row['Letterboxd URI'])) {
        errors.push({
          row: index + 2,
          field: 'Letterboxd URI',
          value: row['Letterboxd URI'],
          message: `Invalid Letterboxd URI: "${row['Letterboxd URI']}"`,
        })
        return
      }

      const watchedDate = parseDate(row.Date)
      if (!watchedDate) {
        errors.push({
          row: index + 2,
          field: 'Date',
          value: row.Date,
          message: `Invalid date format: "${row.Date}" (expected YYYY-MM-DD)`,
        })
        return
      }

      const year = parseInt(String(row.Year), 10)

      const movie: Movie = {
        id: row['Letterboxd URI'],
        title: row.Name.trim(),
        year,
        dateMarkedWatched: watchedDate,
        rewatch: false,
        decade: computeDecade(year),
        era: classifyEra(year),
      }

      movies.push(movie)
    } catch (error) {
      errors.push({
        row: index + 2,
        field: 'unknown',
        value: JSON.stringify(row),
        message: `Error parsing row: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    }
  })

  return {
    success: errors.length === 0,
    data: movies,
    errors,
  }
}

/**
 * Parse diary.csv into Movie array
 */
function parseDiaryCSV(rows: DiaryCSVRow[]): ParseResult<Movie[]> {
  const movies: Movie[] = []
  const errors: ParseError[] = []

  rows.forEach((row, index) => {
    try {
      // Validate required fields (same as watched)
      if (!isValidTitle(row.Name)) {
        errors.push({
          row: index + 2,
          field: 'Name',
          value: row.Name,
          message: 'Movie title is empty or invalid',
        })
        return
      }

      if (!isValidYear(row.Year)) {
        errors.push({
          row: index + 2,
          field: 'Year',
          value: String(row.Year),
          message: `Invalid year: "${row.Year}"`,
        })
        return
      }

      if (!isValidLetterboxdUri(row['Letterboxd URI'])) {
        errors.push({
          row: index + 2,
          field: 'Letterboxd URI',
          value: row['Letterboxd URI'],
          message: `Invalid Letterboxd URI: "${row['Letterboxd URI']}"`,
        })
        return
      }

      const year = parseInt(String(row.Year), 10)
      const rating = parseRating(row.Rating) || undefined
      const rewatch = parseRewatch(row.Rewatch)
      const tags = parseTags(row.Tags)

      // Watched date from diary is more accurate than Date column
      const watchedDate = parseDate(row['Watched Date']) || parseDate(row.Date)

      if (!watchedDate) {
        errors.push({
          row: index + 2,
          field: 'Watched Date',
          value: row['Watched Date'] || row.Date,
          message: 'Could not parse watched date',
        })
        return
      }

      const ratingDate = rating ? (parseDate(row.Date) || undefined) : undefined

      const movie: Movie = {
        id: row['Letterboxd URI'],
        title: row.Name.trim(),
        year,
        watchedDate,
        dateMarkedWatched: parseDate(row.Date) || watchedDate,
        rating,
        ratingDate,
        rewatch,
        rewatchCount: rewatch ? 1 : undefined, // If marked as Rewatch: Yes, count at least 1
        tags: tags.length > 0 ? tags : undefined,
        decade: computeDecade(year),
        era: classifyEra(year),
      }

      movies.push(movie)
    } catch (error) {
      errors.push({
        row: index + 2,
        field: 'unknown',
        value: JSON.stringify(row),
        message: `Error parsing row: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    }
  })

  return {
    success: errors.length === 0,
    data: movies,
    errors,
  }
}

/**
 * Parse ratings.csv into Movie array
 */
function parseRatingsCSV(rows: RatingsCSVRow[]): ParseResult<Movie[]> {
  const movies: Movie[] = []
  const errors: ParseError[] = []

  rows.forEach((row, index) => {
    try {
      if (!isValidTitle(row.Name)) {
        errors.push({
          row: index + 2,
          field: 'Name',
          value: row.Name,
          message: 'Movie title is empty or invalid',
        })
        return
      }

      if (!isValidYear(row.Year)) {
        errors.push({
          row: index + 2,
          field: 'Year',
          value: String(row.Year),
          message: `Invalid year: "${row.Year}"`,
        })
        return
      }

      if (!isValidLetterboxdUri(row['Letterboxd URI'])) {
        errors.push({
          row: index + 2,
          field: 'Letterboxd URI',
          value: row['Letterboxd URI'],
          message: `Invalid Letterboxd URI: "${row['Letterboxd URI']}"`,
        })
        return
      }

      const rating = parseRating(row.Rating)
      if (rating === null) {
        errors.push({
          row: index + 2,
          field: 'Rating',
          value: row.Rating,
          message: `Invalid rating: "${row.Rating}" (must be 0.5-5.0)`,
        })
        return
      }

      const year = parseInt(String(row.Year), 10)
      const ratingDate = parseDate(row.Date)

      if (!ratingDate) {
        errors.push({
          row: index + 2,
          field: 'Date',
          value: row.Date,
          message: `Invalid date format: "${row.Date}"`,
        })
        return
      }

      const movie: Movie = {
        id: row['Letterboxd URI'],
        title: row.Name.trim(),
        year,
        rating,
        ratingDate,
        dateMarkedWatched: ratingDate, // Use rating date as fallback
        rewatch: false,
        decade: computeDecade(year),
        era: classifyEra(year),
      }

      movies.push(movie)
    } catch (error) {
      errors.push({
        row: index + 2,
        field: 'unknown',
        value: JSON.stringify(row),
        message: `Error parsing row: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    }
  })

  return {
    success: errors.length === 0,
    data: movies,
    errors,
  }
}

/**
 * Parse films.csv (liked movies) into Movie array
 */
function parseFilmsCSV(rows: WatchedCSVRow[]): ParseResult<Movie[]> {
  // Films.csv has same structure as watched.csv but indicates "liked" movies
  const result = parseWatchedCSV(rows)

  // Mark all as liked
  if (result.data) {
    result.data.forEach((movie) => {
      movie.liked = true
    })
  }

  return result
}

/**
 * Parse watchlist.csv into Movie array
 */
function parseWatchlistCSV(rows: WatchedCSVRow[]): ParseResult<Movie[]> {
  // Watchlist has same structure as watched.csv
  return parseWatchedCSV(rows)
}

/**
 * Main CSV parsing dispatcher
 */
function parseCSV(content: string, fileType: CSVType): ParseResult<Movie[]> {
  if (!content || content.trim().length === 0) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 0,
          field: 'content',
          value: '',
          message: 'CSV file is empty',
        },
      ],
    }
  }

  try {
    const parsed = Papa.parse(content.trim(), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      fastMode: false,
    })

    if (parsed.errors && parsed.errors.length > 0) {
      return {
        success: false,
        data: [],
        errors: parsed.errors.map((err: any) => ({
          row: err.row || 0,
          field: err.field || 'unknown',
          value: '',
          message: err.message || 'CSV parsing error',
        })),
      }
    }

    const rows = parsed.data as Record<string, string>[]

    if (rows.length === 0) {
      return {
        success: true,
        data: [],
        errors: [],
      }
    }

    // Check headers
    const headers = Object.keys(rows[0])
    const headerValidation = validateCSV(headers)

    if (headerValidation.length > 0) {
      return {
        success: false,
        data: [],
        errors: headerValidation.map((err) => ({
          row: 1,
          field: err.field,
          value: '',
          message: err.message,
        })),
      }
    }

    // Parse based on detected type
    switch (fileType) {
      case 'diary':
        return parseDiaryCSV(rows as unknown as DiaryCSVRow[])
      case 'ratings':
        return parseRatingsCSV(rows as unknown as RatingsCSVRow[])
      case 'films':
        return parseFilmsCSV(rows as unknown as WatchedCSVRow[])
      case 'watchlist':
        return parseWatchlistCSV(rows as unknown as WatchedCSVRow[])
      case 'watched':
      default:
        return parseWatchedCSV(rows as unknown as WatchedCSVRow[])
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 0,
          field: 'parser',
          value: '',
          message: `CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
    }
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Main entry point: Parse uploaded CSV file
 */
export async function parseLetterboxdCSV(file: File): Promise<ParseResult<Movie[]>> {
  if (!file) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 0,
          field: 'file',
          value: '',
          message: 'No file provided',
        },
      ],
    }
  }

  try {
    // Read file content using FileReader (works in both browser and test environment)
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })

    // Try to detect type from filename first
    const fileName = file.name.toLowerCase()
    let type: CSVType = 'unknown'

    if (fileName === 'watched.csv') {
      type = 'watched'
    } else if (fileName === 'diary.csv') {
      type = 'diary'
    } else if (fileName === 'ratings.csv') {
      type = 'ratings'
    } else if (fileName === 'films.csv') {
      type = 'films'
    } else if (fileName === 'watchlist.csv') {
      type = 'watchlist'
    } else if (fileName === 'profile.csv') {
      type = 'profile'
    } else {
      // Fall back to header detection
      const headerLine = content.split('\n')[0]
      // Simple split that handles quoted fields better
      const headers = headerLine.split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
      type = detectCSVType(headers)
    }

    if (type === 'unknown') {
      return {
        success: false,
        data: [],
        errors: [
          {
            row: 1,
            field: 'headers',
            value: '',
            message: 'Unknown CSV type - missing required columns',
          },
        ],
      }
    }

    return parseCSV(content, type)
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [
        {
          row: 0,
          field: 'file',
          value: file.name,
          message: `File reading error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
    }
  }
}

/**
 * Parse CSV content string directly
 */
export function parseCSVContent(content: string, fileType: CSVType): ParseResult<Movie[]> {
  return parseCSV(content, fileType)
}

// ============================================================================
// PROFILE CSV PARSING
// ============================================================================

/**
 * Parse profile.csv into UserProfile object
 * Profile CSV contains user metadata and up to 4 favorite film URIs
 */
export function parseProfileCSV(content: string): ParseResult<UserProfile> {
  try {
    const result = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    })

    if (!result.data || result.data.length === 0) {
      return {
        success: false,
        errors: [
          {
            row: 0,
            field: 'data',
            value: '',
            message: 'No data rows found in profile CSV',
          },
        ],
      }
    }

    // Profile CSV should have exactly 1 data row
    const row = result.data[0] as ProfileCSVRow
    const errors: ParseError[] = []

    // Validate Username (required)
    const usernameValidation = validateProfileUsername(row.Username)
    if (!usernameValidation.valid) {
      errors.push({
        row: 1,
        field: 'Username',
        value: row.Username || '',
        message: usernameValidation.error || 'Username is required',
      })
    }

    // Parse and validate favorite films
    let favoriteFilms: FavoriteFilm[] = []
    const favoriteFilmsStr = row['Favorite Films']
    if (favoriteFilmsStr && favoriteFilmsStr.trim()) {
      const filmUris = parseFavoriteFilmsString(favoriteFilmsStr)
      const limitedUris = limitFavoriteFilms(filmUris, 4)

      favoriteFilms = limitedUris
        .filter(uri => isValidLetterboxdFavoriteUri(uri))
        .map(uri => ({
          uri,
          title: undefined,
          rating: undefined,
          watched: undefined,
        }))

      // Warn if any URIs were invalid
      if (limitedUris.length > favoriteFilms.length) {
        console.warn(
          `Profile contains ${limitedUris.length} favorite films, but ${limitedUris.length - favoriteFilms.length} have invalid format`
        )
      }
    }

    // Create UserProfile object
    const userProfile: UserProfile = {
      username: row.Username?.trim() || '',
      firstName: row['Given Name']?.trim(),
      lastName: row['Family Name']?.trim(),
      email: row['Email Address']?.trim(),
      location: row.Location?.trim(),
      website: row.Website?.trim(),
      bio: row.Bio?.trim(),
      pronoun: row.Pronoun?.trim(),
      joinDate: parseDate(row['Date Joined']) || undefined,
      favoriteFilms,
    }

    return {
      success: errors.length === 0,
      data: userProfile,
      errors,
    }
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          row: 0,
          field: 'parse',
          value: '',
          message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
    }
  }
}

/**
 * Parse profile.csv file (async version)
 * Reads File object and delegates to parseProfileCSV
 */
export async function parseProfileCSVFile(
  file: File
): Promise<ParseResult<UserProfile>> {
  if (!file) {
    return {
      success: false,
      errors: [
        {
          row: 0,
          field: 'file',
          value: '',
          message: 'No file provided',
        },
      ],
    }
  }

  try {
    // Read file content using FileReader
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })

    return parseProfileCSV(content)
  } catch (err) {
    return {
      success: false,
      errors: [
        {
          row: 0,
          field: 'file',
          value: '',
          message: `Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`,
        },
      ],
    }
  }
}

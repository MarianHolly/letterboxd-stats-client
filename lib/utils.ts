import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse, isValid } from "date-fns"
import type { DecadeString, Era } from "./types"

// ============================================================================
// CLASSNAME UTILITIES
// ============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// DATE PARSING & FORMATTING
// ============================================================================

/**
 * Parse ISO date string (YYYY-MM-DD) to Date object
 * Returns null if parsing fails or date is invalid
 */
export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString || dateString.trim() === "") {
    return null
  }

  try {
    // Expect ISO format: YYYY-MM-DD
    const parsed = parse(dateString.trim(), "yyyy-MM-dd", new Date())

    if (!isValid(parsed)) {
      console.warn(`Invalid date format: "${dateString}"`)
      return null
    }

    return parsed
  } catch (error) {
    console.warn(`Error parsing date "${dateString}":`, error)
    return null
  }
}

/**
 * Format Date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

/**
 * Format Date to readable string (e.g., "Jan 20, 2022")
 */
export function formatDateReadable(date: Date): string {
  return format(date, "MMM dd, yyyy")
}

/**
 * Get year from Date
 */
export function getYear(date: Date): number {
  return date.getFullYear()
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const time1 = date1.getTime()
  const time2 = date2.getTime()
  return Math.floor(Math.abs(time2 - time1) / (1000 * 60 * 60 * 24))
}

// ============================================================================
// DECADE & ERA CLASSIFICATION
// ============================================================================

/**
 * Compute decade from year (e.g., 2010 from year 2019)
 */
export function computeDecade(year: number): number {
  if (year < 0 || year > 9999) {
    throw new Error(`Invalid year: ${year}`)
  }
  return Math.floor(year / 10) * 10
}

/**
 * Format decade as string (e.g., "2010s" from 2010)
 */
export function formatDecade(decade: number): DecadeString {
  return `${decade}s` as DecadeString
}

/**
 * Classify year into era
 */
export function classifyEra(year: number): Era {
  if (year < 1960) {
    return "classic"
  } else if (year < 1980) {
    return "golden"
  } else if (year < 2000) {
    return "modern"
  } else {
    return "contemporary"
  }
}

// ============================================================================
// STRING PARSING & VALIDATION
// ============================================================================

/**
 * Parse rating string to number (0.5-5.0)
 * Returns null if invalid or empty
 */
export function parseRating(ratingString: string | null | undefined): number | null {
  if (!ratingString || ratingString.trim() === "") {
    return null
  }

  try {
    const rating = parseFloat(ratingString.trim())

    if (isNaN(rating) || rating < 0.5 || rating > 5.0) {
      console.warn(`Invalid rating value: "${ratingString}"`)
      return null
    }

    // Round to nearest 0.5
    return Math.round(rating * 2) / 2
  } catch (error) {
    console.warn(`Error parsing rating "${ratingString}":`, error)
    return null
  }
}

/**
 * Parse comma-separated tags string into array
 * Returns empty array if empty or null
 */
export function parseTags(tagsString: string | null | undefined): string[] {
  if (!tagsString || tagsString.trim() === "") {
    return []
  }

  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

/**
 * Parse rewatch indicator ("Yes" or empty string)
 */
export function parseRewatch(rewatchString: string | null | undefined): boolean {
  if (!rewatchString) {
    return false
  }

  return rewatchString.trim().toLowerCase() === "yes"
}

/**
 * Validate Letterboxd URI format
 */
export function isValidLetterboxdUri(uri: string): boolean {
  if (!uri || typeof uri !== "string") {
    return false
  }

  return /^https:\/\/boxd\.it\/[a-zA-Z0-9]+$/.test(uri.trim())
}

/**
 * Validate movie title (non-empty string)
 */
export function isValidTitle(title: string | null | undefined): boolean {
  return Boolean(title && typeof title === "string" && title.trim().length > 0)
}

/**
 * Validate year (integer between 1890 and 2100)
 */
export function isValidYear(year: unknown): boolean {
  if (typeof year === "string") {
    const parsed = parseInt(year, 10)
    if (isNaN(parsed)) {
      return false
    }
    return parsed >= 1890 && parsed <= 2100
  }

  if (typeof year === "number") {
    return Number.isInteger(year) && year >= 1890 && year <= 2100
  }

  return false
}

// ============================================================================
// ARRAY & OBJECT UTILITIES
// ============================================================================

/**
 * Group array items by key function
 */
export function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>()

  items.forEach((item) => {
    const key = keyFn(item)
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(item)
  })

  return groups
}

/**
 * Count occurrences of items by key function
 */
export function countBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {}

  items.forEach((item) => {
    const key = keyFn(item)
    counts[key] = (counts[key] || 0) + 1
  })

  return counts
}

/**
 * Sum numeric values
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0)
}

/**
 * Calculate average
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return sum(numbers) / numbers.length
}

/**
 * Calculate median
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0

  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }

  return sorted[mid]
}

/**
 * Find minimum value
 */
export function min(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return Math.min(...numbers)
}

/**
 * Find maximum value
 */
export function max(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return Math.max(...numbers)
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format number as percentage (0-100)
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format rating with one decimal place
 */
export function formatRating(rating: number | undefined | null): string {
  if (rating === null || rating === undefined) {
    return "N/A"
  }

  return rating.toFixed(1)
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

// ============================================================================
// PROFILE UTILITIES
// ============================================================================

/**
 * Validate Letterboxd favorite film URI format
 * Format: https://boxd.it/XXXXX (where X is alphanumeric)
 */
export function isValidLetterboxdFavoriteUri(uri: string): boolean {
  if (!uri || typeof uri !== "string") {
    return false
  }

  return /^https:\/\/boxd\.it\/[a-zA-Z0-9]+$/.test(uri.trim())
}

/**
 * Parse comma-separated favorite film URIs
 * Trims whitespace, filters empty strings
 */
export function parseFavoriteFilmsString(csvStr: string | null | undefined): string[] {
  if (!csvStr || csvStr.trim() === "") {
    return []
  }

  return csvStr
    .split(",")
    .map((uri) => uri.trim())
    .filter((uri) => uri.length > 0)
}

/**
 * Limit favorite films to maximum (default 4)
 * Logs warning if truncated
 */
export function limitFavoriteFilms(films: string[], max: number = 4): string[] {
  if (films.length > max) {
    console.warn(
      `Profile has ${films.length} favorite films, limiting to first ${max}`
    )
    return films.slice(0, max)
  }
  return films
}

/**
 * Format full name from first and last name
 * Falls back to username if name not available
 */
export function formatProfileFullName(
  firstName: string | undefined,
  lastName: string | undefined,
  username: string
): string {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }

  if (firstName || lastName) {
    return (firstName || lastName || username).trim()
  }

  return username
}

/**
 * Validate profile username (required, non-empty)
 */
export function validateProfileUsername(username: string | null | undefined): {
  valid: boolean
  error?: string
} {
  if (!username || typeof username !== "string") {
    return { valid: false, error: "Username is required" }
  }

  if (username.trim().length === 0) {
    return { valid: false, error: "Username cannot be empty" }
  }

  if (username.trim().length > 255) {
    return { valid: false, error: "Username is too long (max 255 characters)" }
  }

  return { valid: true }
}

/**
 * Unit tests for CSV Parser
 * Tests all CSV file types, validation, and error handling
 */

import { detectCSVType, validateCSV, parseCSVContent, parseLetterboxdCSV } from '@/lib/csv-parser'
import type { ParseResult, Movie } from '@/lib/types'
import {
  MOCK_WATCHED_CSV,
  MOCK_DIARY_CSV,
  MOCK_RATINGS_CSV,
  MOCK_FILMS_CSV,
  MOCK_WATCHLIST_CSV,
  MOCK_WATCHED_CSV_INVALID_COLUMNS,
  MOCK_WATCHED_CSV_EMPTY,
  MOCK_WATCHED_CSV_MINIMAL,
  countCSVRows,
} from '../fixtures/mock-csvs'

describe('CSV Parser', () => {
  // ============================================================================
  // CSV TYPE DETECTION
  // ============================================================================

  describe('detectCSVType', () => {
    it('should detect watched.csv type', () => {
      const headers = ['Date', 'Name', 'Year', 'Letterboxd URI']
      expect(detectCSVType(headers)).toBe('watched')
    })

    it('should detect diary.csv type with all columns', () => {
      const headers = ['Date', 'Name', 'Year', 'Letterboxd URI', 'Rating', 'Rewatch', 'Tags', 'Watched Date']
      expect(detectCSVType(headers)).toBe('diary')
    })

    it('should detect ratings.csv type', () => {
      const headers = ['Date', 'Name', 'Year', 'Letterboxd URI', 'Rating']
      expect(detectCSVType(headers)).toBe('ratings')
    })

    it('should detect films.csv type', () => {
      const headers = ['Date', 'Name', 'Year', 'Letterboxd URI']
      expect(detectCSVType(headers)).toBe('watched') // Same structure as watched
    })

    it('should return unknown for invalid headers', () => {
      const headers = ['Name', 'Year'] // Missing required columns
      expect(detectCSVType(headers)).toBe('unknown')
    })

    it('should return unknown for empty headers', () => {
      expect(detectCSVType([])).toBe('unknown')
    })

    it('should handle trimmed headers', () => {
      const headers = ['  Date  ', '  Name  ', 'Year', 'Letterboxd URI']
      expect(detectCSVType(headers)).toBe('watched')
    })
  })

  // ============================================================================
  // CSV VALIDATION
  // ============================================================================

  describe('validateCSV', () => {
    it('should validate correct watched.csv headers', () => {
      const headers = ['Date', 'Name', 'Year', 'Letterboxd URI']
      const errors = validateCSV(headers)
      expect(errors).toHaveLength(0)
    })

    it('should report missing columns', () => {
      const headers = ['Date', 'Name', 'Year'] // Missing Letterboxd URI
      const errors = validateCSV(headers)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors[0].field).toBe('Letterboxd URI')
    })

    it('should report error for empty headers', () => {
      const errors = validateCSV([])
      expect(errors.length).toBeGreaterThan(0)
    })

    it('should validate diary.csv headers', () => {
      const headers = ['Date', 'Name', 'Year', 'Letterboxd URI', 'Rating', 'Rewatch', 'Tags', 'Watched Date']
      const errors = validateCSV(headers)
      expect(errors).toHaveLength(0)
    })
  })

  // ============================================================================
  // WATCHED.CSV PARSING
  // ============================================================================

  describe('parseCSVContent - watched.csv', () => {
    it('should parse valid watched.csv file', () => {
      const result = parseCSVContent(MOCK_WATCHED_CSV, 'watched')

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.length).toBeGreaterThan(0)
      expect(result.errors).toHaveLength(0)
    })

    it('should extract correct movie fields', () => {
      const result = parseCSVContent(MOCK_WATCHED_CSV, 'watched')
      const movie = result.data![0]

      expect(movie.id).toBe('https://boxd.it/1skk')
      expect(movie.title).toBe('Inception')
      expect(movie.year).toBe(2010)
      expect(movie.dateMarkedWatched).toBeInstanceOf(Date)
      expect(movie.rewatch).toBe(false)
      expect(movie.decade).toBe(2010)
      expect(movie.era).toBe('contemporary')
    })

    it('should handle multiple movies correctly', () => {
      const result = parseCSVContent(MOCK_WATCHED_CSV, 'watched')
      const expectedRows = countCSVRows(MOCK_WATCHED_CSV)

      expect(result.data).toHaveLength(expectedRows)
    })

    it('should classify eras correctly', () => {
      const result = parseCSVContent(MOCK_WATCHED_CSV, 'watched')
      const movies = result.data!

      // Check specific era classifications
      const classic = movies.find((m) => m.year < 1960)
      const golden = movies.find((m) => m.year >= 1960 && m.year < 1980)
      const modern = movies.find((m) => m.year >= 1980 && m.year < 2000)
      const contemporary = movies.find((m) => m.year >= 2000)

      if (classic) expect(classic.era).toBe('classic')
      if (golden) expect(golden.era).toBe('golden')
      if (modern) expect(modern.era).toBe('modern')
      if (contemporary) expect(contemporary.era).toBe('contemporary')
    })

    it('should handle empty CSV', () => {
      const result = parseCSVContent(MOCK_WATCHED_CSV_EMPTY, 'watched')

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(0)
    })

    it('should handle minimal CSV', () => {
      const result = parseCSVContent(MOCK_WATCHED_CSV_MINIMAL, 'watched')

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
    })
  })

  // ============================================================================
  // DIARY.CSV PARSING
  // ============================================================================

  describe('parseCSVContent - diary.csv', () => {
    it('should parse valid diary.csv file', () => {
      const result = parseCSVContent(MOCK_DIARY_CSV, 'diary')

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.length).toBeGreaterThan(0)
    })

    it('should extract rating from diary', () => {
      const result = parseCSVContent(MOCK_DIARY_CSV, 'diary')
      const ratedMovie = result.data!.find((m) => m.rating !== undefined)

      expect(ratedMovie).toBeDefined()
      expect(ratedMovie!.rating).toBeGreaterThanOrEqual(0.5)
      expect(ratedMovie!.rating).toBeLessThanOrEqual(5)
    })

    it('should extract rewatch information', () => {
      const result = parseCSVContent(MOCK_DIARY_CSV, 'diary')
      const rewatched = result.data!.find((m) => m.rewatch === true)

      expect(rewatched).toBeDefined()
      expect(rewatched!.rewatch).toBe(true)
    })

    it('should extract tags from diary', () => {
      const result = parseCSVContent(MOCK_DIARY_CSV, 'diary')
      const tagged = result.data!.find((m) => m.tags && m.tags.length > 0)

      expect(tagged).toBeDefined()
      expect(Array.isArray(tagged!.tags)).toBe(true)
    })

    it('should handle empty rating', () => {
      const result = parseCSVContent(MOCK_DIARY_CSV, 'diary')
      const unrated = result.data!.find((m) => m.rating === undefined || m.rating === null)

      expect(unrated).toBeDefined()
    })

    it('should use watchedDate from Watched Date column', () => {
      const result = parseCSVContent(MOCK_DIARY_CSV, 'diary')
      const movie = result.data![0]

      expect(movie.watchedDate).toBeInstanceOf(Date)
      // Should be 2021-01-02 from Watched Date column
      expect(movie.watchedDate!.getFullYear()).toBe(2021)
    })
  })

  // ============================================================================
  // RATINGS.CSV PARSING
  // ============================================================================

  describe('parseCSVContent - ratings.csv', () => {
    it('should parse valid ratings.csv file', () => {
      const result = parseCSVContent(MOCK_RATINGS_CSV, 'ratings')

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.length).toBeGreaterThan(0)
    })

    it('should extract rating from every movie', () => {
      const result = parseCSVContent(MOCK_RATINGS_CSV, 'ratings')

      result.data!.forEach((movie) => {
        expect(movie.rating).toBeDefined()
        expect(movie.rating).toBeGreaterThanOrEqual(0.5)
        expect(movie.rating).toBeLessThanOrEqual(5)
      })
    })

    it('should handle half-star ratings', () => {
      const result = parseCSVContent(MOCK_RATINGS_CSV, 'ratings')
      const halfStar = result.data!.find((m) => m.rating === 3.5 || m.rating === 4.5)

      expect(halfStar).toBeDefined()
    })

    it('should set ratingDate', () => {
      const result = parseCSVContent(MOCK_RATINGS_CSV, 'ratings')
      const movie = result.data![0]

      expect(movie.ratingDate).toBeInstanceOf(Date)
    })
  })

  // ============================================================================
  // FILMS.CSV PARSING
  // ============================================================================

  describe('parseCSVContent - films.csv', () => {
    it('should parse valid films.csv file', () => {
      const result = parseCSVContent(MOCK_FILMS_CSV, 'films')

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should mark all movies as liked', () => {
      const result = parseCSVContent(MOCK_FILMS_CSV, 'films')

      result.data!.forEach((movie) => {
        expect(movie.liked).toBe(true)
      })
    })
  })

  // ============================================================================
  // WATCHLIST.CSV PARSING
  // ============================================================================

  describe('parseCSVContent - watchlist.csv', () => {
    it('should parse valid watchlist.csv file', () => {
      const result = parseCSVContent(MOCK_WATCHLIST_CSV, 'watchlist')

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it('should parse unwatched movies', () => {
      const result = parseCSVContent(MOCK_WATCHLIST_CSV, 'watchlist')

      // Watchlist movies are parsed same as watched
      expect(result.data!.length).toBeGreaterThan(0)
      result.data!.forEach((movie) => {
        expect(movie.title).toBeTruthy()
        expect(movie.year).toBeGreaterThan(0)
      })
    })
  })

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  describe('Error handling', () => {
    it('should handle invalid CSV with missing required columns', () => {
      const result = parseCSVContent(MOCK_WATCHED_CSV_INVALID_COLUMNS, 'watched')

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should handle empty string', () => {
      const result = parseCSVContent('', 'watched')

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should return movie array even with some errors', () => {
      const csvWithMixedData = `Date,Name,Year,Letterboxd URI
2022-01-20,Valid Movie,2020,https://boxd.it/good1
2022-01-20,,2020,https://boxd.it/bad1
2022-01-20,Another Valid,2021,https://boxd.it/good2`

      const result = parseCSVContent(csvWithMixedData, 'watched')

      // Should have parsed the valid ones
      expect(result.data!.length).toBeGreaterThan(0)
      // Should have errors for invalid ones
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  // ============================================================================
  // FILE INPUT (ASYNC)
  // ============================================================================

  describe('parseLetterboxdCSV (async)', () => {
    it('should parse File object', async () => {
      const csvContent = MOCK_WATCHED_CSV
      const file = new File([csvContent], 'watched.csv', { type: 'text/csv' })
      const result = await parseLetterboxdCSV(file)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data!.length).toBeGreaterThan(0)
    })

    it('should handle missing file', async () => {
      const result = await parseLetterboxdCSV(null as any)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should auto-detect CSV type from file', async () => {
      const file = new File([MOCK_DIARY_CSV], 'diary.csv', { type: 'text/csv' })
      const result = await parseLetterboxdCSV(file)

      expect(result.success).toBe(true)
      // Diary data should have ratings and rewatches
      const hasRatings = result.data!.some((m) => m.rating !== undefined)
      expect(hasRatings).toBe(true)
    })
  })

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge cases', () => {
    it('should handle whitespace in fields', () => {
      const csvWithWhitespace = `Date,Name,Year,Letterboxd URI
2022-01-20,  Movie With Spaces  ,2020,https://boxd.it/test1`

      const result = parseCSVContent(csvWithWhitespace, 'watched')

      expect(result.success).toBe(true)
      expect(result.data![0].title).toBe('Movie With Spaces')
    })

    it('should handle special characters in movie titles', () => {
      const csvWithSpecialChars = `Date,Name,Year,Letterboxd URI
2022-01-20,"The Good, the Bad and the Ugly",1966,https://boxd.it/test2`

      const result = parseCSVContent(csvWithSpecialChars, 'watched')

      expect(result.success).toBe(true)
      expect(result.data![0].title).toContain('Good')
    })

    it('should handle movies with same title but different years', () => {
      const csvWithDuplicateTitles = `Date,Name,Year,Letterboxd URI
2022-01-20,King Kong,2005,https://boxd.it/test3
2022-01-21,King Kong,1933,https://boxd.it/test4`

      const result = parseCSVContent(csvWithDuplicateTitles, 'watched')

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data![0].year).toBe(2005)
      expect(result.data![1].year).toBe(1933)
    })

    it('should handle very old movies', () => {
      const csvWithOldMovie = `Date,Name,Year,Letterboxd URI
2022-01-20,A Very Old Movie,1920,https://boxd.it/test5`

      const result = parseCSVContent(csvWithOldMovie, 'watched')

      expect(result.success).toBe(true)
      expect(result.data![0].year).toBe(1920)
      expect(result.data![0].era).toBe('classic')
    })

    it('should handle recent movies', () => {
      const csvWithRecentMovie = `Date,Name,Year,Letterboxd URI
2022-01-20,Very New Movie,2024,https://boxd.it/test6`

      const result = parseCSVContent(csvWithRecentMovie, 'watched')

      expect(result.success).toBe(true)
      expect(result.data![0].year).toBe(2024)
      expect(result.data![0].era).toBe('contemporary')
    })
  })

  // ============================================================================
  // PERFORMANCE
  // ============================================================================

  describe('Performance', () => {
    it('should parse 100+ movies efficiently', () => {
      const rows = Array.from({ length: 100 }, (_, i) => ({
        Date: '2022-01-20',
        Name: `Movie ${i}`,
        Year: String(2000 + (i % 20)),
        'Letterboxd URI': `https://boxd.it/${String(i).padStart(6, '0')}`,
      }))

      const csv = `Date,Name,Year,Letterboxd URI\n${rows.map((r) => `${r.Date},${r.Name},${r.Year},${r['Letterboxd URI']}`).join('\n')}`

      const start = Date.now()
      const result = parseCSVContent(csv, 'watched')
      const duration = Date.now() - start

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(100)
      expect(duration).toBeLessThan(500) // Should parse 100 movies in <500ms
    })
  })
})

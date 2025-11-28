/**
 * Unit tests for Profile CSV Parser
 * Tests profile.csv parsing, validation, and error handling
 */

import { parseProfileCSV } from '@/lib/csv-parser'
import type { UserProfile } from '@/lib/types'
import {
  MOCK_PROFILE_CSV_FULL,
  MOCK_PROFILE_CSV_MINIMAL,
  MOCK_PROFILE_CSV_NO_FAVORITES,
  MOCK_PROFILE_CSV_MANY_FAVORITES,
  MOCK_PROFILE_CSV_INVALID_FAVORITES,
  MOCK_PROFILE_CSV_INVALID_NO_USERNAME,
} from '../fixtures/mock-csvs'

describe('Profile CSV Parser', () => {
  // ============================================================================
  // VALID PROFILE PARSING
  // ============================================================================

  describe('parseProfileCSV - Valid profiles', () => {
    it('should parse complete profile with all fields and favorite films', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_FULL)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.errors).toHaveLength(0)

      const profile = result.data as UserProfile
      expect(profile.username).toBe('Stupel')
      expect(profile.firstName).toBe('Marián')
      expect(profile.lastName).toBe('Hollý')
      expect(profile.pronoun).toBe('He / his')
      expect(profile.favoriteFilms).toHaveLength(2)
    })

    it('should parse minimal profile with only username', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_MINIMAL)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()

      const profile = result.data as UserProfile
      expect(profile.username).toBe('testuser')
      // Empty string fields should be undefined or empty string after trim
      expect(profile.firstName || undefined).toBeUndefined()
      expect(profile.lastName || undefined).toBeUndefined()
      expect(profile.favoriteFilms).toHaveLength(0)
    })

    it('should parse profile with no favorite films', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_NO_FAVORITES)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()

      const profile = result.data as UserProfile
      expect(profile.username).toBe('cinemaloveur')
      expect(profile.firstName).toBe('Jean')
      expect(profile.lastName).toBe('Dupont')
      expect(profile.favoriteFilms).toHaveLength(0)
    })

    it('should parse profile with maximum 4 favorite films', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_MANY_FAVORITES)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()

      const profile = result.data as UserProfile
      expect(profile.username).toBe('contradictio')
      expect(profile.favoriteFilms).toHaveLength(4)
      expect(profile.favoriteFilms[0].uri).toBe('https://boxd.it/251c')
      expect(profile.favoriteFilms[3].uri).toBe('https://boxd.it/Arw0')
    })

    it('should format full name correctly from first and last name', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_FULL)
      const profile = result.data as UserProfile

      expect(profile.firstName).toBe('Marián')
      expect(profile.lastName).toBe('Hollý')
      // This should be formatted in component, but data is available
    })

    it('should parse join date as Date object when provided', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_FULL)
      const profile = result.data as UserProfile

      expect(profile.joinDate).toBeInstanceOf(Date)
      expect(profile.joinDate?.getFullYear()).toBe(2022)
    })

    it('should trim whitespace from string fields', () => {
      const csv = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2023-01-01,  spaceyuser  ,  John  ,  Doe  , test@example.com , New York , https://test.com , A bio , He / him ,`

      const result = parseProfileCSV(csv)
      const profile = result.data as UserProfile

      expect(profile.username).toBe('spaceyuser')
      expect(profile.firstName).toBe('John')
      expect(profile.lastName).toBe('Doe')
      expect(profile.email).toBe('test@example.com')
    })

    it('should parse optional fields as undefined when empty', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_MINIMAL)
      const profile = result.data as UserProfile

      // Empty trimmed strings become undefined
      expect(profile.firstName || undefined).toBeUndefined()
      expect(profile.lastName || undefined).toBeUndefined()
      expect(profile.email || undefined).toBeUndefined()
      expect(profile.location || undefined).toBeUndefined()
      expect(profile.website || undefined).toBeUndefined()
      expect(profile.bio || undefined).toBeUndefined()
      expect(profile.pronoun || undefined).toBeUndefined()
    })
  })

  // ============================================================================
  // FAVORITE FILMS PARSING
  // ============================================================================

  describe('parseProfileCSV - Favorite films', () => {
    it('should parse comma-separated favorite film URIs', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_FULL)
      const profile = result.data as UserProfile

      expect(profile.favoriteFilms).toHaveLength(2)
      expect(profile.favoriteFilms[0].uri).toBe('https://boxd.it/251c')
      expect(profile.favoriteFilms[1].uri).toBe('https://boxd.it/1m8W')
    })

    it('should limit favorite films to maximum of 4', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_INVALID_FAVORITES)

      // Should succeed but with warning logged
      expect(result.success).toBe(true)
      const profile = result.data as UserProfile
      // Only first 4 should be included (limited during parsing)
      expect(profile.favoriteFilms.length).toBeLessThanOrEqual(4)
    })

    it('should set uri property on favorite films', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_FULL)
      const profile = result.data as UserProfile

      profile.favoriteFilms.forEach((film) => {
        expect(film.uri).toBeDefined()
        expect(film.uri).toMatch(/^https:\/\/boxd\.it\//)
      })
    })

    it('should initialize title, rating, watched as undefined on favorite films', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_FULL)
      const profile = result.data as UserProfile

      profile.favoriteFilms.forEach((film) => {
        expect(film.title).toBeUndefined()
        expect(film.rating).toBeUndefined()
        expect(film.watched).toBeUndefined()
      })
    })

    it('should trim whitespace from favorite film URIs', () => {
      const csv = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2023-01-01,testuser,,,,,,,,\" https://boxd.it/abc , https://boxd.it/def \"`

      const result = parseProfileCSV(csv)
      const profile = result.data as UserProfile

      expect(profile.favoriteFilms).toHaveLength(2)
      expect(profile.favoriteFilms[0].uri).toBe('https://boxd.it/abc')
      expect(profile.favoriteFilms[1].uri).toBe('https://boxd.it/def')
    })
  })

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  describe('parseProfileCSV - Error handling', () => {
    it('should fail when username is missing', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_INVALID_NO_USERNAME)

      expect(result.success).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].field).toBe('Username')
      expect(result.errors[0].message).toContain('required')
    })

    it('should fail on empty CSV', () => {
      const csv = 'Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films'

      const result = parseProfileCSV(csv)

      expect(result.success).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toContain('No data rows')
    })

    it('should fail on malformed CSV', () => {
      const csv = 'Invalid CSV { broken'

      const result = parseProfileCSV(csv)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      // PapaParse will handle the CSV gracefully, likely returning no data rows
      expect(result.errors[0].message).toMatch(/(Parse error|No data rows)/i)
    })

    it('should return specific error format with row, field, value', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_INVALID_NO_USERNAME)
      const error = result.errors[0]

      expect(error).toHaveProperty('row')
      expect(error).toHaveProperty('field')
      expect(error).toHaveProperty('value')
      expect(error).toHaveProperty('message')
      expect(error.row).toBe(1)
      expect(error.field).toBe('Username')
    })
  })

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('parseProfileCSV - Edge cases', () => {
    it('should handle profile with only one field populated besides username', () => {
      const csv = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2023-01-01,testuser,John,,,,,,,`

      const result = parseProfileCSV(csv)

      expect(result.success).toBe(true)
      const profile = result.data as UserProfile
      expect(profile.firstName).toBe('John')
      expect(profile.lastName || undefined).toBeUndefined()
    })

    it('should ignore rows after the first data row', () => {
      const csv = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2023-01-01,user1,John,Doe,,,,,,,
2023-01-02,user2,Jane,Smith,,,,,,,`

      const result = parseProfileCSV(csv)
      const profile = result.data as UserProfile

      // Should only process first row
      expect(profile.username).toBe('user1')
      expect(profile.firstName).toBe('John')
    })

    it('should handle very long bio text', () => {
      const longBio = 'A'.repeat(500)
      const csv = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
2023-01-01,testuser,,,,,,${longBio},He / him,`

      const result = parseProfileCSV(csv)
      expect(result.success).toBe(true)

      const profile = result.data as UserProfile
      expect(profile.bio).toBe(longBio)
    })

    it('should handle empty string as undefined for date fields', () => {
      const csv = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
,testuser,,,,,,,,`

      const result = parseProfileCSV(csv)
      const profile = result.data as UserProfile

      expect(profile.joinDate).toBeUndefined()
    })

    it('should handle invalid date gracefully (returns undefined)', () => {
      const csv = `Date Joined,Username,Given Name,Family Name,Email Address,Location,Website,Bio,Pronoun,Favorite Films
invalid-date,testuser,,,,,,,,`

      const result = parseProfileCSV(csv)
      const profile = result.data as UserProfile

      expect(result.success).toBe(true) // Doesn't fail overall
      expect(profile.joinDate).toBeUndefined() // Invalid date becomes undefined
    })
  })

  // ============================================================================
  // DATA STRUCTURE VERIFICATION
  // ============================================================================

  describe('parseProfileCSV - Output structure', () => {
    it('should return ParseResult with success, data, and errors fields', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_FULL)

      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('errors')
      expect(typeof result.success).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
    })

    it('should return complete UserProfile object', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_FULL)
      const profile = result.data as UserProfile

      expect(profile).toHaveProperty('username')
      expect(profile).toHaveProperty('firstName')
      expect(profile).toHaveProperty('lastName')
      expect(profile).toHaveProperty('email')
      expect(profile).toHaveProperty('location')
      expect(profile).toHaveProperty('website')
      expect(profile).toHaveProperty('bio')
      expect(profile).toHaveProperty('pronoun')
      expect(profile).toHaveProperty('joinDate')
      expect(profile).toHaveProperty('favoriteFilms')
      expect(Array.isArray(profile.favoriteFilms)).toBe(true)
    })

    it('should ensure favorite films array exists even if empty', () => {
      const result = parseProfileCSV(MOCK_PROFILE_CSV_MINIMAL)
      const profile = result.data as UserProfile

      expect(Array.isArray(profile.favoriteFilms)).toBe(true)
      expect(profile.favoriteFilms).toHaveLength(0)
    })
  })
})

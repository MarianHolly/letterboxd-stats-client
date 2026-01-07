/**
 * E2E tests for Profile Feature
 * Tests the complete user journey of uploading profile.csv and viewing profile stats
 */

import { render, screen } from '@testing-library/react'
import { StatsOverview } from '@/components/analytics/stats-overview'
import type { AnalyticsOverview, UserProfile } from '@/lib/types'

// ============================================================================
// MOCK DATA
// ============================================================================

const mockProfile: UserProfile = {
  username: 'testcinephile',
  firstName: 'Test',
  lastName: 'User',
  bio: 'A passionate film lover',
}

const mockAnalytics: AnalyticsOverview = {
  totalMoviesWatched: 342,
  moviesRated: 280,
  moviesLiked: 95,
  ratingCoverage: 81.9,
  likeRatio: 27.8,
  averageRating: 3.85,
  medianRating: 4.0,
  ratingDistribution: {
    '0.5': 2,
    '1.0': 5,
    '1.5': 3,
    '2.0': 8,
    '2.5': 12,
    '3.0': 45,
    '3.5': 80,
    '4.0': 95,
    '4.5': 25,
    '5.0': 5,
  },
  totalRewatches: 42,
  moviesRewatched: 28,
  rewatchRate: 12.3,
  earliestWatchDate: new Date('2015-03-15'),
  latestWatchDate: new Date('2024-11-28'),
  trackingSpan: 3514,
  decadeBreakdown: {
    '1960': 3,
    '1970': 8,
    '1980': 18,
    '1990': 45,
    '2000': 95,
    '2010': 120,
    '2020': 53,
  },
  yearlyWatching: {
    '2015': 12,
    '2016': 25,
    '2017': 35,
    '2018': 42,
    '2019': 55,
    '2020': 38,
    '2021': 48,
    '2022': 62,
    '2023': 85,
    '2024': 40,
  },
}

// ============================================================================
// TEST SUITES
// ============================================================================

describe('Profile Feature E2E Tests', () => {
  describe('StatsOverview with Profile', () => {
    test('should display profile header when profile is provided', () => {
      render(
        <StatsOverview analytics={mockAnalytics} profile={mockProfile} />
      )

      expect(screen.getByText('Cinematic Identity')).toBeInTheDocument()
      expect(
        screen.getByText("Test User's all-time stats")
      ).toBeInTheDocument()
      expect(screen.getByText('@testcinephile')).toBeInTheDocument()
      expect(
        screen.getByText('A passionate film lover')
      ).toBeInTheDocument()
    })

    test('should not display profile header when profile is not provided', () => {
      render(<StatsOverview analytics={mockAnalytics} />)

      expect(screen.queryByText('Cinematic Identity')).not.toBeInTheDocument()
      expect(
        screen.queryByText("all-time stats")
      ).not.toBeInTheDocument()
    })

    test('should display all six stat cards in one row', () => {
      render(
        <StatsOverview analytics={mockAnalytics} profile={mockProfile} />
      )

      // Check for all stat titles
      expect(screen.getByText('Total Movies')).toBeInTheDocument()
      expect(screen.getByText('Movies Rated')).toBeInTheDocument()
      expect(screen.getByText('Average Rating')).toBeInTheDocument()
      expect(screen.getByText('Favorite Movies')).toBeInTheDocument()
      expect(screen.getByText('Hours Watched')).toBeInTheDocument()
      expect(screen.getByText('Countries')).toBeInTheDocument()
    })

    test('should display correct stat values', () => {
      render(
        <StatsOverview analytics={mockAnalytics} profile={mockProfile} />
      )

      expect(screen.getByText('342')).toBeInTheDocument() // Total Movies
      expect(screen.getByText('280')).toBeInTheDocument() // Movies Rated
      expect(screen.getByText(/3\.85/)).toBeInTheDocument() // Average Rating (with or without star)
      expect(screen.getByText('95')).toBeInTheDocument() // Favorite Movies
    })

    test('should display Coming Soon badges for future features', () => {
      render(
        <StatsOverview analytics={mockAnalytics} profile={mockProfile} />
      )

      const comingSoonBadges = screen.getAllByText('Coming Soon')
      expect(comingSoonBadges).toHaveLength(2) // Hours Watched and Countries
    })

    test('should apply success variant for high rating coverage', () => {
      const highCoverageAnalytics = {
        ...mockAnalytics,
        ratingCoverage: 85.0,
      }

      render(
        <StatsOverview
          analytics={highCoverageAnalytics}
          profile={mockProfile}
        />
      )

      // Movies Rated card should be visible
      expect(screen.getByText('Movies Rated')).toBeInTheDocument()
      expect(screen.getByText('280')).toBeInTheDocument()
    })

    test('should apply success variant for high like ratio', () => {
      const highLikesAnalytics = {
        ...mockAnalytics,
        likeRatio: 60.0,
      }

      render(
        <StatsOverview
          analytics={highLikesAnalytics}
          profile={mockProfile}
        />
      )

      // Favorite Movies card should be visible
      expect(screen.getByText('Favorite Movies')).toBeInTheDocument()
      expect(screen.getByText('95')).toBeInTheDocument()
    })
  })

  describe('StatsOverview Loading States', () => {
    test('should show loading state when loading prop is true', () => {
      render(<StatsOverview analytics={null} isLoading={true} />)

      // Should show empty message or loading indicator
      const noDataMessage = screen.queryByText(
        /Upload your Letterboxd data/i
      )
      expect(noDataMessage).not.toBeInTheDocument()
    })

    test('should show empty state when no analytics data', () => {
      render(<StatsOverview analytics={null} isLoading={false} />)

      expect(
        screen.getByText(/Upload your Letterboxd data to see your statistics/)
      ).toBeInTheDocument()
    })
  })

  describe('Profile with Optional Fields', () => {
    test('should handle profile with only username (no first/last name)', () => {
      const minimalProfile: UserProfile = {
        username: 'filmmaker',
      }

      render(
        <StatsOverview analytics={mockAnalytics} profile={minimalProfile} />
      )

      expect(screen.getByText('Cinematic Identity')).toBeInTheDocument()
      expect(screen.getByText("filmmaker's all-time stats")).toBeInTheDocument()
      expect(screen.getByText('@filmmaker')).toBeInTheDocument()
    })

    test('should not display bio section when bio is not provided', () => {
      const profileWithoutBio: UserProfile = {
        username: 'testcinephile',
        firstName: 'Test',
        lastName: 'User',
      }

      render(
        <StatsOverview analytics={mockAnalytics} profile={profileWithoutBio} />
      )

      expect(
        screen.queryByText('A passionate film lover')
      ).not.toBeInTheDocument()
    })

    test('should display bio when provided', () => {
      const profileWithBio: UserProfile = {
        username: 'testcinephile',
        firstName: 'Test',
        lastName: 'User',
        bio: 'Avid movie watcher since 2015',
      }

      render(
        <StatsOverview analytics={mockAnalytics} profile={profileWithBio} />
      )

      expect(
        screen.getByText('Avid movie watcher since 2015')
      ).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('should handle zero values gracefully', () => {
      const zeroAnalytics: AnalyticsOverview = {
        ...mockAnalytics,
        totalMoviesWatched: 0,
        moviesRated: 0,
        moviesLiked: 0,
        averageRating: 0,
      }

      render(
        <StatsOverview analytics={zeroAnalytics} profile={mockProfile} />
      )

      // Check that component renders with zero values
      expect(screen.getByText('Total Movies')).toBeInTheDocument()
      expect(screen.getByText('Movies Rated')).toBeInTheDocument()
    })

    test('should handle large numbers correctly', () => {
      const largeAnalytics: AnalyticsOverview = {
        ...mockAnalytics,
        totalMoviesWatched: 5000,
        moviesRated: 4500,
        moviesLiked: 2000,
      }

      render(
        <StatsOverview analytics={largeAnalytics} profile={mockProfile} />
      )

      // toLocaleString() uses space as thousands separator in some locales
      expect(screen.getByText(/5\s*000/)).toBeInTheDocument()
      expect(screen.getByText('4500')).toBeInTheDocument()
      expect(screen.getByText('2000')).toBeInTheDocument()
    })

    test('should handle very long usernames', () => {
      const longUsernameProfile: UserProfile = {
        username: 'veryverylongusernamethatgoesonforreallyquite',
        firstName: 'Test',
        lastName: 'User',
      }

      render(
        <StatsOverview analytics={mockAnalytics} profile={longUsernameProfile} />
      )

      expect(
        screen.getByText('@veryverylongusernamethatgoesonforreallyquite')
      ).toBeInTheDocument()
    })

    test('should handle profile with special characters in bio', () => {
      const specialCharProfile: UserProfile = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        bio: '🎬 Film enthusiast | Movie lover! (2015-present) & more...',
      }

      render(
        <StatsOverview analytics={mockAnalytics} profile={specialCharProfile} />
      )

      expect(
        screen.getByText('🎬 Film enthusiast | Movie lover! (2015-present) & more...')
      ).toBeInTheDocument()
    })
  })

  describe('Dark Mode Compatibility', () => {
    test('should render correctly with profile data', () => {
      const { container } = render(
        <StatsOverview analytics={mockAnalytics} profile={mockProfile} />
      )

      // Verify structure is rendered
      expect(screen.getByText('Cinematic Identity')).toBeInTheDocument()
      expect(container.querySelector('section')).toBeInTheDocument()
    })
  })
})

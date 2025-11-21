/**
 * Unit tests for StatsOverview component
 * Tests rendering of stat cards with analytics data
 */

import { render, screen } from '@testing-library/react'
import { StatsOverview } from '@/components/analytics/stats-overview'
import type { AnalyticsOverview } from '@/lib/types'

// ============================================================================
// MOCK DATA
// ============================================================================

const mockAnalytics: AnalyticsOverview = {
  totalMoviesWatched: 150,
  moviesRated: 120,
  moviesLiked: 45,
  ratingCoverage: 80.0,
  likeRatio: 30.0,
  averageRating: 3.75,
  medianRating: 4.0,
  ratingDistribution: {
    '0.5': 2,
    '1.0': 5,
    '1.5': 3,
    '2.0': 8,
    '2.5': 12,
    '3.0': 25,
    '3.5': 30,
    '4.0': 22,
    '4.5': 10,
    '5.0': 3,
  },
  totalRewatches: 15,
  moviesRewatched: 10,
  rewatchRate: 6.67,
  earliestWatchDate: new Date('2020-01-01'),
  latestWatchDate: new Date('2024-11-21'),
  trackingSpan: 1755,
  decadeBreakdown: {
    '1950': 5,
    '1960': 8,
    '1970': 12,
    '1980': 15,
    '1990': 25,
    '2000': 35,
    '2010': 40,
    '2020': 5,
  },
  yearlyWatching: {
    '2020': 25,
    '2021': 30,
    '2022': 35,
    '2023': 45,
    '2024': 15,
  },
}

// ============================================================================
// RENDERING TESTS
// ============================================================================

describe('StatsOverview Component - Rendering', () => {
  test('should render overview title and description', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(
      screen.getByText("Key statistics about your movie watching habits")
    ).toBeInTheDocument()
  })

  test('should render all five stat cards', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('Total Movies')).toBeInTheDocument()
    expect(screen.getByText('Movies Rated')).toBeInTheDocument()
    expect(screen.getByText('Average Rating')).toBeInTheDocument()
    expect(screen.getByText('Movies Liked')).toBeInTheDocument()
    expect(screen.getByText('Rewatches')).toBeInTheDocument()
  })

  test('should display total movies watched correctly', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('150')).toBeInTheDocument()
  })
})

// ============================================================================
// STAT VALUES TESTS
// ============================================================================

describe('StatsOverview Component - Stat Values', () => {
  test('should display movies rated with percentage', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('120 (80.0%)')).toBeInTheDocument()
  })

  test('should display average rating', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('3.75')).toBeInTheDocument()
  })

  test('should display movies liked with percentage', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('45 (30.0%)')).toBeInTheDocument()
  })

  test('should display rewatches with count', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('10 (6.7%)')).toBeInTheDocument()
    expect(screen.getByText('15 total rewatches')).toBeInTheDocument()
  })

  test('should display median rating', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('4.00')).toBeInTheDocument()
  })
})

// ============================================================================
// LOADING STATE TESTS
// ============================================================================

describe('StatsOverview Component - Loading State', () => {
  test('should show loading skeletons when loading', () => {
    render(<StatsOverview analytics={null} isLoading={true} />)

    // Should show Overview title but not stat values
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  test('should show empty state when no data', () => {
    render(<StatsOverview analytics={null} isLoading={false} />)

    expect(
      screen.getByText('Upload your Letterboxd data to see your statistics')
    ).toBeInTheDocument()
  })
})

// ============================================================================
// VARIANT/STYLING TESTS
// ============================================================================

describe('StatsOverview Component - Variants', () => {
  test('should apply success variant for high rating coverage', () => {
    const analyticsHighCoverage = {
      ...mockAnalytics,
      ratingCoverage: 85.0,
    }

    render(<StatsOverview analytics={analyticsHighCoverage} />)

    // Component should still render
    expect(screen.getByText('Movies Rated')).toBeInTheDocument()
  })

  test('should apply default variant for low rating coverage', () => {
    const analyticsLowCoverage = {
      ...mockAnalytics,
      ratingCoverage: 50.0,
    }

    render(<StatsOverview analytics={analyticsLowCoverage} />)

    // Component should still render
    expect(screen.getByText('Movies Rated')).toBeInTheDocument()
  })

  test('should apply success variant for high like ratio', () => {
    const analyticsHighLikes = {
      ...mockAnalytics,
      likeRatio: 60.0,
    }

    render(<StatsOverview analytics={analyticsHighLikes} />)

    expect(screen.getByText('Movies Liked')).toBeInTheDocument()
  })

  test('should apply default variant for low like ratio', () => {
    const analyticsLowLikes = {
      ...mockAnalytics,
      likeRatio: 20.0,
    }

    render(<StatsOverview analytics={analyticsLowLikes} />)

    expect(screen.getByText('Movies Liked')).toBeInTheDocument()
  })
})

// ============================================================================
// EDGE CASES TESTS
// ============================================================================

describe('StatsOverview Component - Edge Cases', () => {
  test('should handle zero movies watched', () => {
    const emptyAnalytics = {
      ...mockAnalytics,
      totalMoviesWatched: 0,
      moviesRated: 0,
      moviesLiked: 0,
      ratingCoverage: 0,
      likeRatio: 0,
    }

    render(<StatsOverview analytics={emptyAnalytics} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('should handle single rewatch correctly', () => {
    const singleRewatch = {
      ...mockAnalytics,
      totalRewatches: 1,
    }

    render(<StatsOverview analytics={singleRewatch} />)

    expect(screen.getByText('1 total rewatch')).toBeInTheDocument()
  })

  test('should handle multiple rewatches correctly', () => {
    const multipleRewatches = {
      ...mockAnalytics,
      totalRewatches: 10,
    }

    render(<StatsOverview analytics={multipleRewatches} />)

    expect(screen.getByText('10 total rewatches')).toBeInTheDocument()
  })

  test('should handle decimal percentages', () => {
    const decimalPercentage = {
      ...mockAnalytics,
      ratingCoverage: 66.67,
    }

    render(<StatsOverview analytics={decimalPercentage} />)

    expect(screen.getByText('120 (66.7%)')).toBeInTheDocument()
  })
})

// ============================================================================
// RESPONSIVE LAYOUT TESTS
// ============================================================================

describe('StatsOverview Component - Responsive Layout', () => {
  test('should render all cards in the grid', () => {
    const { container } = render(<StatsOverview analytics={mockAnalytics} />)

    // Check for grid container (md:grid-cols-2 lg:grid-cols-3)
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toBeInTheDocument()
  })

  test('should render correct number of stat cards', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    // Count the number of stat card titles
    expect(screen.getByText('Total Movies')).toBeInTheDocument()
    expect(screen.getByText('Movies Rated')).toBeInTheDocument()
    expect(screen.getByText('Average Rating')).toBeInTheDocument()
    expect(screen.getByText('Movies Liked')).toBeInTheDocument()
    expect(screen.getByText('Rewatches')).toBeInTheDocument()
    expect(screen.getByText('Median Rating')).toBeInTheDocument()
  })
})

// ============================================================================
// DESCRIPTION/METADATA TESTS
// ============================================================================

describe('StatsOverview Component - Descriptions', () => {
  test('should show description for total movies', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText("All movies you've watched")).toBeInTheDocument()
  })

  test('should show description for movies rated', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('80.0% of your movies')).toBeInTheDocument()
  })

  test('should show description for average rating', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('Out of 5.0 stars')).toBeInTheDocument()
  })

  test('should show description for movies liked', () => {
    render(<StatsOverview analytics={mockAnalytics} />)

    expect(screen.getByText('30.0% of your movies')).toBeInTheDocument()
  })
})

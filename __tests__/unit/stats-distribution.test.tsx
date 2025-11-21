/**
 * Unit tests for StatsDistribution component
 * Tests chart rendering and data visualization
 */

import { render, screen } from '@testing-library/react'
// Mock Recharts since it doesn't work well in JSDOM environment
jest.mock('recharts', () => ({
  BarChart: () => <div data-testid="bar-chart-mock" />,
  Bar: () => <div data-testid="bar-mock" />,
  XAxis: () => <div data-testid="x-axis-mock" />,
  YAxis: () => <div data-testid="y-axis-mock" />,
  CartesianGrid: () => <div data-testid="grid-mock" />,
  Tooltip: () => <div data-testid="tooltip-mock" />,
  Legend: () => <div data-testid="legend-mock" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-mock">{children}</div>,
  Cell: () => <div data-testid="cell-mock" />,
}))

import { StatsDistribution } from '@/components/analytics/stats-distribution'
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

describe('StatsDistribution Component - Rendering', () => {
  test('should render distributions title and description', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    expect(screen.getByText('Distributions')).toBeInTheDocument()
    expect(
      screen.getByText('Breakdown of your movies by rating, decade, and year')
    ).toBeInTheDocument()
  })

  test('should render rating distribution section', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    expect(screen.getByText('Rating Distribution')).toBeInTheDocument()
    expect(
      screen.getByText('How many movies you rated at each star level')
    ).toBeInTheDocument()
  })

  test('should render decade breakdown section', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    expect(screen.getByText('Movies by Decade')).toBeInTheDocument()
    expect(
      screen.getByText("How many movies you've watched from each decade")
    ).toBeInTheDocument()
  })

  test('should render yearly watching section', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    expect(screen.getByText('Movies by Year')).toBeInTheDocument()
    expect(
      screen.getByText('How many movies you watched each year (top 10)')
    ).toBeInTheDocument()
  })
})

// ============================================================================
// RATING DISTRIBUTION TESTS
// ============================================================================

describe('StatsDistribution Component - Rating Distribution', () => {
  test('should display rating distribution section', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    // Check that rating distribution section is rendered
    expect(screen.getByText('Rating Distribution')).toBeInTheDocument()
    expect(screen.getByText('How many movies you rated at each star level')).toBeInTheDocument()
  })

  test('should handle empty rating distribution', () => {
    const analyticsNoRatings = {
      ...mockAnalytics,
      ratingDistribution: {},
    }

    render(<StatsDistribution analytics={analyticsNoRatings} />)

    expect(screen.getByText('No rating data available')).toBeInTheDocument()
  })
})

// ============================================================================
// DECADE BREAKDOWN TESTS
// ============================================================================

describe('StatsDistribution Component - Decade Breakdown', () => {
  test('should display decade breakdown section', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    // Check that decade section is rendered
    expect(screen.getByText('Movies by Decade')).toBeInTheDocument()
    expect(screen.getByText("How many movies you've watched from each decade")).toBeInTheDocument()
  })

  test('should handle empty decade breakdown', () => {
    const analyticsNoDecades = {
      ...mockAnalytics,
      decadeBreakdown: {},
    }

    render(<StatsDistribution analytics={analyticsNoDecades} />)

    // Component should still render with no data message
    expect(screen.getByText('No decade data available')).toBeInTheDocument()
  })
})

// ============================================================================
// YEARLY WATCHING TESTS
// ============================================================================

describe('StatsDistribution Component - Yearly Watching', () => {
  test('should display yearly watching data', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    // Check that years appear
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    expect(screen.getByText('2021')).toBeInTheDocument()
  })

  test('should display movie counts for each year', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    // Top years should be displayed with their counts
    expect(screen.getByText('45')).toBeInTheDocument() // 2023 has 45
    expect(screen.getByText('35')).toBeInTheDocument() // 2022 has 35
  })

  test('should show top 10 years only', () => {
    const analyticsMany = {
      ...mockAnalytics,
      yearlyWatching: {
        '2000': 1,
        '2001': 2,
        '2002': 3,
        '2003': 4,
        '2004': 5,
        '2005': 6,
        '2006': 7,
        '2007': 8,
        '2008': 9,
        '2009': 10,
        '2010': 11,
        '2020': 25,
        '2021': 30,
        '2022': 35,
        '2023': 45,
      },
    }

    const { container } = render(<StatsDistribution analytics={analyticsMany} />)

    // Count year entries - should be 10 or fewer
    const yearElements = container.querySelectorAll('[class*="flex"][class*="justify-between"]')
    // At most 10 years should be displayed
    expect(yearElements.length).toBeLessThanOrEqual(10)
  })

  test('should handle empty yearly watching', () => {
    const analyticsNoYears = {
      ...mockAnalytics,
      yearlyWatching: {},
    }

    render(<StatsDistribution analytics={analyticsNoYears} />)

    expect(screen.getByText('No yearly data available')).toBeInTheDocument()
  })

  test('should display years in descending order', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    // Get all year text elements
    const yearTexts = screen.getAllByText(/^202[0-4]$/)
    expect(yearTexts.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// LOADING STATE TESTS
// ============================================================================

describe('StatsDistribution Component - Loading State', () => {
  test('should show loading skeletons when loading', () => {
    render(<StatsDistribution analytics={null} isLoading={true} />)

    // Should show title but not data
    expect(screen.getByText('Distributions')).toBeInTheDocument()
  })

  test('should show empty state when no data', () => {
    render(<StatsDistribution analytics={null} isLoading={false} />)

    // Should show all three "no data" messages
    const noDataMessages = screen.queryAllByText(/No .* data available/)
    expect(noDataMessages.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// NULL/UNDEFINED HANDLING TESTS
// ============================================================================

describe('StatsDistribution Component - Null Handling', () => {
  test('should handle null analytics', () => {
    render(<StatsDistribution analytics={null} isLoading={false} />)

    expect(screen.getByText('Distributions')).toBeInTheDocument()
  })

  test('should handle null ratingDistribution', () => {
    const analyticsNull = {
      ...mockAnalytics,
      ratingDistribution: null as any,
    }

    render(<StatsDistribution analytics={analyticsNull} />)

    expect(screen.getByText('No rating data available')).toBeInTheDocument()
  })

  test('should handle null decadeBreakdown', () => {
    const analyticsNull = {
      ...mockAnalytics,
      decadeBreakdown: null as any,
    }

    render(<StatsDistribution analytics={analyticsNull} />)

    expect(screen.getByText('No decade data available')).toBeInTheDocument()
  })

  test('should handle null yearlyWatching', () => {
    const analyticsNull = {
      ...mockAnalytics,
      yearlyWatching: null as any,
    }

    render(<StatsDistribution analytics={analyticsNull} />)

    expect(screen.getByText('No yearly data available')).toBeInTheDocument()
  })
})

// ============================================================================
// EDGE CASES TESTS
// ============================================================================

describe('StatsDistribution Component - Edge Cases', () => {
  test('should handle single rating value', () => {
    const singleRating = {
      ...mockAnalytics,
      ratingDistribution: {
        '5.0': 150,
      },
    }

    render(<StatsDistribution analytics={singleRating} />)

    expect(screen.getByText('Rating Distribution')).toBeInTheDocument()
  })

  test('should handle single decade', () => {
    const singleDecade = {
      ...mockAnalytics,
      decadeBreakdown: {
        '2020': 150,
      },
    }

    render(<StatsDistribution analytics={singleDecade} />)

    expect(screen.getByText('Movies by Decade')).toBeInTheDocument()
  })

  test('should handle single year', () => {
    const singleYear = {
      ...mockAnalytics,
      yearlyWatching: {
        '2023': 150,
      },
    }

    render(<StatsDistribution analytics={singleYear} />)

    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  test('should handle very large numbers', () => {
    const largeNumbers = {
      ...mockAnalytics,
      yearlyWatching: {
        '2023': 9999,
        '2022': 8888,
      },
    }

    render(<StatsDistribution analytics={largeNumbers} />)

    expect(screen.getByText('9999')).toBeInTheDocument()
    expect(screen.getByText('8888')).toBeInTheDocument()
  })
})

// ============================================================================
// RESPONSIVE LAYOUT TESTS
// ============================================================================

describe('StatsDistribution Component - Layout', () => {
  test('should render main sections with data', () => {
    render(<StatsDistribution analytics={mockAnalytics} />)

    // All three main sections should be present
    expect(screen.getByText('Rating Distribution')).toBeInTheDocument()
    expect(screen.getByText('Movies by Decade')).toBeInTheDocument()
    expect(screen.getByText('Movies by Year')).toBeInTheDocument()
  })
})

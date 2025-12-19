'use client'

import type { AnalyticsOverview, Movie } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DiaryMonthlyRadarChart } from '@/components/charts/upcoming-feature-showcase'
import { computeMonthlyRadarData } from '@/lib/analytics-engine'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// ============================================================================
// RATING DISTRIBUTION COMPONENT
// ============================================================================

interface RatingDistributionProps {
  data: Record<string, number> | null
  isLoading?: boolean
}

function RatingDistribution({ data, isLoading = false }: RatingDistributionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>
            How many movies you rated at each star level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    )
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>
            How many movies you rated at each star level
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80 text-muted-foreground">
          No rating data available
        </CardContent>
      </Card>
    )
  }

  // Convert rating distribution to chart data
  const chartData = Object.entries(data)
    .map(([rating, count]) => ({
      rating,
      count,
    }))
    .sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating))

  const colors = [
    'hsl(0, 0%, 50%)',    // 0.5 - Gray
    'hsl(0, 100%, 50%)',  // 1.0 - Red
    'hsl(20, 100%, 50%)', // 1.5 - Orange
    'hsl(45, 100%, 50%)', // 2.0 - Yellow
    'hsl(80, 100%, 50%)', // 2.5 - Lime
    'hsl(120, 100%, 50%)',// 3.0 - Green
    'hsl(160, 100%, 50%)',// 3.5 - Cyan
    'hsl(200, 100%, 50%)',// 4.0 - Blue
    'hsl(260, 100%, 50%)',// 4.5 - Purple
    'hsl(320, 100%, 50%)',// 5.0 - Magenta
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
        <CardDescription>
          How many movies you rated at each star level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DECADE BREAKDOWN COMPONENT
// ============================================================================

interface DecadeBreakdownProps {
  data: Record<string, number> | null
  isLoading?: boolean
}

function DecadeBreakdown({ data, isLoading = false }: DecadeBreakdownProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Movies by Decade</CardTitle>
          <CardDescription>
            How many movies you've watched from each decade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    )
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Movies by Decade</CardTitle>
          <CardDescription>
            How many movies you've watched from each decade
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80 text-muted-foreground">
          No decade data available
        </CardContent>
      </Card>
    )
  }

  // Convert decade breakdown to chart data
  const chartData = Object.entries(data)
    .map(([decade, count]) => ({
      decade: `${decade}s`,
      count,
    }))
    .sort((a, b) => parseInt(a.decade) - parseInt(b.decade))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movies by Decade</CardTitle>
        <CardDescription>
          How many movies you've watched from each decade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="decade" type="category" width={60} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
              }}
            />
            <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// YEARLY WATCHING COMPONENT
// ============================================================================

interface YearlyWatchingProps {
  data: Record<string, number> | null
  isLoading?: boolean
}

function YearlyWatching({ data, isLoading = false }: YearlyWatchingProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Movies by Year</CardTitle>
          <CardDescription>
            How many movies you watched each year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    )
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Movies by Year</CardTitle>
          <CardDescription>
            How many movies you watched each year
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80 text-muted-foreground">
          No yearly data available
        </CardContent>
      </Card>
    )
  }

  // Convert yearly watching to table format
  const tableData = Object.entries(data)
    .map(([year, count]) => ({
      year,
      count,
    }))
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
    .slice(0, 10) // Show top 10 years

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movies by Year</CardTitle>
        <CardDescription>
          How many movies you watched each year (top 10)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tableData.map(({ year, count }) => (
            <div key={year} className="flex items-center justify-between">
              <span className="text-sm font-medium">{year}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{
                      width: `${(count / Math.max(...tableData.map((d) => d.count))) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// STATS DISTRIBUTION COMPONENT
// ============================================================================

interface StatsDistributionProps {
  analytics: AnalyticsOverview | null
  movies?: Movie[] | null
  isLoading?: boolean
}

export function StatsDistribution({ analytics, movies, isLoading = false }: StatsDistributionProps) {
  // Generate monthly radar data from movies
  const monthlyRadarData = movies ? computeMonthlyRadarData(movies) : []

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Distributions</h2>
        <p className="text-muted-foreground">
          Breakdown of your movies by rating, decade, year, and monthly patterns
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* Rating Distribution */}
        <RatingDistribution
          data={analytics?.ratingDistribution ?? null}
          isLoading={isLoading}
        />

        {/* Decade Breakdown */}
        <DecadeBreakdown data={analytics?.decadeBreakdown ?? null} isLoading={isLoading} />
      </div>

      {/* Yearly Watching - Full Width */}
      <YearlyWatching data={analytics?.yearlyWatching ?? null} isLoading={isLoading} />

      {/* Monthly Patterns Radar Chart - Full Width */}
      {isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Patterns by Year</CardTitle>
            <CardDescription>Which months you watch the most movies</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-96" />
          </CardContent>
        </Card>
      ) : monthlyRadarData.length > 0 ? (
        <DiaryMonthlyRadarChart data={monthlyRadarData} size="large" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Patterns by Year</CardTitle>
            <CardDescription>Which months you watch the most movies</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
            No monthly pattern data available. Watch dates are needed to show this chart.
          </CardContent>
        </Card>
      )}
    </section>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export { RatingDistribution, DecadeBreakdown, YearlyWatching }

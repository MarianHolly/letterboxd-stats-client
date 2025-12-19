'use client'

import { useEffect, useState } from 'react'
import { useAnalyticsStore } from '@/hooks/use-analytics-store'
import { StatsOverview } from './stats-overview'
import { StatsDistribution } from './stats-distribution'
import { FavoriteFilms } from './favorite-films'
import { AnalyticsEmptyState } from './analytics-empty-state'
import { AnalyticsSkeleton } from './analytics-skeleton'
import { DiaryAreaChart } from '@/components/charts/diary-area-chart'
// import { GenreDistribution } from '@/components/charts/genre-distribution'
// import { RatingDistribution } from '@/components/charts/rating-distribution'
import { ReleasedYearAnalysis } from '@/components/charts/release-year-analysis'
// import { ViewingOverTime } from '@/components/charts/viewing-over-time'
import { DiaryMonthlyRadarChart } from '@/components/charts/upcoming-feature-showcase'
import { DiaryStatistics } from '@/components/charts/diary-statistics'
import { computeMonthlyRadarData, computeTagDistribution } from '@/lib/analytics-engine'

// ============================================================================
// ANALYTICS DASHBOARD COMPONENT
// ============================================================================

interface AnalyticsDashboardProps {
  onUploadClick?: () => void
}

export function AnalyticsDashboard({ onUploadClick }: AnalyticsDashboardProps) {
  // Subscribe to store
  const dataset = useAnalyticsStore((state) => state.dataset)
  const analytics = useAnalyticsStore((state) => state.analytics)
  const loading = useAnalyticsStore((state) => state.loading)
  const error = useAnalyticsStore((state) => state.error)
  const hasData = useAnalyticsStore((state) => state.hasData())

  // Handle hydration
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Loading state
  if (!isHydrated || loading) {
    return <AnalyticsSkeleton />
  }

  // No data state
  if (!hasData) {
    return <AnalyticsEmptyState onUploadClick={onUploadClick} />
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 overflow-auto scroll-smooth">
        <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
            <h3 className="font-semibold text-destructive mb-2">Error</h3>
            <p className="text-sm text-destructive/90">{error}</p>
          </div>
          {analytics && <StatsOverview analytics={analytics} profile={dataset?.userProfile} isLoading={false} />}
        </div>
      </div>
    )
  }

  // Success state
  // Prepare data for charts
  const movies = dataset?.watched || []
  const monthlyRadarData = computeMonthlyRadarData(movies)
  const genreData = computeTagDistribution(movies)

  // Convert diary data for area chart (monthly breakdown)
  const diaryAreaData = (movies && movies.length > 0)
    ? Array.from({ length: 12 }, (_, i) => {
        const month = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const count = monthlyRadarData.flatMap(y => y.data).filter(m => m.month === month.split(' ')[0]).reduce((sum, m) => sum + m.count, 0)
        return { month, count: count || 0 }
      })
    : []

  // Convert release year data for analysis
  const releaseYearData: Record<string, number> = {}
  movies.forEach(movie => {
    const year = String(movie.year)
    releaseYearData[year] = (releaseYearData[year] || 0) + 1
  })

  // Convert viewing over time (year breakdown)
  const viewingOverTimeData: Record<string, number> = {}
  movies.forEach(movie => {
    const date = movie.watchedDate || movie.dateMarkedWatched
    if (date) {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      const year = String(dateObj.getFullYear())
      viewingOverTimeData[year] = (viewingOverTimeData[year] || 0) + 1
    }
  })

  // Compute diary statistics
  const diaryStats = monthlyRadarData.length > 0 ? (() => {
    const allCounts = monthlyRadarData.flatMap(y => y.data.map(m => m.count))
    const total = allCounts.reduce((sum, c) => sum + c, 0)
    const monthlyAverages = monthlyRadarData.map(y => ({
      year: y.year,
      average: y.data.reduce((sum, m) => sum + m.count, 0) / 12
    }))

    let busiestMonth = { name: '', count: 0 }
    let quietestMonth = { name: '', count: Infinity }
    monthlyRadarData.forEach(y => {
      y.data.forEach(m => {
        if (m.count > busiestMonth.count) {
          busiestMonth = { name: `${m.month}`, count: m.count }
        }
        if (m.count > 0 && m.count < quietestMonth.count) {
          quietestMonth = { name: `${m.month}`, count: m.count }
        }
      })
    })

    return {
      totalEntries: total,
      averagePerMonth: monthlyAverages.length > 0 ? monthlyAverages.reduce((sum, m) => sum + m.average, 0) / monthlyAverages.length : 0,
      busiestMonth: busiestMonth.name || 'N/A',
      busiestMonthCount: busiestMonth.count,
      quietestMonth: quietestMonth.name !== '' ? quietestMonth.name : 'N/A',
      quietestMonthCount: quietestMonth.count !== Infinity ? quietestMonth.count : 0,
      dateRange: monthlyRadarData.length > 0 ? `${monthlyRadarData[0].year} - ${monthlyRadarData[monthlyRadarData.length - 1].year}` : 'N/A'
    }
  })() : undefined

  return (
    <div className="flex-1 overflow-auto scroll-smooth">
      <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full">
        {/* Stats Overview Section - Full Width */}
        <StatsOverview analytics={analytics} profile={dataset?.userProfile} isLoading={!analytics} />

        {/* Main Charts Section */}
        <section className="space-y-8">
          {/* Release Year Analysis - Full Width First */}
          {Object.keys(releaseYearData).length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-center py-12">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Movie Release Years</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Requires: watched.csv</p>
                </div>
              </div>
              <ReleasedYearAnalysis data={releaseYearData} />
            </div>
          )}
{/* 
          {/* Diary Statistics */}
          {diaryStats && (
            <div>
              <div className="mb-4 py-12 flex flex-col gap-2 items-center justify-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Your Viewing Habits</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Requires: diary.csv</p>
              </div>
              <DiaryStatistics stats={diaryStats} />
            </div>
          )}

          {/* Timeline Charts */}
          {diaryAreaData.length > 0 && (
            <div>
              <div className="mb-4 py-12 flex flex-col gap-2 items-center justify-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Watching Timeline</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Requires: diary.csv (watch dates)</p>
              </div>
              <div className="grid gap-8 lg:grid-cols-1">
                <DiaryAreaChart data={diaryAreaData} />
              </div>
            </div>
          )}

          {/* Distribution Charts */}
          <div className="space-y-4">
              <div className="mb-4 py-12 flex flex-col gap-2 items-center justify-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ratings & Genres</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Requires: {analytics?.ratingDistribution && Object.keys(analytics.ratingDistribution).length > 0 ? 'ratings.csv' : ''}{analytics?.ratingDistribution && Object.keys(analytics.ratingDistribution).length > 0 && genreData && Object.keys(genreData).length > 0 ? ' / ' : ''}
                {genreData && Object.keys(genreData).length > 0 ? 'diary.csv (tags)' : ''}
              </p>
            </div>
            {/* <div className="grid gap-8 md:grid-cols-2">
              {analytics?.ratingDistribution && Object.keys(analytics.ratingDistribution).length > 0 && (
                <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Rating Distribution</h3>
                  <RatingDistribution data={analytics.ratingDistribution} />
                </div>
              )}

              {genreData && Object.keys(genreData).length > 0 && (
                <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">Tag Distribution</h3>
                  <GenreDistribution data={genreData} />
                </div>
              )}
            </div> */}
          </div>

          {/* Viewing Over Time */}
          {/* {Object.keys(viewingOverTimeData).length > 0 && (
            <div>
              <div className="mb-4 py-12 flex flex-col gap-2 items-center justify-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Viewing Trends</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Requires: watched.csv or diary.csv (watch dates)</p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-900 p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Viewing Over Time</h3>
                <ViewingOverTime data={viewingOverTimeData} />
              </div>
            </div>
          )} */}

          {/* Distribution Stats Section */}
          {analytics && (
            <div>
              <div className="mb-4 py-12 flex flex-col gap-2 items-center justify-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Distribution Breakdown</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Requires: watched.csv, ratings.csv, diary.csv</p>
              </div>
              <StatsDistribution analytics={analytics} movies={movies} isLoading={false} />
            </div>
          )}

         
        </section>
      </div>
    </div>
  )
}

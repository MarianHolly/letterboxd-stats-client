'use client'

import { useEffect, useState } from 'react'
import { useAnalyticsStore } from '@/hooks/use-analytics-store'
import { StatsOverview } from './stats-overview'
import { StatsDistribution } from './stats-distribution'
import { AnalyticsEmptyState } from './analytics-empty-state'
import { AnalyticsSkeleton } from './analytics-skeleton'

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
          {analytics && <StatsOverview analytics={analytics} isLoading={false} />}
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="flex-1 overflow-auto scroll-smooth">
      <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full">
        {/* Overview Section - Full Width */}
        <StatsOverview analytics={analytics} isLoading={!analytics} />
      </div>
    </div>
  )
}

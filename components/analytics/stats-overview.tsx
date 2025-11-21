'use client'

import type { AnalyticsOverview } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  variant?: 'default' | 'success' | 'warning'
  isLoading?: boolean
}

function StatCard({
  title,
  value,
  description,
  variant = 'default',
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          {description && <Skeleton className="h-3 w-32" />}
        </CardContent>
      </Card>
    )
  }

  const variantStyles = {
    default: 'text-foreground',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${variantStyles[variant]}`}>{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// STATS OVERVIEW COMPONENT
// ============================================================================

interface StatsOverviewProps {
  analytics: AnalyticsOverview | null
  isLoading?: boolean
}

export function StatsOverview({ analytics, isLoading = false }: StatsOverviewProps) {
  if (isLoading || !analytics) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Key statistics about your movie watching habits
          </p>
        </div>

        {!analytics && !isLoading ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              Upload your Letterboxd data to see your statistics
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Movies" value="—" isLoading={true} />
            <StatCard title="Movies Rated" value="—" isLoading={true} />
            <StatCard title="Average Rating" value="—" isLoading={true} />
            <StatCard title="Movies Liked" value="—" isLoading={true} />
            <StatCard title="Rewatches" value="—" isLoading={true} />
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Key statistics about your movie watching habits
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Movies Watched */}
        <StatCard
          title="Total Movies"
          value={analytics.totalMoviesWatched}
          description="All movies you've watched"
          variant="default"
        />

        {/* Movies Rated */}
        <StatCard
          title="Movies Rated"
          value={`${analytics.moviesRated} (${analytics.ratingCoverage.toFixed(1)}%)`}
          description={`${analytics.ratingCoverage.toFixed(1)}% of your movies`}
          variant={analytics.ratingCoverage >= 75 ? 'success' : 'default'}
        />

        {/* Average Rating */}
        <StatCard
          title="Average Rating"
          value={analytics.averageRating.toFixed(2)}
          description={`Out of 5.0 stars`}
          variant="default"
        />

        {/* Movies Liked */}
        <StatCard
          title="Movies Liked"
          value={`${analytics.moviesLiked} (${analytics.likeRatio.toFixed(1)}%)`}
          description={`${analytics.likeRatio.toFixed(1)}% of your movies`}
          variant={analytics.likeRatio >= 50 ? 'success' : 'default'}
        />

        {/* Rewatches */}
        <StatCard
          title="Rewatches"
          value={`${analytics.moviesRewatched} (${analytics.rewatchRate.toFixed(1)}%)`}
          description={`${analytics.totalRewatches} total rewatch${analytics.totalRewatches !== 1 ? 'es' : ''}`}
          variant={analytics.rewatchRate >= 20 ? 'success' : 'default'}
        />

        {/* Median Rating */}
        <StatCard
          title="Median Rating"
          value={analytics.medianRating.toFixed(2)}
          description="Middle value of all ratings"
          variant="default"
        />
      </div>
    </section>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export { StatCard }

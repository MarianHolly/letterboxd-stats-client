'use client'

import type { AnalyticsOverview } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

// ============================================================================
// STAT CARD COMPONENT - PROFESSIONAL DESIGN
// ============================================================================

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'primary'
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
      <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-5 text-center space-y-3">
        <Skeleton className="h-3 w-20 mx-auto" />
        <Skeleton className="h-10 w-24 mx-auto" />
        <Skeleton className="h-3 w-32 mx-auto" />
      </div>
    )
  }

  const variantStyles = {
    default: {
      value: 'text-slate-900 dark:text-white',
      title: 'text-slate-500 dark:text-slate-500',
      description: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-white dark:bg-slate-900/50',
      border: 'border-slate-200 dark:border-white/10'
    },
    success: {
      value: 'text-emerald-600 dark:text-emerald-400',
      title: 'text-slate-500 dark:text-slate-500',
      description: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-white dark:bg-slate-900/50',
      border: 'border-slate-200 dark:border-white/10'
    },
    warning: {
      value: 'text-amber-600 dark:text-amber-400',
      title: 'text-slate-500 dark:text-slate-500',
      description: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-white dark:bg-slate-900/50',
      border: 'border-slate-200 dark:border-white/10'
    },
    primary: {
      value: 'text-indigo-600 dark:text-indigo-400',
      title: 'text-slate-500 dark:text-slate-500',
      description: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-white dark:bg-slate-900/50',
      border: 'border-slate-200 dark:border-white/10'
    }
  }

  const style = variantStyles[variant]

  return (
    <div className={`rounded-sm border ${style.border} ${style.bg} p-5 text-center transition-all hover:border-slate-300 dark:hover:border-white/20`}>
      <p className={`text-xs font-light ${style.title} uppercase tracking-widest mb-3`}>{title}</p>
      <div className={`text-5xl font-bold ${style.value} mb-2`}>{value}</div>
      {description && (
        <p className={`text-xs font-light ${style.description}`}>{description}</p>
      )}
    </div>
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
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Your Cinematic Journey</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Comprehensive statistics about your Letterboxd watching habits
          </p>
        </div>

        {!analytics && !isLoading ? (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-white/10 p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Upload your Letterboxd data to see your statistics
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Movies" value="—" isLoading={true} />
            <StatCard title="Movies Rated" value="—" isLoading={true} />
            <StatCard title="Average Rating" value="—" isLoading={true} />
            <StatCard title="Movies Liked" value="—" isLoading={true} />
            <StatCard title="Rewatches" value="—" isLoading={true} />
            <StatCard title="Median Rating" value="—" isLoading={true} />
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Your Cinematic Journey</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Comprehensive statistics about your Letterboxd watching habits
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Movies Watched - Primary Stat */}
        <StatCard
          title="Total Movies"
          value={analytics.totalMoviesWatched.toLocaleString()}
          description="All unique movies watched"
          variant="primary"
        />

        {/* Movies Rated */}
        <StatCard
          title="Movies Rated"
          value={`${analytics.moviesRated}`}
          description={`${analytics.ratingCoverage.toFixed(1)}% of your collection`}
          variant={analytics.ratingCoverage >= 75 ? 'success' : 'default'}
        />

        {/* Average Rating */}
        <StatCard
          title="Average Rating"
          value={`${analytics.averageRating.toFixed(2)} ★`}
          description={`Out of 5.0`}
          variant="primary"
        />

        {/* Movies Liked */}
        <StatCard
          title="Favorite Movies"
          value={`${analytics.moviesLiked}`}
          description={`${analytics.likeRatio.toFixed(1)}% of your movies`}
          variant={analytics.likeRatio >= 50 ? 'success' : 'default'}
        />

        {/* Rewatches */}
        <StatCard
          title="Rewatched"
          value={`${analytics.moviesRewatched}`}
          description={`${analytics.totalRewatches} total rewatch${analytics.totalRewatches !== 1 ? 'es' : ''}`}
          variant={analytics.rewatchRate >= 20 ? 'success' : 'default'}
        />

        {/* Median Rating */}
        <StatCard
          title="Median Rating"
          value={`${analytics.medianRating.toFixed(2)} ★`}
          description="Middle point of ratings"
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

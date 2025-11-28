'use client'

import type { UserProfile, AnalyticsOverview } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { formatProfileFullName } from '@/lib/utils'

// ============================================================================
// PROFILE INFO COMPONENT
// ============================================================================

interface ProfileInfoProps {
  profile: UserProfile | undefined
  analytics: AnalyticsOverview | null | undefined
  isLoading?: boolean
}

export function ProfileInfo({
  profile,
  analytics,
  isLoading = false,
}: ProfileInfoProps) {
  // No profile or loading state
  if (!profile || isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-64" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  // Format user's name
  const displayName = formatProfileFullName(
    profile.firstName,
    profile.lastName,
    profile.username
  )

  // Calculate "Life in Movies" stat - based on total movies watched
  // Assuming average movie is ~2 hours
  const avgMovieHours = 2
  const totalHoursWatching = analytics
    ? analytics.totalMoviesWatched * avgMovieHours
    : 0
  const totalDaysWatching = Math.floor(totalHoursWatching / 24)

  return (
    <section className="space-y-6">
      {/* User Header Section */}
      <div className="space-y-4">
        {/* Username and Full Name */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-1">
            {displayName}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            @{profile.username}
          </p>
        </div>

        {/* Optional: User Bio */}
        {profile.bio && (
          <p className="text-base text-slate-700 dark:text-slate-300 max-w-2xl">
            {profile.bio}
          </p>
        )}

        {/* Optional: Additional Profile Info */}
        {(profile.location || profile.joinDate) && (
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
            {profile.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{profile.location}</span>
              </div>
            )}
            {profile.joinDate && (
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>
                  Joined{' '}
                  {profile.joinDate.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Life in Movies Stats Grid */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Hours / Days Stat */}
          <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 transition-all hover:border-slate-300 dark:hover:border-white/20">
            <p className="text-xs font-light text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-3">
              Life in Movies
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Hours
                </p>
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {totalHoursWatching.toLocaleString()}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Equivalent to
                </p>
                <p className="text-2xl font-semibold text-indigo-500 dark:text-indigo-300">
                  {totalDaysWatching} days
                </p>
              </div>
            </div>
          </div>

          {/* Account Info Stat */}
          <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-6 transition-all hover:border-slate-300 dark:hover:border-white/20">
            <p className="text-xs font-light text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-3">
              Account Information
            </p>
            <div className="space-y-3">
              {profile.pronoun && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Pronouns
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {profile.pronoun}
                  </p>
                </div>
              )}
              {profile.email && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 break-all">
                    {profile.email}
                  </p>
                </div>
              )}
              {profile.website && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Website
                  </p>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

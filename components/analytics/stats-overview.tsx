"use client";

import type { AnalyticsOverview, UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "../ui/separator";

// ============================================================================
// STAT CARD COMPONENT - PROFESSIONAL DESIGN
// ============================================================================

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  variant?: "default" | "success" | "warning" | "primary";
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  variant = "default",
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-background dark:bg-slate-900/50 p-5 text-center space-y-3">
        <Skeleton className="h-3 w-20 mx-auto" />
        <Skeleton className="h-10 w-24 mx-auto" />
        <Skeleton className="h-3 w-32 mx-auto" />
      </div>
    );
  }

  const variantStyles = {
    default: {
      value: "text-slate-900 dark:text-white",
      title: "text-slate-500 dark:text-slate-500",
      description: "text-slate-600 dark:text-slate-400",
      bg: "bg-background dark:bg-slate-900/50",
      border: "border-slate-200 dark:border-white/10",
    },
    success: {
      value: "text-emerald-600 dark:text-emerald-400",
      title: "text-slate-500 dark:text-slate-500",
      description: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-background dark:bg-slate-900/50",
      border: "border-slate-200 dark:border-white/10",
    },
    warning: {
      value: "text-amber-600 dark:text-amber-400",
      title: "text-slate-500 dark:text-slate-500",
      description: "text-amber-600 dark:text-amber-400",
      bg: "bg-background dark:bg-slate-900/50",
      border: "border-slate-200 dark:border-white/10",
    },
    primary: {
      value: "text-indigo-600 dark:text-indigo-400",
      title: "text-slate-500 dark:text-slate-500",
      description: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-background dark:bg-slate-900/50",
      border: "border-slate-200 dark:border-white/10",
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="text-center flex-shrink-0">
      <div className={`text-4xl font-bold ${style.value}`}>{value}</div>
      <p
        className={`text-xs font-light ${style.title} uppercase tracking-widest mb-1`}
      >
        {title}
      </p>
    </div>
  );
}

// ============================================================================
// STATS OVERVIEW COMPONENT
// ============================================================================

interface StatsOverviewProps {
  analytics: AnalyticsOverview | null;
  profile?: UserProfile | null;
  isLoading?: boolean;
}

export function StatsOverview({
  analytics,
  profile,
  isLoading = false,
}: StatsOverviewProps) {
  if (isLoading || !analytics) {
    return (
      <section className="space-y-6">
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
    );
  }

  // Format user's name for display
  const firstName = profile?.firstName;
  const lastName = profile?.lastName;
  const username = profile?.username;

  // Create display name with possessive form
  const displayName = firstName && lastName
    ? `${firstName} ${lastName}'s all-time stats`
    : username
    ? `${username}'s all-time stats`
    : null;

  return (
    <section className="space-y-16">
      {/* Profile Header Section */}
      {profile && (
        <div className="space-y-8 text-center mt-16 mb-8">
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
              Cinematic Identity
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              {displayName}
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 font-light">
              @{profile.username}
            </p>

            {profile.bio && (
              <p className="text-sm text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto">
                {profile.bio}
              </p>
            )}
          </div>

          <Separator className="my-12 max-w-md mx-auto" />
        </div>
      )}

      {/* Stats Grid - Single Row with 6 cards */}
      <div className="flex flex-wrap gap-12 justify-center pb-8">
        {/* Total Movies Watched */}
        <StatCard
          title="Total Movies"
          value={analytics.totalMoviesWatched.toLocaleString()}
          variant="primary"
        />

        {/* Movies Rated */}
        <StatCard
          title="Movies Rated"
          value={`${analytics.moviesRated}`}
          variant={analytics.ratingCoverage >= 75 ? "success" : "default"}
        />

        {/* Average Rating */}
        <StatCard
          title="Average Rating"
          value={`${analytics.averageRating.toFixed(2)}`}
          variant="primary"
        />

        {/* Favorite Movies */}
        <StatCard
          title="Favorite Movies"
          value={`${analytics.moviesLiked}`}
          variant={analytics.likeRatio >= 50 ? "success" : "default"}
        />

        {/* Hours Watched - Coming Soon */}
        <div className="text-center flex-shrink-0">
          <span className="inline-block px-2 mb-4 py-1 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 rounded">
            Coming Soon
          </span>
          <p className="text-xs font-light text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4">
            Hours Watched
          </p>
        </div>

        {/* Countries - Coming Soon */}
        <div className="text-center flex-shrink-0">
          <span className="inline-block px-2 mb-4 py-1 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 rounded">
            Coming Soon
          </span>
          <p className="text-xs font-light text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4">
            Countries
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { StatCard };

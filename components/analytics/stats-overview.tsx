"use client";

import type { AnalyticsOverview, UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatProfileFullName } from "@/lib/utils";
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
  description,
  variant = "default",
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 p-5 text-center space-y-3">
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
      bg: "bg-white dark:bg-slate-900/50",
      border: "border-slate-200 dark:border-white/10",
    },
    success: {
      value: "text-emerald-600 dark:text-emerald-400",
      title: "text-slate-500 dark:text-slate-500",
      description: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-white dark:bg-slate-900/50",
      border: "border-slate-200 dark:border-white/10",
    },
    warning: {
      value: "text-amber-600 dark:text-amber-400",
      title: "text-slate-500 dark:text-slate-500",
      description: "text-amber-600 dark:text-amber-400",
      bg: "bg-white dark:bg-slate-900/50",
      border: "border-slate-200 dark:border-white/10",
    },
    primary: {
      value: "text-indigo-600 dark:text-indigo-400",
      title: "text-slate-500 dark:text-slate-500",
      description: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-white dark:bg-slate-900/50",
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

  // Format user's name
  const displayName = profile
    ? formatProfileFullName(
        profile.firstName,
        profile.lastName,
        profile.username
      )
    : null;

  return (
    <section className="space-y-8">
      {/* Profile Header Section */}
      {profile && (
        <div className="space-y-4 text-center mt-8">
       
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white pt-4">
            <span className="font-light">Cinematic Identity of</span> @{profile.username}
          </h1>
      
          <h2 className="text-lg font-light text-slate-900 dark:text-white">
            {displayName}'s Stats
          </h2>

          <Separator className="my-6" />
        </div>
      )}

      {/* Stats Grid - Single Row */}
      <div className="flex flex-wrap gap-8 justify-center">
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

        {/* Movies Liked */}
        <StatCard
          title="Favorite Movies"
          value={`${analytics.moviesLiked}`}
          variant={analytics.likeRatio >= 50 ? "success" : "default"}
        />

        {/* Countries - Coming Soon */}
        <div className="text-center flex-shrink-0">
          <span className="inline-block px-2 mb-4 py-1 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 rounded">
            Coming Soon
          </span>
          <p className="text-xs font-light text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4">
            Countries
          </p>
        </div>

        {/* Earliest Entry Date */}
        {analytics.earliestWatchDate &&
          (() => {
            const date = new Date(analytics.earliestWatchDate);
            const month = date.toLocaleDateString("en-US", { month: "short" });
            const year = date.getFullYear();

            return (
              <div className="text-center flex-shrink-0">
                <div className="text-indigo-600 dark:text-indigo-400 leading-tight">
                  <div className="text-xl md:text-2xl font-bold">
                    <span className="font-normal">{month}</span> {year}
                  </div>
                </div>
                <p className="text-xs font-light text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-2">
                  Earliest Entry
                </p>
              </div>
            );
          })()}
      </div>
    </section>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { StatCard };

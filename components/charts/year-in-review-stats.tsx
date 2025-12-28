"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface YearInReviewStatsProps {
  stats?: {
    totalWatched?: number
    avgRating?: number
    totalRewatches?: number
    totalLiked?: number
    monthlyAverage?: number
    busiestMonth?: string
    busiestMonthCount?: number
  }
}

interface StatItemProps {
  label: string
  value: string | number
  description?: string
}

function StatItem({ label, value, description }: StatItemProps) {
  return (
    <div className="flex flex-col gap-0.5 text-center">
      <span className="text-xs text-slate-500 dark:text-white/50 font-medium uppercase">
        {label}
      </span>
      <span className="text-2xl font-bold text-black dark:text-white">
        {value}
      </span>
      {description && (
        <span className="text-xs text-slate-600 dark:text-white/60">
          {description}
        </span>
      )}
    </div>
  )
}

export function YearInReviewStats({ stats }: YearInReviewStatsProps) {
  if (!stats) {
    return null
  }

  // Calculate derived stats
  const uniqueFilms = (stats.totalWatched ?? 0) - (stats.totalRewatches ?? 0)
  const rewatchRate = stats.totalWatched && stats.totalWatched > 0
    ? ((stats.totalRewatches ?? 0) / stats.totalWatched * 100).toFixed(1)
    : 0
  const likeRate = stats.totalWatched && stats.totalWatched > 0
    ? ((stats.totalLiked ?? 0) / stats.totalWatched * 100).toFixed(1)
    : 0

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">
          2025 Quick Stats
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-white/60">
          Your viewing year at a glance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {/* Main Stats */}
        <div className="flex flex-row flex-wrap justify-center gap-6 sm:gap-8 mb-6">
          <StatItem
            label="Total Watched"
            value={stats.totalWatched ?? 0}
            description="movies this year"
          />
          <StatItem
            label="Average Rating"
            value={(stats.avgRating ?? 0).toFixed(1)}
            description="out of 5 stars"
          />
          <StatItem
            label="Monthly Average"
            value={(stats.monthlyAverage ?? 0).toFixed(1)}
            description="movies per month"
          />
          {stats.busiestMonth && (
            <StatItem
              label="Busiest Month"
              value={stats.busiestMonthCount ?? 0}
              description={stats.busiestMonth}
            />
          )}
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-200 dark:bg-white/10 my-6" />

        {/* Breakdown Stats */}
        <div className="flex flex-row flex-wrap justify-center gap-6 sm:gap-8">
          <StatItem
            label="New Films"
            value={uniqueFilms}
            description="first-time watches"
          />
          <StatItem
            label="Rewatches"
            value={stats.totalRewatches ?? 0}
            description={`${rewatchRate}% of total`}
          />
          <StatItem
            label="Liked"
            value={stats.totalLiked ?? 0}
            description={`${likeRate}% of watched`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

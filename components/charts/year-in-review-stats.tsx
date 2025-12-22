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
    <div className="flex flex-col gap-1">
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

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">
          2025 Quick Stats
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-white/60">
          Your viewing year at a glance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row flex-wrap justify-between gap-6 sm:gap-8">
          <StatItem
            label="Total Watched"
            value={stats.totalWatched ?? 0}
            description="movies this year"
          />
          <StatItem
            label="Average Rating"
            value={(stats.avgRating ?? 0).toFixed(1)}
            description="rating (out of 5)"
          />
          <StatItem
            label="Rewatches"
            value={stats.totalRewatches ?? 0}
            description="movies rewatched"
          />
          <StatItem
            label="Liked"
            value={stats.totalLiked ?? 0}
            description="movies added to likes"
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
      </CardContent>
    </Card>
  )
}

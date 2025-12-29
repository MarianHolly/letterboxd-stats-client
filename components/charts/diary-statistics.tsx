/*

Diary Statistics Component for Analytics Page
- Displays text-based statistics about user's watching habits
- Shows key metrics: total diary entries, average movies per month, busiest month, etc.
- Grid layout for organized display
- Dark mode support
- Responsive design for mobile and desktop

Usage:
  <DiaryStatistics stats={diaryStats} />

Data format:
  Object with statistics:
  - totalEntries: number (total diary entries)
  - averagePerMonth: number
  - busiestMonth: string (month with most entries)
  - busiestMonthCount: number
  - quietestMonth: string (month with least entries)
  - quietestMonthCount: number
  - dateRange: string (e.g., "Jan 2020 - Nov 2024")

Example:
  {
    totalEntries: 156,
    averagePerMonth: 3.2,
    busiestMonth: "October 2023",
    busiestMonthCount: 12,
    quietestMonth: "February 2021",
    quietestMonthCount: 1,
    dateRange: "Jan 2020 - Nov 2024"
  }

*/

"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DiaryStatisticsProps {
  stats?: {
    totalUniqueMovies?: number;
    totalViewingEvents?: number;
    averagePerMonth?: number;
    busiestMonth?: string;
    busiestMonthCount?: number;
    quietestMonth?: string;
    quietestMonthCount?: number;
    dateRange?: string;
  };
}

interface StatItemProps {
  value: string | number;
  description: string;
}

function StatItem({ value, description }: StatItemProps) {
  return (
    <div className="flex flex-col gap-2 text-center">
      <span className="text-4xl font-bold text-black dark:text-white tabular-nums">
        {value}
      </span>
      <span className="text-sm text-slate-500 dark:text-white/50">
        {description}
      </span>
    </div>
  )
}

export function DiaryStatistics({ stats }: DiaryStatisticsProps) {
  if (!stats) {
    return (
      <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">
            Your Statistics
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-white/60">
            Key metrics about your watching habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-slate-500 dark:text-white/50">
            No statistics available. Upload your diary data to see your stats.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
          <StatItem
            value={stats.totalUniqueMovies ?? 0}
            description="Unique Movies"
          />
          <StatItem
            value={stats.totalViewingEvents ?? 0}
            description="Total Viewings"
          />
          <StatItem
            value={stats.averagePerMonth ?? 0}
            description="Average per Month"
          />
          <StatItem
            value={stats.busiestMonthCount ?? 0}
            description={`Busiest (${stats.busiestMonth})`}
          />
          <StatItem
            value={stats.quietestMonthCount ?? 0}
            description={`Quietest (${stats.quietestMonth})`}
          />
        </div>

        {stats.dateRange && (
          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 text-center">
            <span className="text-xs text-slate-500 dark:text-white/50 font-medium uppercase tracking-wider block mb-2">
              Date Range
            </span>
            <p className="text-sm text-black dark:text-white font-medium">
              {stats.dateRange}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  Card,
} from "@/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

interface WatchedVsWatchlistRadialProps {
  data: {
    watched: number
    watchlist: number
  }
}

interface StatItemProps {
  value: string | number
  description: string
  color?: string
}

function StatItem({ value, description, color }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1 lg:gap-1.5 text-center">
      <span
        className="text-2xl md:text-2xl lg:text-3xl font-bold tabular-nums"
        style={color ? { color } : undefined}
      >
        {value}
      </span>
      <span className="text-xs text-slate-500 dark:text-white/50 font-medium">
        {description}
      </span>
    </div>
  )
}

const chartConfig = {
  watched: {
    label: "Watched",
    color: "#1e40af", // Deep blue
  },
  watchlist: {
    label: "Watchlist",
    color: "#6d28d9", // Deep violet
  },
} satisfies ChartConfig

export function WatchedVsWatchlistRadial({ data }: WatchedVsWatchlistRadialProps) {
  const total = data.watched + data.watchlist
  const watchedPercentage = total > 0 ? Math.round((data.watched / total) * 100) : 0

  // Chart data for radial bar
  const chartData = [
    {
      percentage: watchedPercentage,
      fill: "var(--color-watched)",
    },
  ]

  // Calculate end angle based on percentage (0-360 degrees)
  const endAngle = (watchedPercentage / 100) * 360

  // Calculate watchlist-to-watched ratio
  const ratio = data.watched > 0 ? (data.watchlist / data.watched) : 0

  // Determine collector type
  let collectorType = "Focused Watcher"
  let collectorDescription = "You watch more than you plan"

  if (ratio > 2) {
    collectorType = "Grand Collector"
    collectorDescription = "Your watchlist is vast and ambitious"
  } else if (ratio > 1) {
    collectorType = "Ambitious Planner"
    collectorDescription = "You have big plans for movies to watch"
  } else if (ratio > 0.5) {
    collectorType = "Balanced Explorer"
    collectorDescription = "You maintain a healthy balance"
  }

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full p-4 md:p-5 lg:p-6">
      <div className="flex flex-col md:flex-row lg:flex-col items-center gap-4 md:gap-6 lg:gap-0">
        {/* LEFT: Radial Chart */}
        <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-[200px] md:w-[220px] lg:w-[280px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={endAngle}
              innerRadius={80}
              outerRadius={130}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar
                dataKey="percentage"
                background
                cornerRadius={10}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-black dark:fill-white text-3xl md:text-4xl font-bold"
                          >
                            {watchedPercentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-slate-500 dark:fill-white/50 text-sm"
                          >
                            Completed
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>

        {/* SEPARATOR - Vertical on tablet, Horizontal on mobile/desktop */}
        <div className="hidden md:block lg:hidden h-[220px] w-px bg-slate-200 dark:bg-white/10 flex-shrink-0" />
        <div className="md:hidden lg:block w-full h-px bg-slate-200 dark:bg-white/10 my-3 lg:my-4" />

        {/* RIGHT: Stats and Profile */}
        <div className="flex-1 flex flex-col justify-center md:justify-center lg:justify-between gap-2 w-full">
          {/* Statistics */}
          <div className="flex flex-row md:flex-row lg:flex-col gap-4 md:gap-6 lg:gap-8 justify-between md:justify-between lg:justify-start">
            <StatItem
              value={data.watched.toLocaleString()}
              description="Watched"
              color="#1e40af"
            />
            <StatItem
              value={data.watchlist.toLocaleString()}
              description="Watchlist"
              color="#6d28d9"
            />
            <StatItem
              value={total.toLocaleString()}
              description="Total Films"
            />
          </div>

          {/* Separator */}
          <div className="w-full h-px bg-slate-200 dark:bg-white/10 my-2 md:my-3 lg:my-6" />

          {/* Profile Section */}
          <div className="text-center lg:mt-auto">
            <span className="text-xs text-slate-500 dark:text-white/50 font-medium uppercase tracking-wider block mb-1.5">
              Your Profile
            </span>
            <p className="text-sm text-black dark:text-white font-medium">
              {collectorType}
            </p>
            <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">
              {collectorDescription}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

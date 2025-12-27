"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
    <div className="flex flex-col gap-2 text-center">
      <span
        className="text-4xl font-bold tabular-nums"
        style={color ? { color } : undefined}
      >
        {value}
      </span>
      <span className="text-sm text-slate-500 dark:text-white/50">
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
  const chartData = [{ watched: data.watched, watchlist: data.watchlist }]
  const total = data.watched + data.watchlist
  const watchedPercentage = total > 0 ? Math.round((data.watched / total) * 100) : 0

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
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-black dark:text-white text-center">
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-2">
        {/* Radial Chart */}
        <div className="mb-6 -mt-2">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[180px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={100}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 12}
                            className="fill-black dark:fill-white text-2xl font-bold"
                          >
                            {watchedPercentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 8}
                            className="fill-slate-500 dark:fill-white/50 text-xs"
                          >
                            Completed
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="watched"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-watched)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="watchlist"
                fill="var(--color-watchlist)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </div>

        {/* Statistics */}
        <div className="flex flex-col gap-8 px-2">
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

        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/10 text-center">
          <span className="text-xs text-slate-500 dark:text-white/50 font-medium uppercase tracking-wider block mb-2">
            Your Profile
          </span>
          <p className="text-sm text-black dark:text-white font-medium">
            {collectorType}
          </p>
          <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {collectorDescription}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

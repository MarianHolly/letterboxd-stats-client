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
import type { CanonProgress } from "@/lib/canon/types"
import { ALL_CANON_LISTS } from "@/lib/canon/lists"

interface CanonListCardProps {
  progress: CanonProgress
}

export function CanonListCard({ progress }: CanonListCardProps) {
  const isComplete = progress.completionPercentage === 100
  const barColor = isComplete ? "hsl(142, 76%, 36%)" : "hsl(221, 83%, 53%)" // Green if complete, blue otherwise

  const chartData = [
    {
      list: progress.listId,
      completion: progress.completionPercentage,
      fill: barColor,
    },
  ]

  const chartConfig = {
    completion: {
      label: "Completion",
      color: barColor,
    },
  } satisfies ChartConfig

  // Calculate end angle based on percentage (0-360 degrees)
  const endAngle = (progress.completionPercentage / 100) * 360

  // Get source URL from the list
  const listData = ALL_CANON_LISTS.find(l => l.id === progress.listId)
  const sourceUrl = listData?.sourceUrl || "#"

  const remaining = progress.totalMovies - progress.watchedCount
  const bottomText = remaining < 10
    ? `${remaining} movies remain!`
    : `${progress.watchedCount} of ${progress.totalMovies}`

  return (
    <Card className="border-none bg-transparent h-full p-0">
      {/* Mobile: Progress Bar Layout */}
      <div className="md:hidden flex flex-col p-2 gap-2 h-full justify-center">
        {/* Top Row: Title and Percentage */}
        <div className="flex justify-between items-baseline">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-light text-black dark:text-white hover:underline"
          >
            {progress.listTitle}
          </a>
          <span className="text-2xl font-bold text-black dark:text-white">
            {progress.completionPercentage.toFixed(1)}<span className="font-light ml-0.5">%</span>
          </span>
        </div>

        {/* Progress Bar with Gradient */}
        <div className="space-y-1.5">
          <div className="relative w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-600 to-violet-600"
              style={{
                width: `${progress.completionPercentage}%`,
              }}
            />
          </div>

          {/* Count below bar */}
          <div className="text-xs text-slate-500 dark:text-white/50 text-center">
            {bottomText}
          </div>
        </div>
      </div>

      {/* Desktop: Radial Chart Layout */}
      <div className="hidden md:flex flex-col items-center justify-center h-full p-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[280px] h-[280px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={endAngle}
            innerRadius={75}
            outerRadius={130}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[81, 69]}
            />
            <RadialBar
              dataKey="completion"
              background
              cornerRadius={10}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const remaining = progress.totalMovies - progress.watchedCount
                    const bottomText = remaining < 10
                      ? `${remaining} movies remain!`
                      : `${progress.watchedCount} of ${progress.totalMovies}`

                    return (
                      <g>
                        {/* Large percentage */}
                        <text
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 5}
                            className="fill-black dark:fill-white text-4xl font-bold"
                          >
                            {progress.completionPercentage.toFixed(1)}%
                          </tspan>
                        </text>

                        {/* Count or remaining text */}
                        <text
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 25}
                          textAnchor="middle"
                          className="fill-slate-500 dark:fill-white/50 text-sm"
                        >
                          {bottomText}
                        </text>
                      </g>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>

        {/* Title below chart */}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="-mt-12 text-center text-base font-light text-black dark:text-white hover:underline relative z-10"
        >
          {progress.listTitle}
        </a>
      </div>
    </Card>
  )
}

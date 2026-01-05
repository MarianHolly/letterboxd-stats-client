"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface TopRatedDecadesBarProps {
  data: Array<{
    decade: string
    avgRating: number
    totalRated: number
    fiveStars: number
    fourHalfStars: number
    fourStars: number
    hasEnoughData: boolean
  }>
}

type ViewMode = "average" | "fiveStars" | "fourHalfStars" | "fourStars"

const chartConfig = {
  avgRating: {
    label: "Average Rating",
    color: "#EFBF04", // Gold/yellow
  },
} satisfies ChartConfig

const viewConfig = {
  average: {
    label: "Average",
    dataKey: "avgRating" as const,
    yAxisLabel: "Avg Rating",
    domain: [0, 5] as [number, number],
    ticks: [0, 1, 2, 3, 4, 5],
    formatter: (value: number) => `${value}★`,
  },
  fiveStars: {
    label: "5★",
    dataKey: "fiveStars" as const,
    yAxisLabel: "Count",
    domain: undefined,
    ticks: undefined,
    formatter: (value: number) => value.toString(),
  },
  fourHalfStars: {
    label: "4.5★",
    dataKey: "fourHalfStars" as const,
    yAxisLabel: "Count",
    domain: undefined,
    ticks: undefined,
    formatter: (value: number) => value.toString(),
  },
  fourStars: {
    label: "4★",
    dataKey: "fourStars" as const,
    yAxisLabel: "Count",
    domain: undefined,
    ticks: undefined,
    formatter: (value: number) => value.toString(),
  },
}

export function TopRatedDecadesBar({ data }: TopRatedDecadesBarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("average")

  if (!data || data.length === 0) {
    return (
      <Card className="border border-border dark:border-border-light bg-card dark:bg-transparent">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Top-Rated Decades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Not enough data. Rate at least 10 movies per decade to see this chart.
          </p>
        </CardContent>
      </Card>
    )
  }

  const currentView = viewConfig[viewMode]

  // Filter data based on view mode
  // For average view, only show decades with 10+ movies
  // For count views, show all decades with any ratings
  const filteredData = viewMode === "average"
    ? data.filter(d => d.hasEnoughData)
    : data

  if (filteredData.length === 0) {
    return (
      <Card className="border border-border dark:border-border-light bg-card dark:bg-transparent">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Top-Rated Decades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Not enough data. Rate at least 10 movies per decade to see this chart.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Find the decade with highest value for current view
  const topDecade = filteredData.reduce((max, item) => {
    const maxValue = max[currentView.dataKey] as number
    const itemValue = item[currentView.dataKey] as number
    return itemValue > maxValue ? item : max
  }, filteredData[0])

  return (
    <Card className="border border-border dark:border-border-light bg-card dark:bg-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Top-Rated Decades</CardTitle>
          {topDecade && (
            <Badge
              variant="secondary"
              className="text-xs font-medium"
              style={{ backgroundColor: "#EFBF04", color: "black" }}
            >
              {topDecade.decade}: {viewMode === "average"
                ? `${topDecade.avgRating}★`
                : `${topDecade[currentView.dataKey]} movies`}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {viewMode === "average"
            ? "Average ratings by decade (minimum 10 films)"
            : "High-rated film count by decade"}
        </p>

        {/* View Toggle Buttons */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {(Object.keys(viewConfig) as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === mode
                  ? "bg-[#EFBF04] text-black"
                  : "bg-muted dark:bg-slate-800 text-muted-foreground dark:text-slate-300 hover:bg-input dark:hover:bg-slate-700"
              }`}
            >
              {viewConfig[mode].label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] md:h-[200px] lg:h-[280px] w-full">
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{ top: 20, left: 12, right: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="decade"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              domain={currentView.domain}
              ticks={currentView.ticks}
              label={{ value: currentView.yAxisLabel, angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-semibold">{data.decade}</div>
                      <div className="grid gap-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Avg Rating:</span>
                          <span className="font-medium" style={{ color: "#EFBF04" }}>
                            {data.avgRating}★
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Total Rated:</span>
                          <span className="font-medium">{data.totalRated}</span>
                        </div>
                        <div className="h-px bg-border my-1" />
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">5★:</span>
                          <span className="font-medium">{data.fiveStars}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">4.5★:</span>
                          <span className="font-medium">{data.fourHalfStars}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">4★:</span>
                          <span className="font-medium">{data.fourStars}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey={currentView.dataKey} fill="var(--color-avgRating)" radius={[8, 8, 0, 0]}>
              <LabelList
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={11}
                formatter={currentView.formatter}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

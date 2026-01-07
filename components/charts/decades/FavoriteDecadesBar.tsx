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
  type ChartConfig,
} from "@/components/ui/chart"

interface FavoriteDecadesBarProps {
  data: Array<{
    decade: string
    total: number
    liked: number
    percentage: number
  }>
}

type ViewMode = "count" | "comparison"

const chartConfig = {
  unliked: {
    label: "Unliked",
    color: "#e2e8f0", // Light gray
  },
  liked: {
    label: "Liked",
    color: "#9b1c31", // Deep red/maroon
  },
} satisfies ChartConfig

export function FavoriteDecadesBar({ data }: FavoriteDecadesBarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("count")

  if (!data || data.length === 0) {
    return null
  }

  // Transform data to include unliked count
  const chartData = data.map(item => ({
    ...item,
    unliked: item.total - item.liked
  }))

  // Find the decade with highest percentage (for comparison mode)
  // Find the decade with most likes (for count mode)
  const topDecade = viewMode === "count"
    ? data.reduce((max, item) => item.liked > max.liked ? item : max, data[0])
    : data.reduce((max, item) => item.percentage > max.percentage ? item : max, data[0])

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Favorite Decades</CardTitle>
          {topDecade && (
            <Badge
              variant="secondary"
              className="text-xs font-medium"
              style={{ backgroundColor: "#9b1c31", color: "white" }}
            >
              {topDecade.decade}: {viewMode === "count"
                ? `${topDecade.liked} liked`
                : `${topDecade.percentage}%`}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {viewMode === "count"
            ? "Total favorites by decade"
            : "Favorite rate by decade"}
        </p>

        {/* View Toggle Buttons */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => setViewMode("count")}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              viewMode === "count"
                ? "bg-[#9b1c31] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Count
          </button>
          <button
            onClick={() => setViewMode("comparison")}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              viewMode === "comparison"
                ? "bg-[#9b1c31] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Comparison
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] md:h-[200px] lg:h-[280px] w-full">
          <BarChart
            key={viewMode}
            accessibilityLayer
            data={chartData}
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
              label={{ value: "Movies", angle: -90, position: "insideLeft" }}
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
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-medium">{data.total}</span>
                        </div>
                        <div className="h-px bg-border my-1" />
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Liked:</span>
                          <span className="font-medium" style={{ color: "#9b1c31" }}>
                            {data.liked} ({data.percentage}%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Unliked:</span>
                          <span className="font-medium">{data.unliked}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            {viewMode === "count" ? (
              // Count mode: Just show liked movies with percentage labels
              <Bar key="liked-only" dataKey="liked" fill="#9b1c31" radius={[8, 8, 0, 0]}>
                <LabelList
                  position="top"
                  offset={8}
                  className="fill-foreground"
                  fontSize={11}
                  content={(props: any) => {
                    const { x, y, width, index } = props as { x: number; y: number; width: number; index: number }
                    const percentage = chartData[index]?.percentage
                    if (!percentage) return null
                    return (
                      <text
                        x={Number(x) + Number(width) / 2}
                        y={Number(y) - 8}
                        fill="currentColor"
                        textAnchor="middle"
                        fontSize={11}
                      >
                        {percentage}%
                      </text>
                    )
                  }}
                />
              </Bar>
            ) : (
              // Comparison mode: Stacked bars (unliked + liked)
              [
                <Bar key="unliked-stack" dataKey="unliked" stackId="a" fill="#e2e8f0" radius={[0, 0, 0, 0]} />,
                <Bar key="liked-stack" dataKey="liked" stackId="a" fill="#9b1c31" radius={[4, 4, 0, 0]}>
                  <LabelList
                    position="top"
                    offset={8}
                    className="fill-foreground"
                    fontSize={11}
                    content={(props: any) => {
                      const { x, y, width, index } = props as { x: number; y: number; width: number; index: number }
                      const percentage = chartData[index]?.percentage
                      if (!percentage) return null
                      return (
                        <text
                          x={Number(x) + Number(width) / 2}
                          y={Number(y) - 8}
                          fill="currentColor"
                          textAnchor="middle"
                          fontSize={11}
                        >
                          {percentage}%
                        </text>
                      )
                    }}
                  />
                </Bar>
              ]
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

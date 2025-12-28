"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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

interface YearByDecadeBarProps {
  decadeData: Array<{
    decade: string
    count: number
  }>
  fiveYearData: Array<{
    decade: string
    count: number
  }>
}

type ViewMode = "decade" | "fiveYear"

const chartConfig = {
  count: {
    label: "Films",
    color: "#ec4899", // Pink to match Year in Film theme
  },
} satisfies ChartConfig

export function YearByDecadeBar({ decadeData, fiveYearData }: YearByDecadeBarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("decade")

  const data = viewMode === "decade" ? decadeData : fiveYearData

  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Films by Decade</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No decade data available
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Films by Decade</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Release years of films watched this year
            </p>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("decade")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === "decade"
                  ? "bg-[#ec4899] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Decade
            </button>
            <button
              onClick={() => setViewMode("fiveYear")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === "fiveYear"
                  ? "bg-[#ec4899] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              5 Years
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
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
              label={{ value: "Films", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={(value) => `${value} films`} />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={11} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

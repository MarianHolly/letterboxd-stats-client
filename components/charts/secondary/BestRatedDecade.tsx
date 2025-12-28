"use client"

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

interface BestRatedDecadeProps {
  data: Array<{
    decade: string
    avgRating: number
    totalRated: number
    highlyRated: number
  }>
}

const chartConfig = {
  avgRating: {
    label: "Average Rating",
    color: "#EFBF04", // Gold/yellow
  },
} satisfies ChartConfig

export function BestRatedDecade({ data }: BestRatedDecadeProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Best Rated Decade</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Not enough data. Rate at least 10 movies per decade to see this chart.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Find the decade with highest average rating
  const topDecade = data.reduce((max, item) =>
    item.avgRating > max.avgRating ? item : max
  , data[0])

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Best Rated Decade</CardTitle>
          {topDecade && (
            <Badge
              variant="secondary"
              className="text-xs font-medium"
              style={{ backgroundColor: "#EFBF04", color: "black" }}
            >
              {topDecade.decade}: {topDecade.avgRating}★
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Only decades with 10+ rated movies
        </p>
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
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              label={{ value: "Avg Rating", angle: -90, position: "insideLeft" }}
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
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">4★+ Movies:</span>
                          <span className="font-medium">{data.highlyRated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey="avgRating" fill="var(--color-avgRating)" radius={[8, 8, 0, 0]}>
              <LabelList
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={11}
                formatter={(value: number) => `${value}★`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Legend with badges showing highly rated count */}
        <div className="mt-4 flex flex-wrap gap-2">
          {data.map((item) => (
            <Badge
              key={item.decade}
              variant="outline"
              className="text-xs"
            >
              {item.decade}: {item.highlyRated} movies 4★+
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Cell } from "recharts"
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

interface LikedMoviesRatingDistributionProps {
  data: Array<{
    rating: string
    count: number
    isNotRated?: boolean
  }>
}

const chartConfig = {
  count: {
    label: "Movies",
    color: "#9b1c31", // Deep red/maroon - like color
  },
  notRated: {
    label: "Not Rated",
    color: "#cbd5e1", // Light gray for unrated
  },
} satisfies ChartConfig

export function LikedMoviesRatingDistribution({ data }: LikedMoviesRatingDistributionProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Favorites Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Not enough data. Like and rate movies to see this chart.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Favorites Rating Distribution</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Rating distribution for favorited films
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
              dataKey="rating"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: "Rating", position: "insideBottomRight", offset: -8 }}
            />
            <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={(value) => `${value} liked movies`} />}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isNotRated ? "var(--color-notRated)" : "var(--color-count)"}
                />
              ))}
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={11} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

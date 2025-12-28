"use client"

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

interface RatingDistributionBarProps {
  data: Array<{
    rating: string
    count: number
  }>
}

const chartConfig = {
  count: {
    label: "Movies",
    color: "#EFBF04", // Gold/yellow - rating color
  },
} satisfies ChartConfig

export function RatingDistributionBar({ data }: RatingDistributionBarProps) {
  if (!data || data.length === 0) {
    return null
  }

  // Sort by rating value to ensure correct order (0.5, 1.0, 1.5, ... 5.0)
  const sortedData = [...data].sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating))

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Your Rating Distribution</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          How your ratings spread across the full scale
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={sortedData}
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
              content={<ChartTooltipContent hideLabel formatter={(value) => `${value} movies`} />}
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

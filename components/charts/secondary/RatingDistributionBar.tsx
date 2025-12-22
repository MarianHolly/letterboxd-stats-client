"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function RatingDistributionBar({ data }: RatingDistributionBarProps) {
  if (!data || data.length === 0) {
    return null
  }

  // Sort by rating value to ensure correct order (0.5, 1.0, 1.5, ... 5.0)
  const sortedData = [...data].sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating))

  return (
    <ChartContainer config={chartConfig} className="h-[320px] w-full">
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
        <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]}>
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={11} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

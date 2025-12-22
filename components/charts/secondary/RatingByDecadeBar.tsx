"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface RatingByDecadeBarProps {
  data: Array<{
    decade: string
    avgRating: number
    count: number
  }>
}

const chartConfig = {
  avgRating: {
    label: "Average Rating",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function RatingByDecadeBar({ data }: RatingByDecadeBarProps) {
  if (!data || data.length === 0) {
    return null
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 20, left: 12, right: 12, bottom: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="decade"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis domain={[0, 5]} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" formatter={(value) => `${value}★`} />}
        />
        <Bar dataKey="avgRating" fill="hsl(var(--chart-1))" radius={8}>
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

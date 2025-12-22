"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface LikesByDecadeBarProps {
  data: Array<{
    decade: string
    count: number
  }>
}

const chartConfig = {
  count: {
    label: "Likes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function LikesByDecadeBar({ data }: LikesByDecadeBarProps) {
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
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={8}>
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

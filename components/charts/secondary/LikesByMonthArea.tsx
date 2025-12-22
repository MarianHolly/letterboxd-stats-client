"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface LikesByMonthAreaProps {
  data: Array<{
    month: string
    count: number
  }>
}

const chartConfig = {
  count: {
    label: "Likes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function LikesByMonthArea({ data }: LikesByMonthAreaProps) {
  if (!data || data.length === 0) {
    return null
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="hsl(var(--chart-1))"
          fill="url(#colorCount)"
          isAnimationActive={true}
        />
      </AreaChart>
    </ChartContainer>
  )
}

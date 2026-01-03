"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface LikesOverTimeAreaProps {
  data: Array<{
    month: string
    liked: number
    unliked: number
  }>
}

const chartConfig = {
  liked: {
    label: "Liked",
    color: "hsl(var(--chart-1))",
  },
  unliked: {
    label: "Not Liked",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function LikesOverTimeArea({ data }: LikesOverTimeAreaProps) {
  if (!data || data.length === 0) {
    return null
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
        <defs>
          <linearGradient id="colorLiked" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorUnliked" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        <Area
          type="monotone"
          dataKey="liked"
          stroke="hsl(var(--chart-1))"
          fill="url(#colorLiked)"
          stackId="a"
          isAnimationActive={true}
        />
        <Area
          type="monotone"
          dataKey="unliked"
          stroke="hsl(var(--chart-3))"
          fill="url(#colorUnliked)"
          stackId="a"
          isAnimationActive={true}
        />
      </AreaChart>
    </ChartContainer>
  )
}

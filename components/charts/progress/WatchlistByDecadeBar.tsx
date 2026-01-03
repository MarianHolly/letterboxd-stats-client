"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface WatchlistByDecadeBarProps {
  data: Array<{
    decade: string
    watched: number
    watchlist: number
  }>
}

const chartConfig = {
  watched: {
    label: "Watched",
    color: "hsl(var(--chart-1))",
  },
  watchlist: {
    label: "Watchlist",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function WatchlistByDecadeBar({ data }: WatchlistByDecadeBarProps) {
  if (!data || data.length === 0) {
    return null
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, left: 12, right: 12, bottom: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="decade"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="watched" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="watchlist" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

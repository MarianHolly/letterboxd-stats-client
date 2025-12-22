"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface WatchedVsWatchlistBarProps {
  data: {
    watched: number
    watchlist: number
  }
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

export function WatchedVsWatchlistBar({ data }: WatchedVsWatchlistBarProps) {
  const chartData = [{ name: "Movies", watched: data.watched, watchlist: data.watchlist }]

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20, left: 12, right: 12, bottom: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="dashed" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="watched" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]}>
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Bar>
        <Bar dataKey="watchlist" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]}>
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

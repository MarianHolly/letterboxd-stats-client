"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TrendingUp, Film } from "lucide-react"

interface WatchedVsWatchlistRadialProps {
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
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function WatchedVsWatchlistRadial({ data }: WatchedVsWatchlistRadialProps) {
  const chartData = [{ watched: data.watched, watchlist: data.watchlist }]
  const total = data.watched + data.watchlist
  const watchedPercentage = total > 0 ? Math.round((data.watched / total) * 100) : 0

  // Calculate watchlist-to-watched ratio
  const ratio = data.watched > 0 ? (data.watchlist / data.watched).toFixed(1) : "0"

  // Determine collector type
  let collectorType = "balanced"
  let collectorColor = "text-blue-600 dark:text-blue-400"
  const numRatio = parseFloat(ratio)

  if (numRatio > 2) {
    collectorType = "very ambitious"
    collectorColor = "text-purple-600 dark:text-purple-400"
  } else if (numRatio > 1) {
    collectorType = "ambitious"
    collectorColor = "text-indigo-600 dark:text-indigo-400"
  } else if (numRatio < 0.5) {
    collectorType = "minimal"
    collectorColor = "text-green-600 dark:text-green-400"
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          Watched vs. Watchlist
        </CardTitle>
        <CardDescription>
          How your viewing compares to your plans
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground text-xs"
                        >
                          Total Films
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="watched"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-watched)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="watchlist"
              fill="var(--color-watchlist)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          <span className={collectorType}>
            You're a <span className={collectorColor}>{collectorType}</span> collector
          </span>
        </div>
        <div className="text-muted-foreground leading-none text-center">
          {data.watchlist} unwatched films ({watchedPercentage}% completed)
        </div>
      </CardFooter>
    </Card>
  )
}

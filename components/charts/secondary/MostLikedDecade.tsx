"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface MostLikedDecadeProps {
  data: Array<{
    decade: string
    total: number
    liked: number
    percentage: number
  }>
}

const chartConfig = {
  total: {
    label: "Total Watched",
    color: "#cbd5e1", // Light gray
  },
  liked: {
    label: "Liked",
    color: "#9b1c31", // Deep red/maroon
  },
} satisfies ChartConfig

export function MostLikedDecade({ data }: MostLikedDecadeProps) {
  if (!data || data.length === 0) {
    return null
  }

  // Find the decade with highest percentage
  const topDecade = data.reduce((max, item) =>
    item.percentage > max.percentage ? item : max
  , data[0])

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Most Liked Decade</CardTitle>
          {topDecade && (
            <Badge
              variant="secondary"
              className="text-xs font-medium"
              style={{ backgroundColor: "#9b1c31", color: "white" }}
            >
              {topDecade.decade}: {topDecade.percentage}%
            </Badge>
          )}
        </div>
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
              dataKey="decade"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              label={{ value: "Movies", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-semibold">{data.decade}</div>
                      <div className="grid gap-1 text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-medium">{data.total}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Liked:</span>
                          <span className="font-medium" style={{ color: "#9b1c31" }}>
                            {data.liked} ({data.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey="total" stackId="a" fill="var(--color-total)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="liked" stackId="a" fill="var(--color-liked)" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.decade === topDecade.decade ? "#9b1c31" : "var(--color-liked)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Legend with badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {data.map((item) => (
            <Badge
              key={item.decade}
              variant="outline"
              className="text-xs"
            >
              {item.decade}: {item.liked}/{item.total} ({item.percentage}%)
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

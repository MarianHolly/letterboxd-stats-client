"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

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
  type ChartConfig,
} from "@/components/ui/chart"
import { useCanonProgress } from "@/hooks/use-canon-progress"

export function CanonListsRadial() {
  const canonData = useCanonProgress()

  if (!canonData) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Canon Lists Progress</CardTitle>
          <CardDescription>Track your progress on famous movie lists</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-sm text-muted-foreground">
              Upload your data to see progress
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { lists, overallStats } = canonData

  // Prepare chart data - transform canon progress into chart format
  const chartData = lists.map((list, index) => ({
    name: list.listTitle,
    shortName: list.listTitle.length > 20
      ? list.listTitle.substring(0, 20) + '...'
      : list.listTitle,
    completion: list.completionPercentage,
    watched: list.watchedCount,
    total: list.totalMovies,
    fill: `var(--color-list-${index})`,
  }))

  // Generate chart config dynamically
  const chartConfig: ChartConfig = {
    completion: {
      label: "Completion",
    },
    ...lists.reduce((acc, list, index) => {
      acc[`list-${index}`] = {
        label: list.listTitle,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      }
      return acc
    }, {} as Record<string, { label: string; color: string }>)
  }

  // Find most improved list (you can customize this logic)
  const topList = lists[0]
  const improvementText = topList
    ? `${topList.listTitle} leading at ${topList.completionPercentage.toFixed(1)}%`
    : "Start watching to track progress"

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Canon Lists Progress</CardTitle>
        <CardDescription>
          Your completion across {overallStats.totalLists} famous movie lists
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={30}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="completion"
              background
              cornerRadius={10}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {overallStats.averageCompletion.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Average
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {improvementText} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {lists.map((list, index) => (
            <div key={list.listId} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
              />
              <span className="text-xs">
                {list.listTitle}: {list.watchedCount}/{list.totalMovies} ({list.completionPercentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

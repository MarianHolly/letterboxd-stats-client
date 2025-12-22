"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface YearRewatchesRatioProps {
  data: {
    rewatched: number
    firstWatch: number
  }
}

const chartConfig = {
  rewatched: {
    label: "Rewatched",
    color: "hsl(var(--chart-2))",
  },
  firstWatch: {
    label: "First Watch",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function YearRewatchesRatio({ data }: YearRewatchesRatioProps) {
  const chartData = [{ rewatched: data.rewatched, firstWatch: data.firstWatch }]
  const total = data.rewatched + data.firstWatch
  const rewatchedPercentage = total > 0 ? Math.round((data.rewatched / total) * 100) : 0

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[300px]"
    >
      <RadialBarChart
        data={chartData}
        endAngle={180}
        innerRadius={80}
        outerRadius={130}
      >
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
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
                      {rewatchedPercentage}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground text-xs"
                    >
                      Rewatched
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="rewatched"
          stackId="a"
          cornerRadius={5}
          fill="hsl(var(--chart-2))"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="firstWatch"
          fill="hsl(var(--chart-4))"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  )
}

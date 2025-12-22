"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface RatingVsUnratedRatioProps {
  data: {
    rated: number
    unrated: number
  }
}

const chartConfig = {
  rated: {
    label: "Rated",
    color: "hsl(var(--chart-1))",
  },
  unrated: {
    label: "Unrated",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function RatingVsUnratedRatio({ data }: RatingVsUnratedRatioProps) {
  const chartData = [{ rated: data.rated, unrated: data.unrated }]
  const total = data.rated + data.unrated
  const ratedPercentage = total > 0 ? Math.round((data.rated / total) * 100) : 0

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
                      {ratedPercentage}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground text-xs"
                    >
                      Rated
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="rated"
          stackId="a"
          cornerRadius={5}
          fill="hsl(var(--chart-1))"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="unrated"
          fill="hsl(var(--chart-3))"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  )
}

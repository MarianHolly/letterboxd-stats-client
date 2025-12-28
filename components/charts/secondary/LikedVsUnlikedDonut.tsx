"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface LikedVsUnlikedDonutProps {
  data: {
    liked: number
    unliked: number
  }
}

const chartConfig = {
  liked: {
    label: "Liked",
    color: "#9b1c31", // Deep red/maroon
  },
  unliked: {
    label: "Not Liked",
    color: "#cbd5e1", // Light gray
  },
} satisfies ChartConfig

export function LikedVsUnlikedDonut({ data }: LikedVsUnlikedDonutProps) {
  const chartData = [{ liked: data.liked, unliked: data.unliked }]
  const total = data.liked + data.unliked
  const likePercentage = total > 0 ? Math.round((data.liked / total) * 100) : 0

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
                      {likePercentage}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground text-xs"
                    >
                      Liked
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="liked"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-liked)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="unliked"
          fill="var(--color-unliked)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  )
}

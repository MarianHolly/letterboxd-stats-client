"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface LikedMoviesRadialProps {
  data: {
    watched: number
    liked: number
  }
}

interface StatItemProps {
  value: string | number
  description: string
  color?: string
}

function StatItem({ value, description, color }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1.5 text-center">
      <span
        className="text-3xl font-bold tabular-nums"
        style={color ? { color } : undefined}
      >
        {value}
      </span>
      <span className="text-xs text-slate-500 dark:text-white/50 font-medium">
        {description}
      </span>
    </div>
  )
}

const chartConfig = {
  liked: {
    label: "Liked",
    color: "#9b1c31", // Deep red/maroon
  },
  unliked: {
    label: "Unliked",
    color: "#cbd5e1", // Light gray
  },
} satisfies ChartConfig

export function LikedMoviesRadial({ data }: LikedMoviesRadialProps) {
  const { watched, liked } = data
  const unliked = watched - liked

  const chartData = [{ liked, unliked }]
  const likedPercentage = watched > 0 ? Math.round((liked / watched) * 100) : 0

  // Determine liker profile based on percentage liked
  let likerType = "Selective Enthusiast"
  let likerDescription = "You like movies selectively"

  if (likedPercentage >= 80) {
    likerType = "Cinema Lover"
    likerDescription = "You love most of what you watch"
  } else if (likedPercentage >= 50) {
    likerType = "Generous Fan"
    likerDescription = "You enjoy most movies you watch"
  } else if (likedPercentage >= 25) {
    likerType = "Discerning Viewer"
    likerDescription = "You reserve likes for special films"
  } else if (likedPercentage < 25) {
    likerType = "Rare Enthusiast"
    likerDescription = "Only exceptional films earn your like"
  }

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full">
      <div className="px-6 py-4 flex flex-row items-center gap-6">
          {/* LEFT: Donut Chart (Full Circle) */}
          <div className="flex-shrink-0">
            <ChartContainer
              config={chartConfig}
              className="aspect-square w-[240px]"
            >
              <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={450}
                innerRadius={60}
                outerRadius={110}
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
                              y={(viewBox.cy || 0) - 10}
                              className="fill-black dark:fill-white text-2xl font-bold"
                            >
                              {likedPercentage}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 8}
                              className="fill-slate-500 dark:fill-white/50 text-xs"
                            >
                              Liked
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
                {/* Background bar (unliked) - thinner */}
                <RadialBar
                  dataKey="unliked"
                  fill="var(--color-unliked)"
                  cornerRadius={3}
                  className="stroke-transparent stroke-1"
                  background={{ fill: 'transparent' }}
                />
                {/* Foreground bar (liked) - thicker and bolder */}
                <RadialBar
                  dataKey="liked"
                  cornerRadius={6}
                  fill="var(--color-liked)"
                  className="stroke-transparent stroke-[3px]"
                  barSize={35}
                />
              </RadialBarChart>
            </ChartContainer>
          </div>

          {/* SEPARATOR */}
          <div className="h-[240px] w-px bg-slate-200 dark:bg-white/10 flex-shrink-0" />

          {/* RIGHT: Stats and Profile */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            {/* Statistics */}
            <div className="flex flex-row gap-6">
              <StatItem
                value={liked.toLocaleString()}
                description="Liked"
                color="#9b1c31"
              />
              <StatItem
                value={unliked.toLocaleString()}
                description="Not Liked"
              />
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-slate-200 dark:bg-white/10" />

            {/* Profile Section */}
            <div className="text-left">
              <span className="text-xs text-slate-500 dark:text-white/50 font-medium uppercase tracking-wider block mb-1">
                Like Profile
              </span>
              <p className="text-sm text-black dark:text-white font-medium">
                {likerType}
              </p>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                {likerDescription}
              </p>
            </div>
          </div>
        </div>
    </Card>
  )
}

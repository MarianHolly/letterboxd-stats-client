"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface TastePreferenceStatsProps {
  data: {
    watched: number
    rated: number
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
  rated: {
    label: "Rated",
    color: "#EFBF04", // Gold/yellow
  },
  unrated: {
    label: "Unrated",
    color: "#cbd5e1", // Light gray
  },
} satisfies ChartConfig

export function TastePreferenceStats({ data }: TastePreferenceStatsProps) {
  const { watched, rated, liked } = data
  const unrated = watched - rated

  const chartData = [{ rated, unrated }]
  const ratedPercentage = watched > 0 ? Math.round((rated / watched) * 100) : 0
  const likedPercentage = watched > 0 ? Math.round((liked / watched) * 100) : 0

  // Determine rater profile based on percentage rated
  let raterType = "Selective Rater"
  let raterDescription = "You rate movies selectively"

  if (ratedPercentage >= 95) {
    raterType = "Meticulous Curator"
    raterDescription = "You meticulously rate almost everything"
  } else if (ratedPercentage >= 80) {
    raterType = "Thorough Evaluator"
    raterDescription = "You consistently rate what you watch"
  } else if (ratedPercentage >= 50) {
    raterType = "Active Rater"
    raterDescription = "You rate most of what you watch"
  } else if (ratedPercentage < 30) {
    raterType = "Minimalist Rater"
    raterDescription = "You rarely rate your films"
  }

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full">
      <CardHeader className="pb-6 pt-4">
        {/* Radial Chart in Header - Centered */}
        <div className="flex justify-center mb-2">
          <ChartContainer
            config={chartConfig}
            className="aspect-square w-[240px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={180}
              endAngle={0}
              innerRadius={75}
              outerRadius={120}
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
                            {ratedPercentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 8}
                            className="fill-slate-500 dark:fill-white/50 text-xs"
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
                fill="var(--color-rated)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="unrated"
                fill="var(--color-unrated)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Vertical Statistics */}
        <div className="flex flex-col gap-6 py-4 border-t border-slate-200 dark:border-white/10">
          <StatItem
            value={watched.toLocaleString()}
            description="Movies Watched"
          />
          <StatItem
            value={rated.toLocaleString()}
            description="Movies Rated"
            color="#EFBF04"
          />
          <StatItem
            value={liked.toLocaleString()}
            description="Movies Liked"
            color="#9b1c31"
          />
        </div>

        {/* Percentage Section */}
        <div className="pt-5 mt-2 border-t border-slate-200 dark:border-white/10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <span className="text-2xl font-bold" style={{ color: "#EFBF04" }}>
                {ratedPercentage}%
              </span>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                Rated
              </p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold" style={{ color: "#9b1c31" }}>
                {likedPercentage}%
              </span>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                Liked
              </p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="pt-5 mt-2 border-t border-slate-200 dark:border-white/10 text-center">
          <span className="text-xs text-slate-500 dark:text-white/50 font-medium uppercase tracking-wider block mb-2">
            Your Profile
          </span>
          <p className="text-sm text-black dark:text-white font-medium">
            {raterType}
          </p>
          <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {raterDescription}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

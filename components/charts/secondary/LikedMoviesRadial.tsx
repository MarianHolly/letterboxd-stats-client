"use client"

import { LabelList, Pie, PieChart } from "recharts"
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
    color: "#e2e8f0", // Light gray
  },
} satisfies ChartConfig

export function LikedMoviesRadial({ data }: LikedMoviesRadialProps) {
  const { watched, liked } = data
  const unliked = watched - liked

  const chartData = [
    { category: "liked", value: liked, fill: "var(--color-liked)" },
    { category: "unliked", value: unliked, fill: "var(--color-unliked)" },
  ]
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
      {/* Mobile/Tablet Title and Description */}
      <div className="lg:hidden px-6 pt-4 pb-2 text-center">
        <h3 className="text-base font-semibold">Your Like Behavior</h3>
        <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
          <span className="font-semibold">{likerType}</span> - {likerDescription}
        </p>
      </div>

      <div className="px-6 py-4 flex flex-col lg:flex-row items-center gap-6">
          {/* LEFT: Pie Chart */}
          <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
            <ChartContainer
              config={chartConfig}
              className="aspect-square w-full max-w-[220px] lg:w-[220px] [&_.recharts-text]:fill-background"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="value" hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={30}
                  outerRadius={95}
                  cornerRadius={6}
                  paddingAngle={2}
                >
                  <LabelList
                    dataKey="value"
                    stroke="none"
                    fontSize={14}
                    fontWeight={600}
                    fill="currentColor"
                    formatter={(value: number) => value.toLocaleString()}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          {/* MIDDLE: Tablet Stats (row layout) */}
          <div className="hidden md:flex lg:hidden flex-row gap-6">
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

          {/* SEPARATOR - Desktop only */}
          <div className="hidden lg:block h-[220px] w-px bg-slate-200 dark:bg-white/10 flex-shrink-0" />

          {/* RIGHT: Stats and Profile - Desktop only */}
          <div className="hidden lg:flex flex-1 flex-col justify-center items-center gap-2 w-full">
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
            <div className="w-full h-px bg-slate-200 dark:bg-white/10 mt-2" />

            {/* Profile Section */}
            <div className="text-center mt-2">
              <span className="text-xs text-slate-500 dark:text-white/50 font-medium uppercase tracking-wider block mb-1">
                Like Profile
              </span>
              <p className="text-sm text-black dark:text-white font-medium">
                {likerType}
              </p>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">
                {likerDescription}
              </p>
            </div>
          </div>
        </div>
    </Card>
  )
}

"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Cell } from "recharts"
import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ReleasedYearBarHorizontalProps {
  data: Array<{ decade: string; count: number }>;
}

const chartConfig = {
  count: {
    label: "Movies",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// Gradient color generation from cyan to magenta
const getDecadeColor = (index: number, total: number): string => {
  const progress = total > 1 ? index / (total - 1) : 0;

  // Cyan to Magenta gradient
  const hue = 180 + (120 * progress); // 180 (cyan) to 300 (magenta)
  const saturation = 85;
  const lightness = 45;

  return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
};

export function ReleasedYearBarHorizontal({ data }: ReleasedYearBarHorizontalProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  if (data.length === 0) {
    return (
      <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
        <CardHeader>
          <CardTitle>Release by Decade</CardTitle>
          <CardDescription>Movie count distribution across decades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-slate-500 dark:text-white/50">
            No decade data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader>
        <CardTitle>Release by Decade</CardTitle>
        <CardDescription>Movie count distribution across decades</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 60,
              right: 16,
              top: 12,
              bottom: 12,
            }}
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <CartesianGrid horizontal={false} stroke="rgba(0,0,0,0.1)" className="dark:stroke-white/10" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12, fill: "rgba(0,0,0,0.6)" }}
              className="dark:[&_text]:fill-white/70"
            />
            <YAxis
              dataKey="decade"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 12, fill: "rgba(0,0,0,0.6)" }}
              className="dark:[&_text]:fill-white/70"
              width={50}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.01)" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-count)"
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground dark:fill-white"
                fontSize={12}
              />
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getDecadeColor(index, data.length)}
                  fillOpacity={activeIndex === null ? 1 : activeIndex === index ? 1 : 0.6}
                  style={{ transition: "opacity 300ms ease-in-out" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

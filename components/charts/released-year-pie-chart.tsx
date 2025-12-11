"use client"

import { Pie, PieChart, Cell } from "recharts"
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

interface ReleasedYearPieChartProps {
  data: Array<{ era: string; count: number; fill: string }>;
}

const chartConfig = {
  count: {
    label: "Movies",
  },
} satisfies ChartConfig

export function ReleasedYearPieChart({ data }: ReleasedYearPieChartProps) {
  if (data.length === 0) {
    return (
      <Card className="flex flex-col border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
        <CardHeader className="items-center pb-0">
          <CardTitle>Release Era Distribution</CardTitle>
          <CardDescription>Movies by release era</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[250px] text-slate-500 dark:text-white/50">
            No era data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMovies = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex flex-col border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader className="items-center pb-0">
        <CardTitle>Release Era Distribution</CardTitle>
        <CardDescription>Movie count by release era</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground [&_.recharts-pie-label-text]:font-semibold [&_.recharts-pie-label-text]:text-xs mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }: any) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  const percentage = ((data.count / totalMovies) * 100).toFixed(1);
                  return (
                    <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-3.5 py-2 shadow-md">
                      <div className="text-xs text-center">
                        <p className="font-semibold text-black dark:text-white">{data.era}</p>
                        <p className="text-slate-600 dark:text-white/70">{data.count} movies</p>
                        <p className="text-slate-500 dark:text-white/60">{percentage}%</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="era"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ era, count, percent }) => `${era} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex-col gap-2 text-sm px-6 pb-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {data.map((item) => {
            const percentage = ((item.count / totalMovies) * 100).toFixed(1);
            return (
              <div key={item.era} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-xs text-slate-600 dark:text-white/70">
                  {item.era}: <span className="font-semibold text-black dark:text-white">{item.count}</span>
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}

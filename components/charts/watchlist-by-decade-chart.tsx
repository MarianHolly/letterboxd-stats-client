"use client";

import { Bar, BarChart, XAxis, YAxis, Cell, CartesianGrid } from "recharts";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface WatchlistByDecadeChartProps {
  data: Array<{
    decade: string;
    watched: number;
    watchlist: number;
  }>;
}

const chartConfig = {
  watched: {
    label: "Watched",
    color: "#1e40af", // Deep blue
  },
  watchlist: {
    label: "Watchlist",
    color: "#6d28d9", // Deep violet
  },
} satisfies ChartConfig;

export function WatchlistByDecadeChart({ data }: WatchlistByDecadeChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Calculate total watched and watchlist
  const totals = React.useMemo(() => {
    return data.reduce(
      (acc, item) => ({
        watched: acc.watched + item.watched,
        watchlist: acc.watchlist + item.watchlist,
      }),
      { watched: 0, watchlist: 0 }
    );
  }, [data]);

  const completionRate = totals.watched + totals.watchlist > 0
    ? Math.round((totals.watched / (totals.watched + totals.watchlist)) * 100)
    : 0;

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">
          Watched vs. Watchlist by Decade
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-white/60">
          Comparing your viewing history and future plans across film eras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            onMouseLeave={() => setActiveIndex(null)}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <rect
              x="0"
              y="0"
              width="100%"
              height="85%"
              fill="url(#watchlist-pattern-dots)"
            />
            <defs>
              <DottedBackgroundPattern />
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-slate-200 dark:stroke-white/10"
            />
            <XAxis
              dataKey="decade"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-slate-600 dark:text-white/60"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-slate-600 dark:text-white/60"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="watched" fill="var(--color-watched)" radius={4}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-watched-${index}`}
                  fillOpacity={
                    activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3
                  }
                  stroke={activeIndex === index ? "var(--color-watched)" : ""}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="duration-200"
                />
              ))}
            </Bar>
            <Bar dataKey="watchlist" fill="var(--color-watchlist)" radius={4}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-watchlist-${index}`}
                  fillOpacity={
                    activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3
                  }
                  stroke={activeIndex === index ? "var(--color-watchlist)" : ""}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Summary footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartConfig.watched.color }} />
                <span className="text-slate-600 dark:text-white/60">
                  {totals.watched.toLocaleString()} Watched
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartConfig.watchlist.color }} />
                <span className="text-slate-600 dark:text-white/60">
                  {totals.watchlist.toLocaleString()} Watchlist
                </span>
              </div>
            </div>
            <div className="text-slate-600 dark:text-white/60">
              {completionRate}% Completed
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const DottedBackgroundPattern = () => {
  return (
    <pattern
      id="watchlist-pattern-dots"
      x="0"
      y="0"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <circle
        className="dark:text-muted/40 text-muted"
        cx="2"
        cy="2"
        r="1"
        fill="currentColor"
      />
    </pattern>
  );
};

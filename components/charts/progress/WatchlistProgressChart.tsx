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

interface WatchlistProgressChartProps {
  decadeData: Array<{
    decade: string;
    watched: number;
    watchlist: number;
  }>;
  fiveYearData?: Array<{
    period: string;
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

export function WatchlistProgressChart({ decadeData, fiveYearData }: WatchlistProgressChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [viewMode, setViewMode] = React.useState<'decade' | 'fiveYear'>('decade');

  // Determine which data to use based on view mode
  const currentData = React.useMemo(() => {
    if (viewMode === 'fiveYear' && fiveYearData && fiveYearData.length > 0) {
      return fiveYearData.map(item => ({
        decade: item.period,
        watched: item.watched,
        watchlist: item.watchlist,
      }));
    }
    return decadeData;
  }, [viewMode, decadeData, fiveYearData]);

  // Calculate total watched and watchlist
  const totals = React.useMemo(() => {
    return currentData.reduce(
      (acc, item) => ({
        watched: acc.watched + item.watched,
        watchlist: acc.watchlist + item.watchlist,
      }),
      { watched: 0, watchlist: 0 }
    );
  }, [currentData]);

  const completionRate = totals.watched + totals.watchlist > 0
    ? Math.round((totals.watched / (totals.watched + totals.watchlist)) * 100)
    : 0;

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent h-full flex flex-col">
      {/* Fixed Height Header */}
      <CardHeader className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-black dark:text-white">
              Viewing Progress by {viewMode === 'decade' ? 'Decade' : '5-Year Period'}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-white/60">
              Completed viewings vs. planned watches by era
            </CardDescription>
          </div>

          {/* Toggle Button */}
          {fiveYearData && fiveYearData.length > 0 && (
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-lg">
              <button
                onClick={() => setViewMode('decade')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  viewMode === 'decade'
                    ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-white/60 hover:text-black dark:hover:text-white'
                }`}
              >
                Decade
              </button>
              <button
                onClick={() => setViewMode('fiveYear')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  viewMode === 'fiveYear'
                    ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-white/60 hover:text-black dark:hover:text-white'
                }`}
              >
                5-Year
              </button>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Flexible Content Area */}
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Responsive Chart Container - Fills Available Space */}
        <ChartContainer config={chartConfig} className="flex-1 w-full min-h-0">
          <BarChart
            accessibilityLayer
            data={currentData}
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
              {currentData.map((_, index) => (
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
              {currentData.map((_, index) => (
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

        {/* Fixed Height Footer - Stays at Bottom */}
        <div className="flex-shrink-0 mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-sm">
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: chartConfig.watched.color }} />
                <span className="text-slate-600 dark:text-white/60">
                  {totals.watched.toLocaleString()} Watched
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: chartConfig.watchlist.color }} />
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

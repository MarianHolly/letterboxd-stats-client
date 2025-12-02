"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
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

interface ReleaseYearAnalysisProps {
  data: Record<string, number>;
}

type DecadeFilter = "1960-1964" | "1965-1969" | "all";

const ERA_BOUNDARIES = {
  EARLY: { min: 1960, max: 1964, label: "1960-1964" },
  LATE: { min: 1965, max: 1969, label: "1965-1969" },
  ALL: { min: 1960, max: 1969, label: "All 1960s" },
} as const;

const chartConfig = {
  count: {
    label: "Movies",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ReleasedYearAnalysisUpgradeV3({ data }: ReleaseYearAnalysisProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [decadeFilter, setDecadeFilter] = React.useState<DecadeFilter>("all");

  // Filter data based on decade filter
  const { processedData, decadeTotals } = React.useMemo(() => {
    const fullData = [];
    for (let year = 1960; year <= 1969; year++) {
      const yearStr = String(year);
      const count = data[yearStr] || 0;
      fullData.push({
        year: yearStr,
        count: count,
      });
    }

    // Calculate totals for each filter
    const earlyTotal = fullData
      .filter(d => parseInt(d.year) >= ERA_BOUNDARIES.EARLY.min && parseInt(d.year) <= ERA_BOUNDARIES.EARLY.max)
      .reduce((sum, d) => sum + d.count, 0);

    const lateTotal = fullData
      .filter(d => parseInt(d.year) >= ERA_BOUNDARIES.LATE.min && parseInt(d.year) <= ERA_BOUNDARIES.LATE.max)
      .reduce((sum, d) => sum + d.count, 0);

    const allTotal = fullData.reduce((sum, d) => sum + d.count, 0);

    // Filter data based on selected decade
    let filtered = fullData;
    if (decadeFilter === "1960-1964") {
      filtered = fullData.filter(d => parseInt(d.year) >= ERA_BOUNDARIES.EARLY.min && parseInt(d.year) <= ERA_BOUNDARIES.EARLY.max);
    } else if (decadeFilter === "1965-1969") {
      filtered = fullData.filter(d => parseInt(d.year) >= ERA_BOUNDARIES.LATE.min && parseInt(d.year) <= ERA_BOUNDARIES.LATE.max);
    }

    return {
      processedData: filtered,
      decadeTotals: {
        early: earlyTotal,
        late: lateTotal,
        all: allTotal,
      },
    };
  }, [data, decadeFilter]);

  const activeData = React.useMemo(() => {
    if (activeIndex === null) return null;
    return processedData[activeIndex];
  }, [activeIndex, processedData]);

  const totalMovies = React.useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.count, 0);
  }, [processedData]);

  return (
    <Card className="py-0 border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader className="flex flex-col items-stretch border-b border-slate-200 dark:border-white/10 !p-0 md:flex-row">
        {/* Title Section */}
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 md:!py-0">
          <CardTitle className="text-black dark:text-white">
            1960s Movies
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-white/60">
            {activeData
              ? `${activeData.year}: ${activeData.count} movie${activeData.count !== 1 ? 's' : ''}`
              : `Total: ${totalMovies} movies from the 1960s`}
          </CardDescription>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap" role="tablist" aria-label="Select decade range">
          {[
            { key: "1960-1964" as DecadeFilter, label: "1960-1964", count: decadeTotals.early },
            { key: "1965-1969" as DecadeFilter, label: "1965-1969", count: decadeTotals.late },
            { key: "all" as DecadeFilter, label: "All 1960s", count: decadeTotals.all },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              role="tab"
              aria-selected={decadeFilter === key}
              data-active={decadeFilter === key}
              onClick={() => setDecadeFilter(key)}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-slate-200 dark:border-white/10 px-6 py-4 text-left md:border-t-0 md:border-l md:px-8 md:py-6
                data-[active=true]:bg-slate-50 dark:data-[active=true]:bg-white/5
                hover:bg-slate-50 dark:hover:bg-white/[0.02]
                transition-colors"
            >
              <span className="text-xs text-slate-500 dark:text-white/50">
                {label}
              </span>
              <span className="text-lg leading-none font-bold md:text-2xl text-black dark:text-white">
                {count}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 md:p-6 pt-6">
        {processedData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-slate-500 dark:text-white/50">
            No data available for {decadeFilter === "all" ? "the 1960s" : `${decadeFilter}`}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={processedData}
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <rect
              x="0"
              y="0"
              width="100%"
              height="85%"
              fill="url(#highlighted-pattern-dots)"
            />
            <defs>
              <DottedBackgroundPattern />
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.1)" className="dark:stroke-white/10" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12, fill: "rgba(0,0,0,0.6)" }}
              className="dark:[&_text]:fill-white/70"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12, fill: "rgba(0,0,0,0.6)" }}
              className="dark:[&_text]:fill-white/70"
            />
            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.01)" }}
              content={
                <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-3.5 py-2 shadow-md">
                  {activeData && (
                    <div className="text-xs text-center">
                      <p className="font-light text-black dark:text-white">Year of {activeData.year}</p>
                      <p className="text-slate-600 dark:text-white/70 font-semibold">{activeData.count} movies</p>
                    </div>
                  )}
                </div>
              }
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]} fill="var(--color-count)" isAnimationActive={false}>
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count > 0 ? "var(--color-count)" : "transparent"}
                  fillOpacity={activeIndex === null ? 1 : activeIndex === index ? 1 : 0.7}
                  style={{ transition: "opacity 300ms ease-in-out" }}
                />
              ))}
            </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

const DottedBackgroundPattern = () => {
  return (
    <pattern
      id="highlighted-pattern-dots"
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

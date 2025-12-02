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

type EraFilter = "classic" | "golden" | "modern" | "contemporary" | "all";

const ERA_BOUNDARIES = {
  CLASSIC: {
    min: 1900,
    max: 1944,
    label: "Classic",
    description: "1900–1944",
  },
  GOLDEN: {
    min: 1945,
    max: 1969,
    label: "Golden",
    description: "1945–1969",
  },
  MODERN: {
    min: 1970,
    max: 1999,
    label: "Modern",
    description: "1970–1999",
  },
  CONTEMPORARY: {
    min: 2000,
    max: 2099,
    label: "Contemporary",
    description: "2000–",
  },
} as const;

const chartConfig = {
  count: {
    label: "Movies",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ReleasedYearAnalysisUpgradeV3({ data }: ReleaseYearAnalysisProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [eraFilter, setEraFilter] = React.useState<EraFilter>("all");

  // Process data by year with era filtering
  const { processedData, eraTotals, allData } = React.useMemo(() => {
    const entries = Object.entries(data)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);

    if (entries.length === 0) {
      return {
        processedData: [],
        eraTotals: {
          classic: 0,
          golden: 0,
          modern: 0,
          contemporary: 0,
          all: 0,
        },
        allData: entries,
      };
    }

    // Calculate totals for each era
    const classicTotal = entries
      .filter(e => e.year >= ERA_BOUNDARIES.CLASSIC.min && e.year <= ERA_BOUNDARIES.CLASSIC.max)
      .reduce((sum, e) => sum + e.count, 0);

    const goldenTotal = entries
      .filter(e => e.year >= ERA_BOUNDARIES.GOLDEN.min && e.year <= ERA_BOUNDARIES.GOLDEN.max)
      .reduce((sum, e) => sum + e.count, 0);

    const modernTotal = entries
      .filter(e => e.year >= ERA_BOUNDARIES.MODERN.min && e.year <= ERA_BOUNDARIES.MODERN.max)
      .reduce((sum, e) => sum + e.count, 0);

    const contemporaryTotal = entries
      .filter(e => e.year >= ERA_BOUNDARIES.CONTEMPORARY.min && e.year <= ERA_BOUNDARIES.CONTEMPORARY.max)
      .reduce((sum, e) => sum + e.count, 0);

    const allTotal = entries.reduce((sum, e) => sum + e.count, 0);

    // Filter data based on selected era - fill in missing years in range with 0
    let filtered = entries;
    let minYear = entries[0].year;
    let maxYear = entries[entries.length - 1].year;

    if (eraFilter === "classic") {
      minYear = ERA_BOUNDARIES.CLASSIC.min;
      maxYear = ERA_BOUNDARIES.CLASSIC.max;
      filtered = entries.filter(e => e.year >= ERA_BOUNDARIES.CLASSIC.min && e.year <= ERA_BOUNDARIES.CLASSIC.max);
    } else if (eraFilter === "golden") {
      minYear = ERA_BOUNDARIES.GOLDEN.min;
      maxYear = ERA_BOUNDARIES.GOLDEN.max;
      filtered = entries.filter(e => e.year >= ERA_BOUNDARIES.GOLDEN.min && e.year <= ERA_BOUNDARIES.GOLDEN.max);
    } else if (eraFilter === "modern") {
      minYear = ERA_BOUNDARIES.MODERN.min;
      maxYear = ERA_BOUNDARIES.MODERN.max;
      filtered = entries.filter(e => e.year >= ERA_BOUNDARIES.MODERN.min && e.year <= ERA_BOUNDARIES.MODERN.max);
    } else if (eraFilter === "contemporary") {
      minYear = ERA_BOUNDARIES.CONTEMPORARY.min;
      maxYear = Math.min(ERA_BOUNDARIES.CONTEMPORARY.max, maxYear);
      filtered = entries.filter(e => e.year >= ERA_BOUNDARIES.CONTEMPORARY.min && e.year <= ERA_BOUNDARIES.CONTEMPORARY.max);
    }

    // Fill in missing years with 0 count
    const filledData = [];
    for (let year = minYear; year <= maxYear; year++) {
      const existing = filtered.find(e => e.year === year);
      filledData.push({
        year: String(year),
        count: existing ? existing.count : 0,
      });
    }

    return {
      processedData: filledData,
      eraTotals: {
        classic: classicTotal,
        golden: goldenTotal,
        modern: modernTotal,
        contemporary: contemporaryTotal,
        all: allTotal,
      },
      allData: entries,
    };
  }, [data, eraFilter]);

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
            Release Year Analysis
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-white/60">
            Movies watched by release year with era categorization
          </CardDescription>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap" role="tablist" aria-label="Select era filter">
          {[
            { key: "classic" as EraFilter, label: "Classic", count: eraTotals.classic, description: ERA_BOUNDARIES.CLASSIC.description },
            { key: "golden" as EraFilter, label: "Golden", count: eraTotals.golden, description: ERA_BOUNDARIES.GOLDEN.description },
            { key: "modern" as EraFilter, label: "Modern", count: eraTotals.modern, description: ERA_BOUNDARIES.MODERN.description },
            { key: "contemporary" as EraFilter, label: "Contemporary", count: eraTotals.contemporary, description: ERA_BOUNDARIES.CONTEMPORARY.description },
            { key: "all" as EraFilter, label: "All Years", count: eraTotals.all, description: "Complete range" },
          ].map(({ key, label, count, description }) => (
            <button
              key={key}
              role="tab"
              aria-selected={eraFilter === key}
              data-active={eraFilter === key}
              onClick={() => setEraFilter(key)}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-slate-200 dark:border-white/10 px-6 py-4 text-left md:border-t-0 md:border-l md:px-8 md:py-6
                data-[active=true]:bg-slate-50 dark:data-[active=true]:bg-white/5
                hover:bg-slate-50 dark:hover:bg-white/[0.02]
                transition-colors"
            >
              <span className="text-xs text-slate-500 dark:text-white/50">
                {description}
              </span>
              <span className="text-lg leading-none font-bold md:text-2xl text-black dark:text-white">
                {count}
              </span>
              <span className="text-xs text-slate-600 dark:text-white/60">
                {label}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 md:p-6 pt-6">
        {processedData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-slate-500 dark:text-white/50">
            No data available for {eraFilter === "all" ? "this era" : `${eraFilter} films`}
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

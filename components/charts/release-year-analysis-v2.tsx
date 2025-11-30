/*

Released Year Analysis for Analytics Page
- Four-era breakdown: Classic (1900-1944), Golden (1945-1969), Modern (1970-1999), Contemporary (2000+)
- Interactive bar chart of movies watched by release year
- Segmented control tabs with era filtering and mini-bars for "All Years" view
- Color gradient within each era (dark to light progression by year)
- Hover over bars to show year and count
- Each bar colored individually using Cell components for proper rendering

*/

"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts"

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

interface ReleaseYearAnalysisProps {
  data: Record<string, number>;
}

type EraFilter = "classic" | "golden" | "modern" | "contemporary" | "all"

export const description = "An interactive bar chart of movies by release year with era categorization"

// ============================================================================
// ERA BOUNDARIES CONFIGURATION
// ============================================================================

const ERA_BOUNDARIES = {
  CLASSIC: {
    min: 1900,
    max: 1944,
    label: "Classic",
    description: "1900–1944"
  },
  GOLDEN: {
    min: 1945,
    max: 1969,
    label: "Golden",
    description: "1945–1969"
  },
  MODERN: {
    min: 1970,
    max: 1999,
    label: "Modern",
    description: "1970–1999"
  },
  CONTEMPORARY: {
    min: 2000,
    max: 2099,
    label: "Contemporary",
    description: "2000–"
  },
} as const;

// ============================================================================
// COLOR SCHEME (Subtle shades derived from blue-to-violet gradient)
// Each era has a single shade with subtle variations within the era
// ============================================================================

const eraColors = {
  classic: {
    // Blue shade - older films
    base: "hsl(240, 70%, 50%)",           // #3b82f6 (original blue)
    light: "hsl(240, 60%, 60%)",          // Lighter variation for newest in era
    dark: "hsl(240, 75%, 40%)",           // Darker variation for oldest in era
  },
  golden: {
    // Blue-purple shade - golden age
    base: "hsl(250, 70%, 50%)",           // Between blue and purple
    light: "hsl(250, 60%, 60%)",
    dark: "hsl(250, 75%, 40%)",
  },
  modern: {
    // Purple-violet shade - modern films
    base: "hsl(260, 70%, 50%)",           // Between purple and violet
    light: "hsl(260, 60%, 60%)",
    dark: "hsl(260, 75%, 40%)",
  },
  contemporary: {
    // Violet shade - contemporary films
    base: "hsl(270, 70%, 50%)",           // #c084fc (original violet)
    light: "hsl(270, 60%, 60%)",          // Lighter variation
    dark: "hsl(270, 75%, 40%)",           // Darker variation
  },
} as const;

// ============================================================================
// COLOR CALCULATION FUNCTIONS
// ============================================================================

/**
 * Determine which era a year belongs to
 */
function getEraForYear(year: number): keyof typeof ERA_BOUNDARIES | null {
  if (year >= ERA_BOUNDARIES.CLASSIC.min && year <= ERA_BOUNDARIES.CLASSIC.max) return "CLASSIC";
  if (year >= ERA_BOUNDARIES.GOLDEN.min && year <= ERA_BOUNDARIES.GOLDEN.max) return "GOLDEN";
  if (year >= ERA_BOUNDARIES.MODERN.min && year <= ERA_BOUNDARIES.MODERN.max) return "MODERN";
  if (year >= ERA_BOUNDARIES.CONTEMPORARY.min && year <= ERA_BOUNDARIES.CONTEMPORARY.max) return "CONTEMPORARY";
  return null;
}

/**
 * Calculate subtle gradient color for a year within its era
 * Progresses from dark (oldest in era) to light (newest in era)
 * Maintains overall blue-to-violet theme across all eras
 */
const getYearColor = (year: number): string => {
  const eraKey = getEraForYear(year);

  if (!eraKey) {
    // Fallback for years outside defined ranges
    return "#94a3b8"; // neutral gray
  }

  const era = ERA_BOUNDARIES[eraKey];
  const eraColor = eraColors[eraKey.toLowerCase() as keyof typeof eraColors];

  // Calculate progress within this era (0 = oldest year, 1 = newest year)
  const progress = (year - era.min) / (era.max - era.min);

  // For years at the start of era, use darker shade; at end, use lighter shade
  if (progress < 0.5) {
    // First half: interpolate from dark to base
    const halfProgress = progress * 2; // 0 to 1 within first half
    const darkHSL = eraColor.dark.match(/\d+/g);
    const baseHSL = eraColor.base.match(/\d+/g);

    if (darkHSL && baseHSL) {
      const h = parseInt(darkHSL[0]) + (parseInt(baseHSL[0]) - parseInt(darkHSL[0])) * halfProgress;
      const s = parseInt(darkHSL[1]) + (parseInt(baseHSL[1]) - parseInt(darkHSL[1])) * halfProgress;
      const l = parseInt(darkHSL[2]) + (parseInt(baseHSL[2]) - parseInt(darkHSL[2])) * halfProgress;
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  } else {
    // Second half: interpolate from base to light
    const halfProgress = (progress - 0.5) * 2; // 0 to 1 within second half
    const baseHSL = eraColor.base.match(/\d+/g);
    const lightHSL = eraColor.light.match(/\d+/g);

    if (baseHSL && lightHSL) {
      const h = parseInt(baseHSL[0]) + (parseInt(lightHSL[0]) - parseInt(baseHSL[0])) * halfProgress;
      const s = parseInt(baseHSL[1]) + (parseInt(lightHSL[1]) - parseInt(baseHSL[1])) * halfProgress;
      const l = parseInt(baseHSL[2]) + (parseInt(lightHSL[2]) - parseInt(baseHSL[2])) * halfProgress;
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }

  // Fallback to base color
  return eraColor.base;
};

const chartConfig = {
  count: {
    label: "Movies",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ReleasedYearAnalysisUpgrade({ data }: ReleaseYearAnalysisProps) {
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

    // Filter data based on selected era
    let filtered = entries;
    if (eraFilter === "classic") {
      filtered = entries.filter(e => e.year >= ERA_BOUNDARIES.CLASSIC.min && e.year <= ERA_BOUNDARIES.CLASSIC.max);
    } else if (eraFilter === "golden") {
      filtered = entries.filter(e => e.year >= ERA_BOUNDARIES.GOLDEN.min && e.year <= ERA_BOUNDARIES.GOLDEN.max);
    } else if (eraFilter === "modern") {
      filtered = entries.filter(e => e.year >= ERA_BOUNDARIES.MODERN.min && e.year <= ERA_BOUNDARIES.MODERN.max);
    } else if (eraFilter === "contemporary") {
      filtered = entries.filter(e => e.year >= ERA_BOUNDARIES.CONTEMPORARY.min && e.year <= ERA_BOUNDARIES.CONTEMPORARY.max);
    }

    return {
      processedData: filtered,
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


  return (
    <Card className="py-0 border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader className="flex flex-col items-stretch border-b border-slate-200 dark:border-white/10 !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle className="text-black dark:text-white">Release Year Analysis</CardTitle>
          <CardDescription className="text-slate-600 dark:text-white/60">
            Movies watched by release year with era categorization
          </CardDescription>
        </div>
        <div className="flex" role="tablist" aria-label="Select era filter">
          {[
            { key: "classic" as EraFilter, label: "Classic", count: eraTotals.classic, description: ERA_BOUNDARIES.CLASSIC.description },
            { key: "golden" as EraFilter, label: "Golden", count: eraTotals.golden, description: ERA_BOUNDARIES.GOLDEN.description },
            { key: "modern" as EraFilter, label: "Modern", count: eraTotals.modern, description: ERA_BOUNDARIES.MODERN.description },
            { key: "contemporary" as EraFilter, label: "Contemporary", count: eraTotals.contemporary, description: ERA_BOUNDARIES.CONTEMPORARY.description },
            { key: "all" as EraFilter, label: "All Years", count: eraTotals.all, description: "Complete range" },
          ].map(({ key, label, count, description }) => (
            <button
              key={key}
              data-active={eraFilter === key}
              className="data-[active=true]:bg-slate-100 dark:data-[active=true]:bg-white/5 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-slate-200 dark:border-white/10 px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
              onClick={() => setEraFilter(key)}
            >
              <span className="text-xs text-slate-500 dark:text-white/50">
                {description}
              </span>
              <span className="text-lg leading-none font-bold sm:text-2xl text-black dark:text-white">
                {count}
              </span>
              <span className="text-xs text-slate-600 dark:text-white/60">
                {label}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 pt-6">
        {processedData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-slate-500 dark:text-white/50">
            No data available for {eraFilter === "all" ? "this era" : `${eraFilter} films`}
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={processedData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.1)" />
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
                {/* count */}
                <ChartTooltip
                  content={

                    <ChartTooltipContent
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg text-center"
                      labelFormatter={(processedData: any) => `Year: ${processedData.year}`} // shows undefined instead of year number for that particular bar
                      formatter={
                        (value: any) => {
                        return [typeof value === 'number' ? `${value} movies` : value, ''];
                      }
                    }

                    />
                  }
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                >
                  {processedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getYearColor(entry.year)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

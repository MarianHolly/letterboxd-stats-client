/*

Released Year Analysis V2 - Enhanced Design
- Showing Individual Years with redesigned styling
- Interactive bar chart of movies watched by release year
- Era filter tabs: Classic Films (≤1969), Modern Films (≥1970), All Years
- Color gradient from blue (older years) to violet (newer years)
- Enhanced dark mode support
- Improved spacing and visual hierarchy

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

interface ReleaseYearAnalysisV2Props {
  data: Record<string, number>;
}

type EraFilter = "classic" | "modern" | "all"

export const description = "An interactive bar chart of movies by release year with enhanced design"

// Color gradient from blue (older) to violet (newer)
const getYearColor = (year: number, minYear: number, maxYear: number): string => {
  const progress = (year - minYear) / (maxYear - minYear);

  // Blue to Violet gradient
  const hue = 240 - (progress * 90); // 240 (blue) to 270 (violet)
  return `hsl(${hue}, 70%, 50%)`;
};

const chartConfig = {
  count: {
    label: "Movies",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ReleasedYearAnalysisV2({ data }: ReleaseYearAnalysisV2Props) {
  const [eraFilter, setEraFilter] = React.useState<EraFilter>("all");

  // Process data by year with era filtering
  const { processedData, classicCount, modernCount, allCount } = React.useMemo(() => {
    const entries = Object.entries(data)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year);

    if (entries.length === 0) {
      return { processedData: [], classicCount: 0, modernCount: 0, allCount: 0 };
    }

    // Filter by era
    let filtered = entries;
    if (eraFilter === "classic") {
      filtered = entries.filter(e => e.year <= 1969);
    } else if (eraFilter === "modern") {
      filtered = entries.filter(e => e.year >= 1970);
    }

    const allCount = entries.reduce((sum, e) => sum + e.count, 0);
    const classicCount = entries.filter(e => e.year <= 1969).reduce((sum, e) => sum + e.count, 0);
    const modernCount = entries.filter(e => e.year >= 1970).reduce((sum, e) => sum + e.count, 0);

    return {
      processedData: filtered,
      classicCount,
      modernCount,
      allCount,
    };
  }, [data, eraFilter]);

  // Get color gradient range
  const minYear = Math.min(...processedData.map(d => d.year), 1900);
  const maxYear = Math.max(...processedData.map(d => d.year), 2024);

  // Calculate totals for display
  const totalMovies = eraFilter === "classic"
    ? classicCount
    : eraFilter === "modern"
    ? modernCount
    : allCount;

  return (
    <Card className="py-0 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50">
      <CardHeader className="flex flex-col items-stretch border-b border-slate-200 dark:border-white/10 !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle className="text-black dark:text-white">Release Year Analysis</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Movies watched by release year with era categorization
          </CardDescription>
        </div>
        <div className="flex" role="tablist" aria-label="Select era filter">
          {[
            { key: "classic" as EraFilter, label: "Classic", count: classicCount, description: "≤1969" },
            { key: "modern" as EraFilter, label: "Modern", count: modernCount, description: "≥1970" },
            { key: "all" as EraFilter, label: "All Years", count: allCount, description: "Complete range" },
          ].map(({ key, label, count, description }) => (
            <button
              key={key}
              data-active={eraFilter === key}
              className="data-[active=true]:bg-slate-100 dark:data-[active=true]:bg-white/5 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-slate-200 dark:border-white/10 px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
              onClick={() => setEraFilter(key)}
              role="tab"
              aria-selected={eraFilter === key}
            >
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {description}
              </span>
              <span className="text-lg leading-none font-bold sm:text-2xl text-black dark:text-white">
                {count}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {label}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 pt-6">
        {processedData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-slate-500 dark:text-slate-400">
            No data available for {eraFilter === "classic" ? "classic films" : eraFilter === "modern" ? "modern films" : "this era"}
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
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(0,0,0,0.1)"
                  className="dark:stroke-white/10"
                />
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
                  content={
                    <ChartTooltipContent
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg text-center"
                      labelFormatter={(value: any) => `Year: ${value?.year || ''}`}
                      formatter={(value: any) => {
                        return [typeof value === 'number' ? `${value} movies` : value, ''];
                      }}
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
                      fill={getYearColor(entry.year, minYear, maxYear)}
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

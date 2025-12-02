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

const chartConfig = {
  count: {
    label: "Movies",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ReleasedYearAnalysisUpgradeV3({ data }: ReleaseYearAnalysisProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Filter 1960s movies (1960-1969)
  const sixties1960sData = React.useMemo(() => {
    const result = [];
    for (let year = 1960; year <= 1969; year++) {
      const yearStr = String(year);
      const count = data[yearStr] || 0;
      result.push({
        year: yearStr,
        count: count,
      });
    }
    return result;
  }, [data]);

  const activeData = React.useMemo(() => {
    if (activeIndex === null) return null;
    return sixties1960sData[activeIndex];
  }, [activeIndex, sixties1960sData]);

  const totalMovies = React.useMemo(() => {
    return sixties1960sData.reduce((sum, item) => sum + item.count, 0);
  }, [sixties1960sData]);

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">
          1960s Movies
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-white/60">
          {activeData
            ? `${activeData.year}: ${activeData.count} movie${activeData.count !== 1 ? 's' : ''}`
            : `Total: ${totalMovies} movies from the 1960s`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={sixties1960sData}
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
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="var(--color-count)">
              {sixties1960sData.map((_, index) => (
                <Cell
                  className="duration-200"
                  key={`cell-${index}`}
                  fillOpacity={
                    activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3
                  }
                  stroke={activeIndex === index ? "var(--color-count)" : ""}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
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

"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

interface YearOverYearAreaProps {
  data: Array<{ month: string; [year: string]: string | number }>;
}

export function YearOverYearArea({ data }: YearOverYearAreaProps) {
  // Extract years from the data (all keys except 'month')
  const years = data.length > 0
    ? Object.keys(data[0]).filter(key => key !== 'month').sort()
    : [];

  // Create dynamic chart config for each year
  const chartConfig: ChartConfig = years.reduce((config, year, index) => {
    const colorIndex = (index % 5) + 1; // Cycle through chart-1 to chart-5
    config[year] = {
      label: year,
      color: `var(--chart-${colorIndex})`,
    };
    return config;
  }, {} as ChartConfig);

  // If no data, show empty state
  if (data.length === 0 || years.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Year-over-Year Comparison</CardTitle>
          <CardDescription>
            No data available for comparison
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p>Upload diary data to see yearly patterns</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year-over-Year Comparison</CardTitle>
        <CardDescription className="hidden lg:block">
          Monthly viewing patterns across years
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <defs>
              <HatchedBackgroundPattern config={chartConfig} />
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            {/* Dynamically render Area for each year */}
            {years.map((year, index) => (
              <Area
                key={year}
                dataKey={year}
                type="natural"
                fill={`url(#bar-background-pattern-${year})`}
                fillOpacity={0.4}
                stroke={`var(--color-${year})`}
                stackId="a"
                strokeWidth={0.8}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const HatchedBackgroundPattern = ({ config }: { config: ChartConfig }) => {
  const items = Object.fromEntries(
    Object.entries(config).map(([key, value]) => [key, value.color])
  );

  return (
    <>
      {Object.entries(items).map(([key, value]) => (
        <g key={key}>
          <linearGradient
            id={`bar-pattern-gradient-${key}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="50%" stopColor={value} stopOpacity={0.2} />
            <stop offset="50%" stopColor={value} />
          </linearGradient>
          <pattern
            id={`bar-background-pattern-${key}`}
            x="0"
            y="0"
            width="40"
            height="10"
            patternUnits="userSpaceOnUse"
            overflow="visible"
          >
            <rect
              width="40"
              height="10"
              fill={`url(#bar-pattern-gradient-${key})`}
            />
          </pattern>
        </g>
      ))}
    </>
  );
};

"use client";

import { Bar, BarChart, XAxis, Cell } from "recharts";
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
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";

const chartData = [
  { decade: "1920s", watched: 6, watchlist: 80 },
  { decade: "1930", watched: 105, watchlist: 200 },
  { decade: "1940s", watched: 137, watchlist: 120 },
  { decade: "1950s", watched: 73, watchlist: 190 },
  { decade: "1960s", watched: 29, watchlist: 130 },
  { decade: "1970s", watched: 42, watchlist: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function WatchlistAnalysis() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const activeData = React.useMemo(() => {
    if (activeIndex === null) return null;
    return chartData[activeIndex];
  }, [activeIndex]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Compare Watched Movies and Watchlist
          <Badge
            variant="outline"
            className="text-red-500 bg-red-500/10 border-none ml-2"
          >
            <TrendingDown className="h-4 w-4" />
            {/* write ratio if watched vs watchlist number of movies - 
            not decided what information would be best suited ()
            */}
            <span>-5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription>
      
            <span>Watched Movies - Watchlist</span>
        
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <rect
              x="0"
              y="0"
              width="100%"
              height="85%"
              fill="url(#default-multiple-pattern-dots)"
            />
            <defs>
              <DottedBackgroundPattern />
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-desktop-${index}`}
                  fillOpacity={
                    activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3
                  }
                  stroke={activeIndex === index ? "var(--color-desktop)" : ""}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="duration-200"
                />
              ))}
            </Bar>
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-mobile-${index}`}
                  fillOpacity={
                    activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3
                  }
                  stroke={activeIndex === index ? "var(--color-mobile)" : ""}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="duration-200"
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
      id="default-multiple-pattern-dots"
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

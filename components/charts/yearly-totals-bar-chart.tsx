"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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

interface YearlyTotalsBarChartProps {
  data: Array<{ year: string; total: number; change: number | null }>;
}

const chartConfig = {
  total: {
    label: "Movies Watched",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function YearlyTotalsBarChart({ data }: YearlyTotalsBarChartProps) {
  // If no data, show empty state
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yearly Totals</CardTitle>
          <CardDescription>
            Total movies watched per year
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p>Upload diary data to see yearly totals</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Totals</CardTitle>
        <CardDescription>
          Total movies watched each year with year-over-year change
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{data.year}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">Total:</span>
                          <span className="text-sm font-bold">{data.total} movies</span>
                        </div>
                        {data.change !== null && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">Change:</span>
                            <span className={`text-sm font-medium ${
                              data.change > 0 ? 'text-green-600 dark:text-green-400' :
                              data.change < 0 ? 'text-red-600 dark:text-red-400' :
                              'text-muted-foreground'
                            }`}>
                              {data.change > 0 ? '+' : ''}{data.change}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="var(--color-total)"
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Year-over-year change badges below the chart */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {data.map((item) => {
            if (item.change === null) {
              return (
                <div
                  key={item.year}
                  className="flex items-center gap-1 px-2 py-1 rounded-sm text-xs bg-muted text-muted-foreground"
                >
                  <span className="font-medium">{item.year}</span>
                  <span>—</span>
                </div>
              );
            }

            const isIncrease = item.change > 0;
            const isDecrease = item.change < 0;
            const isStable = item.change === 0;

            return (
              <Badge
                key={item.year}
                variant="outline"
                className={`flex items-center gap-1 ${
                  isIncrease
                    ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                    : isDecrease
                    ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                    : 'bg-muted border-muted-foreground/20'
                }`}
              >
                <span className="font-medium">{item.year}</span>
                {isIncrease && <TrendingUp className="h-3 w-3" />}
                {isDecrease && <TrendingDown className="h-3 w-3" />}
                {isStable && <Minus className="h-3 w-3" />}
                <span className="font-semibold">
                  {item.change > 0 ? '+' : ''}{item.change}%
                </span>
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

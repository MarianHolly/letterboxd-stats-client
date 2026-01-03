"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, LabelList } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AnnualSummaryBarProps {
  data: Array<{ year: string; total: number; change: number | null }>;
}

const chartConfig = {
  total: {
    label: "Movies Watched",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AnnualSummaryBar({ data }: AnnualSummaryBarProps) {
  // If no data, show empty state
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Annual Viewing Summary</CardTitle>
          <CardDescription>
            Total films per year
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
        <CardTitle>Annual Viewing Summary</CardTitle>
        <CardDescription className="hidden lg:block">
          Total films per year with growth metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 30,
              right: 12,
              bottom: 12,
              left: 12,
            }}
          >
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
                    <div className="rounded-lg border bg-background p-1 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{data.year}</span>
                        <span className="text-sm font-bold">{data.total} movies</span>
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
              <LabelList
                dataKey="change"
                position="top"
                content={({ x, y, width, value, index }) => {
                  const item = data[index as number];
                  if (!item || item.change === null) return null;

                  const change = item.change;
                  const isIncrease = change > 0;
                  const isDecrease = change < 0;

                  // Calculate center position
                  const centerX = (x as number) + (width as number) / 2;
                  const labelY = (y as number) - 18;

                  return (
                    <g>
                      <rect
                        x={centerX - 20}
                        y={labelY - 10}
                        width="40"
                        height="16"
                        rx="3"
                        fill={
                          isIncrease
                            ? 'rgb(34 197 94 / 0.1)'
                            : isDecrease
                            ? 'rgb(239 68 68 / 0.1)'
                            : 'rgb(148 163 184 / 0.1)'
                        }
                        stroke={
                          isIncrease
                            ? 'rgb(34 197 94 / 0.3)'
                            : isDecrease
                            ? 'rgb(239 68 68 / 0.3)'
                            : 'rgb(148 163 184 / 0.3)'
                        }
                        strokeWidth="1"
                      />
                      <text
                        x={centerX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-current text-[10px] font-semibold"
                        style={{
                          fill: isIncrease
                            ? 'rgb(22 163 74)'
                            : isDecrease
                            ? 'rgb(220 38 38)'
                            : 'rgb(100 116 139)',
                        }}
                      >
                        {change > 0 ? '+' : ''}{change}%
                      </text>
                    </g>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm pt-4">
        <div className="flex gap-2 font-medium leading-none">
          Total: {data.reduce((sum, item) => sum + item.total, 0).toLocaleString()} movies across {data.length} years
        </div>
        <div className="hidden lg:block leading-none text-muted-foreground">
          Average: {Math.round(data.reduce((sum, item) => sum + item.total, 0) / data.length).toLocaleString()} movies per year
        </div>
      </CardFooter>
    </Card>
  );
}

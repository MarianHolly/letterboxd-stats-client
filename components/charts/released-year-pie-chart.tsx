"use client";

import * as React from "react";
import { LabelList, Pie, PieChart, Cell } from "recharts";

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

interface ReleasedYearPieChartProps {
  data: Array<{ era: string; count: number; fill: string }>;
}

// Era descriptions for the legend
const ERA_DESCRIPTIONS: Record<string, { years: string; description: string }> = {
  "Classic": {
    years: "1900–1944",
    description: "Silent era and early talkies"
  },
  "Golden": {
    years: "1945–1969",
    description: "Golden Age of Hollywood"
  },
  "Modern": {
    years: "1970–1999",
    description: "New Hollywood and blockbusters"
  },
  "Contemporary": {
    years: "2000–Present",
    description: "Digital era and modern cinema"
  },
};

const chartConfig = {
  count: {
    label: "Movies",
  },
} satisfies ChartConfig;

export function ReleasedYearPieChart({ data }: ReleasedYearPieChartProps) {
  if (data.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Movies by Era</CardTitle>
          <CardDescription>Distribution by release era</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[350px] text-slate-500 dark:text-white/50">
            No era data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMovies = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Movies by Era</CardTitle>
        <CardDescription>Distribution by release era</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-foreground mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="era" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="era"
              innerRadius={30}
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey="count"
                stroke="none"
                fontSize={12}
                fontWeight={500}
                fill="currentColor"
                formatter={(value: number) => value.toString()}
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex flex-row gap-3 text-sm pt-4 px-6 pb-4">
        <div className="flex gap-4 w-full flex-wrap justify-center md:justify-start">
          {data.map((item) => {
            const percentage = ((item.count / totalMovies) * 100).toFixed(1);
            const eraDesc = ERA_DESCRIPTIONS[item.era] || { years: "", description: "" };
            return (
              <div key={item.era} className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="font-semibold text-black dark:text-white">{item.era}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-white/70">{percentage}%</span>
                </div>
                <div className="ml-5">
                  <p className="text-xs text-slate-500 dark:text-white/50">{eraDesc.years}</p>
                  <p className="text-xs text-slate-600 dark:text-white/70">{eraDesc.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

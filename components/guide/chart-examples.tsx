"use client";

import React from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

export default function ChartExamples() {
  // Mock data for showcase charts
  const viewingTimelineData = [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 18 },
    { month: "Mar", count: 22 },
    { month: "Apr", count: 28 },
    { month: "May", count: 32 },
    { month: "Jun", count: 25 },
    { month: "Jul", count: 30 },
    { month: "Aug", count: 35 },
    { month: "Sep", count: 28 },
    { month: "Oct", count: 40 },
    { month: "Nov", count: 38 },
    { month: "Dec", count: 42 },
  ];

  const ratingDistData = [
    { rating: "5★", count: 45 },
    { rating: "4.5★", count: 62 },
    { rating: "4★", count: 78 },
    { rating: "3.5★", count: 48 },
    { rating: "3★", count: 25 },
    { rating: "2.5★", count: 12 },
    { rating: "2★", count: 8 },
  ];

  const decadeData = [
    { decade: "1970s", count: 15 },
    { decade: "1980s", count: 28 },
    { decade: "1990s", count: 45 },
    { decade: "2000s", count: 68 },
    { decade: "2010s", count: 95 },
    { decade: "2020s", count: 82 },
  ];

  const ratioData = [
    { name: "Rated", value: 68, fill: "#EFBF04" },
    { name: "Unrated", value: 32, fill: "#e2e8f0" },
  ];

  const COLORS = {
    primary: "#EFBF04",
    secondary: "#9b1c31",
    indigo: "#4f46e5",
    muted: "#e2e8f0",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Chart 1: Viewing Timeline */}
      <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950/50">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
          <h4 className="font-semibold text-foreground text-base mb-1">
            Viewing Timeline
          </h4>
          <p className="text-sm text-foreground/70 dark:text-foreground/60">
            Track your monthly viewing activity and discover seasonal patterns
          </p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={viewingTimelineData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke={COLORS.indigo}
                strokeWidth={2}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Rating Distribution */}
      <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950/50">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
          <h4 className="font-semibold text-foreground text-base mb-1">
            Rating Distribution
          </h4>
          <p className="text-sm text-foreground/70 dark:text-foreground/60">
            See how you rate films and understand your rating tendencies
          </p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingDistData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="rating"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Films by Decade */}
      <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950/50">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
          <h4 className="font-semibold text-foreground text-base mb-1">
            Films by Decade
          </h4>
          <p className="text-sm text-foreground/70 dark:text-foreground/60">
            Explore which eras of cinema dominate your viewing history
          </p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={decadeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="decade"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Rating Coverage Ratio */}
      <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-950/50">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
          <h4 className="font-semibold text-foreground text-base mb-1">
            Rating Coverage
          </h4>
          <p className="text-sm text-foreground/70 dark:text-foreground/60">
            Percentage of your films you've rated vs. unrated
          </p>
        </div>
        <div className="p-6 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={ratioData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
              >
                {ratioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

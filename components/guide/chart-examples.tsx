"use client";

import React from "react";
import { ReleaseYearDistributionBar } from "@/components/charts/distribution/ReleaseYearDistributionBar";
import { YearOverYearArea } from "@/components/charts/timeline/YearOverYearArea";

export default function ChartExamples() {
  // Professional mock data for Release Year Distribution
  // Shows appreciation for cinema history with peaks in 60s-70s and dominant 2000s-2010s era
  const releaseYearData: Record<string, number> = {
    "1939": 1,
    "1945": 1,
    "1950": 2,
    "1952": 1,
    "1954": 2,
    "1956": 2,
    "1957": 2,
    "1958": 2,
    "1959": 2,
    "1960": 3,
    "1961": 3,
    "1962": 4,
    "1963": 5,
    "1964": 5,
    "1965": 5,
    "1966": 5,
    "1967": 5,
    "1968": 6,
    "1969": 7,
    "1970": 8,
    "1971": 9,
    "1972": 9,
    "1973": 8,
    "1974": 7,
    "1975": 7,
    "1976": 6,
    "1977": 6,
    "1978": 5,
    "1979": 5,
    "1980": 5,
    "1981": 5,
    "1982": 6,
    "1983": 5,
    "1984": 7,
    "1985": 7,
    "1986": 5,
    "1987": 6,
    "1988": 7,
    "1989": 7,
    "1990": 9,
    "1991": 10,
    "1992": 11,
    "1993": 11,
    "1994": 13,
    "1995": 13,
    "1996": 14,
    "1997": 15,
    "1998": 17,
    "1999": 19,
    "2000": 21,
    "2001": 24,
    "2002": 27,
    "2003": 30,
    "2004": 32,
    "2005": 35,
    "2006": 37,
    "2007": 41,
    "2008": 45,
    "2009": 49,
    "2010": 53,
    "2011": 56,
    "2012": 59,
    "2013": 62,
    "2014": 64,
    "2015": 68,
    "2016": 72,
    "2017": 76,
    "2018": 80,
    "2019": 77,
    "2020": 66,
    "2021": 70,
    "2022": 75,
    "2023": 79,
    "2024": 45,
  };

  // Professional mock data for Year-over-Year Comparison
  // Shows growth trajectory with realistic seasonal patterns (summer dips, holiday spikes)
  const yearOverYearData = [
    { month: "Jan", "2022": 18, "2023": 22, "2024": 28 },
    { month: "Feb", "2022": 16, "2023": 20, "2024": 25 },
    { month: "Mar", "2022": 19, "2023": 24, "2024": 30 },
    { month: "Apr", "2022": 21, "2023": 26, "2024": 32 },
    { month: "May", "2022": 20, "2023": 25, "2024": 31 },
    { month: "Jun", "2022": 14, "2023": 18, "2024": 22 },
    { month: "Jul", "2022": 12, "2023": 15, "2024": 18 },
    { month: "Aug", "2022": 11, "2023": 14, "2024": 17 },
    { month: "Sep", "2022": 17, "2023": 21, "2024": 26 },
    { month: "Oct", "2022": 22, "2023": 28, "2024": 34 },
    { month: "Nov", "2022": 24, "2023": 30, "2024": 37 },
    { month: "Dec", "2022": 26, "2023": 32, "2024": 40 },
  ];

  return (
    <div className="space-y-16">
      {/* Chart 1: Release Year Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Description */}
        <div className="space-y-6 flex flex-col justify-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                Interactive
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              Release Year Distribution
            </h3>
          </div>
          <p className="text-base text-foreground/70 dark:text-foreground/60 leading-relaxed">
            Explore your viewing history across cinema's entire timeline. This interactive chart reveals which eras dominate your taste—with era-based filtering, historical reference lines, and a gradient that makes decades come alive. Notice how the color shifts from classic films to contemporary releases.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
              <span className="text-sm text-foreground/80">Era-based filtering with instant totals</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
              <span className="text-sm text-foreground/80">Historical reference lines marking cinema eras</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
              <span className="text-sm text-foreground/80">Dynamic color gradient spanning 1900-2099</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950/30">
          <ReleaseYearDistributionBar data={releaseYearData} />
        </div>
      </div>

      {/* Chart 2: Year-over-Year Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950/30 order-2 lg:order-1">
          <YearOverYearArea data={yearOverYearData} />
        </div>

        {/* Description */}
        <div className="space-y-6 flex flex-col justify-start order-1 lg:order-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                Multi-year
              </span>
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              Year-over-Year Comparison
            </h3>
          </div>
          <p className="text-base text-foreground/70 dark:text-foreground/60 leading-relaxed">
            Track how your viewing habits evolve over time. This stacked visualization compares your monthly activity across multiple years, revealing patterns like summer slowdowns, holiday binges, or steady growth in your cinematic journey. Each year is color-coded for effortless comparison.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-sm text-foreground/80">Stacked area visualization for multi-year trends</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-sm text-foreground/80">Seasonal pattern detection and insights</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-sm text-foreground/80">Automatically adapts to any number of years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

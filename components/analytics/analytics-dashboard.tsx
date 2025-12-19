"use client";

import { useEffect, useState } from "react";
import { useAnalyticsStore } from "@/hooks/use-analytics-store";

import { StatsOverview } from "./stats-overview";
import { AnalyticsEmptyState } from "./analytics-empty-state";
import { AnalyticsSkeleton } from "./analytics-skeleton";

// Import chart components
import { DiaryAreaChart } from "@/components/charts/diary-area-chart";
import { DiaryStatistics } from "@/components/charts/diary-statistics";
import { ReleasedYearAnalysis } from "@/components/charts/release-year-analysis";
import { ReleasedYearBarHorizontal } from "@/components/charts/released-year-bar-horizont";
import { ReleasedYearPieChart } from "@/components/charts/released-year-pie-chart";

// ============================================================================
// DATA TRANSFORMATION FUNCTIONS
// ============================================================================

function transformReleaseYearData(movies: any[]): Record<string, number> {
  const data: Record<string, number> = {};
  movies.forEach((movie) => {
    const year = String(movie.year);
    data[year] = (data[year] || 0) + 1;
  });
  return data;
}

function transformReleaseYearToDecades(movies: any[]): Array<{ decade: string; count: number }> {
  const decadeMap: Record<string, number> = {};

  movies.forEach((movie) => {
    if (movie.year) {
      const year = parseInt(String(movie.year));
      const decadeStart = Math.floor(year / 10) * 10;
      const decadeEnd = decadeStart + 9;
      const decadeLabel = `${decadeStart}s`;

      decadeMap[decadeLabel] = (decadeMap[decadeLabel] || 0) + 1;
    }
  });

  // Sort decades in chronological order
  return Object.entries(decadeMap)
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => {
      const yearA = parseInt(a.decade);
      const yearB = parseInt(b.decade);
      return yearA - yearB;
    });
}

function transformReleaseYearToEras(movies: any[]): Array<{ era: string; count: number; fill: string }> {
  const ERA_BOUNDARIES = {
    CLASSIC: { min: 1900, max: 1944, label: "Classic", color: "#06b6d4" },      // Cyan
    GOLDEN: { min: 1945, max: 1969, label: "Golden", color: "#0891b2" },        // Dark Cyan
    MODERN: { min: 1970, max: 1999, label: "Modern", color: "#6366f1" },        // Indigo
    CONTEMPORARY: { min: 2000, max: 2099, label: "Contemporary", color: "#d946ef" }, // Magenta
  };

  const eraTotals = {
    classic: 0,
    golden: 0,
    modern: 0,
    contemporary: 0,
  };

  movies.forEach((movie) => {
    if (movie.year) {
      const year = parseInt(String(movie.year));
      if (year >= ERA_BOUNDARIES.CLASSIC.min && year <= ERA_BOUNDARIES.CLASSIC.max) {
        eraTotals.classic++;
      } else if (year >= ERA_BOUNDARIES.GOLDEN.min && year <= ERA_BOUNDARIES.GOLDEN.max) {
        eraTotals.golden++;
      } else if (year >= ERA_BOUNDARIES.MODERN.min && year <= ERA_BOUNDARIES.MODERN.max) {
        eraTotals.modern++;
      } else if (year >= ERA_BOUNDARIES.CONTEMPORARY.min && year <= ERA_BOUNDARIES.CONTEMPORARY.max) {
        eraTotals.contemporary++;
      }
    }
  });

  return [
    { era: ERA_BOUNDARIES.CLASSIC.label, count: eraTotals.classic, fill: ERA_BOUNDARIES.CLASSIC.color },
    { era: ERA_BOUNDARIES.GOLDEN.label, count: eraTotals.golden, fill: ERA_BOUNDARIES.GOLDEN.color },
    { era: ERA_BOUNDARIES.MODERN.label, count: eraTotals.modern, fill: ERA_BOUNDARIES.MODERN.color },
    { era: ERA_BOUNDARIES.CONTEMPORARY.label, count: eraTotals.contemporary, fill: ERA_BOUNDARIES.CONTEMPORARY.color },
  ].filter(item => item.count > 0);
}

function transformMonthlyData(movies: any[]): Array<{ month: string; count: number }> {
  const monthMap: Record<string, number> = {};
  movies.forEach((movie) => {
    const date = movie.watchedDate || movie.dateMarkedWatched;
    if (date) {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const monthKey = dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
    }
  });

  return Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

function transformGenreData(moviesLength: number): Record<string, number> {
  const genreMap: Record<string, number> = {};
  const genres = ["Drama", "Action", "Comedy", "Sci-Fi", "Horror", "Thriller", "Romance", "Animation", "Adventure", "Documentary"];
  genres.forEach((genre) => {
    genreMap[genre] = Math.floor(Math.random() * moviesLength * 0.15) + 5;
  });
  return genreMap;
}

function transformRatingData(movies: any[]): Record<number, number> {
  const ratingMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  movies.forEach((movie) => {
    if (movie.rating !== undefined) {
      const roundedRating = Math.ceil(movie.rating);
      ratingMap[roundedRating] = (ratingMap[roundedRating] || 0) + 1;
    }
  });
  return ratingMap;
}

function transformYearMonthlyData(movies: any[]): Array<{ year: number; data: Array<{ month: string; count: number }> }> {
  const yearMap: Record<number, Record<string, number>> = {};

  movies.forEach((movie) => {
    const date = movie.watchedDate || movie.dateMarkedWatched;
    if (date) {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const year = dateObj.getFullYear();
      const month = dateObj.toLocaleDateString("en-US", { month: "short" });

      if (!yearMap[year]) yearMap[year] = {};
      yearMap[year][month] = (yearMap[year][month] || 0) + 1;
    }
  });

  return Object.entries(yearMap)
    .map(([year, monthData]) => ({
      year: parseInt(year),
      data: Object.entries(monthData).map(([month, count]) => ({ month, count })),
    }))
    .sort((a, b) => a.year - b.year);
}

function transformDailyData(movies: any[]): Record<string, number> {
  const dayMap: Record<string, number> = {};
  movies.forEach((movie) => {
    const date = movie.watchedDate || movie.dateMarkedWatched;
    if (date) {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const dayKey = dateObj.toISOString().split("T")[0];
      dayMap[dayKey] = (dayMap[dayKey] || 0) + 1;
    }
  });
  return dayMap;
}

function transformDiaryStats(
  monthlyData: Array<{ month: string; count: number }>,
  moviesLength: number
): { totalEntries: number; averagePerMonth: number; busiestMonth: string; busiestMonthCount: number; quietestMonth: string; quietestMonthCount: number; dateRange: string } | undefined {
  if (monthlyData.length === 0) return undefined;

  const monthlyAverages = monthlyData.map((m) => m.count);
  const averagePerMonth = monthlyAverages.length > 0
    ? monthlyAverages.reduce((a, b) => a + b, 0) / monthlyAverages.length
    : 0;

  const busiestMonth = monthlyData.reduce((max, m) => m.count > max.count ? m : max, monthlyData[0]);
  const quietestMonth = monthlyData.reduce((min, m) => m.count < min.count ? m : min, monthlyData[0]);

  return {
    totalEntries: moviesLength,
    averagePerMonth: Math.round(averagePerMonth * 10) / 10,
    busiestMonth: busiestMonth?.month || "Unknown",
    busiestMonthCount: busiestMonth?.count || 0,
    quietestMonth: quietestMonth?.month || "Unknown",
    quietestMonthCount: quietestMonth?.count || 0,
    dateRange: monthlyData.length > 0
      ? `${monthlyData[0].month} - ${monthlyData[monthlyData.length - 1].month}`
      : "No data",
  };
}

// ============================================================================
// ANALYTICS DASHBOARD COMPONENT
// ============================================================================

interface AnalyticsDashboardProps {
  onUploadClick?: () => void;
}

export function AnalyticsDashboard({ onUploadClick }: AnalyticsDashboardProps) {
  // Subscribe to store
  const dataset = useAnalyticsStore((state) => state.dataset);
  const analytics = useAnalyticsStore((state) => state.analytics);
  const loading = useAnalyticsStore((state) => state.loading);
  const error = useAnalyticsStore((state) => state.error);
  const hasData = useAnalyticsStore((state) => state.hasData());

  // Handle hydration
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Loading state
  if (!isHydrated || loading) {
    return <AnalyticsSkeleton />;
  }

  // No data state
  if (!hasData) {
    return <AnalyticsEmptyState onUploadClick={onUploadClick} />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 overflow-auto scroll-smooth">
        <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
            <h3 className="font-semibold text-destructive mb-2">Error</h3>
            <p className="text-sm text-destructive/90">{error}</p>
          </div>
          {analytics && (
            <StatsOverview
              analytics={analytics}
              profile={dataset?.userProfile}
              isLoading={false}
            />
          )}
        </div>
      </div>
    );
  }

  // Success state - prepare data for all charts
  const movies = dataset?.watched || [];

  // ========== DATA TRANSFORMATIONS FOR CHARTS ==========

  // Transform all data using pure functions
  const releaseYearData = transformReleaseYearData(movies);
  const decadeData = transformReleaseYearToDecades(movies);
  const eraData = transformReleaseYearToEras(movies);
  const monthlyData = transformMonthlyData(movies);
  const yearMonthlyData = transformYearMonthlyData(movies);
  const diaryStats = transformDiaryStats(monthlyData, movies.length);

  return (
    <div className="flex-1 overflow-auto scroll-smooth">
      <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full">


        {/* Stats Overview Section - Full Width */}
        <StatsOverview
          analytics={analytics}
          profile={dataset?.userProfile}
          isLoading={!analytics}
        />

        {/* ===== RELEASE YEAR ANALYSIS ===== */}
        {Object.keys(releaseYearData).length > 0 && (
          <div>
            <div className="mb-6 py-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Release Year Analysis
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Movies watched by release year with era categorization
              </p>
            </div>
            <ReleasedYearAnalysis data={releaseYearData} />
            {(decadeData.length > 0 || eraData.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {decadeData.length > 0 && (
                  <ReleasedYearBarHorizontal data={decadeData} />
                )}
                {eraData.length > 0 && (
                  <ReleasedYearPieChart data={eraData} />
                )}
              </div>
            )}
          </div>
        )}







        {/* ============================================ */}
        {/* SECTION 1: VIEWING PATTERNS & HABITS */}
        {/* ============================================ */}

        {/* ===== GENERAL DIARY STATISTICS ===== */}
        {/* 
          - how many movies user watched, liked, rated, has in watchlist?
        */}
        {diaryStats && (
          <div>
            <div className="mb-6 py-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Your Watching Habits
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Key metrics about your viewing patterns
              </p>
            </div>
            <DiaryStatistics stats={diaryStats} />
          </div>
        )}

        {/* ===== TIMELINE / AREA CHART ===== */}
        {monthlyData.length > 0 && (
          <div>
            <div className="mb-6 py-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Watching Timeline
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your viewing activity over time with smoothing options
              </p>
            </div>
            <DiaryAreaChart data={monthlyData} />
          </div>
        )}


        {/* CHARTS BASED ON DIARY */}
        {/* 
          - title
          - description - look at your diary records to discover what month you watch most movies, how many movies you watched over time,...
          - message based on users ratio of watched for first time - re-watched movies (various conclusions based on value - you are discovery watcher, you rarelly discover new movies,...)
        */}
        {/* PRIMARY CHART: Area Chart of Watched Movies / Monthly */}
        {/* 
          - possible variantions and manipulations: all records, last 12 months / monhtly, average of 2 or 3 months
        */}

        {/* 
          SECONDARY CHARTs: 
          - Compare years to each other
          - Compare months throught years to each other - bar chart (like in januar in 2023 has 20 movies, in 2024 has 31, in 2025 has 27 - making average)
          - Compare years to each other - area chart with multiple years 
        */}

        
        {/* CHARTS BASED ON RATING */}
        {/* 
          - give ration of how many movies are rated in comparison to watched - how well we can see users personality
          - looking at average rating and other patterns - not only basic average - look at most used rating value, what rating value is rare or never used
        */}
        {/* 
          rated vs not rated
          average rating per decade (note how precise it is (number of rated movies, number of rated movies compare to watched in particular decade - these are two different numbers expressing something different))
        */}


        {/* CHARTS BASED ON WATCHLIST */}
        {/* 
          - how many movies in watchlist - conclusions (you are wonderrer and collector, you are...)
          - watched vs watchlist (ratio)
          - display on cbar chart various decades 
        */}


        {/* CHARTS BASED ON FAMOUS WATCHLISTS */}
        {/* 
          - bar chart that can be changes btw stacked + legend / multiple charts
          - maybe will be composed of list of various watchlist and user can pick and choose which he is interested in
        */}

        
      </div>
    </div>
  );
}

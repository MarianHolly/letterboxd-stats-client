"use client";

import { useEffect, useState } from "react";
import { useAnalyticsStore } from "@/hooks/use-analytics-store";

import { StatsOverview } from "./stats-overview";
import { AnalyticsEmptyState } from "./analytics-empty-state";
import { AnalyticsSkeleton } from "./analytics-skeleton";

// Import all chart components
import { DiaryAreaChart } from "@/components/charts/diary-area-chart";
import { DiaryMonthlyRadarChart } from "@/components/charts/diary-monthly-radar-chart";
import { DiaryStatistics } from "@/components/charts/diary-statistics";
import { ReleasedYearAnalysis } from "@/components/charts/release-year-analysis";
import { ReleasedYearAnalysisUpgrade } from "@/components/charts/release-year-analysis-v2";
import { ReleasedYearAnalysisUpgradeV3 } from "../charts/released-year-analysis-v3";

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

        {/* ===== RELEASE YEAR ANALYSIS (V1 & V2) ===== */}
          {Object.keys(releaseYearData).length > 0 && (
            <div>
              <div className="mb-6 py-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                  Movie Release Years
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Distribution of movies by their release year
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Version 1: Classic Era Filter</h3>
                  <ReleasedYearAnalysis data={releaseYearData} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Version 2: Four-Era Breakdown</h3>
                  <ReleasedYearAnalysisUpgrade data={releaseYearData} />
                </div>
                <div className="">
                  <ReleasedYearAnalysisUpgradeV3 data={releaseYearData} />
                </div>
              </div>
            </div>
          )}

        {/* Main Charts Section */}
        <section className="space-y-8">
          {/* ===== DIARY STATISTICS ===== */}
          {diaryStats && (
            <div>
              <div className="mb-6 py-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                  Your Watching Habits
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Overview of your viewing patterns and statistics
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
                  Your viewing activity over time
                </p>
              </div>
              <DiaryAreaChart data={monthlyData} />
            </div>
          )}

          {/* ===== MONTHLY RADAR CHART (BY YEAR) ===== */}
          {yearMonthlyData.length > 0 && (
            <div>
              <div className="mb-6 py-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                  Monthly Patterns by Year
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  How your watching habits vary by month across different years
                </p>
              </div>
              <DiaryMonthlyRadarChart data={yearMonthlyData} size="compact" />
            </div>
          )}

          {/* ===== 1960s RELEASE YEAR ANALYSIS ===== */}
          {Object.keys(releaseYearData).length > 0 && (
            <div>
              <div className="mb-6 py-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                  1960s Movies by Release Year
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Movies released during the 1960s decade
                </p>
              </div>
              <ReleasedYearAnalysisUpgradeV3 data={releaseYearData} />
            </div>
          )}

          {/* ===== RATING DISTRIBUTION ===== */}





        </section>
      </div>
    </div>
  );
}

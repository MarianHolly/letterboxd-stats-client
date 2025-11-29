"use client";

import { useEffect, useState } from "react";
import { useAnalyticsStore } from "@/hooks/use-analytics-store";
import {
  computeMonthlyRadarData,
  computeTagDistribution,
} from "@/lib/analytics-engine";

import { StatsOverview } from "./stats-overview";
import { AnalyticsEmptyState } from "./analytics-empty-state";
import { AnalyticsSkeleton } from "./analytics-skeleton";

import { ReleasedYearAnalysis } from "@/components/charts/release-year-analysis";
import { ReleasedYearAnalysisUpgrade } from "../charts/release-year-analysis-v2";
import { HighlightedBarChart } from "@/prototype/bar-chart";
import { ChartBarInteractive } from "@/prototype/bar-chart-animated";

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

  // Success state
  // Prepare data for charts
  const movies = dataset?.watched || [];

  // Convert release year data for analysis
  const releaseYearData: Record<string, number> = {};
  movies.forEach((movie) => {
    const year = String(movie.year);
    releaseYearData[year] = (releaseYearData[year] || 0) + 1;
  });

  // Convert viewing over time (year breakdown)
  const viewingOverTimeData: Record<string, number> = {};
  movies.forEach((movie) => {
    const date = movie.watchedDate || movie.dateMarkedWatched;
    if (date) {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const year = String(dateObj.getFullYear());
      viewingOverTimeData[year] = (viewingOverTimeData[year] || 0) + 1;
    }
  });

  return (
    <div className="flex-1 overflow-auto scroll-smooth">
      <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full">
        {/* Stats Overview Section - Full Width */}
        <StatsOverview
          analytics={analytics}
          profile={dataset?.userProfile}
          isLoading={!analytics}
        />

        {/* Main Charts Section */}
        <section className="space-y-8">
          {/* Release Year Analysis - Full Width First */}
          {Object.keys(releaseYearData).length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-center py-12">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Movie Release Years
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Requires: watched.csv
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-8 mb-24">
                <ReleasedYearAnalysis data={releaseYearData} />
                <ReleasedYearAnalysisUpgrade data={releaseYearData} />
                <HighlightedBarChart />
                <ChartBarInteractive />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

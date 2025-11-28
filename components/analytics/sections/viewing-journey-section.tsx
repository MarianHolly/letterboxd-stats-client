"use client";

import type { AnalyticsOverview, Movie } from "@/lib/types";
import { SectionTemplate } from "./section-template";
import { ViewingOverTimeV2 } from "@/components/charts/viewing-over-time-v2";

interface ViewingJourneySectionProps {
  uploadedFiles: string[];
  analytics: AnalyticsOverview | null;
  movies: Movie[];
}

// Mock data for preview
const MOCK_VIEWING_OVER_TIME_DATA: Record<string, number> = {
  "2018-01-05": 2,
  "2018-02-10": 1,
  "2018-03-15": 3,
  "2018-04-20": 2,
  "2018-05-12": 4,
  "2019-01-08": 3,
  "2019-02-14": 5,
  "2019-03-20": 4,
  "2019-04-10": 6,
  "2019-05-18": 3,
  "2020-01-12": 8,
  "2020-02-19": 6,
  "2020-03-25": 7,
  "2020-04-30": 9,
  "2020-05-22": 5,
  "2021-01-15": 10,
  "2021-02-18": 8,
  "2021-03-24": 11,
  "2021-04-29": 9,
  "2021-05-30": 7,
  "2022-01-10": 12,
  "2022-02-14": 10,
  "2022-03-22": 13,
  "2022-04-28": 11,
  "2022-05-25": 9,
  "2023-01-20": 14,
  "2023-02-16": 12,
  "2023-03-30": 15,
  "2023-04-26": 13,
  "2023-05-28": 11,
  "2024-01-18": 16,
  "2024-02-20": 14,
  "2024-03-15": 17,
};

export function ViewingJourneySection({
  uploadedFiles,
  analytics,
  movies,
}: ViewingJourneySectionProps) {
  // Section 2: Visible if diary.csv uploaded OR use mock data for preview
  const hasDiaryCsv = uploadedFiles.includes("diary.csv");
  const hasWatchedDates = movies.some((m) => m.watchedDate !== undefined);

  // Prepare viewing over time data (year breakdown) or use mock data
  let viewingOverTimeData: Record<string, number> = {};

  if (hasDiaryCsv && hasWatchedDates && analytics) {
    movies.forEach((movie) => {
      const date = movie.watchedDate || movie.dateMarkedWatched;
      if (date) {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        const year = String(dateObj.getFullYear());
        viewingOverTimeData[year] = (viewingOverTimeData[year] || 0) + 1;
      }
    });
  } else {
    // Use mock data for preview
    viewingOverTimeData = MOCK_VIEWING_OVER_TIME_DATA;
  }

  const hasData = Object.keys(viewingOverTimeData).length > 0;

  return (
    <SectionTemplate
      id="viewing-journey"
      title="📅 When do you watch movies most?"
      description="Temporal Viewing Patterns"
      showEmptyState={!hasData}
      emptyStateMessage="No viewing date data available"
    >
      <ViewingOverTimeV2 data={viewingOverTimeData} />
    </SectionTemplate>
  );
}

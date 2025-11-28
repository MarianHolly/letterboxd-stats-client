"use client";

import type { AnalyticsOverview, Movie } from "@/lib/types";
import { SectionTemplate } from "./section-template";
import { ReleasedYearAnalysisV2 } from "@/components/charts/release-year-analysis-v2";

interface MovieCollectionSectionProps {
  uploadedFiles: string[];
  analytics: AnalyticsOverview | null;
  movies?: Movie[];
}

// Mock data for preview
const MOCK_RELEASE_YEAR_DATA: Record<string, number> = {
  "1970": 2,
  "1975": 1,
  "1980": 3,
  "1985": 2,
  "1990": 5,
  "1995": 8,
  "2000": 12,
  "2005": 15,
  "2010": 18,
  "2015": 22,
  "2016": 19,
  "2017": 21,
  "2018": 24,
  "2019": 26,
  "2020": 23,
  "2021": 25,
  "2022": 28,
  "2023": 31,
  "2024": 18,
};

export function MovieCollectionSection({
  uploadedFiles,
  analytics,
  movies = [],
}: MovieCollectionSectionProps) {
  // Section 1 always displays (watched.csv is required)
  const hasData = uploadedFiles.includes("watched.csv") && analytics;

  // Prepare release year data from movies or use mock data
  let releaseYearData: Record<string, number> = {};

  if (hasData) {
    movies.forEach((movie) => {
      const year = String(movie.year);
      releaseYearData[year] = (releaseYearData[year] || 0) + 1;
    });
  } else {
    // Use mock data for preview
    releaseYearData = MOCK_RELEASE_YEAR_DATA;
  }

  return (
    <SectionTemplate
      id="movie-collection"
      title="📽️ Which eras of cinema define your taste?"
      description="Release Year & Decade Analysis"
      showEmptyState={Object.keys(releaseYearData).length === 0}
      emptyStateMessage="No release year data available"
    >
      <ReleasedYearAnalysisV2 data={releaseYearData} />
    </SectionTemplate>
  );
}

"use client";

import type { AnalyticsOverview, Movie } from "@/lib/types";
import { SectionTemplate } from "./section-template";

interface DeepDivesSectionProps {
  uploadedFiles: string[];
  analytics: AnalyticsOverview | null;
  movies: Movie[];
}

export function DeepDivesSection({
  uploadedFiles,
  analytics,
  movies,
}: DeepDivesSectionProps) {
  // Section 4: Placeholder for Phase 2
  // Currently shows placeholder message

  return (
    <SectionTemplate
      id="deep-dives"
      title="🔍 What patterns define your viewing?"
      description="Advanced Cross-Analysis"
      showEmptyState={true}
      emptyStateMessage="Deep Dives section coming in Phase 2. This will feature advanced cross-analysis including rewatch patterns, liked movies analysis, tag distributions, and watchlist insights."
    />
  );

  // Future implementation:
  // - Rewatch analysis (diary.csv with rewatch data)
  // - Liked movies analysis (films.csv)
  // - Tag analysis (diary.csv with tags)
  // - Watchlist insights (watchlist.csv + watched.csv)
}

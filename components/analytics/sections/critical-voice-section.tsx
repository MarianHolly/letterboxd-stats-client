"use client";

import type { AnalyticsOverview } from "@/lib/types";
import { SectionTemplate } from "./section-template";
import { RatingDistributionV2 } from "@/components/charts/rating-distribution-v2";

interface CriticalVoiceSectionProps {
  uploadedFiles: string[];
  analytics: AnalyticsOverview | null;
}

// Mock data for preview
const MOCK_RATING_DATA: Record<number, number> = {
  1: 8,
  2: 15,
  3: 42,
  4: 68,
  5: 127,
};

export function CriticalVoiceSection({
  uploadedFiles,
  analytics,
}: CriticalVoiceSectionProps) {
  // Section 3: Visible if rating data exists OR use mock data for preview
  const hasRatingData =
    analytics && Object.keys(analytics.ratingDistribution || {}).length > 0;

  const ratingData = hasRatingData
    ? (analytics?.ratingDistribution || {})
    : MOCK_RATING_DATA;

  return (
    <SectionTemplate
      id="critical-voice"
      title="⭐ Are you a harsh critic or generous rater?"
      description="Rating Distribution & Patterns"
      showEmptyState={Object.keys(ratingData).length === 0}
      emptyStateMessage="No rating data available"
    >
      <RatingDistributionV2 data={ratingData} />
    </SectionTemplate>
  );
}

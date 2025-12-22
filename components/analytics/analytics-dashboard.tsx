"use client";

import { useEffect, useState } from "react";
import { useAnalyticsStore } from "@/hooks/use-analytics-store";
import type { Movie } from "@/lib/types";

import { StatsOverview } from "./stats-overview";
import { AnalyticsEmptyState } from "./analytics-empty-state";
import { AnalyticsSkeleton } from "./analytics-skeleton";
import { SectionLayout } from "./SectionLayout";

// Import chart components
import { DiaryAreaChart } from "@/components/charts/diary-area-chart";
import { DiaryStatistics } from "@/components/charts/diary-statistics";
import { ReleasedYearAnalysis } from "@/components/charts/release-year-analysis";
import { ReleasedYearBarHorizontal } from "@/components/charts/released-year-bar-horizont";
import { ReleasedYearPieChart } from "@/components/charts/released-year-pie-chart";

// Import new secondary chart components
import { LikedVsUnlikedDonut } from "@/components/charts/secondary/LikedVsUnlikedDonut";
import { LikesByDecadeBar } from "@/components/charts/secondary/LikesByDecadeBar";
import { LikesByMonthArea } from "@/components/charts/secondary/LikesByMonthArea";
import { LikesVsUnlikesOverTimeArea } from "@/components/charts/secondary/LikesVsUnlikesOverTimeArea";
import { RatingDistributionBar } from "@/components/charts/secondary/RatingDistributionBar";
import { RatingByDecadeBar } from "@/components/charts/secondary/RatingByDecadeBar";
import { RatingVsUnratedRatio } from "@/components/charts/secondary/RatingVsUnratedRatio";
import { WatchedVsWatchlistBar } from "@/components/charts/secondary/WatchedVsWatchlistBar";
import { WatchlistByDecadeBar } from "@/components/charts/secondary/WatchlistByDecadeBar";
import { YearRewatchesRatio } from "@/components/charts/secondary/YearRewatchesRatio";
import { YearInReviewStats } from "@/components/charts/year-in-review-stats";

// Import data transformers
import {
  transformReleaseYearData,
  transformReleaseYearToDecades,
  transformReleaseYearToEras,
  transformMonthlyData,
  transformYearMonthlyData,
  transformDiaryStats,
  computeReleaseYearInsight,
  computeViewingInsight,
  transformLikesByMonth,
  transformLikesVsUnlikesOverTime,
  computeLikeTimelineInsight,
  transformLikedVsUnliked,
  transformLikesByDecade,
  computeLikeInsight,
  transformRatingDistribution,
  transformRatingByDecade,
  transformRatedVsUnrated,
  computeRatingInsight,
  transformWatchedVsWatchlist,
  transformWatchlistByDecade,
  computeWatchlistInsight,
  filter2025Movies,
  transform2025MonthlyData,
  transform2025Stats,
  transform2025RatingDistribution,
  transform2025RewatchData,
  transform2025LikesAndFavorites,
  compute2025Insight,
} from "@/lib/analytics-transformers";

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
  const watchlist = dataset?.watchlist || [];

  // ========== DATA TRANSFORMATIONS FOR ALL SECTIONS ==========

  // SECTION 1: Your Movie Taste
  const releaseYearData = transformReleaseYearData(movies);
  const decadeData = transformReleaseYearToDecades(movies);
  const eraData = transformReleaseYearToEras(movies);
  const releaseYearInsight = computeReleaseYearInsight(movies, eraData);

  // SECTION 2A: Watching Timeline
  const hasDiaryData = dataset?.uploadedFiles?.includes("diary") ?? false;
  const monthlyData = hasDiaryData ? transformMonthlyData(movies) : [];
  const yearMonthlyData = hasDiaryData ? transformYearMonthlyData(movies) : [];
  const diaryStats = hasDiaryData ? transformDiaryStats(monthlyData, movies.length) : undefined;
  const viewingInsight = analytics ? computeViewingInsight(analytics, monthlyData) : "";

  // SECTION 2B: Like Timeline
  const hasLikesData = movies.some((m: Movie) => m.liked === true) && hasDiaryData;
  const likesByMonth = hasLikesData ? transformLikesByMonth(movies) : [];
  const likesVsUnlikesOverTime = hasLikesData ? transformLikesVsUnlikesOverTime(movies) : [];
  const likeTimelineInsight = hasLikesData ? computeLikeTimelineInsight(likesByMonth) : "";

  // SECTION 3A: Likes Analysis
  const hasMoviesLiked = movies.some((m: Movie) => m.liked === true);
  const likedVsUnliked = hasMoviesLiked ? transformLikedVsUnliked(movies) : null;
  const likesByDecade = hasMoviesLiked ? transformLikesByDecade(movies) : [];
  const likeInsight = hasMoviesLiked ? computeLikeInsight(analytics?.moviesLiked || 0, movies.length) : "";

  // SECTION 3B: Rating Patterns
  const hasRatings = analytics && analytics.moviesRated > 0;
  const ratingDistribution = hasRatings
    ? transformRatingDistribution(analytics?.ratingDistribution || {})
    : [];
  const ratingByDecade = hasRatings ? transformRatingByDecade(movies) : [];
  const ratedVsUnrated = hasRatings ? transformRatedVsUnrated(movies) : null;
  const ratingInsight = analytics ? computeRatingInsight(analytics) : "";

  // SECTION 4: Watchlist
  const hasWatchlist = watchlist && watchlist.length > 0;
  const watchedVsWatchlist = hasWatchlist ? transformWatchedVsWatchlist(movies, watchlist) : null;
  const watchlistByDecade = hasWatchlist ? transformWatchlistByDecade(movies, watchlist) : [];
  const watchlistInsight = hasWatchlist ? computeWatchlistInsight(movies, watchlist) : "";

  // SECTION 5: 2025 Year in Review
  const movies2025 = filter2025Movies(movies);
  const has2025Data = movies2025.length > 0;
  const monthly2025Data = has2025Data ? transform2025MonthlyData(movies) : [];
  const stats2025 = has2025Data ? transform2025Stats(movies2025) : null;
  const rating2025Distribution = has2025Data ? transform2025RatingDistribution(movies2025) : [];
  const rewatch2025Data = has2025Data ? transform2025RewatchData(movies2025) : null;
  const likes2025Data = has2025Data ? transform2025LikesAndFavorites(movies2025) : null;
  const insight2025 = stats2025 ? compute2025Insight(stats2025, movies.length) : "";

  return (
    <div className="flex-1 overflow-auto scroll-smooth">
      <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full">
        {/* ============================================================================ */}
        {/* STATS OVERVIEW - KPI Cards */}
        {/* ============================================================================ */}
        <StatsOverview
          analytics={analytics}
          profile={dataset?.userProfile}
          isLoading={!analytics}
        />

        {/* ============================================================================ */}
        {/* SECTION 1: YOUR MOVIE TASTE */}
        {/* ============================================================================ */}
        {Object.keys(releaseYearData).length > 0 && (
          <SectionLayout>
            <SectionLayout.Header
              title="Your Movie Taste"
              description="Explore the release years and eras of movies you watch"
              insight={releaseYearInsight}
            />

            <SectionLayout.Primary>
              <ReleasedYearAnalysis data={releaseYearData} />
            </SectionLayout.Primary>

            {(decadeData.length > 0 || eraData.length > 0) && (
              <SectionLayout.Secondary>
                {decadeData.length > 0 && (
                  <div>
                    <ReleasedYearBarHorizontal data={decadeData} />
                  </div>
                )}
                {eraData.length > 0 && (
                  <div>
                    <ReleasedYearPieChart data={eraData} />
                  </div>
                )}
              </SectionLayout.Secondary>
            )}
          </SectionLayout>
        )}

        {/* ============================================================================ */}
        {/* SECTION 2: YOUR VIEWING PROFILE */}
        {/* ============================================================================ */}
        {loading && hasDiaryData ? (
          <SectionLayout.Loading />
        ) : (
          <SectionLayout>
            <SectionLayout.Header
              title="Your Viewing Profile"
              description="Discover when and how often you watch movies"
            />

            {!hasDiaryData ? (
              <SectionLayout.Empty
                message="Upload your diary.csv to unlock viewing insights and discover your watching patterns over time."
                actionText="Upload Diary"
                onAction={onUploadClick}
              />
            ) : (
              <>
                {/* SUBSECTION 2A: Watching Timeline */}
                <SectionLayout>
                  <SectionLayout.Header
                    title="Watching Timeline"
                    description="Your viewing activity over time"
                    insight={viewingInsight}
                  />

                  {diaryStats && (
                    <>
                      <DiaryStatistics stats={diaryStats} />
                    </>
                  )}

                  {monthlyData.length > 0 && (
                    <>
                      <SectionLayout.Primary>
                        <DiaryAreaChart data={monthlyData} />
                      </SectionLayout.Primary>

                    </>
                  )}
                </SectionLayout>

                {/* SUBSECTION 2B: Like Timeline */}
                {hasLikesData && (
                  <SectionLayout>
                    <SectionLayout.Header
                      title="Like Timeline"
                      description="When did you start liking movies?"
                      insight={likeTimelineInsight}
                    />

                    {likesByMonth.length > 0 && (
                      <>
                        <SectionLayout.Primary>
                          <LikesByMonthArea data={likesByMonth} />
                        </SectionLayout.Primary>

                        <SectionLayout.Secondary>
                          <div className="col-span-1 md:col-span-2">
                            <LikesVsUnlikesOverTimeArea data={likesVsUnlikesOverTime} />
                          </div>
                        </SectionLayout.Secondary>
                      </>
                    )}
                  </SectionLayout>
                )}
              </>
            )}
          </SectionLayout>
        )}

        {/* ============================================================================ */}
        {/* SECTION 3: LIKES & RATINGS */}
        {/* ============================================================================ */}
        {(hasMoviesLiked || hasRatings) && (
          <SectionLayout>
            <SectionLayout.Header
              title="Likes & Ratings"
              description="How you feel about the movies you watch"
            />

            {/* SUBSECTION 3A: Likes Analysis */}
            {hasMoviesLiked && (
              <SectionLayout>
                <SectionLayout.Header
                  title="Your Likes"
                  description="Which movies do you love?"
                  insight={likeInsight}
                />

                {likedVsUnliked && (
                  <>
                    <SectionLayout.Primary>
                      <LikedVsUnlikedDonut data={likedVsUnliked} />
                    </SectionLayout.Primary>

                    {likesByDecade.length > 0 && (
                      <SectionLayout.Secondary>
                        <div className="col-span-1">
                          <LikesByDecadeBar data={likesByDecade} />
                        </div>
                      </SectionLayout.Secondary>
                    )}
                  </>
                )}
              </SectionLayout>
            )}

            {/* SUBSECTION 3B: Rating Patterns */}
            {hasRatings && (
              <SectionLayout>
                <SectionLayout.Header
                  title="Rating Patterns"
                  description="How you rate the movies you watch"
                  insight={ratingInsight}
                />

                {ratingDistribution.length > 0 && (
                  <>
                    <SectionLayout.Primary>
                      <RatingDistributionBar data={ratingDistribution} />
                    </SectionLayout.Primary>

                    <SectionLayout.Secondary>
                      {ratingByDecade.length > 0 && (
                        <div className="col-span-1">
                          <RatingByDecadeBar data={ratingByDecade} />
                        </div>
                      )}
                      {ratedVsUnrated && (
                        <div className="col-span-1">
                          <RatingVsUnratedRatio data={ratedVsUnrated} />
                        </div>
                      )}
                    </SectionLayout.Secondary>
                  </>
                )}
              </SectionLayout>
            )}
          </SectionLayout>
        )}

        {/* ============================================================================ */}
        {/* SECTION 4: WATCHLIST INSIGHTS */}
        {/* ============================================================================ */}
        {hasWatchlist && (
          <SectionLayout>
            <SectionLayout.Header
              title="Watchlist Insights"
              description="Explore movies you want to watch"
              insight={watchlistInsight}
            />

            {watchedVsWatchlist && (
              <>
                <SectionLayout.Primary>
                  <WatchedVsWatchlistBar data={watchedVsWatchlist} />
                </SectionLayout.Primary>

                {watchlistByDecade.length > 0 && (
                  <SectionLayout.Secondary>
                    <div className="col-span-1 md:col-span-2">
                      <WatchlistByDecadeBar data={watchlistByDecade} />
                    </div>
                  </SectionLayout.Secondary>
                )}
              </>
            )}
          </SectionLayout>
        )}

        {/* ============================================================================ */}
        {/* SECTION 5: 2025 YEAR IN REVIEW */}
        {/* ============================================================================ */}
        <SectionLayout>
          <SectionLayout.Header
            title="2025 Year in Review"
            description="Your cinematic journey through the year"
            insight={insight2025}
          />

          {!has2025Data ? (
            <SectionLayout.Empty
              message="No movies watched in 2025 yet. Start logging your 2025 watches to see your year in review!"
            />
          ) : (
            <>
              {stats2025 && <YearInReviewStats stats={stats2025} />}

              {monthly2025Data.length > 0 && (
                <>
                  <SectionLayout.Primary>
                    <DiaryAreaChart data={monthly2025Data} />
                  </SectionLayout.Primary>

                  <SectionLayout.Secondary>
                    {rating2025Distribution.length > 0 && (
                      <div className="col-span-1">
                        <RatingDistributionBar data={rating2025Distribution} />
                      </div>
                    )}
                    {rewatch2025Data && (
                      <div className="col-span-1">
                        <YearRewatchesRatio data={rewatch2025Data} />
                      </div>
                    )}
                    {likes2025Data && (
                      <div className="col-span-1 md:col-span-2">
                        <LikedVsUnlikedDonut data={likes2025Data} />
                      </div>
                    )}
                  </SectionLayout.Secondary>
                </>
              )}
            </>
          )}
        </SectionLayout>
      </div>
    </div>
  );
}

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
import { ViewingRhythmInsights } from "@/components/charts/viewing-rhythm-insights";
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
import { YearRewatchesRatio } from "@/components/charts/secondary/YearRewatchesRatio";
import { YearInReviewStats } from "@/components/charts/year-in-review-stats";
import { YearlyComparisonChart } from "@/components/charts/yearly-comparison-chart";
import { YearlyTotalsBarChart } from "@/components/charts/yearly-totals-bar-chart";

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
  computeWatchlistInsight,
  filter2025Movies,
  transform2025MonthlyData,
  transform2025Stats,
  transform2025RatingDistribution,
  transform2025RewatchData,
  transform2025LikesAndFavorites,
  compute2025Insight,
  transformYearlyComparison,
  transformYearlyTotals,
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
        <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full min-w-0">
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
  // Always compute data (now has fallback logic to use dateMarkedWatched)
  const monthlyData = transformMonthlyData(movies);
  const yearMonthlyData = transformYearMonthlyData(movies);
  const diaryStats = monthlyData.length > 0 ? transformDiaryStats(monthlyData, movies) : undefined;
  const viewingInsight = analytics && diaryStats ? computeViewingInsight(analytics, monthlyData, diaryStats) : "";
  const yearlyComparisonData = transformYearlyComparison(movies);
  const yearlyTotalsData = transformYearlyTotals(movies);

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
      <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full min-w-0">
        {/* ============================================================================ */}
        {/* INTRO SECTION - Shown when no profile data */}
        {/* ============================================================================ */}
        {!dataset?.userProfile && (
          <div className="space-y-6 pb-36 border-b-2 border-slate-200 dark:border-white/10">
            <SectionLayout.Header
              title="Welcome to Your Cinematic Identity"
              subtitle="Discover the data behind your film taste"
              description="Upload your Letterboxd data to begin exploring your viewing habits, preferences, and cinematic journey. This dashboard reveals patterns in what you watch, when you watch it, and how you feel about cinema."
            />
          </div>
        )}

        {/* ============================================================================ */}
        {/* STATS OVERVIEW - KPI Cards */}
        {/* ============================================================================ */}
        <StatsOverview
          analytics={analytics}
          profile={dataset?.userProfile}
          isLoading={!analytics}
        />

        {/* ============================================================================ */}
        {/* SECTION 1: YOUR CINEMATIC TIMELINE */}
        {/* ============================================================================ */}
        {Object.keys(releaseYearData).length > 0 && (
          <SectionLayout>
            <SectionLayout.Header
              title="Your Cinematic Timeline"
              subtitle="A chronological map of the film history you've explored"
              description="This section analyzes your viewing habits through the lens of release years. By mapping watched films across decades and major cinematic eras—from the Golden Age of Hollywood to contemporary cinema—it reveals which periods of film history most strongly shape your personal canon."
              insight={releaseYearInsight}
              highlightWord="Cinematic"
              highlightColor="#3b82f6"
              showDescription={true}
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
        {/* SECTION 2: VIEWING RHYTHM */}
        {/* ============================================================================ */}
        {loading && monthlyData.length > 0 ? (
          <SectionLayout.Loading />
        ) : (
          <SectionLayout>
            <SectionLayout.Header
              title="Viewing Rhythm"
              subtitle="The tempo of your movie-watching life, month by month"
              description="An examination of your engagement over time. This analysis highlights peak viewing periods and quieter months, visualizing how your watching frequency fluctuates across the calendar year and over longer historical spans."
              highlightWord="Viewing"
              highlightColor="#06b6d4"
              showDescription={monthlyData.length > 0}
            />

            {monthlyData.length === 0 ? (
              <SectionLayout.EmptyWithSplit
                subtitle="The tempo of your movie-watching life, month by month"
                description="An examination of your engagement over time. This analysis highlights peak viewing periods and quieter months, visualizing how your watching frequency fluctuates across the calendar year and over longer historical spans."
                requiredFiles={["diary.csv or watched.csv with dates"]}
                actionText="Upload Data"
                onAction={onUploadClick}
              />
            ) : (
              <>
                {/* TOP SECTION: Insights & Summary */}
                {viewingInsight ? (
                  <ViewingRhythmInsights insight={viewingInsight} />
                ) : (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                    Loading insights...
                  </div>
                )}

                {/* MAIN SECTION: Stats (left 1/4) + Chart (right 3/4) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left: Statistics (1/4 width on desktop) */}
                  <div className="lg:col-span-1">
                    {diaryStats ? (
                      <DiaryStatistics stats={diaryStats} />
                    ) : (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                        Loading statistics...
                      </div>
                    )}
                  </div>

                  {/* Right: Chart (3/4 width on desktop) */}
                  <div className="lg:col-span-3">
                    {monthlyData.length > 0 ? (
                      <DiaryAreaChart data={monthlyData} />
                    ) : (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                        No monthly data available - diary may not have date information
                      </div>
                    )}
                  </div>
                </div>

                {/* SECONDARY SECTION: Yearly Comparison */}
                <SectionLayout.Secondary>
                  <YearlyComparisonChart data={yearlyComparisonData} />
                  <YearlyTotalsBarChart data={yearlyTotalsData} />
                </SectionLayout.Secondary>

                {/* SUBSECTION 2B: Like Timeline */}
                {hasLikesData && (
                  <SectionLayout.Subsection>
                    <SectionLayout.SubHeader
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
                  </SectionLayout.Subsection>
                )}
              </>
            )}
          </SectionLayout>
        )}

        {/* ============================================================================ */}
        {/* SECTION 3: TASTE, PREFERENCE, AND JUDGMENT */}
        {/* ============================================================================ */}
        {(hasMoviesLiked || hasRatings) && (
          <SectionLayout>
            <SectionLayout.Header
              title="Taste, Preference, and Judgment"
              subtitle="How you evaluate cinema—and what it says about your taste"
              description="A breakdown of how you rate what you watch. Compare Liked versus Unliked films, explore your rating distribution, and identify patterns across decades. This section reveals whether your preferences gravitate toward critically acclaimed classics, specific eras, or more overlooked, under-the-radar films."
              highlightWord="Preference"
              highlightColor="#f59e0b"
              showDescription={Boolean(hasMoviesLiked || hasRatings)}
            />

            {/* SUBSECTION 3A: Likes Analysis */}
            {hasMoviesLiked && (
              <SectionLayout.Subsection>
                <SectionLayout.SubHeader
                  title="Your Likes"
                  description="Which movies do you love?"
                  insight={likeInsight}
                />

                {likedVsUnliked ? (
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
                ) : (
                  <SectionLayout.EmptyWithSplit
                    subtitle="Which movies do you love?"
                    description="Discover how you express your feelings about films through likes and ratings. Analyze your rating patterns across genres and decades, and understand the relationship between your ratings and your most-loved movies."
                    requiredFiles={["watched.csv with like markers"]}
                    actionText="Mark Likes on Letterboxd"
                  />
                )}
              </SectionLayout.Subsection>
            )}

            {/* SUBSECTION 3B: Rating Patterns */}
            {hasRatings && (
              <SectionLayout.Subsection>
                <SectionLayout.SubHeader
                  title="Rating Patterns"
                  description="How you rate the movies you watch"
                  insight={ratingInsight}
                />

                {ratingDistribution.length > 0 ? (
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
                ) : (
                  <SectionLayout.EmptyWithSplit
                    subtitle="How you rate the movies you watch"
                    description="A breakdown of how you rate what you watch. Compare Liked versus Unliked films, explore your rating distribution, and identify patterns across decades. This section reveals whether your preferences gravitate toward critically acclaimed classics, specific eras, or more overlooked, under-the-radar films."
                    requiredFiles={["ratings.csv"]}
                    actionText="Upload Ratings"
                    onAction={onUploadClick}
                  />
                )}
              </SectionLayout.Subsection>
            )}
          </SectionLayout>
        )}

        {/* ============================================================================ */}
        {/* SECTION 4: PLANNED VS. WATCHED */}
        {/* ============================================================================ */}
        <SectionLayout>
          <SectionLayout.Header
            title="Planned vs. Watched"
            subtitle="The gap between intention and experience"
            description="An analysis of your cinematic backlog. This section compares your watchlist against completed viewings and breaks down unwatched titles by decade, highlighting which eras and movements you are most eager to explore next."
            highlightWord="Watched"
            highlightColor="#8b5cf6"
            showDescription={hasWatchlist}
          />

          {!hasWatchlist ? (
            <SectionLayout.EmptyWithSplit
              subtitle="The gap between intention and experience"
              description="An analysis of your cinematic backlog. This section compares your watchlist against completed viewings and breaks down unwatched titles by decade, highlighting which eras and movements you are most eager to explore next."
              requiredFiles={["watchlist.csv"]}
              actionText="Upload Watchlist"
              onAction={onUploadClick}
            />
          ) : (
            <div className="text-center p-8 text-slate-600 dark:text-slate-400">
              Watchlist content coming soon
            </div>
          )}
        </SectionLayout>

        {/* ============================================================================ */}
        {/* SECTION 5: YOUR YEAR IN FILM */}
        {/* ============================================================================ */}
        <SectionLayout>
          <SectionLayout.Header
            title="Your Year in Film"
            subtitle="A concise summary of volume, taste, and discovery"
            description="A high-level snapshot of the past twelve months. This review highlights total films watched, average ratings, rewatches, standout discoveries, and the decades that defined your year—capturing both breadth and depth of your viewing habits."
            insight={insight2025}
            highlightWord="Year"
            highlightColor="#ec4899"
            showDescription={has2025Data}
          />

          {!has2025Data ? (
            <SectionLayout.EmptyWithSplit
              subtitle="A concise summary of volume, taste, and discovery"
              description="A high-level snapshot of the past twelve months. This review highlights total films watched, average ratings, rewatches, standout discoveries, and the decades that defined your year—capturing both breadth and depth of your viewing habits."
              requiredFiles={["diary.csv (with 2025 entries)"]}
              actionText="Upload Diary"
              onAction={onUploadClick}
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

        {/* ============================================================================ */}
        {/* SECTION 6: THE CANON */}
        {/* ============================================================================ */}
        <SectionLayout>
          <SectionLayout.Header
            title="The Canon"
            subtitle="Essential Cinema Collections"
            description="Track your progress through the world's most iconic film lists and cinematic movements. See how much of the 'Top 250' or specific genres (like French New Wave or Noir) you've conquered compared to the global film community."
            highlightWord="Canon"
            highlightColor="#10b981"
            showDescription={true}
          />

          <div className="text-center p-8 text-slate-600 dark:text-slate-400">
            <p className="mb-4">Essential cinema collections coming soon</p>
            <p className="text-sm">Track progress through iconic film lists and cinematic movements</p>
          </div>
        </SectionLayout>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAnalyticsStore } from "@/hooks/use-analytics-store";
import type { Movie } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Film } from "lucide-react";

import { StatsOverview } from "./stats-overview";
import { AnalyticsEmptyState } from "./analytics-empty-state";
import { AnalyticsSkeleton } from "./analytics-skeleton";
import { SectionLayout } from "./SectionLayout";

// Import chart components from barrel export
import {
  // Timeline
  ViewingTimelineArea,
  YearOverYearArea,
  // Distribution
  RatingDistributionBar,
  ReleaseYearDistributionBar,
  LikedRatingDistributionBar,
  // Decades
  ReleaseByEraPie,
  ReleaseByDecadeBar,
  TopRatedDecadesBar,
  FavoriteDecadesBar,
  // Ratios
  RatedRatioRadial,
  LikedRatioRadial,
  WatchlistProgressRadial,
  // Progress
  WatchlistProgressChart,
  CanonListsGrid,
  // Stats
  DiaryStats,
  YearInReviewStats,
  // Totals
  AnnualSummaryBar,
  FilmsByDecadeBar,
} from "@/components/charts";

// Import data transformers
import {
  transformReleaseYearData,
  transformReleaseYearToDecades,
  transformReleaseYearToFiveYearPeriods,
  transformReleaseYearToEras,
  transformMonthlyData,
  transformDiaryStats,
  computeReleaseYearInsight,
  computeViewingInsight,
  transformLikesByDecade,
  transformRatingDistribution,
  transformRatingByDecade,
  transformTastePreferenceStats,
  transformMostLikedDecade,
  transformBestRatedDecade,
  transformLikedMoviesRatingDistribution,
  transformWatchedVsWatchlist,
  transformWatchlistByDecade,
  transformWatchlistByFiveYear,
  computeWatchlistInsight,
  filter2025Movies,
  transform2025MonthlyData,
  transform2025Stats,
  transform2025RatingDistribution,
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth" data-analytics-scroll-container>
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
  const monthlyData = transformMonthlyData(movies);
  const diaryStats = monthlyData.length > 0 ? transformDiaryStats(monthlyData, movies) : undefined;
  const viewingInsight = analytics && diaryStats ? computeViewingInsight(analytics, monthlyData, diaryStats) : "";
  const yearlyComparisonData = transformYearlyComparison(movies);
  const yearlyTotalsData = transformYearlyTotals(movies);

  // SECTION 3A: Likes Analysis
  const hasMoviesLiked = movies.some((m: Movie) => m.liked === true);
  const likesByDecade = hasMoviesLiked ? transformLikesByDecade(movies) : [];

  // SECTION 3B: Rating Patterns
  const hasRatings = analytics && analytics.moviesRated > 0;
  const ratingDistribution = hasRatings
    ? transformRatingDistribution(analytics?.ratingDistribution || {})
    : [];
  const ratingByDecade = hasRatings ? transformRatingByDecade(movies) : [];

  // SECTION 3: Overall Taste & Preference Stats
  const tastePreferenceStats = (hasMoviesLiked || hasRatings)
    ? transformTastePreferenceStats(movies)
    : null;
  const mostLikedDecadeData = hasMoviesLiked ? transformMostLikedDecade(movies) : [];
  const bestRatedDecadeData = hasRatings ? transformBestRatedDecade(movies) : [];
  const likedMoviesRatingDistribution = hasMoviesLiked ? transformLikedMoviesRatingDistribution(movies) : [];

  // SECTION 4: Watchlist
  const hasWatchlist = watchlist && watchlist.length > 0;
  const watchlistInsight = hasWatchlist ? computeWatchlistInsight(movies, watchlist) : "";
  const watchedVsWatchlistData = hasWatchlist ? transformWatchedVsWatchlist(movies, watchlist) : null;
  const watchlistByDecadeData = hasWatchlist ? transformWatchlistByDecade(movies, watchlist) : [];
  const watchlistByFiveYearData = hasWatchlist ? transformWatchlistByFiveYear(movies, watchlist) : [];

  // SECTION 5: 2025 Year in Review
  const movies2025 = filter2025Movies(movies);
  const has2025Data = movies2025.length > 0;
  const monthly2025Data = has2025Data ? transform2025MonthlyData(movies) : [];
  const stats2025 = has2025Data ? transform2025Stats(movies2025) : null;
  const rating2025Distribution = has2025Data ? transform2025RatingDistribution(movies2025) : [];
  const decade2025Data = has2025Data ? transformReleaseYearToDecades(movies2025) : [];
  const fiveYear2025Data = has2025Data ? transformReleaseYearToFiveYearPeriods(movies2025) : [];
  const insight2025 = stats2025 ? compute2025Insight(stats2025, movies.length) : "";

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth" data-analytics-scroll-container>
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
        <div className="pb-16 mb-8 border-b-2 border-slate-200 dark:border-white/10">
          <StatsOverview
            analytics={analytics}
            profile={dataset?.userProfile}
            isLoading={!analytics}
          />
        </div>

        {/* ============================================================================ */}
        {/* SECTION 1: YOUR CINEMATIC TIMELINE */}
        {/* ============================================================================ */}
        {Object.keys(releaseYearData).length > 0 && (
          <SectionLayout id="cinematic-timeline">
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
              <ReleaseYearDistributionBar data={releaseYearData} />
            </SectionLayout.Primary>

            {(decadeData.length > 0 || eraData.length > 0) && (
              <SectionLayout.Secondary>
                {decadeData.length > 0 && (
                  <div>
                    <ReleaseByDecadeBar data={decadeData} />
                  </div>
                )}
                {eraData.length > 0 && (
                  <div>
                    <ReleaseByEraPie data={eraData} />
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
          <SectionLayout id="viewing-rhythm">
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
                {/* MAIN SECTION: Stats (left 1/4) + Chart (right 3/4) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left: Statistics (1/4 width on desktop) */}
                  <div className="lg:col-span-1">
                    {diaryStats ? (
                      <DiaryStats stats={diaryStats} />
                    ) : (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                        Loading statistics...
                      </div>
                    )}
                  </div>

                  {/* Right: Chart (3/4 width on desktop) */}
                  <div className="lg:col-span-3">
                    {monthlyData.length > 0 ? (
                      <ViewingTimelineArea data={monthlyData} />
                    ) : (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                        No monthly data available - diary may not have date information
                      </div>
                    )}
                  </div>
                </div>

                {/* SECONDARY SECTION: Yearly Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-7 auto-rows-[minmax(320px,auto)] gap-6">
                  <div className="md:col-span-4">
                    <YearOverYearArea data={yearlyComparisonData} />
                  </div>
                  <div className="md:col-span-3">
                    <AnnualSummaryBar data={yearlyTotalsData} />
                  </div>
                </div>
              </>
            )}
          </SectionLayout>
        )}

        {/* ============================================================================ */}
        {/* SECTION 3: TASTE, PREFERENCE, AND JUDGMENT */}
        {/* ============================================================================ */}
        {(hasMoviesLiked || hasRatings) && (
          <SectionLayout id="taste-judgment">
            <SectionLayout.Header
              title="Taste, Preference, and Judgment"
              subtitle="How you evaluate cinema—and what it says about your taste"
              description="A breakdown of how you rate what you watch. Compare Liked versus Unliked films, explore your rating distribution, and identify patterns across decades. This section reveals whether your preferences gravitate toward critically acclaimed classics, specific eras, or more overlooked, under-the-radar films."
              highlightWord="Preference"
              highlightColor="#f59e0b"
              showDescription={Boolean(hasMoviesLiked || hasRatings)}
            />

            {/* LAYOUT: 2 Columns - Rated (Left) and Liked (Right) */}
            {tastePreferenceStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT COLUMN: Rated Stats */}
                <div className="flex flex-col gap-6">
                  {/* Rated Movies Radial */}
                  {hasRatings && (
                    <RatedRatioRadial
                      data={{
                        watched: tastePreferenceStats.watched,
                        rated: tastePreferenceStats.rated
                      }}
                    />
                  )}

                  {/* Rating Distribution */}
                  {ratingDistribution.length > 0 && (
                    <RatingDistributionBar data={ratingDistribution} />
                  )}

                  {/* Best Rated Decade */}
                  {hasRatings && (
                    <TopRatedDecadesBar data={bestRatedDecadeData} />
                  )}
                </div>

                {/* RIGHT COLUMN: Liked Stats */}
                <div className="flex flex-col gap-6">
                  {/* Liked Movies Radial */}
                  {hasMoviesLiked && (
                    <LikedRatioRadial
                      data={{
                        watched: tastePreferenceStats.watched,
                        liked: tastePreferenceStats.liked
                      }}
                    />
                  )}

                  {/* Liked Movies Rating Distribution */}
                  {hasMoviesLiked && (
                    <LikedRatingDistributionBar data={likedMoviesRatingDistribution} />
                  )}

                  {/* Most Liked Decade */}
                  {hasMoviesLiked && mostLikedDecadeData.length > 0 && (
                    <FavoriteDecadesBar data={mostLikedDecadeData} />
                  )}
                </div>
              </div>
            )}

            
          </SectionLayout>
        )}

        {/* ============================================================================ */}
        {/* SECTION 4: PLANNED VS. WATCHED */}
        {/* ============================================================================ */}
        <SectionLayout id="planned-watched">
          <SectionLayout.Header
            title="Planned vs. Watched"
            subtitle="The gap between intention and experience"
            description="An analysis of your cinematic backlog. This section compares your watchlist against completed viewings and breaks down unwatched titles by decade, highlighting which eras and movements you are most eager to explore next."
            insight={watchlistInsight}
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
            <>
              {watchedVsWatchlistData && (
                <div className="grid grid-cols-1 lg:grid-cols-4 auto-rows-[minmax(300px,auto)] gap-6">
                  {/* Left: Statistics (smaller) */}
                  <div className="lg:col-span-1">
                    <WatchlistProgressRadial data={watchedVsWatchlistData} />
                  </div>

                  {/* Right: Primary Chart (larger) */}
                  <div className="lg:col-span-3">
                    {watchlistByDecadeData.length > 0 ? (
                      <WatchlistProgressChart
                        decadeData={watchlistByDecadeData}
                        fiveYearData={watchlistByFiveYearData}
                      />
                    ) : (
                      <Card className="h-full flex items-center justify-center border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
                        <CardContent className="text-center py-12">
                          <div className="text-muted-foreground">
                            <Film className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p className="text-sm">No decade data available</p>
                            <p className="text-xs mt-2 opacity-70">Upload data with release years to see the breakdown</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </SectionLayout>

        {/* ============================================================================ */}
        {/* SECTION 5: YOUR YEAR IN FILM */}
        {/* ============================================================================ */}
        <SectionLayout id="year-in-film">
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
              {/* First row: Quick Stats (2/3) + Rating Distribution (1/3) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats2025 && (
                  <div className="md:col-span-2">
                    <YearInReviewStats stats={stats2025} />
                  </div>
                )}
                {rating2025Distribution.length > 0 && (
                  <div className="md:col-span-1">
                    <RatingDistributionBar data={rating2025Distribution} />
                  </div>
                )}
              </div>

              {/* Second row: Timeline + Decade Chart */}
              {monthly2025Data.length > 0 && (
                <SectionLayout.Secondary>
                  <ViewingTimelineArea data={monthly2025Data} />
                  {decade2025Data.length > 0 && fiveYear2025Data.length > 0 && (
                    <FilmsByDecadeBar decadeData={decade2025Data} fiveYearData={fiveYear2025Data} />
                  )}
                </SectionLayout.Secondary>
              )}
            </>
          )}
        </SectionLayout>

        {/* ============================================================================ */}
        {/* SECTION 6: THE CANON */}
        {/* ============================================================================ */}
        <SectionLayout id="the-canon">
          <SectionLayout.Header
            title="The Canon"
            subtitle="Essential Cinema Collections"
            description="Track your progress through the world's most iconic film lists and cinematic movements. Discover how many classics from the IMDb Top 250, Oscar Best Picture winners, Cannes Palme d'Or, AFI's greatest films, and Letterboxd Top 250 you've watched."
            highlightWord="Canon"
            highlightColor="#10b981"
            showDescription={true}
          />

          <CanonListsGrid />
        </SectionLayout>
      </div>
    </div>
  );
}

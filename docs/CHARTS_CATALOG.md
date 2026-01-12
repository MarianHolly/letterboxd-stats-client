# Charts Catalog

> **Complete visual reference for all 27 chart components** in the Letterboxd Stats application. Use this as a reference when building new features, adding charts, or understanding the analytics dashboard.

**Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Chart Directory by Category](#chart-directory-by-category)
   - [Timeline Charts (4)](#timeline-charts-4-components)
   - [Distribution Charts (3)](#distribution-charts-3-components)
   - [Decade-Based Charts (7)](#decade-based-charts-7-components)
   - [Ratio/Gauge Charts (4)](#ratiogauge-charts-4-components)
   - [Progress Tracking (4)](#progress-tracking-charts-4-components)
   - [Statistics Displays (3)](#statistics-displays-3-components)
   - [Totals Charts (1)](#totals-charts-1-component)
3. [Chart Selection Guide](#chart-selection-guide)
4. [Common Patterns](#common-patterns)
5. [Adding New Charts](#adding-new-charts)

---

## Overview

The Letterboxd Stats application features **27 interactive chart components** organized into 7 categories. All charts are built using:
- **Recharts** for visualizations
- **shadcn/ui Card** components for consistent layout
- **Tailwind CSS** for styling and dark mode support
- **TypeScript** for type safety

### Chart Categories Summary

| Category | Count | Purpose |
|----------|-------|---------|
| **Timeline** | 4 | Show trends over time (monthly, yearly) |
| **Distribution** | 3 | Show breakdowns and patterns (ratings, years) |
| **Decade-Based** | 7 | Analyze viewing by decade/era |
| **Ratio/Gauge** | 4 | Show percentages and completion rates |
| **Progress** | 4 | Track watchlist and canon list progress |
| **Statistics** | 3 | Display key metrics and summaries |
| **Totals** | 1 | Annual summary bar chart |
| **TOTAL** | **27** | |

---

## Chart Directory by Category

### Timeline Charts (4 components)

Charts that visualize data over time periods (months, years).

#### 1. ViewingTimelineArea

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/timeline/ViewingTimelineArea.tsx` |
| **Chart Type** | Area Chart |
| **Purpose** | Display monthly viewing trends over time with smoothing options |
| **Data Required** | Array of `{month: string, count: number}` |
| **Features** | - Monthly/2-month averaging toggle<br>- Interpolated data for smooth curves<br>- Year boundary reference lines<br>- Gradient fill |
| **Empty State** | "No data available. Upload your diary data to see your timeline." |

**Data Interface:**
```typescript
interface ViewingTimelineAreaProps {
  data: Array<{
    month: string;  // e.g., "Jan 2024"
    count: number;  // Number of movies watched
  }>;
}
```

**Usage Example:**
```tsx
<ViewingTimelineArea data={monthlyViewingData} />
```

**Visual Notes:**
- Uses `var(--chart-1)` color (blue gradient)
- Shows "Watching Timeline" title
- Responsive: adapts labels for mobile/desktop

---

#### 2. YearOverYearArea

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/timeline/YearOverYearArea.tsx` |
| **Chart Type** | Area Chart (multi-series) |
| **Purpose** | Compare viewing patterns across multiple years |
| **Data Required** | Array of `{month: string, [year]: number}` (dynamic years) |
| **Features** | - Overlapping area charts for each year<br>- Semi-transparent fills<br>- Month labels (Jan, Feb, etc.)<br>- Legend for years |
| **Empty State** | "Not enough data" message |

**Usage Example:**
```tsx
<YearOverYearArea data={yearComparisonData} />
```

---

#### 3. LikesOverTimeArea

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/timeline/LikesOverTimeArea.tsx` |
| **Chart Type** | Area Chart |
| **Purpose** | Show when user liked films over time |
| **Data Required** | Array of `{month: string, count: number}` (liked films) |
| **Features** | - Purple/maroon color scheme<br>- Smooth curves<br>- Monthly aggregation |
| **Empty State** | No likes data message |

**Visual Notes:**
- Uses `#9b1c31` (maroon) for liked films
- Shows temporal patterns in liking behavior

---

#### 4. LikesByMonthArea

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/timeline/LikesByMonthArea.tsx` |
| **Chart Type** | Area Chart |
| **Purpose** | Show liked films aggregated by calendar month (seasonal patterns) |
| **Data Required** | Array of `{month: string, count: number}` (12 months) |
| **Features** | - Circular month representation<br>- Identifies seasonal liking patterns<br>- 12-month cycle visualization |
| **Empty State** | No seasonal data message |

**Usage Example:**
```tsx
<LikesByMonthArea data={seasonalLikesData} />
```

---

### Distribution Charts (3 components)

Charts that show how data is distributed across categories.

#### 5. RatingDistributionBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/distribution/RatingDistributionBar.tsx` |
| **Chart Type** | Bar Chart (vertical) |
| **Purpose** | Show distribution of user ratings (0.5 to 5.0 stars) |
| **Data Required** | Array of `{rating: string, count: number}` |
| **Features** | - Gold/yellow color (#EFBF04)<br>- Sorted by rating value<br>- Label list showing counts<br>- Rounded bar tops |
| **Empty State** | Returns `null` (no rendering) |

**Data Interface:**
```typescript
interface RatingDistributionBarProps {
  data: Array<{
    rating: string;  // e.g., "4.5"
    count: number;   // Number of films with this rating
  }>
}
```

**Usage Example:**
```tsx
<RatingDistributionBar data={ratingDistribution} />
```

**Visual Notes:**
- Shows "Your Rating Distribution" title
- X-axis: Rating values (0.5, 1.0, ..., 5.0)
- Y-axis: Count of movies

---

#### 6. ReleaseYearDistributionBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/distribution/ReleaseYearDistributionBar.tsx` |
| **Chart Type** | Bar Chart |
| **Purpose** | Show distribution of movies by release year |
| **Data Required** | Array of `{year: string, count: number}` |
| **Features** | - Gradient coloring (past → present)<br>- Decade grouping option<br>- Wide year range support |
| **Empty State** | No release year data |

**Usage Example:**
```tsx
<ReleaseYearDistributionBar data={releaseYearData} />
```

---

#### 7. LikedRatingDistributionBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/distribution/LikedRatingDistributionBar.tsx` |
| **Chart Type** | Bar Chart |
| **Purpose** | Show rating distribution specifically for liked films |
| **Data Required** | Array of `{rating: string, count: number}` (liked films only) |
| **Features** | - Filtered to liked films<br>- Same visual style as RatingDistributionBar<br>- Reveals rating patterns of favorites |
| **Empty State** | No liked films data |

**Usage Example:**
```tsx
<LikedRatingDistributionBar data={likedRatingsData} />
```

---

### Decade-Based Charts (7 components)

Charts analyzing movies by release decade and era.

#### 8. FavoriteDecadesBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/decades/FavoriteDecadesBar.tsx` |
| **Chart Type** | Bar Chart (vertical/stacked) |
| **Purpose** | Show which decades user has liked most |
| **Data Required** | Array of `{decade: string, total: number, liked: number, percentage: number}` |
| **Features** | - Two view modes: Count / Comparison<br>- Stacked bars (liked vs unliked)<br>- Percentage labels<br>- Top decade badge<br>- Interactive mode toggle |
| **Empty State** | Returns `null` |

**Data Interface:**
```typescript
interface FavoriteDecadesBarProps {
  data: Array<{
    decade: string;      // e.g., "1990s"
    total: number;       // Total films from decade
    liked: number;       // Liked films from decade
    percentage: number;  // Liked percentage
  }>
}
```

**Usage Example:**
```tsx
<FavoriteDecadesBar data={favoriteDecadesData} />
```

**Visual Notes:**
- **Count mode**: Shows only liked films with percentage labels
- **Comparison mode**: Stacked bars showing liked vs unliked
- Uses maroon (#9b1c31) for liked, light gray (#e2e8f0) for unliked

---

#### 9. FilmsByDecadeBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/decades/FilmsByDecadeBar.tsx` |
| **Chart Type** | Bar Chart |
| **Purpose** | Show total film count by decade (regardless of likes) |
| **Data Required** | Array of `{decade: string, count: number}` |
| **Features** | - Simple count visualization<br>- All decades represented<br>- Identifies viewing patterns |
| **Empty State** | No decade data |

**Usage Example:**
```tsx
<FilmsByDecadeBar data={decadeCountsData} />
```

---

#### 10. ReleaseByDecadeBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/decades/ReleaseByDecadeBar.tsx` |
| **Chart Type** | Bar Chart |
| **Purpose** | Show distribution of films by release decade |
| **Data Required** | Array of `{decade: string, count: number}` |
| **Features** | - Release-focused (vs watched date)<br>- Shows taste for older/newer cinema<br>- Gradient coloring |
| **Empty State** | No release decade data |

**Usage Example:**
```tsx
<ReleaseByDecadeBar data={releaseDecadeData} />
```

---

#### 11. ReleaseByEraPie

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/decades/ReleaseByEraPie.tsx` |
| **Chart Type** | Pie Chart |
| **Purpose** | Show proportion of films across 4 cinema eras |
| **Data Required** | Array of `{era: string, count: number, fill: string}` |
| **Features** | - 4 slices: Classic, Golden, Modern, Current<br>- Era descriptions and year ranges<br>- Percentage labels<br>- Inner radius (donut style)<br>- Legend with context |
| **Empty State** | "No era data available" |

**Data Interface:**
```typescript
interface ReleaseByEraPieProps {
  data: Array<{
    era: string;   // "Classic", "Golden", "Modern", "Current"
    count: number; // Number of films in era
    fill: string;  // Color hex code
  }>;
}
```

**Era Definitions:**
- **Classic**: 1900–1944 (Silent era and early talkies)
- **Golden**: 1945–1969 (Golden Age of Hollywood)
- **Modern**: 1970–1999 (New Hollywood and blockbusters)
- **Current**: 2000–Present (Digital era and modern cinema)

**Usage Example:**
```tsx
<ReleaseByEraPie data={eraDistributionData} />
```

---

#### 12. TopRatedDecadesBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/decades/TopRatedDecadesBar.tsx` |
| **Chart Type** | Bar Chart (horizontal) |
| **Purpose** | Show which decades user rates highest (average rating) |
| **Data Required** | Array of `{decade: string, avgRating: number, count: number}` |
| **Features** | - Horizontal bars<br>- Sorted by average rating<br>- Shows quality preference<br>- Minimum film count filter |
| **Empty State** | No rating data by decade |

**Usage Example:**
```tsx
<TopRatedDecadesBar data={topRatedDecadesData} />
```

---

#### 13. RatingByDecadeBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/decades/RatingByDecadeBar.tsx` |
| **Chart Type** | Bar Chart |
| **Purpose** | Show average rating for each decade |
| **Data Required** | Array of `{decade: string, avgRating: number}` |
| **Features** | - All decades shown<br>- Average rating per decade<br>- Reveals taste evolution |
| **Empty State** | No rating/decade data |

**Usage Example:**
```tsx
<RatingByDecadeBar data={ratingsByDecadeData} />
```

---

#### 14. LikesByDecadeBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/decades/LikesByDecadeBar.tsx` |
| **Chart Type** | Bar Chart |
| **Purpose** | Show liked films count by decade |
| **Data Required** | Array of `{decade: string, likedCount: number}` |
| **Features** | - Liked films only<br>- Identifies favorite eras<br>- Maroon color scheme |
| **Empty State** | No likes by decade |

**Usage Example:**
```tsx
<LikesByDecadeBar data={likesByDecadeData} />
```

---

### Ratio/Gauge Charts (4 components)

Radial/circular charts showing percentages and ratios.

#### 15. RatedRatioRadial

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/ratios/RatedRatioRadial.tsx` |
| **Chart Type** | Pie Chart (radial gauge) |
| **Purpose** | Show percentage of watched films that are rated |
| **Data Required** | Object with `{watched: number, rated: number}` |
| **Features** | - Donut chart visualization<br>- Rated vs unrated segments<br>- Percentage calculation<br>- Rating profile classification<br>- Responsive layout |
| **Empty State** | No data handling |

**Data Interface:**
```typescript
interface RatedRatioRadialProps {
  data: {
    watched: number;  // Total movies watched
    rated: number;    // Movies with ratings
  }
}
```

**Rating Profiles:**
- **Meticulous Curator**: 95%+ rated
- **Thorough Evaluator**: 80-94% rated
- **Active Rater**: 50-79% rated
- **Selective Rater**: 30-49% rated
- **Minimalist Rater**: <30% rated

**Usage Example:**
```tsx
<RatedRatioRadial data={{ watched: 1000, rated: 850 }} />
```

**Visual Notes:**
- Gold (#EFBF04) for rated, light gray (#e2e8f0) for unrated
- Shows absolute numbers and percentage
- Desktop: Vertical stats layout
- Mobile/Tablet: Horizontal stats layout

---

#### 16. LikedRatioRadial

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/ratios/LikedRatioRadial.tsx` |
| **Chart Type** | Pie Chart (radial gauge) |
| **Purpose** | Show percentage of watched films that are liked |
| **Data Required** | Object with `{watched: number, liked: number}` |
| **Features** | - Similar to RatedRatioRadial<br>- Maroon color for liked<br>- Like behavior profile |
| **Empty State** | No data handling |

**Usage Example:**
```tsx
<LikedRatioRadial data={{ watched: 1000, liked: 150 }} />
```

---

#### 17. RewatchRatioRadial

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/ratios/RewatchRatioRadial.tsx` |
| **Chart Type** | Pie Chart (radial gauge) |
| **Purpose** | Show percentage of films rewatched |
| **Data Required** | Object with `{watched: number, rewatched: number}` |
| **Features** | - Rewatch vs single-watch segments<br>- Rewatch behavior profile<br>- Color coding for engagement |
| **Empty State** | No data handling |

**Usage Example:**
```tsx
<RewatchRatioRadial data={{ watched: 1000, rewatched: 75 }} />
```

---

#### 18. WatchlistProgressRadial

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/ratios/WatchlistProgressRadial.tsx` |
| **Chart Type** | Pie Chart (radial gauge) |
| **Purpose** | Show watchlist completion percentage |
| **Data Required** | Object with `{total: number, watched: number}` |
| **Features** | - Progress visualization<br>- Color changes based on completion<br>- Gamification feel |
| **Empty State** | No watchlist data |

**Color Coding:**
- 🔴 **0-25%**: Red (just started)
- 🟡 **25-75%**: Yellow/Orange (making progress)
- 🟢 **75-100%**: Green (almost done!)

**Usage Example:**
```tsx
<WatchlistProgressRadial data={{ total: 200, watched: 150 }} />
```

---

### Progress Tracking Charts (4 components)

Charts for tracking watchlist and canon list progress.

#### 19. WatchlistProgressChart

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/progress/WatchlistProgressChart.tsx` |
| **Chart Type** | Line/Area Chart (time series) |
| **Purpose** | Show watchlist size over time (growth/shrinkage) |
| **Data Required** | Array of `{date: string, count: number}` |
| **Features** | - Temporal watchlist tracking<br>- Shows add/watch patterns<br>- Trend analysis |
| **Empty State** | No watchlist history |

**Usage Example:**
```tsx
<WatchlistProgressChart data={watchlistHistoryData} />
```

---

#### 20. CanonListsGrid

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/progress/CanonListsGrid.tsx` |
| **Chart Type** | Grid of Cards |
| **Purpose** | Display progress on famous film lists (IMDb Top 250, etc.) |
| **Data Required** | Array of canon list progress objects from `useCanonProgress()` hook |
| **Features** | - Grid layout (1/2/4 columns responsive)<br>- Progress cards for each list<br>- Automated via build script<br>- 10 famous film lists tracked |
| **Empty State** | "Upload your data to see progress" |

**Canon Lists Tracked (10 total):**
1. IMDb Top 250
2. Oscar Best Picture Winners
3. Cannes Palme d'Or Winners
4. AFI 100 Greatest American Films
5. Letterboxd Top 250
6. Edgar Wright's 1000 Favorite Movies
7. Roger Ebert's Great Movies
8. Sight and Sound Greatest Films
9. 1001 Movies You Must See Before You Die
10. Worldwide Box Office All-Time Top 100

**Usage Example:**
```tsx
<CanonListsGrid />
```

**Visual Notes:**
- Responsive grid: 1 col (mobile), 2 cols (tablet), 4 cols (desktop)
- Uses `CanonListCard` component for each list

---

#### 21. CanonListCard

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/progress/CanonListCard.tsx` |
| **Chart Type** | Card with progress indicator |
| **Purpose** | Display individual canon list progress |
| **Data Required** | Object with `{listTitle, total, watched, percentage}` |
| **Features** | - Progress bar<br>- Percentage complete<br>- Film count (watched/total)<br>- List title |
| **Empty State** | N/A (used within CanonListsGrid) |

**Usage Example:**
```tsx
<CanonListCard progress={canonListProgress} />
```

---

#### 22. WatchlistByDecadeBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/progress/WatchlistByDecadeBar.tsx` |
| **Chart Type** | Bar Chart |
| **Purpose** | Show unwatched films on watchlist by decade |
| **Data Required** | Array of `{decade: string, count: number}` (watchlist films) |
| **Features** | - Watchlist-specific breakdown<br>- Reveals what eras user wants to explore<br>- Planning tool |
| **Empty State** | No watchlist decade data |

**Usage Example:**
```tsx
<WatchlistByDecadeBar data={watchlistByDecadeData} />
```

**Visual Notes:**
- Helps users understand their watchlist composition
- Identifies decade gaps to fill

---

### Statistics Displays (3 components)

Text-based statistics components showing key metrics.

#### 23. DiaryStats

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/stats/DiaryStats.tsx` |
| **Chart Type** | Text statistics grid |
| **Purpose** | Display key diary metrics in card format |
| **Data Required** | Object with diary statistics |
| **Features** | - Responsive grid layout<br>- Large numbers with descriptions<br>- Date range display<br>- Mobile/tablet/desktop layouts |
| **Empty State** | "No statistics available. Upload your diary data to see your stats." |

**Data Interface:**
```typescript
interface DiaryStatsProps {
  stats?: {
    totalUniqueMovies?: number;
    totalViewingEvents?: number;
    averagePerMonth?: number;
    busiestMonth?: string;
    busiestMonthCount?: number;
    quietestMonth?: string;
    quietestMonthCount?: number;
    dateRange?: string;
  };
}
```

**Displayed Metrics:**
1. **Unique Movies** - Total different films watched
2. **Total Viewings** - Total viewing events (includes rewatches)
3. **Average per Month** - Monthly viewing rate
4. **Busiest** - Month with most watches + count
5. **Quietest** - Month with fewest watches + count (hidden on mobile)
6. **Date Range** - First to last watch date

**Usage Example:**
```tsx
<DiaryStats stats={diaryStatistics} />
```

**Layout:**
- Mobile: 2x2 grid (hides quietest month)
- Tablet: 5-column row
- Desktop: Vertical stack

---

#### 24. TastePreferenceStats

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/stats/TastePreferenceStats.tsx` |
| **Chart Type** | Text statistics |
| **Purpose** | Show taste profile metrics (favorite genres, directors, etc.) |
| **Data Required** | Object with taste preference data |
| **Features** | - Categorical preferences<br>- Top items lists<br>- Taste insights |
| **Empty State** | No preference data |

**Usage Example:**
```tsx
<TastePreferenceStats data={tastePreferences} />
```

---

#### 25. YearInReviewStats

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/stats/YearInReviewStats.tsx` |
| **Chart Type** | Text statistics |
| **Purpose** | Annual summary statistics for a specific year |
| **Data Required** | Object with year-specific statistics |
| **Features** | - Year filtering<br>- Annual highlights<br>- Year-over-year comparison |
| **Empty State** | No data for selected year |

**Usage Example:**
```tsx
<YearInReviewStats year={2024} data={yearData} />
```

---

### Totals Charts (1 component)

#### 26. AnnualSummaryBar

| Property | Value |
|----------|-------|
| **File Path** | `components/charts/totals/AnnualSummaryBar.tsx` |
| **Chart Type** | Bar Chart |
| **Purpose** | Show total films watched per year |
| **Data Required** | Array of `{year: string, count: number}` |
| **Features** | - Year-by-year totals<br>- Identifies viewing trends<br>- Multi-year comparison |
| **Empty State** | No annual data |

**Usage Example:**
```tsx
<AnnualSummaryBar data={annualTotalsData} />
```

---

## Chart Selection Guide

### When to Use Each Chart Type

#### Question: "How has X changed over time?"
**Use Timeline Charts:**
- ViewingTimelineArea - Monthly trends
- YearOverYearArea - Compare years
- LikesOverTimeArea - Like patterns over time
- LikesByMonthArea - Seasonal patterns

#### Question: "What's the breakdown of X?"
**Use Distribution Charts:**
- RatingDistributionBar - Rating patterns
- ReleaseYearDistributionBar - Films by release year
- LikedRatingDistributionBar - Liked films' ratings

#### Question: "How do different decades/eras compare?"
**Use Decade-Based Charts:**
- FavoriteDecadesBar - Liked films by decade
- FilmsByDecadeBar - Total count by decade
- ReleaseByDecadeBar - Release distribution
- ReleaseByEraPie - Era proportions
- TopRatedDecadesBar - Highest-rated decades
- RatingByDecadeBar - Average rating per decade
- LikesByDecadeBar - Liked count by decade

#### Question: "What percentage of X?"
**Use Ratio/Gauge Charts:**
- RatedRatioRadial - % rated
- LikedRatioRadial - % liked
- RewatchRatioRadial - % rewatched
- WatchlistProgressRadial - Watchlist completion

#### Question: "How much have I completed?"
**Use Progress Tracking:**
- WatchlistProgressChart - Watchlist over time
- CanonListsGrid - Canon list progress
- CanonListCard - Individual list card
- WatchlistByDecadeBar - Watchlist by decade

#### Question: "What are the key numbers?"
**Use Statistics Displays:**
- DiaryStats - Key diary metrics
- TastePreferenceStats - Taste profile
- YearInReviewStats - Annual summary

---

## Common Patterns

### Shared Features Across Charts

1. **Empty States**
   - All charts handle missing/empty data gracefully
   - Show user-friendly messages
   - Guide users to upload data

2. **Dark Mode Support**
   - All charts use Tailwind CSS dark mode variants
   - Colors adapt automatically
   - `dark:` prefix for dark mode styles

3. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: `md:` (768px), `lg:` (1024px)
   - Layout shifts for different screen sizes

4. **Card Wrapper**
   - Most charts wrapped in `shadcn/ui Card` component
   - Consistent border, padding, header structure
   - CardTitle, CardDescription, CardContent pattern

5. **Type Safety**
   - All props interfaces defined
   - TypeScript strict mode
   - No `any` types in chart components

### Chart Configuration

All Recharts components use `ChartConfig`:

```typescript
const chartConfig = {
  dataKey: {
    label: "Display Label",
    color: "var(--chart-1)" // or hex code
  }
} satisfies ChartConfig
```

### Color Palette

**Standard Colors:**
- `--chart-1`: Primary (blue) - Timeline charts
- `#EFBF04`: Gold/yellow - Ratings
- `#9b1c31`: Maroon/red - Liked films
- `#e2e8f0`: Light gray - Unrated/unliked
- Gradient fills: Past → present (muted → vibrant)

---

## Adding New Charts

### Step-by-Step Guide

#### 1. Choose Chart Category

Determine which category your chart belongs to:
- **Timeline**: Shows data over months/years?
- **Distribution**: Shows breakdown/spread?
- **Decade**: Analyzes by decade/era?
- **Ratio**: Shows percentages?
- **Progress**: Tracks completion?
- **Statistics**: Displays key numbers?

#### 2. Create Component File

```bash
# Create in appropriate category folder
touch components/charts/[category]/MyNewChart.tsx
```

#### 3. Component Template

```tsx
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart } from "recharts" // or other Recharts components

interface MyNewChartProps {
  data: Array<{
    // Define your data structure
    category: string;
    value: number;
  }>;
}

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function MyNewChart({ data }: MyNewChartProps) {
  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chart Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
      <CardHeader>
        <CardTitle>Chart Title</CardTitle>
        <CardDescription>Chart description</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data}>
            {/* Add Recharts components */}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
```

#### 4. Add to Analytics Dashboard

```tsx
// In app/analytics/page-client.tsx or analytics-dashboard.tsx
import { MyNewChart } from "@/components/charts/[category]/MyNewChart"

// Add to JSX
<SectionLayout title="My New Section">
  <MyNewChart data={myData} />
</SectionLayout>
```

#### 5. Document in This Catalog

Add entry to appropriate category section above with:
- File path
- Chart type
- Purpose
- Data required
- Features
- Usage example

#### 6. Test Thoroughly

- ✅ Empty state handling
- ✅ Dark mode appearance
- ✅ Mobile responsiveness
- ✅ TypeScript types
- ✅ Data edge cases

---

## Chart Development Best Practices

### Do's ✅

1. **Always handle empty states** - Show helpful messages
2. **Use TypeScript** - Define clear prop interfaces
3. **Support dark mode** - Use Tailwind dark mode variants
4. **Make it responsive** - Test on mobile, tablet, desktop
5. **Use semantic colors** - Match existing color scheme
6. **Add ARIA labels** - Accessibility matters
7. **Keep components pure** - Data fetching should be outside
8. **Use memoization** - `useMemo` for expensive computations
9. **Follow naming conventions** - `[Category][Description][ChartType].tsx`
10. **Document your component** - Add to this catalog

### Don'ts ❌

1. **Don't fetch data in chart components** - Pass data as props
2. **Don't use inline styles** - Use Tailwind classes
3. **Don't hardcode colors** - Use CSS variables or config
4. **Don't ignore empty states** - Always handle `data.length === 0`
5. **Don't skip TypeScript** - No `any` types
6. **Don't forget responsiveness** - Charts should work on all screens
7. **Don't over-complicate** - Keep charts focused and simple
8. **Don't skip accessibility** - Add labels, descriptions, ARIA

---

## Related Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Overall application architecture
- **[DATA_GUIDE.md](./DATA_GUIDE.md)** - Data structures and processing
- **[VISUALIZATION_PHILOSOPHY.md](./VISUALIZATION_PHILOSOPHY.md)** - Chart design principles
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute new charts

---

## Notes

### Chart Count History

- **January 2026**: 27 charts documented (current)
- **Previous ANALYTICS_STRUCTURE.md**: Referenced 7 non-existent charts (outdated)

### Future Additions

Potential new charts to add:
- Genre distribution (if TMDB enrichment added in Phase 2)
- Director breakdown (Phase 2 feature)
- Country distribution (Phase 2 feature)
- Tag cloud visualization
- Correlation charts (rating vs decade, etc.)

---

*Last Updated: January 2026*
*Maintained by: Maria Holly*

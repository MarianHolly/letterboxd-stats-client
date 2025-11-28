# Dashboard Content Implementation Guide
## Developer Quick Reference

**Version**: 1.0  
**For**: Converting DASHBOARD_CONTENT_STRUCTURE.md into working components

---

## Quick Start Checklist

### 1. Section Component Structure
Each section should follow this pattern:

```typescript
// components/analytics/sections/movie-collection-section.tsx
'use client'

interface MovieCollectionSectionProps {
  uploadedFiles: string[];
  analytics: AnalyticsData;
}

export function MovieCollectionSection({ uploadedFiles, analytics }: MovieCollectionSectionProps) {
  // Always visible - watched.csv is required
  const hasRequiredData = uploadedFiles.includes('watched.csv');
  
  if (!hasRequiredData) return null; // Should never happen
  
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">
          📽️ Which eras of cinema define your taste?
        </h2>
        <h3 className="text-lg text-muted-foreground">
          Release Year & Decade Analysis
        </h3>
        <p className="text-sm text-muted-foreground">
          Based on watched.csv
        </p>
      </div>
      
      {/* Section Description */}
      <p className="text-muted-foreground">
        Your watching history spans films from across cinema history...
      </p>
      
      {/* Charts */}
      <div className="space-y-8">
        <ChartWrapper
          title="When were your movies released?"
          description="Distribution of movies by release year..."
          insight={generateReleaseYearInsight(analytics)}
        >
          <ReleasedYearAnalysis data={analytics.yearlyBreakdown} />
        </ChartWrapper>
        
        <ChartWrapper
          title="Which cinematic era dominates your collection?"
          description="Your movies categorized by era..."
          insight={generateEraInsight(analytics)}
        >
          <EraBreakdownChart data={analytics.eraBreakdown} />
        </ChartWrapper>
      </div>
      
      {/* Empty State for Next Section */}
      {!uploadedFiles.includes('diary.csv') && (
        <UnlockPrompt
          title="✨ Unlock More Insights"
          files={['diary.csv']}
          benefits={[
            'When you watch movies most',
            'Your viewing consistency over time',
            'Seasonal and monthly patterns'
          ]}
        />
      )}
    </section>
  );
}
```

---

## 2. Reusable Components

### Chart Wrapper Component
```typescript
// components/analytics/chart-wrapper.tsx
interface ChartWrapperProps {
  title: string;
  description: string;
  insight?: string;
  children: React.ReactNode;
}

export function ChartWrapper({ title, description, insight, children }: ChartWrapperProps) {
  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="space-y-2">
        <h4 className="text-xl font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {/* Chart */}
      <div className="rounded-lg border bg-card p-6">
        {children}
      </div>
      
      {/* Dynamic Insight */}
      {insight && (
        <div className="rounded-lg bg-primary/10 p-4">
          <p className="text-sm font-medium">{insight}</p>
        </div>
      )}
    </div>
  );
}
```

### Empty State Component
```typescript
// components/analytics/empty-state.tsx
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = "📁" }: EmptyStateProps) {
  return (
    <div className="rounded-lg border-2 border-dashed p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
```

### Unlock Prompt Component
```typescript
// components/analytics/unlock-prompt.tsx
interface UnlockPromptProps {
  title: string;
  files: string[];
  benefits: string[];
}

export function UnlockPrompt({ title, files, benefits }: UnlockPromptProps) {
  return (
    <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <h4 className="text-lg font-semibold mb-4">{title}</h4>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">
            Add {files.join(', ')} to discover:
          </p>
          <ul className="space-y-1">
            {benefits.map((benefit, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start">
                <span className="mr-2">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

## 3. Insight Generation Functions

### Create Insight Helpers
```typescript
// lib/insights-generator.ts

export function generateReleaseYearInsight(analytics: AnalyticsData): string {
  const { yearlyBreakdown, totalMovies } = analytics;
  
  // Find dominant decade
  const decadeCounts: Record<string, number> = {};
  Object.entries(yearlyBreakdown).forEach(([year, count]) => {
    const decade = `${Math.floor(parseInt(year) / 10) * 10}s`;
    decadeCounts[decade] = (decadeCounts[decade] || 0) + count;
  });
  
  const dominantDecade = Object.entries(decadeCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  const percentage = Math.round((dominantDecade[1] / totalMovies) * 100);
  
  return `You've watched ${percentage}% of your movies from the ${dominantDecade[0]} decade`;
}

export function generateEraInsight(analytics: AnalyticsData): string {
  const { eraBreakdown } = analytics;
  const classic = eraBreakdown['Classic'] || 0;
  const golden = eraBreakdown['Golden Age'] || 0;
  const modern = eraBreakdown['Modern'] || 0;
  const contemporary = eraBreakdown['Contemporary'] || 0;
  const total = classic + golden + modern + contemporary;
  
  const classicPct = Math.round((classic / total) * 100);
  const contemporaryPct = Math.round((contemporary / total) * 100);
  
  if (classicPct > 50) {
    return `You're a classic film enthusiast with ${classicPct}% from pre-1970`;
  }
  if (contemporaryPct > 60) {
    return `Contemporary cinema lover: ${contemporaryPct}% of your watches are from 2020 onwards`;
  }
  return `Evenly split across eras - you appreciate all periods of cinema equally`;
}

export function generateRatingInsight(analytics: AnalyticsData): string {
  const { ratingDistribution, averageRating } = analytics;
  const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
  
  const highRatings = (ratingDistribution[4.5] || 0) + (ratingDistribution[5] || 0);
  const highPct = Math.round((highRatings / total) * 100);
  
  if (highPct > 35) {
    return `Generous rater: ${highPct}% of your ratings are 4.5-5.0 stars`;
  }
  if (averageRating < 3.0) {
    return `Critical viewer: Average rating of ${averageRating.toFixed(1)}★ suggests high standards`;
  }
  if (averageRating > 4.0) {
    return `Highly selective: Your average rating of ${averageRating.toFixed(1)}★ shows you watch quality films`;
  }
  return `Balanced rater: Normal distribution centered around ${averageRating.toFixed(1)}★`;
}

export function generateViewingPatternInsight(analytics: AnalyticsData): string {
  const { moviesPerMonth } = analytics;
  
  // Find peak month
  const peakMonth = Object.entries(moviesPerMonth)
    .sort((a, b) => b[1] - a[1])[0];
  
  return `Your peak viewing month was ${peakMonth[0]} with ${peakMonth[1]} movies`;
}
```

---

## 4. Conditional Rendering Logic

### Data Availability Checker
```typescript
// lib/data-availability.ts

export interface DataAvailability {
  hasWatchedCsv: boolean;
  hasDiaryCsv: boolean;
  hasRatingsCsv: boolean;
  hasFilmsCsv: boolean;
  hasWatchlistCsv: boolean;
  
  // Computed
  hasRatingData: boolean;
  hasWatchDates: boolean;
  hasGenreData: boolean;
  hasRewatchData: boolean;
  hasTagData: boolean;
}

export function checkDataAvailability(
  uploadedFiles: string[],
  movies: Movie[]
): DataAvailability {
  return {
    hasWatchedCsv: uploadedFiles.includes('watched.csv'),
    hasDiaryCsv: uploadedFiles.includes('diary.csv'),
    hasRatingsCsv: uploadedFiles.includes('ratings.csv'),
    hasFilmsCsv: uploadedFiles.includes('films.csv'),
    hasWatchlistCsv: uploadedFiles.includes('watchlist.csv'),
    
    // Computed checks
    hasRatingData: movies.some(m => m.rating !== undefined),
    hasWatchDates: movies.some(m => m.watchedDate !== undefined),
    hasGenreData: movies.some(m => m.genres && m.genres.length > 0),
    hasRewatchData: movies.some(m => m.rewatch === true),
    hasTagData: movies.some(m => m.tags && m.tags.length > 0),
  };
}
```

### Section Visibility Helper
```typescript
// lib/section-visibility.ts

export function getSectionVisibility(availability: DataAvailability) {
  return {
    showSection1: availability.hasWatchedCsv, // Always true (required)
    showSection2: availability.hasDiaryCsv && availability.hasWatchDates,
    showSection3: availability.hasRatingData,
    showSection4: true, // Always show, but charts are conditional
    
    // Individual charts in Section 4
    showGenreChart: availability.hasGenreData,
    showRewatchChart: availability.hasDiaryCsv && availability.hasRewatchData,
    showLikedChart: availability.hasFilmsCsv,
    showTagChart: availability.hasDiaryCsv && availability.hasTagData,
    showWatchlistChart: availability.hasWatchlistCsv && availability.hasWatchedCsv,
  };
}
```

---

## 5. Main Analytics Page Structure

```typescript
// app/analytics/page.tsx
'use client'

import { useAnalyticsStore } from '@/hooks/use-analytics-store';
import { checkDataAvailability, getSectionVisibility } from '@/lib/data-availability';

import { MovieCollectionSection } from '@/components/analytics/sections/movie-collection-section';
import { ViewingJourneySection } from '@/components/analytics/sections/viewing-journey-section';
import { CriticalVoiceSection } from '@/components/analytics/sections/critical-voice-section';
import { DeepDivesSection } from '@/components/analytics/sections/deep-dives-section';

export default function AnalyticsPage() {
  const { analytics, uploadedFiles, movies } = useAnalyticsStore();
  
  if (!analytics) {
    return (
      <EmptyState
        title="No Data Uploaded"
        description="Upload your Letterboxd CSV export to begin analysis."
        icon="📁"
      />
    );
  }
  
  const availability = checkDataAvailability(uploadedFiles, movies);
  const visibility = getSectionVisibility(availability);
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Dashboard Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">
          Discover Your True Cinematic Identity
        </h1>
        <p className="text-lg text-muted-foreground">
          Analyze your Letterboxd viewing history and uncover patterns in what 
          you watch, when you watch, and how you rate.
        </p>
      </header>
      
      {/* Section 1: Always visible */}
      {visibility.showSection1 && (
        <MovieCollectionSection
          uploadedFiles={uploadedFiles}
          analytics={analytics}
        />
      )}
      
      {/* Section 2: Conditional */}
      {visibility.showSection2 ? (
        <ViewingJourneySection
          uploadedFiles={uploadedFiles}
          analytics={analytics}
        />
      ) : (
        <EmptyState
          title="📅 Upload diary.csv to unlock this section"
          description="Your diary file contains exact watch dates for temporal analysis, rewatch indicators, user tags, and rating history over time."
          icon="📅"
        />
      )}
      
      {/* Section 3: Conditional */}
      {visibility.showSection3 ? (
        <CriticalVoiceSection
          uploadedFiles={uploadedFiles}
          analytics={analytics}
        />
      ) : (
        <EmptyState
          title="⭐ Upload ratings.csv or diary.csv to unlock this section"
          description="Rating data enables rating distribution analysis, rating trends over time, comparison of ratings across decades, and your critical philosophy assessment."
          icon="⭐"
        />
      )}
      
      {/* Section 4: Always show container, charts are conditional */}
      <DeepDivesSection
        uploadedFiles={uploadedFiles}
        analytics={analytics}
        visibility={visibility}
      />
    </div>
  );
}
```

---

## 6. File Upload Instructions Component

```typescript
// components/analytics/upload-instructions.tsx

export function UploadInstructions() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h3 className="text-lg font-semibold">Getting Started</h3>
      
      <ol className="space-y-2 list-decimal list-inside">
        <li className="text-sm">Go to letterboxd.com/settings/data</li>
        <li className="text-sm">Request your data export</li>
        <li className="text-sm">Download the ZIP file</li>
        <li className="text-sm">Upload watched.csv here (required)</li>
        <li className="text-sm">Optionally add: diary.csv, ratings.csv, films.csv</li>
      </ol>
      
      <Button className="w-full">Upload Files</Button>
    </div>
  );
}
```

---

## 7. Typography & Styling Reference

### Heading Hierarchy
```tsx
// H1 - Page title
<h1 className="text-4xl font-bold">
  Discover Your True Cinematic Identity
</h1>

// H2 - Section header (question)
<h2 className="text-3xl font-bold">
  📽️ Which eras of cinema define your taste?
</h2>

// H3 - Section subtitle (descriptive)
<h3 className="text-lg text-muted-foreground">
  Release Year & Decade Analysis
</h3>

// H4 - Chart heading (sub-question)
<h4 className="text-xl font-semibold">
  When were your movies released?
</h4>

// Body text - Chart description
<p className="text-sm text-muted-foreground">
  Distribution of movies by release year...
</p>

// Insight callout
<div className="rounded-lg bg-primary/10 p-4">
  <p className="text-sm font-medium">
    You've watched 60% of your movies in winter months
  </p>
</div>
```

---

## 8. Testing Checklist

### Per Section
- [ ] Section renders when required files are uploaded
- [ ] Section shows empty state when files are missing
- [ ] Charts display correct data
- [ ] Insights generate correctly
- [ ] Empty states have correct messaging
- [ ] Unlock prompts show for next sections

### Responsive
- [ ] Mobile: Single column layout
- [ ] Tablet: Appropriate 2-column where applicable
- [ ] Desktop: Full layouts with optimal spacing
- [ ] Charts resize properly
- [ ] Text is readable at all sizes

### Accessibility
- [ ] Semantic HTML structure
- [ ] Proper heading hierarchy
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

### Performance
- [ ] Sections lazy load below fold
- [ ] Charts render smoothly
- [ ] No unnecessary re-renders
- [ ] Analytics computations are memoized

---

## 9. Implementation Order

### Week 1: Foundation
1. Create reusable components (ChartWrapper, EmptyState, UnlockPrompt)
2. Build data availability checker
3. Create insight generation functions
4. Implement Section 1 (Movie Collection)

### Week 2: Core Sections
5. Implement Section 2 (Viewing Journey) with conditional logic
6. Implement Section 3 (Critical Voice) with conditional logic
7. Add empty states for all sections
8. Test file upload flow end-to-end

### Week 3: Advanced & Polish
9. Implement Section 4 (Deep Dives) with all conditional charts
10. Add loading states and transitions
11. Mobile responsive testing
12. Accessibility audit
13. Performance optimization

---

## 10. Common Patterns

### Pattern: Conditional Chart Rendering
```typescript
{availability.hasRewatchData ? (
  <ChartWrapper
    title="Which movies do you rewatch most?"
    description="Movies you've revisited multiple times..."
    insight={generateRewatchInsight(analytics)}
  >
    <RewatchAnalysisChart data={analytics.rewatchData} />
  </ChartWrapper>
) : (
  <div className="rounded-lg border border-dashed p-8 text-center">
    <p className="text-sm text-muted-foreground">
      🔄 Upload diary.csv for rewatch analysis
    </p>
  </div>
)}
```

### Pattern: Progressive Enhancement
```typescript
// Show basic chart first
<BasicChart data={analytics.basicData} />

// If more data available, enhance
{availability.hasDiaryCsv && (
  <EnhancedChart data={analytics.enhancedData} />
)}
```

### Pattern: Multi-file Requirements
```typescript
// Only show if BOTH files are present
{(availability.hasWatchlistCsv && availability.hasWatchedCsv) && (
  <WatchlistComparisonChart
    watchlist={analytics.watchlist}
    watched={analytics.watched}
  />
)}
```

---

**Ready to implement!** Start with the reusable components, then build sections in order. 🚀

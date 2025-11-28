# Dashboard Content Structure
## Professional Headings, Descriptions & Chart Organization

**Version**: 1.0  
**Date**: November 28, 2025  
**Purpose**: Complete content specification for Letterboxd Stats Dashboard

---

## Design Principles

### Content Strategy
1. **Question-based headings** - Encourage discovery and curiosity
2. **Neutral analytical subtitles** - Professional, clear descriptions
3. **Dynamic insights** - Generated after data analysis, personalized
4. **Data-source driven sections** - Logical grouping based on CSV requirements
5. **Moderate depth** - Context without overwhelming

### Conditional Display Logic
- Section renders only if required CSV files are uploaded
- Charts within sections render based on data availability
- Empty sections show educational messaging (not hidden entirely)
- Progressive enhancement as user uploads more files

---

## Dashboard Header

### Main Title
**"Discover Your True Cinematic Identity"**

### Subtitle
**"Analyze your Letterboxd viewing history and uncover patterns in what you watch, when you watch, and how you rate."**

### Description (Below Upload)
```
Upload your Letterboxd CSV export files to generate personalized analytics. 
Start with watched.csv (required), then add diary.csv, ratings.csv, and 
other files to unlock deeper insights.
```

---

## Section 1: Your Movie Collection
**Data Source**: `watched.csv` (Required - Always visible)

### Section Header
```
📽️ Which eras of cinema define your taste?
```

### Section Subtitle
```
Release Year & Decade Analysis
Based on watched.csv
```

### Section Description
```
Your watching history spans films from across cinema history. This section 
reveals which decades and eras resonate with you most - from silent classics 
to contemporary releases.
```

### Chart 1.1: Release Year Distribution
**Component**: `ReleasedYearAnalysis`  
**Data Required**: `watched.csv` → `year` column  
**Condition**: Always available (watched.csv is mandatory)

**Chart Heading**: "When were your movies released?"

**Chart Description**:
```
Distribution of movies by release year. Toggle between decade groupings or 
individual years to see which periods of film history you explore most.
```

**Dynamic Insights** (Examples - generated based on actual data):
- "You've watched 45% of your movies from the 2010s decade"
- "Your oldest film is from 1927, showing appreciation for cinema's early days"
- "You're balanced across eras, with 30% classic, 35% modern, 35% contemporary"
- "You gravitate toward films from the 1990s and 2000s"

**Interactive Features**:
- Toggle: Decade view / Individual year view
- Era filter tabs: Classic (≤1969) / Golden Age (1970-1999) / Modern (2000-2019) / Contemporary (2020+) / All

---

### Chart 1.2: Era Breakdown
**Component**: `ReleasedYearAnalysis` (alternate view or donut chart)  
**Data Required**: `watched.csv` → `year` column  
**Condition**: Always available

**Chart Heading**: "Which cinematic era dominates your collection?"

**Chart Description**:
```
Your movies categorized by era. See the balance between classic Hollywood, 
modern cinema, and contemporary releases.
```

**Dynamic Insights**:
- "You're a classic film enthusiast with 60% from pre-1980"
- "Contemporary cinema lover: 70% of your watches are from 2020 onwards"
- "Evenly split across eras - you appreciate all periods of cinema equally"

**Era Definitions**:
- **Classic Era**: ≤1969 (Silent, Golden Age Hollywood)
- **Golden Age**: 1970-1999 (New Hollywood, Blockbuster Era)
- **Modern**: 2000-2019 (Digital cinema, Streaming emergence)
- **Contemporary**: 2020+ (Current releases)

---

### Empty State (if only watched.csv uploaded)
```
✨ Unlock More Insights

Add diary.csv to discover:
• When you watch movies most
• Your viewing consistency over time
• Seasonal and monthly patterns

Add ratings.csv to discover:
• Your rating philosophy
• Which eras you rate highest
• Rating patterns and trends
```

---

## Section 2: Your Viewing Journey
**Data Source**: `diary.csv` (Optional)  
**Condition**: Renders only if `diary.csv` is uploaded

### Section Header
```
📅 When do you watch movies most?
```

### Section Subtitle
```
Temporal Viewing Patterns
Based on diary.csv
```

### Section Description
```
Your diary entries reveal patterns in when and how you watch. From seasonal 
preferences to viewing consistency, this section maps your cinematic journey 
over time.
```

### Chart 2.1: Watching Timeline
**Component**: `ViewingOverTime`  
**Data Required**: `diary.csv` → `Watched Date` column  
**Condition**: `diary.csv` uploaded AND `Watched Date` column exists

**Chart Heading**: "How has your viewing evolved?"

**Chart Description**:
```
Movies watched over time. Toggle between yearly, monthly, or weekly views to 
spot trends, peaks, and viewing patterns throughout your Letterboxd history.
```

**Dynamic Insights**:
- "Your peak viewing month was January 2024 with 42 movies"
- "You've watched 1,623 movies since starting to track in 2022"
- "Your viewing has increased 35% year-over-year"
- "Most consistent viewing period: Summer 2023 with 8+ movies per week"

**Interactive Features**:
- Granularity: Yearly / Monthly / Weekly
- Time range: All Time / Last 3 Years / Last 12 Months
- Chart type: Area (cumulative) / Bar / Line

---

### Chart 2.2: Monthly Viewing Pattern
**Component**: `DiaryMonthlyRadarChart`  
**Data Required**: `diary.csv` → `Watched Date` column  
**Condition**: `diary.csv` uploaded AND multiple years of data (≥2 years)

**Chart Heading**: "Do you have seasonal watching habits?"

**Chart Description**:
```
Compare your monthly viewing patterns across different years. Reveals whether 
you consistently watch more in certain seasons or if your habits vary annually.
```

**Dynamic Insights**:
- "Winter viewer: 60% of your watching happens in Dec-Feb"
- "Summer movie marathons: Peak viewing in June-August every year"
- "Consistent year-round with 25-30 movies monthly regardless of season"
- "October spike detected: Horror movie season?"

**Interactive Features**:
- Multi-year comparison (overlaid radar)
- Smoothing: Monthly / 2-Month Average / Seasonal (Quarterly)
- Year selection toggles

---

### Chart 2.3: Viewing Consistency
**Component**: `DiaryAreaChart`  
**Data Required**: `diary.csv` → `Watched Date` column  
**Condition**: `diary.csv` uploaded

**Chart Heading**: "How consistent is your movie watching?"

**Chart Description**:
```
Smoothed timeline showing viewing trends. Identifies peak periods, viewing 
slumps, and overall patterns in your watching consistency.
```

**Dynamic Insights**:
- "Most active period: March-May 2023 with 120 movies in 3 months"
- "Viewing gap detected: No entries from June-August 2022"
- "Steady viewer: Maintain 20-30 movies per month consistently"
- "Binge watcher: 65% of movies watched in focused 2-week periods"

**Interactive Features**:
- Time range: All Time / Last 12 Months
- Smoothing: Monthly / 2-Month / 3-Month average
- Year boundary markers

---

### Chart 2.4: Day of Week Patterns (Optional - Future)
**Component**: Custom bar chart  
**Data Required**: `diary.csv` → `Watched Date` column  
**Condition**: `diary.csv` uploaded AND sufficient data (≥50 entries)

**Chart Heading**: "Which days do you watch most?"

**Chart Description**:
```
Movies watched by day of week. Reveals whether you're a weekend movie 
marathoner or spread viewing throughout the week.
```

**Dynamic Insights**:
- "Weekend warrior: 70% of movies watched on Saturday-Sunday"
- "Weeknight viewer: Peak watching on Tuesday and Wednesday evenings"
- "Balanced across all days with slight Friday preference"

---

### Empty State (diary.csv not uploaded)
```
📅 Upload diary.csv to unlock this section

Your diary file contains:
• Exact watch dates for temporal analysis
• Rewatch indicators
• User tags and notes
• Rating history over time

This enables insights about when you watch, viewing consistency, 
and seasonal patterns.
```

---

## Section 3: Your Critical Voice
**Data Source**: `ratings.csv` OR `diary.csv` (if contains ratings)  
**Condition**: Renders if ratings data is available from either source

### Section Header
```
⭐ Are you a harsh critic or generous rater?
```

### Section Subtitle
```
Rating Distribution & Patterns
Based on ratings.csv or diary.csv
```

### Section Description
```
Your ratings reveal your critical philosophy. This section analyzes how you 
rate movies, which ratings you use most, and whether you're generous with 
stars or reserve high scores for true masterpieces.
```

### Chart 3.1: Rating Distribution
**Component**: `RatingDistribution`  
**Data Required**: `ratings.csv` → `Rating` column OR `diary.csv` → `Rating` column  
**Condition**: Rating data exists AND minimum 10 rated movies

**Chart Heading**: "How do you distribute your ratings?"

**Chart Description**:
```
Distribution of your 0.5-5.0 star ratings. Shows which ratings you use most 
frequently and reveals your rating philosophy - harsh critic, generous viewer, 
or somewhere in between.
```

**Dynamic Insights**:
- "Generous rater: 35% of your ratings are 4.5-5.0 stars"
- "Highly selective: Your average rating of 4.2★ shows you watch quality films"
- "Critical viewer: Average rating of 2.8★ suggests high standards"
- "Balanced rater: Normal distribution centered around 3.5★"
- "You rarely use 1-2 stars, preferring to focus on movies you enjoy"

**Stats Display**:
```
Total Ratings: 1,234
Average Rating: 3.8 ★
Rating Coverage: 76% (of watched movies)
```

**Interactive Features**:
- Bar chart with progress bars per rating
- Color gradient: Red (0.5★) → Green (5.0★)
- Percentage display per rating

---

### Chart 3.2: Rating Trends Over Time
**Component**: Custom line chart  
**Data Required**: `diary.csv` → `Watched Date` + `Rating` columns  
**Condition**: `diary.csv` uploaded AND ratings present

**Chart Heading**: "Have your ratings changed over time?"

**Chart Description**:
```
Your average rating over time. Tracks whether you've become more generous 
or critical as you've logged more movies.
```

**Dynamic Insights**:
- "Rating inflation: Your average has increased from 3.2★ to 4.0★ over 2 years"
- "Becoming more critical: Average rating declined from 4.1★ to 3.5★"
- "Consistent standards: Your average stays stable around 3.7-3.9★"
- "Year of discovery: 2023 had your highest ratings at 4.2★ average"

---

### Chart 3.3: Ratings by Decade
**Component**: Grouped bar chart  
**Data Required**: `watched.csv` → `Year` + ratings data from `ratings.csv` or `diary.csv`  
**Condition**: Both release years and ratings available

**Chart Heading**: "Which decades do you rate highest?"

**Chart Description**:
```
Average rating per decade of release. Reveals whether you prefer older 
classics, modern cinema, or rate all eras equally.
```

**Dynamic Insights**:
- "1970s enthusiast: Highest average rating (4.3★) for films from this decade"
- "Modern cinema preference: 2010s films average 4.1★ vs 3.4★ for pre-2000"
- "Consistent across eras: All decades rated within 0.3★ of each other"
- "Classic film appreciation: Pre-1970 films rated 0.5★ higher than average"

---

### Chart 3.4: Rating Consistency (Optional)
**Component**: Standard deviation visualization  
**Data Required**: `ratings.csv` or `diary.csv` with multiple ratings  
**Condition**: ≥30 rated movies

**Chart Heading**: "How varied are your ratings?"

**Chart Description**:
```
Measures rating consistency. High variation means you use the full rating 
scale, low variation suggests you rate most movies similarly.
```

**Dynamic Insights**:
- "Decisive rater: Wide rating spread (SD: 1.2) shows you use full scale"
- "Narrow range: Most ratings fall between 3.5-4.5★ (SD: 0.6)"
- "Open-minded viewer: Varied ratings suggest diverse taste and honest assessment"

**Stats Display**:
```
Standard Deviation: 0.9
Rating Range: 1.0★ - 5.0★
Most Common Rating: 4.0★
```

---

### Empty State (no ratings data)
```
⭐ Upload ratings.csv or diary.csv to unlock this section

Rating data enables:
• Rating distribution analysis
• Rating trends over time
• Comparison of ratings across decades
• Your critical philosophy assessment

Note: diary.csv can include ratings even if you don't have a 
separate ratings.csv file.
```

---

## Section 4: Deep Dives & Patterns
**Data Source**: Multiple files (combination insights)  
**Condition**: Renders based on available data combinations

### Section Header
```
🔍 What patterns define your viewing?
```

### Section Subtitle
```
Advanced Cross-Analysis
Based on multiple data sources
```

### Section Description
```
When multiple data sources are available, deeper patterns emerge. This section 
reveals connections between what you watch, when you watch it, and how you 
rate it.
```

### Chart 4.1: Genre Distribution
**Component**: `GenreDistribution`  
**Data Required**: `watched.csv` → `Genres` column (if available) OR enriched data  
**Condition**: Genre data available (from CSV or TMDB enrichment)

**Chart Heading**: "What genres dominate your viewing?"

**Chart Description**:
```
Breakdown of movies watched by genre. Toggle between pie chart for 
proportions or bar chart for raw counts. Filter to see your top genres.
```

**Dynamic Insights**:
- "Drama devotee: 35% of your library is Drama films"
- "Genre diversity: You've watched 24 different genres"
- "Top 3 genres (Drama, Thriller, Sci-Fi) account for 60% of your viewing"
- "Rare genre explorer: You've watched at least 5 films in 15+ genres"

**Interactive Features**:
- Chart type: Pie / Bar
- Filter: Top 5 / Top 10 / All genres
- Detailed genre list with counts

**Stats Display**:
```
Unique Genres: 24
Most Watched: Drama (342 films)
Average per Genre: 28 films
```

---

### Chart 4.2: Rewatches Analysis
**Component**: Custom list + stats  
**Data Required**: `diary.csv` → `Rewatch` column  
**Condition**: `diary.csv` uploaded AND rewatch data present

**Chart Heading**: "Which movies do you rewatch most?"

**Chart Description**:
```
Movies you've revisited multiple times. Reveals your comfort films and 
favorites worthy of repeated viewing.
```

**Dynamic Insights**:
- "Rewatch champion: You've seen 'The Lord of the Rings' 8 times"
- "Rewatch rate: 12% of your diary entries are rewatches"
- "Top 5 rewatched films account for 45 rewatch entries"
- "First-time viewer: Only 3% rewatches, you prefer discovering new films"

**Display Format**:
```
1. The Lord of the Rings: Fellowship (8 watches)
2. Inception (6 watches)
3. The Matrix (5 watches)
4. Blade Runner (5 watches)
5. Pulp Fiction (4 watches)
```

---

### Chart 4.3: Liked Movies Analysis
**Component**: Stats cards + list  
**Data Required**: `films.csv` → `Liked` column  
**Condition**: `films.csv` uploaded

**Chart Heading**: "What makes your favorites list?"

**Chart Description**:
```
Movies you've marked as "Liked" on Letterboxd. Shows the characteristics 
of films that earn your favorite status.
```

**Dynamic Insights**:
- "Selective liker: Only 8% of watched movies make your favorites"
- "Generous with likes: 35% of your watches earn a heart"
- "Liked films average 4.6★, significantly higher than your 3.8★ overall"
- "Favorite era: 45% of your liked films are from the 1990s"

**Stats Display**:
```
Total Liked: 123 films
Percentage of Watched: 8%
Average Rating of Liked: 4.6★
Most Common Genre: Drama (35%)
```

---

### Chart 4.4: Tag Analysis
**Component**: Tag cloud or bar chart  
**Data Required**: `diary.csv` → `Tags` column  
**Condition**: `diary.csv` uploaded AND tags present (≥10 tagged entries)

**Chart Heading**: "How do you organize your collection?"

**Chart Description**:
```
Your most-used Letterboxd tags. Reveals how you categorize and think about 
the movies you watch beyond genre.
```

**Dynamic Insights**:
- "Most used tag: 'mindfuck' applied to 45 films"
- "Tag variety: You've created 78 unique tags"
- "Top tag themes: Mood-based (dark, uplifting), Style-based (slow burn), Era-based (90s classics)"

**Display Format**:
```
mindfuck (45)
slow-burn (32)
rewatchable (28)
dark-comedy (24)
90s-classics (20)
```

---

### Chart 4.5: Watchlist Insights (Optional)
**Component**: Stats comparison  
**Data Required**: `watchlist.csv` + `watched.csv`  
**Condition**: Both files uploaded

**Chart Heading**: "How much of your watchlist becomes reality?"

**Chart Description**:
```
Compare your watchlist to watched films. See completion rate and which 
watchlist films you've actually seen.
```

**Dynamic Insights**:
- "Watchlist completion: You've watched 342 of 890 watchlist films (38%)"
- "Patient viewer: Average time from adding to watchlist to watching is 8 months"
- "Impulse watcher: 65% of watched films were never on your watchlist"

---

### Empty States for Subsections

**No Genre Data**:
```
🎭 Genre analysis unavailable

Genre data is not present in your watched.csv file. 
Consider using TMDB enrichment (future feature) to add genre information.
```

**No Rewatch Data**:
```
🔄 Upload diary.csv for rewatch analysis

Rewatch tracking requires diary.csv which includes 
a "Rewatch" column for each diary entry.
```

**No Liked Films**:
```
❤️ Upload films.csv to see your favorites

The films.csv export shows which movies you've marked 
as "Liked" on Letterboxd.
```

**No Tags**:
```
🏷️ Start tagging your diary entries

Tags help organize your viewing and reveal thematic patterns. 
Add tags on Letterboxd, then re-export diary.csv.
```

---

## Global Empty State
**Condition**: No CSV file uploaded yet

### Display
```
📁 No Data Uploaded

Upload your Letterboxd CSV export to begin analysis.

Getting Started:
1. Go to letterboxd.com/settings/data
2. Request your data export
3. Download the ZIP file
4. Upload watched.csv here (required)
5. Optionally add: diary.csv, ratings.csv, films.csv

[Upload Files Button]
```

---

## Data Requirements Summary

### Required Files
| File | Purpose | Always Required |
|------|---------|----------------|
| `watched.csv` | Movies watched, release years | ✅ Yes |

### Optional Files (Unlock Additional Insights)
| File | Purpose | Sections Unlocked |
|------|---------|-------------------|
| `diary.csv` | Watch dates, ratings, rewatches, tags | Section 2, parts of Section 3 & 4 |
| `ratings.csv` | Current ratings | Section 3 (if diary.csv doesn't have ratings) |
| `films.csv` | Liked movies | Chart 4.3 in Section 4 |
| `watchlist.csv` | Movies to watch | Chart 4.5 in Section 4 |
| `profile.csv` | Username, favorites | Future enhancements |

### Chart Rendering Conditions

```typescript
// Pseudocode for conditional rendering

// Section 1: Always visible (requires watched.csv which is mandatory)
if (uploadedFiles.includes('watched.csv')) {
  renderSection1(); // Release Year Analysis
}

// Section 2: Requires diary.csv with watched dates
if (uploadedFiles.includes('diary.csv') && hasWatchedDates()) {
  renderSection2(); // Viewing Journey
}

// Section 3: Requires rating data from either source
if (hasRatingData()) { // from ratings.csv OR diary.csv
  renderSection3(); // Critical Voice
}

// Section 4: Various conditions per chart
// Chart 4.1: Genre Distribution
if (hasGenreData()) {
  renderGenreDistribution();
}

// Chart 4.2: Rewatches
if (uploadedFiles.includes('diary.csv') && hasRewatchData()) {
  renderRewatchAnalysis();
}

// Chart 4.3: Liked Films
if (uploadedFiles.includes('films.csv')) {
  renderLikedFilmsAnalysis();
}

// Chart 4.4: Tags
if (uploadedFiles.includes('diary.csv') && hasTagData()) {
  renderTagAnalysis();
}

// Chart 4.5: Watchlist
if (uploadedFiles.includes('watchlist.csv') && uploadedFiles.includes('watched.csv')) {
  renderWatchlistInsights();
}
```

---

## Implementation Notes

### Dynamic Insight Generation

Insights should be computed based on actual data patterns. Example logic:

```typescript
// Example: Rating generosity insight
function getRatingInsight(ratingDistribution: Record<number, number>) {
  const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
  const high = (ratingDistribution[4.5] + ratingDistribution[5]) / total;
  const low = (ratingDistribution[1] + ratingDistribution[1.5] + ratingDistribution[2]) / total;
  
  if (high > 0.35) return "Generous rater: 35% of your ratings are 4.5-5.0 stars";
  if (low > 0.20) return "Critical viewer: You're selective about what deserves high ratings";
  return "Balanced rater: You use the full rating scale thoughtfully";
}
```

### Responsive Design
- **Mobile**: Stack all charts vertically, single column
- **Tablet**: 2-column layout where appropriate
- **Desktop**: Full 2-3 column layouts with optimal spacing

### Loading States
- Show skeleton loaders while computing analytics
- Progressive rendering as data becomes available
- Smooth transitions between empty states and populated charts

### Accessibility
- Semantic HTML headings (h2 for sections, h3 for charts)
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly insights

### Performance
- Lazy load sections below fold
- Memoize computed analytics
- Debounce filter/toggle interactions
- Optimize Recharts rendering

---

## Content Writing Guidelines

### Voice & Tone
- **Conversational but professional**: "You've watched" not "User has watched"
- **Curiosity-driven**: Frame as questions and discoveries
- **Data-focused**: Back insights with specific numbers
- **Encouraging**: Celebrate patterns without judgment

### Heading Hierarchy
```
H1: Dashboard Page Title
H2: Section Headers (Questions)
H3: Section Subtitles (Descriptive)
H4: Chart Headings (Sub-questions)
Body: Chart descriptions
Callout: Dynamic insights
```

### Writing Style
- **Active voice**: "You watched 342 movies" not "342 movies were watched"
- **Specific numbers**: "60%" not "most", "42 movies" not "many"
- **Positive framing**: "You've explored 24 genres" not "Only 24 genres"
- **Avoid jargon**: "Movies per month" not "Temporal viewing frequency"

### Insight Formatting
```markdown
✅ Good: "You watched 60% of your movies in winter months"
✅ Good: "Peak viewing month: January 2024 with 42 movies"
❌ Bad: "High winter correlation detected in viewing patterns"
❌ Bad: "Significant temporal clustering in Q1"
```

---

## Next Steps for Implementation

### Phase 1: Core Sections (Week 1)
1. Implement Section 1 (Release Year Analysis)
2. Add conditional logic for Section 2 (Viewing Journey)
3. Build Section 3 (Critical Voice)

### Phase 2: Advanced Charts (Week 2)
4. Implement Section 4 charts with proper conditions
5. Add dynamic insight generation functions
6. Create empty state components

### Phase 3: Polish (Week 3)
7. Mobile responsive testing
8. Loading states and transitions
9. Accessibility audit
10. Performance optimization

---

## Appendix: Chart Component Mapping

### Available Chart Components
From `/components/charts/`:

1. **DiaryAreaChart** → Chart 2.3 (Viewing Consistency)
2. **DiaryMonthlyRadarChart** → Chart 2.2 (Monthly Pattern)
3. **DiaryStatistics** → Stats cards throughout
4. **ReleasedYearAnalysis** → Chart 1.1 & 1.2 (Release Years)
5. **GenreDistribution** → Chart 4.1 (Genre Analysis)
6. **RatingDistribution** → Chart 3.1 (Rating Distribution)
7. **ViewingOverTime** → Chart 2.1 (Watching Timeline)

### Components to Build
- Tag cloud/bar chart (Chart 4.4)
- Rewatch list component (Chart 4.2)
- Liked films stats (Chart 4.3)
- Rating trends line chart (Chart 3.2)
- Ratings by decade (Chart 3.3)
- Watchlist comparison (Chart 4.5)

---

**Document Version**: 1.0  
**Last Updated**: November 28, 2025  
**Status**: Ready for Implementation ✅

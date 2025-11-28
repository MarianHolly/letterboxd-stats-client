# Dashboard Sections - Design Preview Guide

## Overview

The dashboard now displays all 4 sections with mock data so you can see the final design. Visit **http://localhost:3000/analytics** to view the charts.

---

## Section 1: 📽️ Movie Collection - "Which eras of cinema define your taste?"

### Description
Release Year & Decade Analysis

### Design Elements

**Primary Chart: Release Year Analysis V2**
- **Type**: Bar chart with interactive era filtering
- **Data**: Shows movie distribution across decades (1970-2024)
- **Mock Data**:
  - Range from 2 movies in 1970 to 31 movies in 2023
  - Total: 260 movies across decades
  - Peak: 2023 with 31 movies

**Visual Features**:
- **Era Filter Tabs**: Buttons to filter by cinema era
  - Classic (1900-1960)
  - Golden (1960-1980)
  - Modern (1980-2000)
  - Contemporary (2000-present)
  - Tab styling: Selected = indigo background, unselected = outline

- **Color Gradient**: Blue (240°) → Violet (270°) bars

- **Dark Mode**: Full support with white text and semi-transparent backgrounds

- **Responsive**: Adjusts to sidebar collapse/expand

**Stats Displayed**:
- Total movies by decade
- Average per year
- Peak era

---

## Section 2: 📅 Viewing Journey - "When do you watch movies most?"

### Description
Temporal Viewing Patterns

### Design Elements

**Primary Chart: Viewing Over Time V2**
- **Type**: Multi-format chart (Area, Bar, Line) with controls
- **Data**: Shows viewing activity over time (2018-2024)
- **Mock Data**:
  - 33 data points spanning 6 years
  - Range: 1-17 movies per date
  - Shows increasing trend over time

**Interactive Controls**:
1. **Time Granularity**: Yearly | Monthly | Weekly
   - Aggregates data at selected granularity
   - Smooth transitions between views

2. **Time Range**: All Time | Last 3 Years | Last 12 Months
   - Filters data to selected period
   - Maintains granularity selection

3. **Chart Type**: Area | Bar | Line
   - Area: Shows cumulative viewing over time
   - Bar: Shows movies per period
   - Line: Shows trend

**Visual Features**:
- **Color Scheme**: Indigo (#4f46e5) for all chart types
- **Gradient Fill** (Area chart): Indigo with opacity fade
- **Stats Cards**:
  - Peak Period (max movies in any period)
  - Average (mean movies per period)
  - Style: Light slate background with dark mode support

- **Dark Mode**: Full support on controls, grid, axes, and tooltips

- **Tooltips**: Shows period and movie count with formatted labels

**Responsive**: Height h-96 (384px), scales with container width

---

## Section 3: ⭐ Critical Voice - "Are you a harsh critic or generous rater?"

### Description
Rating Distribution & Patterns

### Design Elements

**Primary Chart: Rating Distribution V2**
- **Type**: Horizontal bar chart with progress bars
- **Data**: Shows rating distribution (1★ to 5★)
- **Mock Data**:
  - 1★: 8 movies (4%)
  - 2★: 15 movies (7%)
  - 3★: 42 movies (20%)
  - 4★: 68 movies (32%)
  - 5★: 127 movies (60%)
  - Total: 260 ratings

**Visual Features**:
1. **Stats Cards**:
   - Total Ratings: 260
   - Average Rating: 4.24★
   - Style: Light slate cards with dark mode support

2. **Progress Bars** (For each rating):
   - Color Gradient: Red → Orange → Yellow → Lime → Green
   - Shows percentage and count
   - Smooth animations on hover/interaction
   - Labels: "5★ | 127 movies (60%)" style

3. **Bar Chart Visualization**:
   - Each rating (1-5) shown as bar
   - Height represents count
   - Colored by rating value
   - Dark mode grid support

4. **Insights Section**:
   - Auto-generated insights based on data:
     - "🌟 You're a generous rater! 60% of your ratings are 5★"
     - "😊 You tend to rate movies highly (avg: 4.24★)"
     - "📉 X% of your ratings are 1★ - you know what you don't like!"
   - Dynamically appears if rating data exists
   - Styled cards with emojis

5. **Dark Mode**: Full support on all elements

**Responsive**: Height h-80 (320px), scales with container width

---

## Section 4: 🔍 Deep Dives - "What patterns define your viewing?"

### Description
Advanced Cross-Analysis (Phase 2)

### Design Elements

**Current State**: Placeholder Section
- **Message**: "Deep Dives section coming in Phase 2. This will feature advanced cross-analysis including rewatch patterns, liked movies analysis, tag distributions, and watchlist insights."
- **Style**: Empty state card with dashed border

**Future Features** (Phase 2):
- Rewatch analysis from diary.csv
- Liked movies patterns from films.csv
- Tag distribution analysis
- Watchlist vs watched comparison

---

## Design System Features

### Typography
- **Section Titles**: 3xl bold, black (dark: white)
- **Section Description**: Base text, slate-600 (dark: slate-400)
- **Chart Labels**: 12px, slate-700 (dark: white/70)
- **Stats Text**: sm (14px) and lg (18px) fonts

### Colors
- **Primary**: Indigo (#4f46e5 / #4f46e5)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#eab308)
- **Danger**: Red (#ef4444)
- **Backgrounds**:
  - Light: white / slate-50
  - Dark: slate-900 / slate-950 / white/5
- **Borders**: slate-200 (dark: white/10)

### Spacing
- Section gap: space-y-16 (64px between sections)
- Internal spacing: space-y-4 (16px)
- Card padding: p-4 to p-8

### Responsive Breakpoints
- **Mobile**: Full width, single column
- **Tablet (md)**: Adjusts chart height and controls
- **Desktop (lg)**: Optimal layout with sidebar

### Accessibility
- Semantic HTML (section, h2 elements)
- `aria-labelledby` for section association
- ARIA roles and attributes on interactive elements
- Keyboard navigation support for buttons
- Proper contrast ratios in both light/dark modes

### Dark Mode
- Full dark mode support on all components
- Uses Tailwind's `dark:` prefix
- Specific overrides for:
  - Text color: `dark:text-white/70`
  - Backgrounds: `dark:bg-white/5`
  - Borders: `dark:border-white/10`
  - Chart grids: `dark:[&_text]:fill-white/70`

---

## Navigation

### Sidebar Integration
The new sections appear in the sidebar under a "Sections" menu group:
- **Movie Collection** - Release years & eras (#movie-collection)
- **Viewing Journey** - Temporal patterns (#viewing-journey)
- **Critical Voice** - Rating analysis (#critical-voice)
- **Deep Dives** - Advanced insights (#deep-dives)

**Features**:
- Smooth scroll-to anchors
- Active section highlighting via Intersection Observer
- Responsive collapse/expand with sidebar
- Icon + description for each section

---

## Viewing the Charts

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Visit Analytics Page**:
   - Open: http://localhost:3000/analytics
   - Wait for page to load (mock data shows immediately)

3. **Navigation**:
   - Use sidebar menu under "Sections" to jump between sections
   - Scroll down to see all charts and existing content

4. **Interactive Features**:
   - **Viewing Over Time**: Try changing granularity (Yearly/Monthly/Weekly), range (All Time/3 Years/12 Months), and chart type (Area/Bar/Line)
   - **Era Filters**: Click tabs in Release Year chart to filter by era
   - **Dark Mode**: Toggle theme to see dark mode styling

---

## Mock Data Details

### Release Year (Movie Collection)
- 19 years of data (1970-2024)
- Distribution shows growth trend
- Peak: 2023 with 31 movies

### Viewing Over Time (Viewing Journey)
- Date-based entries from 2018-2024
- Monthly aggregation by default
- Shows increasing viewing frequency
- Used for temporal analysis

### Rating Distribution (Critical Voice)
- 5 rating values (1-5 stars)
- Skewed towards high ratings (4-5★)
- Realistic distribution pattern
- Generates 4 auto-insights

---

## Customization Notes

These mock data values can be easily customized:

**Movie Collection** (`movie-collection-section.tsx`):
```typescript
const MOCK_RELEASE_YEAR_DATA: Record<string, number> = {
  "1970": 2,
  // ... adjust any year:count
};
```

**Viewing Journey** (`viewing-journey-section.tsx`):
```typescript
const MOCK_VIEWING_OVER_TIME_DATA: Record<string, number> = {
  "2018-01-05": 2,
  // ... adjust date:count
};
```

**Critical Voice** (`critical-voice-section.tsx`):
```typescript
const MOCK_RATING_DATA: Record<number, number> = {
  1: 8,   // 1★ count
  2: 15,  // 2★ count
  // ... adjust rating:count
};
```

---

## Feedback Points to Evaluate

When viewing the charts, consider:

1. **Visual Hierarchy**: Are section titles and descriptions clear?
2. **Color Scheme**: Do the colors work in both light and dark modes?
3. **Chart Readability**: Are the charts easy to understand at first glance?
4. **Interactive Controls**: Are buttons and filters intuitive?
5. **Spacing & Layout**: Is the spacing appropriate between sections and content?
6. **Mobile Responsiveness**: Does it look good on smaller screens?
7. **Performance**: Do charts render smoothly with mock data?
8. **Dark Mode**: Verify all text is readable in dark mode

---

**Last Updated**: November 28, 2025
**Status**: Ready for Visual Review

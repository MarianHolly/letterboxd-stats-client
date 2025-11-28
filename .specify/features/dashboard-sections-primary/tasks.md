# Task List: Dashboard Sections Restructure - Primary Charts

**Feature**: Dashboard Sections Restructure - Primary Charts
**Feature ID**: DASHBOARD-SECTIONS-PRIMARY
**Total Tasks**: 14 main tasks + sub-tasks
**Estimated Effort**: Medium (4-6 development days)

---

## Task Dependencies

```
Phase 1 (Setup): T1, T2, T3 (can be parallel)
    ↓
Phase 2 (Charts): T4, T5, T6 (can be parallel)
    ↓
Phase 3 (Sections): T7, T8, T9, T10 (can be parallel)
    ↓
Phase 4 (Testing): T11, T12, T13, T14 (sequential)
```

---

## PHASE 1: Foundation Components

### T1: Create Section Template Component
**Priority**: P0 - Blocker
**Effort**: 1 task (1-2 hours)
**Status**: [ ] Not Started

**Description**:
Create reusable `section-template.tsx` component that standardizes section layout across all 4 sections.

**Acceptance Criteria**:
- [x] Component created at `components/analytics/sections/section-template.tsx`
- [x] Props interface defined: id, title, description, children, showEmptyState, emptyStateMessage
- [x] Section container renders with h2 title and description
- [x] Empty state displays centered message when `showEmptyState=true`
- [x] Dark mode styling applied (`dark:` classes)
- [x] Responsive spacing (px-4 mobile, px-6 tablet, px-8 desktop)
- [x] Accessibility: Uses section element with ID, h2 heading
- [x] No console errors
- [x] Tested with various title/description lengths

**Sub-tasks**:
- [ ] Create file structure
- [ ] Define TypeScript interface for props
- [ ] Implement JSX structure
- [ ] Apply Tailwind styling
- [ ] Add dark mode classes
- [ ] Test render with sample props
- [ ] Verify accessibility (semantic HTML)

**Testing**:
- Render with title/description only
- Render with children (chart component)
- Render with empty state message
- Test dark mode toggle

---

### T2: Update Analytics Dashboard Component
**Priority**: P0 - Blocker
**Effort**: 1 task (1-2 hours)
**Depends on**: T1 (section-template)
**Status**: [ ] Not Started

**Description**:
Modify `analytics-dashboard.tsx` to render 4 section components in order, replacing or wrapping existing content.

**Acceptance Criteria**:
- [x] File: `components/analytics/analytics-dashboard.tsx`
- [x] Imports all 4 section components (when created)
- [x] Renders sections in order: Movie Collection → Viewing Journey → Critical Voice → Deep Dives
- [x] Maintains existing header styling (if applicable)
- [x] Responsive container: `space-y-16` gap between sections
- [x] Dark mode compatible
- [x] No console errors
- [x] Sidebar state properly passed (uploadedFiles, analytics)

**Sub-tasks**:
- [ ] Review current analytics-dashboard.tsx structure
- [ ] Plan section integration points
- [ ] Add section component imports (with placeholders)
- [ ] Update render logic to include sections
- [ ] Test section visibility based on data
- [ ] Verify layout spacing and responsive behavior

**Testing**:
- Sections render in correct order
- Props pass through correctly
- Layout doesn't shift on responsive changes

---

### T3: Update Analytics Sidebar - Add Section Navigation
**Priority**: P1 - High
**Effort**: 1 task (1-2 hours)
**Depends on**: T1 (section IDs defined)
**Status**: [ ] Not Started

**Description**:
Add expandable "Sections" menu to sidebar with smooth scroll-to links for each section.

**Acceptance Criteria**:
- [x] File: `components/analytics/analytics-sidebar.tsx`
- [x] New "Sections" menu added (expandable/collapsible)
- [x] 4 section links: Movie Collection, Viewing Journey, Critical Voice, Deep Dives
- [x] Links use correct section IDs (#movie-collection, etc.)
- [x] Smooth scroll-to behavior on click: `scrollIntoView({ behavior: 'smooth' })`
- [x] Hover styling applied to section links
- [x] Works on desktop and mobile (hamburger menu)
- [x] Dark mode styling applied
- [x] No console errors
- [x] Accessibility: Proper button/link semantics

**Sub-tasks**:
- [ ] Review analytics-sidebar.tsx current structure
- [ ] Plan "Sections" menu placement
- [ ] Create section links component
- [ ] Implement smooth scroll handler
- [ ] Add hover/active states
- [ ] Add dark mode styling
- [ ] Test on mobile/desktop/tablet

**Testing**:
- Click each section link
- Verify smooth scroll works
- Verify correct section ID targeted
- Test on different viewport sizes

---

## PHASE 2: Chart Component Redesigns

### T4: Create Release Year Analysis V2 Chart
**Priority**: P0 - Blocker
**Effort**: 1 task (2-3 hours)
**Depends on**: None (can start immediately)
**Status**: [ ] Not Started

**Description**:
Create `release-year-analysis-v2.tsx` by copying and enhancing the existing `release-year-analysis.tsx` with prototype design system.

**Acceptance Criteria**:
- [x] File: `components/charts/release-year-analysis-v2.tsx`
- [x] Based on: `release-year-analysis.tsx`
- [x] Enhancements applied:
  - [x] Dark mode support on all text/strokes
  - [x] Improved color palette (blue to violet gradient)
  - [x] Enhanced spacing/padding
  - [x] Era filter tabs functional and styled
  - [x] Chart grid respects dark mode (`dark:stroke-white/10`)
  - [x] Axis text colors adapt to theme
- [x] All props and functionality preserved from original
- [x] Chart responds to data changes
- [x] Tooltip displays correctly in both themes
- [x] Responsive: Adjusts to container width
- [x] No console errors
- [x] Tested with mock data (year distribution)

**Sub-tasks**:
- [ ] Copy release-year-analysis.tsx → release-year-analysis-v2.tsx
- [ ] Add dark mode classes to text elements
- [ ] Update CartesianGrid stroke: `dark:stroke-white/10`
- [ ] Update axis text colors: `dark:fill-white/70`
- [ ] Verify color gradient still works in dark mode
- [ ] Test era filter functionality
- [ ] Test responsive behavior
- [ ] Compare visually with original (should look similar but with dark mode)

**Testing**:
- Light mode: Colors visible, contrast good
- Dark mode: Colors visible, contrast good
- Era filters work
- Tooltip readable in both themes
- Responsive on 375px, 768px, 1440px

**Notes**:
- Don't change the era filter logic (already works well)
- Focus on styling enhancements and dark mode

---

### T5: Create Viewing Over Time V2 Chart
**Priority**: P0 - Blocker
**Effort**: 2 tasks (3-4 hours)
**Depends on**: None (can start immediately)
**Status**: [ ] Not Started

**Description**:
Create `viewing-over-time-v2.tsx` by copying and enhancing `viewing-over-time.tsx` with area chart prototype design.

**Acceptance Criteria**:
- [x] File: `components/charts/viewing-over-time-v2.tsx`
- [x] Based on: `viewing-over-time.tsx`
- [x] Enhancements applied:
  - [x] Apply area chart design from prototype (`area-chart.tsx`)
  - [x] Use hatched gradient patterns (extract from prototype)
  - [x] Add semi-transparent area fills
  - [x] Smooth curve interpolation (type="natural")
  - [x] Dark mode support on grid/axis/text
  - [x] Chart height responsive: h-[250px] sm:h-[350px] lg:h-[400px]
  - [x] Tooltip styled consistently
- [x] All props and functionality preserved
- [x] Data transformation working correctly
- [x] Responsive container wraps chart
- [x] No console errors
- [x] Tested with temporal data

**Sub-tasks**:
- [ ] Copy viewing-over-time.tsx → viewing-over-time-v2.tsx
- [ ] Import HatchedBackgroundPattern or recreate from area-chart.tsx prototype
- [ ] Apply area chart styling:
  - [ ] Update Area components with fill gradients
  - [ ] Add semi-transparent fills (fillOpacity)
  - [ ] Set smooth curve type
- [ ] Add dark mode classes to CartesianGrid, XAxis, YAxis
- [ ] Update responsive height classes
- [ ] Test data rendering (monthly/yearly aggregation)
- [ ] Verify responsive behavior

**Testing**:
- Light mode: Patterns visible, readable
- Dark mode: Patterns visible, readable
- Charts display correct temporal data
- Responsive on 375px, 768px, 1440px
- Tooltip shows correct dates/counts

**Notes**:
- Reference prototype `area-chart.tsx` for hatched pattern implementation
- Maintain existing data aggregation logic from original

---

### T6: Create Rating Distribution V2 Chart
**Priority**: P0 - Blocker
**Effort**: 2 tasks (3-4 hours)
**Depends on**: None (can start immediately)
**Status**: [ ] Not Started

**Description**:
Create `rating-distribution-v2.tsx` by copying and enhancing `rating-distribution.tsx` with bar chart prototype design.

**Acceptance Criteria**:
- [x] File: `components/charts/rating-distribution-v2.tsx`
- [x] Based on: `rating-distribution.tsx`
- [x] Enhancements applied:
  - [x] Apply bar chart design from prototype (`bar-chart.tsx`)
  - [x] Color gradient red (1★) → green (5★) for ratings
  - [x] Add dotted background pattern (extract from prototype)
  - [x] Bar hover interactions (opacity change)
  - [x] Dark mode support on grid/axis/text/background
  - [x] Stats display styled consistently
  - [x] Progress bars for each rating (from original)
  - [x] Overall stats cards (total ratings, average)
- [x] All props and functionality preserved
- [x] Responsive layout for stats and chart
- [x] No console errors
- [x] Tested with various rating distributions

**Sub-tasks**:
- [ ] Copy rating-distribution.tsx → rating-distribution-v2.tsx
- [ ] Import DottedBackgroundPattern or recreate from bar-chart.tsx prototype
- [ ] Apply bar chart styling:
  - [ ] Update color scheme to red→green gradient
  - [ ] Apply dotted background pattern
  - [ ] Add hover state styling (opacity transitions)
  - [ ] Update bar radius/styling
- [ ] Add dark mode classes to all text/borders/backgrounds
- [ ] Update CartesianGrid for dark mode
- [ ] Enhance stats display layout
- [ ] Test with sample rating distributions

**Testing**:
- Light mode: Colors visible, gradient clear, patterns visible
- Dark mode: Colors visible, gradient clear, patterns visible
- Stats cards display correctly
- Progress bars render for all ratings
- Responsive on 375px, 768px, 1440px
- Tooltip shows correct counts/percentages

**Notes**:
- Keep the insights logic from original (generates helpful messages)
- Reference prototype `bar-chart.tsx` for dotted pattern and hover interactions
- Color mapping: 1★=red, 2★=orange, 3★=yellow, 4★=lime, 5★=green

---

## PHASE 3: Section Components

### T7: Create Movie Collection Section
**Priority**: P1 - High
**Effort**: 1 task (1-2 hours)
**Depends on**: T1 (section-template), T4 (release-year-analysis-v2)
**Status**: [ ] Not Started

**Description**:
Create `movie-collection-section.tsx` component for Section 1.

**Acceptance Criteria**:
- [x] File: `components/analytics/sections/movie-collection-section.tsx`
- [x] Uses SectionTemplate component
- [x] Props: uploadedFiles, analytics
- [x] Section ID: "movie-collection"
- [x] Title: "📽️ Which eras of cinema define your taste?"
- [x] Description: "Release Year & Decade Analysis"
- [x] Always visible (watched.csv required)
- [x] Renders ReleaseYearAnalysisV2 chart
- [x] Passes correct data to chart
- [x] No empty state (always has data)
- [x] Dark mode compatible
- [x] No console errors
- [x] Tested with analytics data

**Sub-tasks**:
- [ ] Create file
- [ ] Import SectionTemplate, ReleaseYearAnalysisV2
- [ ] Define props interface
- [ ] Check for required data (watch.csv)
- [ ] Return null if data unavailable (shouldn't happen)
- [ ] Render SectionTemplate with title/description/chart
- [ ] Pass yearlyBreakdown data to chart
- [ ] Test render with sample data
- [ ] Verify dark mode

**Testing**:
- Section renders on page
- Chart displays release year data
- Dark mode works
- Responsive layout

---

### T8: Create Viewing Journey Section
**Priority**: P1 - High
**Effort**: 1 task (1-2 hours)
**Depends on**: T1 (section-template), T5 (viewing-over-time-v2)
**Status**: [ ] Not Started

**Description**:
Create `viewing-journey-section.tsx` component for Section 2 (conditional).

**Acceptance Criteria**:
- [x] File: `components/analytics/sections/viewing-journey-section.tsx`
- [x] Uses SectionTemplate component
- [x] Props: uploadedFiles, analytics
- [x] Section ID: "viewing-journey"
- [x] Title: "📅 When do you watch movies most?"
- [x] Description: "Temporal Viewing Patterns"
- [x] Conditional: Renders only if diary.csv uploaded AND watched dates exist
- [x] Renders ViewingOverTimeV2 chart when data available
- [x] Passes correct data to chart
- [x] Empty state shows appropriate message when data unavailable
- [x] Dark mode compatible
- [x] No console errors
- [x] Tested with and without data

**Sub-tasks**:
- [ ] Create file
- [ ] Import SectionTemplate, ViewingOverTimeV2
- [ ] Define props interface
- [ ] Check conditions: diary.csv AND watchedDates exist
- [ ] Return null if not visible (optional: show nothing)
- [ ] Render SectionTemplate with title/description/chart or empty state
- [ ] Pass viewing timeline data to chart
- [ ] Define empty state message
- [ ] Test with diary.csv present
- [ ] Test with diary.csv missing (empty state)
- [ ] Verify dark mode

**Testing**:
- Section renders when diary.csv uploaded
- Chart displays temporal data
- Empty state shows when diary.csv missing
- Dark mode works
- Responsive layout

---

### T9: Create Critical Voice Section
**Priority**: P1 - High
**Effort**: 1 task (1-2 hours)
**Depends on**: T1 (section-template), T6 (rating-distribution-v2)
**Status**: [ ] Not Started

**Description**:
Create `critical-voice-section.tsx` component for Section 3 (conditional).

**Acceptance Criteria**:
- [x] File: `components/analytics/sections/critical-voice-section.tsx`
- [x] Uses SectionTemplate component
- [x] Props: uploadedFiles, analytics
- [x] Section ID: "critical-voice"
- [x] Title: "⭐ Are you a harsh critic or generous rater?"
- [x] Description: "Rating Distribution & Patterns"
- [x] Conditional: Renders only if rating data exists (ratings.csv or diary.csv)
- [x] Renders RatingDistributionV2 chart when data available
- [x] Passes correct data to chart
- [x] Empty state shows appropriate message when data unavailable
- [x] Dark mode compatible
- [x] No console errors
- [x] Tested with and without data

**Sub-tasks**:
- [ ] Create file
- [ ] Import SectionTemplate, RatingDistributionV2
- [ ] Define props interface
- [ ] Check condition: rating data exists
- [ ] Return null if not visible (optional: show nothing)
- [ ] Render SectionTemplate with title/description/chart or empty state
- [ ] Pass ratingDistribution data to chart
- [ ] Define empty state message
- [ ] Test with ratings present
- [ ] Test with ratings missing (empty state)
- [ ] Verify dark mode

**Testing**:
- Section renders when rating data available
- Chart displays rating distribution
- Empty state shows when ratings missing
- Dark mode works
- Responsive layout

---

### T10: Create Deep Dives Section (Placeholder)
**Priority**: P2 - Medium
**Effort**: 1 task (30 minutes)
**Depends on**: T1 (section-template)
**Status**: [ ] Not Started

**Description**:
Create `deep-dives-section.tsx` as placeholder for Phase 2 secondary charts.

**Acceptance Criteria**:
- [x] File: `components/analytics/sections/deep-dives-section.tsx`
- [x] Uses SectionTemplate component
- [x] Props: uploadedFiles, analytics
- [x] Section ID: "deep-dives"
- [x] Title: "🔍 What patterns define your viewing?"
- [x] Description: "Advanced Cross-Analysis"
- [x] Conditional: Renders only if secondary chart data available
- [x] Placeholder message for Phase 2
- [x] Dark mode compatible
- [x] No console errors
- [x] Doesn't break layout

**Sub-tasks**:
- [ ] Create file
- [ ] Import SectionTemplate
- [ ] Define props interface
- [ ] Check if any secondary data available (genre, rewatches, etc.)
- [ ] Return null if no secondary data
- [ ] Render placeholder message
- [ ] Add comment about Phase 2 implementation
- [ ] Test placeholder displays

**Testing**:
- Placeholder doesn't break page
- Section doesn't render if no data
- Message is clear

---

## PHASE 4: Integration & Testing

### T11: Test Section Rendering & Layout
**Priority**: P1 - High
**Effort**: 1 task (2-3 hours)
**Depends on**: T2, T7, T8, T9, T10 (all sections)
**Status**: [ ] Not Started

**Description**:
Comprehensive testing of section rendering, layout, and conditional display.

**Acceptance Criteria**:
- [x] All 4 sections visible on page
- [x] Sections render in correct order
- [x] Spacing between sections consistent (`space-y-16`)
- [x] Section titles and descriptions visible
- [x] Charts render with correct data
- [x] Empty states appear when data unavailable
- [x] Responsive: Desktop (1440px) layout correct
- [x] Responsive: Tablet (768px) layout correct
- [x] Responsive: Mobile (375px) layout correct
- [x] No layout shifts or overflow issues
- [x] No console errors or warnings

**Test Scenarios**:

1. **Full Data (All CSVs uploaded)**
   - [ ] All 4 sections visible
   - [ ] All primary charts render
   - [ ] No empty states shown

2. **Partial Data 1 (Only watched.csv)**
   - [ ] Section 1 visible with chart
   - [ ] Sections 2, 3 show empty states
   - [ ] Section 4 hidden (no secondary data)

3. **Partial Data 2 (watched.csv + diary.csv)**
   - [ ] Sections 1, 2 visible with charts
   - [ ] Section 3 shows empty state
   - [ ] Section 4 hidden

4. **Partial Data 3 (watched.csv + ratings.csv)**
   - [ ] Sections 1, 3 visible with charts
   - [ ] Section 2 shows empty state
   - [ ] Section 4 hidden

5. **Responsive Testing**
   - [ ] Desktop: Charts full width, proper spacing
   - [ ] Tablet: Charts responsive, sidebar collapsible
   - [ ] Mobile: Charts full width, sidebar hidden
   - [ ] No horizontal scroll

**Sub-tasks**:
- [ ] Create test data fixtures
- [ ] Test full data scenario
- [ ] Test partial data scenarios (3 combinations)
- [ ] Test responsive on each breakpoint
- [ ] Check for console errors
- [ ] Verify layout spacing
- [ ] Document any visual issues

---

### T12: Test Dark/Light Mode on All Sections
**Priority**: P1 - High
**Effort**: 1 task (2-3 hours)
**Depends on**: T4, T5, T6, T7, T8, T9 (all redesigned)
**Status**: [ ] Not Started

**Description**:
Verify dark/light mode rendering on all sections and charts.

**Acceptance Criteria**:
- [x] Light mode: All text readable, sufficient contrast
- [x] Light mode: Borders visible, backgrounds clear
- [x] Light mode: Chart colors visible and distinguishable
- [x] Dark mode: All text readable, sufficient contrast
- [x] Dark mode: Borders visible, backgrounds clear
- [x] Dark mode: Chart colors visible and distinguishable
- [x] Theme toggle works smoothly (no layout shift)
- [x] Chart patterns/gradients visible in both modes
- [x] Tooltips styled correctly in both modes
- [x] Section titles/descriptions clear in both modes

**Test Scenarios**:

1. **Light Mode**
   - [ ] Section 1 (ReleaseYearAnalysis): Era filter tabs visible, colors clear
   - [ ] Section 2 (ViewingOverTime): Areas visible, patterns clear
   - [ ] Section 3 (RatingDistribution): Bars visible, gradient clear
   - [ ] All text labels readable
   - [ ] All grid lines/borders visible

2. **Dark Mode**
   - [ ] Section 1: Era filter tabs visible, colors clear
   - [ ] Section 2: Areas visible, patterns clear
   - [ ] Section 3: Bars visible, gradient clear
   - [ ] All text labels readable
   - [ ] All grid lines/borders visible

3. **Theme Toggle**
   - [ ] Click theme toggle multiple times
   - [ ] No layout shift or jank
   - [ ] Charts update colors immediately
   - [ ] All sections respond to toggle

**Sub-tasks**:
- [ ] Test each section in light mode
- [ ] Test each section in dark mode
- [ ] Test theme toggle behavior
- [ ] Check contrast ratios (accessibility)
- [ ] Document any styling issues
- [ ] Screenshot comparisons (light vs dark)

---

### T13: Test Sidebar Navigation
**Priority**: P1 - High
**Effort**: 1 task (1-2 hours)
**Depends on**: T3 (sidebar updates)
**Status**: [ ] Not Started

**Description**:
Verify sidebar section navigation works correctly.

**Acceptance Criteria**:
- [x] "Sections" menu visible in sidebar
- [x] Menu is expandable/collapsible
- [x] All 4 section links present
- [x] Links have correct labels
- [x] Click link → smooth scroll to section
- [x] Scroll behavior is smooth (not instant)
- [x] Correct section ID targeted
- [x] Works on desktop viewport
- [x] Works on tablet viewport
- [x] Works on mobile (hamburger menu)
- [x] No console errors

**Test Scenarios**:

1. **Desktop Navigation**
   - [ ] Sidebar always visible
   - [ ] Sections menu expanded
   - [ ] Click "Movie Collection" → scrolls to #movie-collection
   - [ ] Click "Viewing Journey" → scrolls to #viewing-journey
   - [ ] Click "Critical Voice" → scrolls to #critical-voice
   - [ ] Click "Deep Dives" → scrolls to #deep-dives
   - [ ] Smooth scroll animation visible

2. **Mobile Navigation (375px)**
   - [ ] Hamburger menu visible
   - [ ] Click hamburger → sidebar appears as overlay
   - [ ] Sections menu in sidebar
   - [ ] Click section link → scrolls to section
   - [ ] Sidebar closes after click (optional)
   - [ ] Smooth scroll animation visible

3. **Edge Cases**
   - [ ] Multiple rapid clicks on links (debounce check)
   - [ ] Click link from bottom → scrolls correctly
   - [ ] Click link from top → scrolls correctly
   - [ ] Scroll offset (scroll-margin-top: 20) working

**Sub-tasks**:
- [ ] Verify section IDs on all sections
- [ ] Test navigation on each viewport
- [ ] Check scroll smoothness
- [ ] Test edge cases
- [ ] Verify accessibility (keyboard navigation)

---

### T14: Verify Responsive Behavior & Polish
**Priority**: P1 - High
**Effort**: 1 task (2 hours)
**Depends on**: All previous tasks
**Status**: [ ] Not Started

**Description**:
Final responsive behavior testing and visual polish.

**Acceptance Criteria**:
- [x] Charts maintain aspect ratio on all viewports
- [x] Sidebar collapse/expand doesn't break charts
- [x] Charts resize smoothly (no jank)
- [x] Text wraps correctly on narrow viewports
- [x] No horizontal scroll at any viewport
- [x] Touch interactions work on mobile
- [x] Responsive padding/spacing correct
- [x] Performance: Charts render <500ms
- [x] No unused CSS classes
- [x] Code is clean and well-organized

**Test Scenarios**:

1. **Sidebar Collapse/Expand (Desktop)**
   - [ ] Sidebar collapse → charts widen
   - [ ] Sidebar expand → charts narrower
   - [ ] No layout shift or jank
   - [ ] Charts resize proportionally

2. **Viewport Resize**
   - [ ] Resize from 1440px → 768px → 375px
   - [ ] Charts adapt at each breakpoint
   - [ ] Text remains readable
   - [ ] No horizontal scroll

3. **Mobile Interactions**
   - [ ] Touch scrolling works smoothly
   - [ ] Tap on chart elements (if interactive)
   - [ ] Hamburger menu opens/closes smoothly
   - [ ] No pinch-zoom issues

4. **Performance**
   - [ ] Page load time <2s
   - [ ] Chart render <500ms
   - [ ] Lighthouse score >85
   - [ ] No layout shifts (CLS)

**Sub-tasks**:
- [ ] Test sidebar collapse/expand
- [ ] Test viewport resizing
- [ ] Test on actual mobile device
- [ ] Performance audit (Chrome DevTools)
- [ ] Accessibility audit (axe DevTools)
- [ ] Visual polish review
- [ ] Code cleanup

---

## OPTIONAL (Future Enhancements)

### T15: Add Active Section Highlighting (Optional)
**Priority**: P3 - Nice to have
**Effort**: 1 task (1-2 hours)
**Depends on**: T3 (sidebar nav)
**Status**: [ ] Not Started

**Description**:
Highlight active section link based on scroll position (optional enhancement).

**Implementation**: Use Intersection Observer API to detect which section is in viewport, update active link styling.

---

### T16: Add Section Transitions/Animations (Optional)
**Priority**: P3 - Nice to have
**Effort**: 1 task (1-2 hours)
**Depends on**: All section components
**Status**: [ ] Not Started

**Description**:
Add fade-in or slide animations when sections become visible on scroll (optional enhancement).

---

## Testing Checklist (Manual QA)

### All Sections
- [ ] Renders without console errors
- [ ] Dark mode toggle works
- [ ] Responsive on 375px, 768px, 1440px
- [ ] Sidebar navigation scrolls correctly
- [ ] No layout shifts

### Section 1: Movie Collection
- [ ] Title and description visible
- [ ] ReleaseYearAnalysisV2 renders
- [ ] Era filter tabs work
- [ ] Dark mode shows patterns/colors clearly
- [ ] Responsive sizing correct

### Section 2: Viewing Journey
- [ ] Shows when diary.csv uploaded
- [ ] Shows empty state when diary.csv missing
- [ ] ViewingOverTimeV2 renders
- [ ] Dark mode shows patterns/colors clearly
- [ ] Responsive sizing correct

### Section 3: Critical Voice
- [ ] Shows when ratings available
- [ ] Shows empty state when ratings missing
- [ ] RatingDistributionV2 renders
- [ ] Dark mode shows patterns/colors clearly
- [ ] Stats cards display correctly
- [ ] Responsive sizing correct

### Section 4: Deep Dives
- [ ] Placeholder visible or hidden appropriately
- [ ] Doesn't break layout

### Sidebar
- [ ] Sections menu expandable/collapsible
- [ ] All 4 links present and functional
- [ ] Smooth scroll works
- [ ] Mobile hamburger menu works

---

## Success Criteria (Feature Complete)

- [x] All 4 sections render correctly
- [x] Primary charts display with correct data
- [x] Prototype design system adopted
- [x] Dark mode fully implemented and tested
- [x] Responsive on all breakpoints
- [x] Sidebar navigation functional
- [x] Empty states display appropriately
- [x] No console errors or warnings
- [x] Performance targets met (lighthouse >85)
- [x] Accessibility standards met (WCAG AA)

---

## Notes & Known Issues

- None at specification time. Issues will be documented as they arise during implementation.

---

**Last Updated**: November 28, 2025
**Status**: Ready for Development ✅

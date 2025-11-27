# Feature Specification: Analytics Dashboard

**Feature**: Display comprehensive analytics dashboard with all statistics and visualizations
**User Story**: US5 - Display Analytics Dashboard
**Priority**: P1 - MANDATORY
**Category**: UI/UX

---

## Overview

Create a complete analytics page that displays user's movie watching statistics, charts, and insights. Pulls all data from parsed/merged CSVs and computed analytics to provide an at-a-glance understanding of viewing habits.

---

## User Story

> As a user, I want to see my analytics displayed on a clean dashboard with stat cards and simple visualizations so I can understand my watching habits.

---

## Acceptance Criteria

- [ ] Analytics page displays stat cards for: total watched, rated, average rating, rewatches
- [ ] Stat cards show clear numbers and percentages
- [ ] Page shows basic distribution visualization (rating distribution as simple chart)
- [ ] Page shows decade breakdown (horizontal bar chart or list)
- [ ] Page shows yearly breakdown (simple table or list)
- [ ] Page is responsive: mobile (375px), tablet (768px), desktop (1920px)
- [ ] Dark mode is default, light mode also works
- [ ] Empty state displayed if no data uploaded
- [ ] Loading state displayed while parsing/computing
- [ ] Error state displays helpful message if something fails
- [ ] No console errors

---

## Technical Details

**Components to Create**:
- `components/analytics/stats-overview.tsx` - stat cards layout
- `components/analytics/stats-distribution.tsx` - rating distribution visualization
- `app/analytics/page.tsx` - main dashboard page

**Visualization Library**: Recharts for charts

**Styling**: Tailwind CSS with dark/light mode support

**State**: Connected to `useAnalyticsStore` hook

---

## Dependencies

- US1 (CSV parsing)
- US2 (data storage)
- US3 (analytics computation)
- US4 (multiple CSV merging)

---

## Test Scenario

- Upload CSV and navigate to analytics page
- Verify stat cards display correct numbers
- Verify charts render (rating distribution bar chart with 5+ ratings)
- Verify decade breakdown displays top decades
- Verify responsive layout on mobile viewport
- Verify dark mode displays correctly

---

## Dashboard Layout

### Header Section
- Page title: "Analytics"
- Upload CSV button
- Clear data button
- Theme toggle (dark/light)

### Stat Cards Section
- Total movies watched
- Movies rated (count + percentage)
- Average rating
- Movies liked (count + percentage)
- Movies rewatched (count + percentage)

### Visualizations Section
- Rating distribution chart (bar chart)
- Decade breakdown chart (horizontal bar)
- Yearly breakdown table/list

### Footer / Bottom
- Data info (last updated timestamp)
- Export option (future P2)

---

## Related User Stories

- US6: Rewatch Tracking (adds rewatch section)
- US7: Liked Movies (adds liked section)
- US9: Data Export (adds export functionality)

---

## Implementation Files

**Page**: `app/analytics/page.tsx`

**Components**:
- `components/analytics/stats-overview.tsx`
- `components/analytics/stats-distribution.tsx`
- `components/analytics/empty-state.tsx` (update existing)
- `components/analytics/analytics-header.tsx` (update existing)

**Tests**:
- `__tests__/e2e/analytics-dashboard.spec.ts`
- `__tests__/unit/stats-overview.test.ts` (component tests)
- `__tests__/unit/stats-distribution.test.ts` (component tests)

---

## Reference

- **App Plan**: `.specify/app/plan.md` (section 1.2 - Project Structure)
- **Tasks**: `.specify/app/tasks.md` (see T027-T031)

---

**Last Updated**: November 27, 2025

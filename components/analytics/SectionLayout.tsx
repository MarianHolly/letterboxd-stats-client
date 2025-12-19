'use client'

import React from 'react'

// ============================================================================
// SECTION LAYOUT - Main wrapper
// ============================================================================

interface SectionLayoutProps {
  children: React.ReactNode
}

/**
 * Main section wrapper with responsive styling and border
 * Mobile: 1 column layout
 * Desktop: 2+ column layout with flexible secondary charts
 *
 * Border: subtle on mobile (pb-8), prominent on desktop (md:pb-12 md:border-b-2)
 */
export function SectionLayout({ children }: SectionLayoutProps) {
  return (
    <div className="space-y-6 border-b border-slate-200 dark:border-white/10 pb-8 md:pb-12 md:border-b-2 md:dark:border-white/15">
      {children}
    </div>
  )
}

// ============================================================================
// HEADER - Title + Description + Insight
// ============================================================================

interface HeaderProps {
  title: string
  description: string
  insight?: string
}

/**
 * Section header with title, description, and optional insight message
 * Insight appears as an italicized callout below description
 */
SectionLayout.Header = function Header({ title, description, insight }: HeaderProps) {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {description}
        </p>
      </div>

      {insight && (
        <div className="pt-2 text-sm text-slate-600 dark:text-slate-400 italic border-l-2 border-slate-300 dark:border-white/10 pl-3">
          💡 {insight}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// PRIMARY - Full width primary chart
// ============================================================================

/**
 * Primary chart slot - always full width
 * Use this for the main visualization of a section
 */
SectionLayout.Primary = function Primary({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>
}

// ============================================================================
// SECONDARY - Responsive grid for secondary charts
// ============================================================================

/**
 * Secondary charts grid
 * Mobile: 1 column (grid-cols-1)
 * Desktop: 2 columns (md:grid-cols-2)
 *
 * Charts can use col-span-1 (default) or col-span-2 (full width)
 * to create flexible layouts
 *
 * Usage:
 * <SectionLayout.Secondary>
 *   <div>Chart 1 (1 col)</div>
 *   <div className="col-span-1 md:col-span-2">Chart 2 (full width on desktop)</div>
 * </SectionLayout.Secondary>
 */
SectionLayout.Secondary = function Secondary({ children }: { children: React.ReactNode }) {
  const childrenArray = React.Children.toArray(children).filter(Boolean)

  // If only 1 child, render as full width
  if (childrenArray.length === 1) {
    return <div className="w-full">{childrenArray[0]}</div>
  }

  // Multiple children: use responsive grid
  // Mobile: 1 column
  // Desktop: 2 columns (children can span 2 with col-span-2)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {childrenArray.map((child, i) => (
        <React.Fragment key={i}>
          {child}
        </React.Fragment>
      ))}
    </div>
  )
}

// ============================================================================
// EMPTY STATE - No data available
// ============================================================================

interface EmptyStateProps {
  message: string
  actionText?: string
  onAction?: () => void
}

/**
 * Empty state - displayed when no data is available for this section
 * Shows a message and optional action button
 *
 * Usage:
 * <SectionLayout.Empty
 *   message="No rating data available. Upload ratings.csv to see patterns."
 *   actionText="Learn how to export"
 *   onAction={() => {}}
 * />
 */
SectionLayout.Empty = function Empty({ message, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-[300px] rounded-lg border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
      <div className="text-center space-y-3">
        <div className="text-sm font-medium text-slate-700 dark:text-white/80">
          No data available
        </div>
        <p className="text-sm text-slate-600 dark:text-white/60 max-w-xs">{message}</p>
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded text-sm font-medium bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// LOADING STATE - Skeleton loaders
// ============================================================================

/**
 * Loading state with skeleton placeholders
 * Shows animated placeholders for header, primary, and secondary charts
 *
 * Usage:
 * {isLoading ? <SectionLayout.Loading /> : <SectionLayout>...</SectionLayout>}
 */
SectionLayout.Loading = function Loading() {
  return (
    <div className="space-y-6 border-b border-slate-200 dark:border-white/10 pb-8 md:pb-12 md:border-b-2 md:dark:border-white/15">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-48 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-white/10 rounded animate-pulse mt-3" />
      </div>

      {/* Primary chart skeleton */}
      <div className="h-[320px] bg-slate-200 dark:bg-white/10 rounded animate-pulse" />

      {/* Secondary charts skeleton (2 columns on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[300px] bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
        <div className="h-[300px] bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  )
}

'use client'

import React from 'react'

// ============================================================================
// SECTION LAYOUT - Main wrapper
// ============================================================================

interface SectionLayoutProps {
  children: React.ReactNode
  id?: string
}

/**
 * Main section wrapper with responsive styling and border
 * Mobile: 1 column layout
 * Desktop: 2+ column layout with flexible secondary charts
 *
 * Border: subtle on mobile (pb-8), prominent on desktop (md:pb-12 md:border-b-2)
 */
export function SectionLayout({ children, id }: SectionLayoutProps) {
  return (
    <div id={id} className="space-y-6 border-b border-slate-200 dark:border-white/10 pb-8 md:pb-12 md:border-b-2 md:dark:border-white/15">
      {children}
    </div>
  )
}

// ============================================================================
// HEADER - Title + Description + Insight
// ============================================================================

interface HeaderProps {
  title: string
  subtitle?: string
  description: string
  insight?: string
  highlightWord?: string
  highlightColor?: string
  showDescription?: boolean
}

/**
 * Section header with title, subtitle, description, and optional insight message
 * Subtitle appears between title and description
 * Insight appears as an italicized callout below description
 *
 * Usage with highlight:
 * <Header
 *   title="Your Cinematic Timeline"
 *   highlightWord="Cinematic"
 *   highlightColor="#4F46E5"
 *   ...
 * />
 */
SectionLayout.Header = function Header({ title, subtitle, description, insight, highlightWord, highlightColor, showDescription = true }: HeaderProps) {
  // Render title with highlighted word if provided
  const renderTitle = () => {
    if (!highlightWord || !highlightColor) {
      return title
    }

    const parts = title.split(highlightWord)
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span style={{ color: highlightColor }} className="font-bold">
                {highlightWord}
              </span>
            )}
          </span>
        ))}
      </>
    )
  }

  return (
    <div className="space-y-2 text-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {renderTitle()}
        </h2>
        {subtitle && (
          <p className="hidden md:block text-lg font-medium text-slate-700 dark:text-slate-300 mt-2">
            {subtitle}
          </p>
        )}
        {showDescription && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 md:max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {insight && (
        <div className="pt-2 text-sm text-slate-600 dark:text-slate-400 italic">
          {insight}
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
// SUBSECTION - Nested subsection without border
// ============================================================================

interface SubsectionProps {
  children: React.ReactNode
}

/**
 * Subsection wrapper for nested content within a section
 * No border, uses spacing to separate from other subsections
 * Use with SubHeader for consistent subsection styling
 *
 * Usage:
 * <SectionLayout.Subsection>
 *   <SectionLayout.SubHeader title="..." />
 *   <SectionLayout.Primary>...</SectionLayout.Primary>
 * </SectionLayout.Subsection>
 */
SectionLayout.Subsection = function Subsection({ children }: SubsectionProps) {
  return (
    <div className="space-y-6 pt-4">
      {children}
    </div>
  )
}

// ============================================================================
// SUB HEADER - Smaller header for subsections
// ============================================================================

interface SubHeaderProps {
  title: string
  subtitle?: string
  description?: string
  insight?: string
}

/**
 * Subsection header with smaller styling
 * Used within Subsection for visual hierarchy
 */
SectionLayout.SubHeader = function SubHeader({ title, subtitle, description, insight }: SubHeaderProps) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-base font-medium text-slate-600 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {description}
          </p>
        )}
      </div>

      {insight && (
        <div className="text-sm text-slate-600 dark:text-slate-400 italic">
          {insight}
        </div>
      )}
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
// EMPTY WITH SPLIT - Split layout for optional sections with no data
// ============================================================================

interface EmptyWithSplitProps {
  subtitle: string
  description: string
  requiredFiles: string[]
  actionText?: string
  onAction?: () => void
}

/**
 * Empty state with split layout for optional sections
 * Desktop: Title + subtitle on top, description (40%) on left, upload area (60%) on right
 * Tablet: Hide subtitle, keep split positioning
 * Mobile: Hide description, show subtitle, stack upload area below
 *
 * Usage:
 * <SectionLayout.EmptyWithSplit
 *   subtitle="Track your cinema journey"
 *   description="Lorem ipsum..."
 *   requiredFiles={["diary.csv"]}
 *   actionText="Upload Diary"
 *   onAction={() => {}}
 * />
 */
SectionLayout.EmptyWithSplit = function EmptyWithSplit({
  subtitle,
  description,
  requiredFiles,
  actionText = "Upload Data",
  onAction,
}: EmptyWithSplitProps) {
  return (
    <div className="space-y-6">
      {/* Subtitle - visible on mobile and tablet, hidden on desktop (shown in Header) */}
      <div className="block md:hidden text-center">
        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
          {subtitle}
        </p>
      </div>

      {/* Split layout: description (40%) + upload area (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Description - Left side (40% on desktop, full width on mobile) */}
        <div className="hidden lg:block lg:col-span-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Upload Area - Right side (60% on desktop, full width on mobile) */}
        <div className="lg:col-span-3">
          <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 min-h-[280px]">
            <div className="text-center space-y-4 w-full">
              {/* Upload icon */}
              <div className="flex justify-center">
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/10">
                  <svg
                    className="w-8 h-8 text-slate-600 dark:text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>

              {/* Upload text */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Upload Required Files
                </h4>
               
              {/* Upload text with required files instruction */}
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select and upload the following files:{' '}
                {requiredFiles.map((file, index) => (
                  <span key={index} className="font-bold text-slate-700 dark:text-slate-300">
                    {file}
                    {index < requiredFiles.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              </div>


              {/* Upload button */}
              {actionText && onAction && (
                <button
                  onClick={onAction}
                  className="mt-4 inline-flex items-center justify-center px-6 py-2 rounded text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {actionText}
                </button>
              )}
            </div>
          </div>
        </div>
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
        <div className="h-6 w-64 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
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

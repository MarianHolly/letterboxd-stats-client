import React from "react";

interface ChartExampleProps {
  title: string;
  description: string;
  category: string;
  children: React.ReactNode;
  dataDescription?: string;
}

/**
 * Reusable component for displaying chart examples with mock data
 * Used in guide page to showcase how charts work
 */
export function ChartExample({
  title,
  description,
  category,
  children,
  dataDescription,
}: ChartExampleProps) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold text-foreground text-sm md:text-base">
            {title}
          </h4>
          <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-foreground/60 whitespace-nowrap flex-shrink-0">
            {category}
          </span>
        </div>
        <p className="text-xs md:text-sm text-foreground/70 dark:text-foreground/60">
          {description}
        </p>
      </div>

      {/* Chart Container */}
      <div className="p-4 bg-white dark:bg-slate-950/50 min-h-[200px] flex items-center justify-center">
        <div className="w-full">{children}</div>
      </div>

      {/* Footer */}
      {dataDescription && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-foreground/60 italic">{dataDescription}</p>
        </div>
      )}
    </div>
  );
}

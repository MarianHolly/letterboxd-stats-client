"use client";

import React from "react";

interface SectionTemplateProps {
  id: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  showEmptyState?: boolean;
  emptyStateMessage?: string;
}

export function SectionTemplate({
  id,
  title,
  description,
  children,
  showEmptyState = false,
  emptyStateMessage = "Data not available",
}: SectionTemplateProps) {
  return (
    <section
      id={id}
      className="space-y-4 scroll-mt-20"
      aria-labelledby={`${id}-title`}
    >
      {/* Section Header */}
      <div className="space-y-2">
        <h2
          id={`${id}-title`}
          className="text-3xl font-bold text-black dark:text-white"
        >
          {title}
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* Content Area */}
      {showEmptyState ? (
        <div className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {emptyStateMessage}
          </p>
        </div>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </section>
  );
}

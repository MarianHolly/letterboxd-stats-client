import React from "react";

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable content section wrapper with max-width, padding, and background
 * Used to structure content pages (about, guide, roadmap)
 */
export function ContentSection({ children, className = "" }: ContentSectionProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

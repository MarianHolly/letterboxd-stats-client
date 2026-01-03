import React from "react";

interface SectionGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: "small" | "medium" | "large";
  className?: string;
}

/**
 * Reusable grid layout component for organizing content
 * Responsive across mobile, tablet, and desktop
 */
export function SectionGrid({
  children,
  cols = 2,
  gap = "medium",
  className = "",
}: SectionGridProps) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapClass = {
    small: "gap-4 md:gap-6",
    medium: "gap-6 md:gap-8",
    large: "gap-8 md:gap-12",
  };

  return (
    <div className={`grid ${colsClass[cols]} ${gapClass[gap]} ${className}`}>
      {children}
    </div>
  );
}

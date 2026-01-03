import React from "react";
import { SectionGrid } from "@/components/layout/section-grid";

interface ChartShowcaseGroup {
  category: string;
  description: string;
  charts: React.ReactNode[];
}

interface ChartShowcaseProps {
  groups: ChartShowcaseGroup[];
}

/**
 * Reusable component for organizing and displaying groups of chart examples
 * Groups charts by category with descriptions
 */
export function ChartShowcase({ groups }: ChartShowcaseProps) {
  return (
    <div className="space-y-12">
      {groups.map((group, idx) => (
        <div key={idx}>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {group.category}
            </h3>
            <p className="text-foreground/70 dark:text-foreground/60 text-sm">
              {group.description}
            </p>
          </div>
          <SectionGrid cols={2} gap="medium">
            {group.charts.map((chart, chartIdx) => (
              <div key={chartIdx}>{chart}</div>
            ))}
          </SectionGrid>
        </div>
      ))}
    </div>
  );
}

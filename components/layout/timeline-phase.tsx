import React from "react";

interface TimelineItem {
  title: string;
  description?: string;
  status?: "complete" | "in-progress" | "planned";
}

interface TimelinePhaseProps {
  phase: number;
  title: string;
  description: string;
  status: "complete" | "in-progress" | "planned";
  items: TimelineItem[];
  icon?: React.ReactNode;
  color?: "emerald" | "indigo" | "purple" | "amber";
  accentColor?: string; // HEX color override
}

/**
 * Reusable timeline phase component for roadmap
 * Displays phase with items and status indicators
 */
export function TimelinePhase({
  phase,
  title,
  description,
  status,
  items,
  icon,
  color = "indigo",
  accentColor,
}: TimelinePhaseProps) {
  const colorMap = {
    emerald: {
      gradient: "from-emerald-600 to-teal-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800/40",
    },
    indigo: {
      gradient: "from-indigo-600 to-blue-600",
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
      badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
      border: "border-indigo-200 dark:border-indigo-800/40",
    },
    purple: {
      gradient: "from-purple-600 to-pink-600",
      bg: "bg-purple-50 dark:bg-purple-950/20",
      badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800/40",
    },
    amber: {
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50 dark:bg-amber-950/20",
      badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800/40",
    },
  };

  const colorConfig = colorMap[color];
  const statusText = {
    complete: "Complete",
    "in-progress": "In Progress",
    planned: "Planned",
  };

  const statusBadgeColor = {
    complete: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    "in-progress":
      "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    planned: "bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300",
  };

  return (
    <div className={`border ${colorConfig.border} rounded-xl p-8 ${colorConfig.bg}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          {icon && (
            <div
              className={`p-3 rounded-lg bg-gradient-to-br ${colorConfig.gradient} text-white flex-shrink-0`}
            >
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-foreground">
                Phase {phase}: {title}
              </h3>
            </div>
            <p className="text-foreground/70 dark:text-foreground/60">
              {description}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
            statusBadgeColor[status]
          }`}
        >
          {statusText[status]}
        </span>
      </div>

      {/* Items Grid */}
      {items.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-4">
            What's Included
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded bg-card dark:bg-slate-950/30 border border-border dark:border-border-light"
              >
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-foreground">
                    {item.title}
                  </h5>
                  {item.description && (
                    <p className="text-xs text-foreground/60 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

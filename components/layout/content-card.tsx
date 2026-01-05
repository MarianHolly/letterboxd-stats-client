import React from "react";

interface ContentCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  number?: string | number;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "highlighted";
}

/**
 * Reusable card component for displaying content items
 * Can be used for features, steps, instructions, etc.
 */
export function ContentCard({
  title,
  description,
  icon,
  number,
  children,
  className = "",
  variant = "default",
}: ContentCardProps) {
  const variantClasses = {
    default:
      "border border-border dark:border-border rounded-lg p-6 hover:bg-secondary dark:hover:bg-slate-900/30 transition-colors",
    bordered:
      "border-2 border-border-medium dark:border-border-dark rounded-lg p-6 hover:border-border-dark dark:hover:border-border-medium transition-colors",
    highlighted:
      "border border-indigo-200 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-lg p-6",
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      <div className="flex gap-4">
        {number && (
          <div className="flex items-center justify-center flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-muted dark:bg-white/10 flex items-center justify-center font-bold text-foreground dark:text-slate-100">
              {number}
            </div>
          </div>
        )}

        <div className="flex-1">
          {icon && <div className="mb-3 flex items-center">{icon}</div>}

          <h3 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-foreground/70 dark:text-foreground/60 leading-relaxed text-sm md:text-base">
            {description}
          </p>

          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

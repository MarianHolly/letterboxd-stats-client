import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

/**
 * Reusable section header with title, description, and optional icon
 * Used across content pages for consistent styling
 */
export function SectionHeader({
  title,
  description,
  icon,
  centered = false,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""} ${className}`}>
      {icon && <div className="mb-4 flex items-center gap-3">{icon}</div>}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-foreground/60 dark:text-foreground/65 leading-relaxed max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
}

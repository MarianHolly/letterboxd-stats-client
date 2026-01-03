"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ExpandableSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

/**
 * Reusable expandable/accordion section component
 * Used for detailed instructions, FAQs, etc.
 */
export function ExpandableSection({
  title,
  description,
  children,
  defaultOpen = false,
  icon,
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div>
            <h3 className="font-semibold text-foreground text-base md:text-lg">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-foreground/60 mt-1">{description}</p>
            )}
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-foreground/60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-white dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
          {children}
        </div>
      )}
    </div>
  );
}

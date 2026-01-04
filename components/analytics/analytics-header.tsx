"use client";

import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";
import { useAnalyticsStore } from "@/hooks/use-analytics-store";

interface AnalyticsHeaderProps {
  title?: string;
  description?: string;
}

export function AnalyticsHeader({
  title = "Analytics",
  description,
}: AnalyticsHeaderProps) {
  const { toggleSidebar } = useSidebar();
  const isDemoMode = useAnalyticsStore((state) => state.isDemoMode);

  return (
    <header className="sticky top-0 z-20 flex-shrink-0 h-16 flex items-center border-b border-gray-200 dark:border-white/10 bg-background dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 px-4">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleSidebar()}
            className="border-gray-50 text-foreground hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            <Menu className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Separator
            orientation="vertical"
            className="h-6 bg-gray-200 dark:bg-white/10"
          />
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-semibold text-foreground dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-gray-600 dark:text-white/60 hidden sm:block">
                  {description}
                </p>
              )}
            </div>
            {isDemoMode && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 dark:bg-purple-500/15 dark:border-purple-400/40">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Demo Data
                </span>
              </div>
            )}
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

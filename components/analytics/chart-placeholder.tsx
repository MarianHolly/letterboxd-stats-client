"use client";

import { useTheme } from "next-themes";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ChartPlaceholderProps {
  title: string;
  description: string;
  requiredFile?: string;
  height?: string;
  onUploadClick?: () => void;
}

/**
 * Placeholder component shown when chart data is unavailable
 * Informs user which file they need to upload
 * Clickable to open upload modal
 */
export function ChartPlaceholder({
  title,
  description,
  requiredFile,
  height = "h-64",
  onUploadClick,
}: ChartPlaceholderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card
      onClick={onUploadClick}
      className={`${height} flex items-center justify-center border-2 border-dashed cursor-pointer transition-all duration-200 ${
        isDark
          ? "border-slate-700 bg-slate-900/50 hover:border-blue-600 hover:bg-slate-900/80"
          : "border-slate-300 bg-slate-50/50 hover:border-blue-500 hover:bg-slate-100"
      }`}
    >
      <CardContent className="p-8 text-center w-full">
        <div className="flex justify-center mb-4">
          <AlertCircle
            className={`w-8 h-8 transition-colors ${
              isDark ? "text-slate-500 group-hover:text-blue-400" : "text-slate-400"
            }`}
          />
        </div>
        <h3
          className={`font-semibold mb-2 ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mb-3 ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {description}
        </p>
        {requiredFile && (
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-medium transition-colors ${
              isDark
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50"
                : "bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 hover:border-blue-400"
            }`}
          >
            💾 Upload {requiredFile} to unlock
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client"

import { motion } from "framer-motion"
import { Upload, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface AnalyticsEmptyStateProps {
  onUploadClick?: () => void
}

export function AnalyticsEmptyState({ onUploadClick }: AnalyticsEmptyStateProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="flex-1 overflow-auto flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl w-full"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          className="mb-8 flex justify-center"
        >
          <div className="p-6 rounded-sm bg-gradient-to-br from-indigo-600 to-rose-600">
            <Upload className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className={`text-4xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
          No Data Uploaded Yet
        </h1>

        {/* Description */}
        <p className={`mb-8 leading-relaxed ${isDark ? "text-white/60" : "text-slate-600"}`}>
          Upload your Letterboxd CSV files to unlock detailed analytics and insights about your movie watching habits, favorite genres, directors, and more.
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-10 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`flex items-start gap-4 p-4 rounded-lg border ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-gradient-to-br from-indigo-600 to-rose-600 text-white">
              1
            </span>
            <div className="flex-1">
              <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Export Your Data</p>
              <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-600"}`}>
                Go to Letterboxd Settings → Import & Export and download your CSV files
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex items-start gap-4 p-4 rounded-lg border ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-gradient-to-br from-indigo-600 to-rose-600 text-white">
              2
            </span>
            <div className="flex-1">
              <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Upload Files</p>
              <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-600"}`}>
                You need at least &apos;watched.csv&apos;. Optionally add ratings.csv, diary.csv, and likes.csv
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex items-start gap-4 p-4 rounded-lg border ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-indigo-50 border-indigo-200"
            }`}
          >
            <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-gradient-to-br from-indigo-600 to-rose-600 text-white">
              3
            </span>
            <div className="flex-1">
              <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>Explore Analytics</p>
              <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-600"}`}>
                View interactive charts, trends, ratings, and insights about your cinema journey
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            onClick={onUploadClick}
            size="lg"
            className="text-white bg-slate-950 hover:bg-slate-900/95 dark:text-white dark:border dark:border-slate-700 hover:dark:bg-slate-900 rounded-sm font-semibold px-8 py-6 text-lg transition-all duration-200 shadow-lg hover:cursor-pointer flex items-center group"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Your Data
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Info */}
        <p className={`text-xs mt-8 ${isDark ? "text-white/40" : "text-slate-500"}`}>
          ✓ Your data stays completely private and secure. Never shared.
        </p>
      </motion.div>
    </div>
  )
}

"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseLetterboxdCSV } from "@/lib/csv-parser";
import { mergeMovieSources } from "@/lib/data-merger";
import type { Movie, MovieDataset } from "@/lib/types";

interface UploadedFile {
  file: File;
  type: "watched" | "ratings" | "diary" | "films" | "watchlist" | "unknown";
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
  parsedData?: Movie[];
}

type UploadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (dataset: MovieDataset) => void;
};

const FILE_TYPES = {
  "diary.csv": "diary",
  "ratings.csv": "ratings",
  "watched.csv": "watched",
  "films.csv": "films",
  "watchlist.csv": "watchlist",
} as const;

const FILE_DESCRIPTIONS = {
  diary: {
    label: "Diary",
    description: "Recommended - Viewing dates and your ratings",
    required: false,
  },
  ratings: {
    label: "Ratings",
    description: "Optional - All your rated movies",
    required: false,
  },
  watched: {
    label: "Watched Movies",
    description: "Optional - Your complete watch list",
    required: false,
  },
  films: {
    label: "Films",
    description: "Optional - Complete watched history",
    required: false,
  },
  watchlist: {
    label: "Watchlist",
    description: "Optional - Movies you want to watch",
    required: false,
  },
};

export function UploadModal({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Reset files when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUploadedFiles([]);
    }
    onOpenChange(newOpen);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = [];

      for (const file of acceptedFiles) {
        const fileName = file.name.toLowerCase();
        let fileType: UploadedFile["type"] = "unknown";

        for (const [key, type] of Object.entries(FILE_TYPES)) {
          if (fileName === key) {
            fileType = type;
            break;
          }
        }

        if (fileType === "unknown") {
          newFiles.push({
            file,
            type: fileType,
            status: "error" as const,
            progress: 100,
            error: `Unknown file type. Expected: ${Object.keys(FILE_TYPES).join(", ")}`,
          });
          continue;
        }

        // Parse the CSV file
        const uploadedFile: UploadedFile = {
          file,
          type: fileType,
          status: "uploading" as const,
          progress: 50,
        };

        try {
          const result = await parseLetterboxdCSV(file);

          if (result.success && result.data) {
            uploadedFile.status = "success";
            uploadedFile.progress = 100;
            uploadedFile.parsedData = result.data;
          } else {
            uploadedFile.status = "error";
            uploadedFile.progress = 100;
            uploadedFile.error =
              result.errors.length > 0
                ? `${result.errors.length} row(s) failed: ${result.errors[0].message}`
                : "Failed to parse CSV";
          }
        } catch (err) {
          uploadedFile.status = "error";
          uploadedFile.progress = 100;
          uploadedFile.error =
            err instanceof Error ? err.message : "Unknown error while parsing";
        }

        newFiles.push(uploadedFile);
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: true,
  });

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    const hasAnyFile = uploadedFiles.length > 0;
    const hasErrors = uploadedFiles.some((f) => f.status === "error");
    const hasWatched = uploadedFiles.some((f) => f.type === "watched" && !f.error);

    if (!hasAnyFile) {
      alert("Please upload at least one CSV file");
      return;
    }

    if (!hasWatched) {
      alert("watched.csv is required to continue");
      return;
    }

    if (hasErrors) {
      alert("Please fix the errors before continuing");
      return;
    }

    // Merge all parsed data
    try {
      const watched = uploadedFiles
        .find((f) => f.type === "watched")?.parsedData || [];
      const diary = uploadedFiles.find((f) => f.type === "diary")?.parsedData;
      const ratings = uploadedFiles
        .find((f) => f.type === "ratings")?.parsedData;
      const films = uploadedFiles.find((f) => f.type === "films")?.parsedData;
      const watchlist = uploadedFiles
        .find((f) => f.type === "watchlist")?.parsedData;

      const dataset = mergeMovieSources(watched, diary, ratings, films, watchlist);

      onUploadComplete?.(dataset);
      onOpenChange(false);
    } catch (err) {
      alert(
        `Error merging data: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const handleReset = () => {
    setUploadedFiles([]);
  };

  const groupedFiles = uploadedFiles.reduce(
    (acc, file, index) => {
      if (!acc[file.type]) {
        acc[file.type] = [];
      }
      acc[file.type].push({ ...file, index });
      return acc;
    },
    {} as Record<string, (UploadedFile & { index: number })[]>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`max-w-4xl ${isDark ? "bg-slate-950 border-white/10" : "bg-white border-slate-200"} border`}>
        <DialogHeader>
          <DialogTitle className={`text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>
            Upload Your Letterboxd Data
          </DialogTitle>
          <p className={`text-sm mt-2 ${isDark ? "text-white/60" : "text-slate-600"}`}>
            Upload your CSV exports from Letterboxd. Upload at least one file to get started.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 cursor-pointer",
              isDragActive
                ? isDark
                  ? "border-slate-400 bg-slate-500/10"
                  : "border-slate-400 bg-slate-50"
                : isDark
                ? "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-3">
              <Upload className={`w-8 h-8 ${isDark ? "text-slate-400" : "text-slate-600"}`} />
              <div className="text-center">
                <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
                  {isDragActive ? "Drop files here" : "Drag CSV files here or click to select"}
                </p>
                <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-600"}`}>
                  Supported: watched.csv, ratings.csv, diary.csv
                </p>
              </div>
            </div>
          </div>

          {/* File Requirements */}
          <div className="space-y-2">
            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Upload Files:</p>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(FILE_DESCRIPTIONS).map(([key, info]) => {
                const fileEntry = uploadedFiles.find((f) => f.type === key);
                const hasFile = fileEntry && fileEntry.status !== "error";
                const hasError = fileEntry?.status === "error";

                return (
                  <div
                    key={key}
                    className={cn(
                      "p-3 rounded-lg border text-sm transition-all",
                      hasFile
                        ? "border-green-500/50 bg-green-500/10"
                        : hasError
                        ? "border-red-500/50 bg-red-500/10"
                        : isDark
                        ? "border-white/10 bg-white/5"
                        : "border-slate-300 bg-slate-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{info.label}</p>
                      {hasFile && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {hasError && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-slate-600"}`}>{info.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                Files ({uploadedFiles.length})
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className={`w-5 h-5 flex-shrink-0 ${isDark ? "text-white/60" : "text-slate-600"}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                          {file.file.name}
                        </p>
                        <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-600"}`}>
                          {(file.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className={`flex-shrink-0 px-2 py-1 rounded text-xs ${
                        isDark ? "bg-white/10 text-white/70" : "bg-slate-200 text-slate-700"
                      }`}>
                        {file.type}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 ml-3">
                      {file.status === "success" && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className={`p-1 rounded transition-colors ${
                          isDark
                            ? "hover:bg-white/10"
                            : "hover:bg-slate-200"
                        }`}
                      >
                        <X className={`w-4 h-4 ${isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Error Messages */}
              {uploadedFiles.some((f) => f.error) && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">Errors found:</p>
                  {uploadedFiles
                    .filter((f) => f.error)
                    .map((f, i) => (
                      <p key={i} className="text-xs text-red-400/80 mt-1">
                        • {f.file.name}: {f.error}
                      </p>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {uploadedFiles.length > 0 && (
              <Button
                variant="outline"
                onClick={handleReset}
                className={isDark ? "border-white/20 text-white hover:bg-white/10" : "border-slate-300 text-slate-900 hover:bg-slate-100"}
              >
                Clear All
              </Button>
            )}
            <div className="flex-1" />
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={isDark ? "border-white/20 text-white hover:bg-white/10" : "border-slate-300 text-slate-900 hover:bg-slate-100"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={
                uploadedFiles.length === 0 ||
                uploadedFiles.some((f) => f.status === "error") ||
                !uploadedFiles.some((f) => f.type === "watched" && f.status !== "error")
              }
              className="bg-slate-950 hover:bg-slate-900/95 dark:text-white dark:border dark:border-slate-700 hover:dark:bg-slate-900 rounded-sm font-semibold px-8 py-2 text-white"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

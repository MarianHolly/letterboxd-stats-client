"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Upload,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parseLetterboxdCSV, parseProfileCSVFile } from "@/lib/csv-parser";
import { mergeMovieSources } from "@/lib/data-merger";
import { categorizeError, type ErrorCategory } from "@/lib/error-messages";
import { useAnalyticsStore } from "@/hooks/use-analytics-store";
import { ProfileReplaceConfirm } from "@/components/dialogs/profile-replace-confirm";
import { loadSampleData, SAMPLE_DATASETS } from "@/lib/sample-data";
import type { Movie, MovieDataset, UserProfile } from "@/lib/types";

interface UploadedFile {
  file: File;
  type: "watched" | "ratings" | "diary" | "films" | "watchlist" | "profile" | "unknown";
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
  errorCategory?: ErrorCategory;
  errorGuidance?: string;
  parsedData?: Movie[];
  profileData?: any;
  isReplaced?: boolean;
  replacedPreviousFile?: boolean;
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
  "profile.csv": "profile",
} as const;

const FILE_DESCRIPTIONS = {
  diary: {
    label: "Diary",
    description: "Recommended - Enables timeline, yearly stats, and rewatches",
    uploadedDescription: "Your viewing timeline with dates and moments",
    required: false,
  },
  ratings: {
    label: "Ratings",
    description: "Optional - Enables rating distribution charts and patterns",
    uploadedDescription: "All your ratings showing your taste profile",
    required: false,
  },
  watched: {
    label: "Watched Movies",
    description: "Required - Your complete cinema history",
    uploadedDescription: "Your complete filmography loaded",
    required: true,
  },
  films: {
    label: "Films (Liked)",
    description: "Optional - Enables favorite films breakdown",
    uploadedDescription: "Your curated collection of favorites",
    required: false,
  },
  watchlist: {
    label: "Watchlist",
    description: "Optional - Enables watchlist progress tracking",
    uploadedDescription: "Your queue of movies to discover",
    required: false,
  },
  profile: {
    label: "User Profile",
    description: "Optional - Shows your username and profile info",
    uploadedDescription: "Your profile data loaded",
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
  const [showInvalidWarning, setShowInvalidWarning] = useState(false);
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const [pendingProfileFile, setPendingProfileFile] = useState<UploadedFile | null>(null);
  const [isLoadingSampleData, setIsLoadingSampleData] = useState(false);
  const [showSampleDataInfo, setShowSampleDataInfo] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string>("profile_01");
  const [otherFilesWithPendingProfile, setOtherFilesWithPendingProfile] = useState<UploadedFile[]>([]);

  const { dataset } = useAnalyticsStore();
  const currentProfile = dataset?.userProfile;

  // Reset files when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUploadedFiles([]);
      setShowProfileConfirm(false);
      setPendingProfileFile(null);
      setOtherFilesWithPendingProfile([]);
    }
    onOpenChange(newOpen);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = [];
    const replacedFiles: string[] = [];

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
        const errorMsg = `Unknown file type. Expected: ${Object.keys(
          FILE_TYPES
        ).join(", ")}`;
        const categorized = categorizeError(errorMsg, file.name);
        newFiles.push({
          file,
          type: fileType,
          status: "error" as const,
          progress: 100,
          error: categorized.userMessage,
          errorCategory: categorized.category,
          errorGuidance: categorized.guidance,
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
        // Handle profile.csv separately
        if (fileType === "profile") {
          const result = await parseProfileCSVFile(file);

          if (result.success && result.data) {
            uploadedFile.status = "success";
            uploadedFile.progress = 100;
            uploadedFile.profileData = result.data;
          } else {
            uploadedFile.status = "error";
            uploadedFile.progress = 100;
            const errorMsg =
              result.errors && result.errors.length > 0
                ? result.errors[0].message
                : "Failed to parse profile CSV";
            const categorized = categorizeError(errorMsg, file.name, fileType);
            uploadedFile.error = categorized.userMessage;
            uploadedFile.errorCategory = categorized.category;
            uploadedFile.errorGuidance = categorized.guidance;
          }
        } else {
          // Handle regular movie CSVs
          const result = await parseLetterboxdCSV(file);

          if (result.success && result.data) {
            uploadedFile.status = "success";
            uploadedFile.progress = 100;
            uploadedFile.parsedData = result.data;
          } else {
            uploadedFile.status = "error";
            uploadedFile.progress = 100;
            const errorMsg =
              result.errors.length > 0
                ? result.errors[0].message
                : "Failed to parse CSV";
            const categorized = categorizeError(errorMsg, file.name, fileType);
            uploadedFile.error = categorized.userMessage;
            uploadedFile.errorCategory = categorized.category;
            uploadedFile.errorGuidance = categorized.guidance;
          }
        }
      } catch (err) {
        uploadedFile.status = "error";
        uploadedFile.progress = 100;
        const errorMsg =
          err instanceof Error ? err.message : "Unknown error while parsing";
        const categorized = categorizeError(errorMsg, file.name, fileType);
        uploadedFile.error = categorized.userMessage;
        uploadedFile.errorCategory = categorized.category;
        uploadedFile.errorGuidance = categorized.guidance;
      }

      newFiles.push(uploadedFile);
    }

    // Separate profile file from other files
    // Special handling for profile: check if replacing existing profile from store
    const profileFile = newFiles.find((f) => f.type === "profile");
    const otherFiles = newFiles.filter((f) => f.type !== "profile");

    // If profile file exists and is valid, and there's an existing profile, show confirmation
    if (profileFile && profileFile.status === "success" && currentProfile) {
      // Store the profile file and other files for later
      setPendingProfileFile(profileFile);
      setOtherFilesWithPendingProfile(otherFiles);
      setShowProfileConfirm(true);

      // Show notification about profile confirmation needed
      toast.info("Profile file detected", {
        description: "Please confirm if you want to replace your current profile",
        duration: 4000,
      });

      return; // Exit here, profile handling is pending - files will be added after user confirms
    }

    // If no profile conflict, process all files normally
    const filesToProcess = newFiles;

    setUploadedFiles((prev) => {
      const updated = [...prev];
      const newFilesCopy = [...filesToProcess];

      for (let i = 0; i < newFilesCopy.length; i++) {
        const newFile = newFilesCopy[i];
        const existingIndex = updated.findIndex(
          (f) => f.type === newFile.type && f.type !== "unknown"
        );

        if (existingIndex !== -1) {
          const oldFile = updated[existingIndex];
          replacedFiles.push(newFile.type);

          // Mark old file as replaced
          updated[existingIndex].isReplaced = true;

          // Mark new file as replacing previous
          newFile.replacedPreviousFile = true;

          // Remove the old file and add the new one
          updated.splice(existingIndex, 1);
        }
      }

      return [...updated, ...newFilesCopy];
    });

    // Show notifications for each replaced file
    replacedFiles.forEach((fileType) => {
      toast.warning(
        `⚠️ ${fileType}.csv already uploaded. Replacing with new file.`,
        {
          duration: 4000,
        }
      );
    });

    // Show notifications for file type errors
    const unknownFiles = newFiles.filter(
      (f) => f.type === "unknown" && f.status === "error"
    );
    unknownFiles.forEach((file) => {
      toast.error(`📁 ${file.error}`, {
        description: file.errorGuidance,
        duration: 5000,
      });
    });

    // Show notifications for parsing errors
    const parseErrors = newFiles.filter(
      (f) => f.type !== "unknown" && f.status === "error"
    );
    parseErrors.forEach((file) => {
      toast.error(`⚠️ Error parsing ${file.file.name}`, {
        description: file.errorGuidance,
        duration: 5000,
      });
    });
  }, []);

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
    const validFiles = uploadedFiles.filter((f) => f.status === "success");
    const invalidFiles = uploadedFiles.filter((f) => f.status === "error");
    const hasWatched = validFiles.some((f) => f.type === "watched");

    if (!hasAnyFile) {
      alert("Please upload at least one CSV file");
      return;
    }

    if (!hasWatched) {
      alert("watched.csv is required to continue");
      return;
    }

    // Remove invalid files from state
    if (invalidFiles.length > 0) {
      setUploadedFiles(validFiles);
      setShowInvalidWarning(true);
    }

    // Merge all parsed data
    try {
      const watched =
        validFiles.find((f) => f.type === "watched")?.parsedData || [];
      const diary = validFiles.find((f) => f.type === "diary")?.parsedData;
      const ratings = validFiles.find(
        (f) => f.type === "ratings"
      )?.parsedData;
      const films = validFiles.find((f) => f.type === "films")?.parsedData;
      const watchlist = validFiles.find(
        (f) => f.type === "watchlist"
      )?.parsedData;
      const profile = validFiles.find(
        (f) => f.type === "profile"
      )?.profileData;

      // Check for empty optional files and warn user
      const emptyOptionalFiles: string[] = [];

      if (diary && diary.length === 0) {
        emptyOptionalFiles.push("diary.csv (viewing dates and timeline won't be available)");
      }
      if (ratings && ratings.length === 0) {
        emptyOptionalFiles.push("ratings.csv (rating distribution charts won't show data)");
      }
      if (films && films.length === 0) {
        emptyOptionalFiles.push("films.csv (favorite films list will be empty)");
      }
      if (watchlist && watchlist.length === 0) {
        emptyOptionalFiles.push("watchlist.csv (watchlist progress charts won't appear)");
      }

      // Show warning if there are empty optional files
      if (emptyOptionalFiles.length > 0) {
        toast.warning("Some uploaded files are empty", {
          description: `${emptyOptionalFiles.join(", ")} will not contribute to your analytics.`,
          duration: 5000,
        });
      }

      const dataset = mergeMovieSources(
        watched,
        diary,
        ratings,
        films,
        watchlist,
        profile
      );

      onUploadComplete?.(dataset);
      onOpenChange(false);
    } catch (err) {
      alert(
        `Error merging data: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleReset = () => {
    setUploadedFiles([]);
  };

  // Profile confirmation dialog handlers
  const handleKeepOldProfile = () => {
    // Discard the new profile file but add other files to uploadedFiles
    if (otherFilesWithPendingProfile.length > 0) {
      setUploadedFiles((prev) => {
        const updated = [...prev];
        const newFilesCopy = [...otherFilesWithPendingProfile];
        const replacedFiles: string[] = [];

        for (let i = 0; i < newFilesCopy.length; i++) {
          const newFile = newFilesCopy[i];
          const existingIndex = updated.findIndex(
            (f) => f.type === newFile.type && f.type !== "unknown"
          );

          if (existingIndex !== -1) {
            replacedFiles.push(newFile.type);
            updated[existingIndex].isReplaced = true;
            newFile.replacedPreviousFile = true;
            updated.splice(existingIndex, 1);
          }
        }

        // Show notifications for replaced files
        replacedFiles.forEach((fileType) => {
          toast.warning(
            `⚠️ ${fileType}.csv already uploaded. Replacing with new file.`,
            {
              duration: 4000,
            }
          );
        });

        return [...updated, ...newFilesCopy];
      });
    }

    setShowProfileConfirm(false);
    setPendingProfileFile(null);
    setOtherFilesWithPendingProfile([]);
    toast.info("Profile not changed. Using current profile. Other files are ready to upload.", {
      duration: 3000,
    });
  };

  const handleReplaceProfile = () => {
    // Add the pending profile file AND other files to uploadedFiles
    if (pendingProfileFile) {
      setUploadedFiles((prev) => {
        const updated = [...prev];
        const filesToAdd = [pendingProfileFile, ...otherFilesWithPendingProfile];
        const replacedFiles: string[] = [];

        for (let i = 0; i < filesToAdd.length; i++) {
          const newFile = filesToAdd[i];
          const existingIndex = updated.findIndex(
            (f) => f.type === newFile.type && f.type !== "unknown"
          );

          if (existingIndex !== -1) {
            replacedFiles.push(newFile.type);
            updated[existingIndex].isReplaced = true;
            newFile.replacedPreviousFile = true;
            updated.splice(existingIndex, 1);
          }
        }

        // Show notifications for replaced files
        replacedFiles.forEach((fileType) => {
          toast.warning(
            `⚠️ ${fileType}.csv already uploaded. Replacing with new file.`,
            {
              duration: 4000,
            }
          );
        });

        return [...updated, ...filesToAdd];
      });
      setShowProfileConfirm(false);
      setPendingProfileFile(null);
      setOtherFilesWithPendingProfile([]);
      toast.success("Profile will be replaced on continue. All files ready.", {
        duration: 3000,
      });
    }
  };

  const handleCancelProfileConfirm = () => {
    // Cancel profile replacement and the associated files
    setShowProfileConfirm(false);
    setPendingProfileFile(null);
    setOtherFilesWithPendingProfile([]);
    toast.info("Profile upload cancelled.", {
      duration: 3000,
    });
  };

  const handleLoadSampleData = async () => {
    setIsLoadingSampleData(true);
    setShowSampleDataInfo(false);

    try {
      const result = await loadSampleData(selectedProfile);

      if (!result.success || !result.files) {
        toast.error("Failed to load sample data", {
          description: result.error || "Unknown error",
          duration: 4000,
        });
        setIsLoadingSampleData(false);
        return;
      }

      // Simulate file upload with sample data
      await onDrop(result.files);

      // Set demo mode flag in store
      setTimeout(() => {
        useAnalyticsStore.setState({ isDemoMode: true });
      }, 100);

      // Show success notification
      toast.success("Sample data loaded", {
        description: `Ready to explore with ${result.files.length} files`,
        duration: 3000,
      });

      // Show demo mode indicator in bottom-left
      setTimeout(() => {
        toast("Demo Mode Active", {
          description: "You're exploring with sample data",
          duration: 4000,
          position: "bottom-left",
          icon: "✨",
        });
      }, 500);
    } catch (err) {
      toast.error("Error loading sample data", {
        description: err instanceof Error ? err.message : "Unknown error",
        duration: 4000,
      });
    } finally {
      setIsLoadingSampleData(false);
    }
  };

  const groupedFiles = uploadedFiles.reduce((acc, file, index) => {
    if (!acc[file.type]) {
      acc[file.type] = [];
    }
    acc[file.type].push({ ...file, index });
    return acc;
  }, {} as Record<string, (UploadedFile & { index: number })[]>);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`!max-w-sm sm:!max-w-xl md:!max-w-2xl lg:!max-w-4xl ${
          isDark ? "bg-slate-950 border-border" : "bg-white border-border"
        } border flex flex-col max-h-[90vh]`}
      >
        <DialogHeader className="flex-shrink-0 overflow-hidden">
          <DialogTitle
            className={`text-2xl ${
              isDark ? "text-white" : "text-foreground"
            } truncate`}
          >
            Upload Your Letterboxd Data
          </DialogTitle>
          <p
            className={`text-sm mt-2 ${
              isDark ? "text-white/60" : "text-muted-foreground"
            } line-clamp-2`}
          >
            Upload your CSV exports from Letterboxd. Upload at least one file to
            get started.
          </p>
        </DialogHeader>

        {/* Quick Sample Data Option */}
        <div
          className={`flex gap-2 px-6 py-3 rounded-sm ${
            isDark
              ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
              : "bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200"
          }`}
        >
          <Sparkles
            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`}
          />
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                isDark ? "text-purple-300" : "text-purple-900"
              }`}
            >
              Want to explore first?
            </p>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? "text-purple-400/70" : "text-purple-700"
              }`}
            >
              Try analytics with sample data without uploading
            </p>
          </div>
          <Button
            onClick={() => setShowSampleDataInfo(true)}
            disabled={isLoadingSampleData}
            variant="ghost"
            size="sm"
            className={`flex-shrink-0 ${
              isDark
                ? "text-purple-300 hover:bg-purple-500/20"
                : "text-purple-700 hover:bg-purple-100"
            }`}
          >
            Try Sample Data
          </Button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto">
          {/* Two Column Layout: Dropzone on left, File Requirements and Uploaded Files on right */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column: Dropzone */}
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={cn(
                  "relative border-2 border-dashed rounded-sm p-8 transition-all duration-300 cursor-pointer flex items-center justify-center lg:aspect-square",
                  isDragActive
                    ? isDark
                      ? "border-slate-400 bg-slate-500/10"
                      : "border-border-medium bg-secondary"
                    : isDark
                    ? "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                    : "border-border bg-muted hover:border-border-medium hover:bg-secondary"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Upload
                    className={`w-8 h-8 ${
                      isDark ? "text-slate-400" : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-center">
                    <p
                      className={`font-medium ${
                        isDark ? "text-white" : "text-foreground"
                      }`}
                    >
                      {isDragActive
                        ? "Drop files here"
                        : "Drag CSV files here or click to select"}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        isDark ? "text-white/50" : "text-slate-600"
                      }`}
                    >
                      Supported: watched.csv, ratings.csv, diary.csv, profile.csv
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: File Requirements and Uploaded Files */}
            <div className="space-y-6">
              {/* Combined File Requirements and Uploaded Files List */}
              <div className="space-y-2">
                <p
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {uploadedFiles.length > 0 ? "Files" : "Upload Files"}
                  {uploadedFiles.length > 0 &&
                    ` (${uploadedFiles.filter((f) => !f.isReplaced).length})`}
                </p>
                {uploadedFiles.some((f) => f.replacedPreviousFile) && (
                  <div
                    className={`text-xs px-3 py-1 rounded-full flex items-center gap-2 ${
                      isDark
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Some files replaced previous versions</span>
                  </div>
                )}
                {showInvalidWarning && (
                  <div
                    className={`text-xs px-3 py-1 rounded-full flex items-center gap-2 ${
                      isDark
                        ? "bg-red-500/20 text-red-300"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>Invalid files were removed. Proceeding with valid data only.</span>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-2 overflow-y-auto">
                  {Object.entries(FILE_DESCRIPTIONS).map(([key, info]) => {
                    const fileEntry = uploadedFiles.find(
                      (f) => f.type === key && !f.isReplaced
                    );
                    const hasFile = fileEntry && fileEntry.status !== "error";
                    const hasError = fileEntry?.status === "error";

                    // Show uploaded file content if file exists
                    if (fileEntry) {
                      const isRequired = info.required;
                      return (
                        <div
                          key={key}
                          className={`flex flex-col gap-2 p-2 rounded-sm transition-all ${
                            fileEntry.replacedPreviousFile
                              ? "border-2 border-amber-500 bg-amber-500/10"
                              : fileEntry.status === "success"
                              ? isRequired
                                ? isDark
                                  ? "border-4 border-slate-600 bg-slate-500/10"
                                  : "border-4 border-slate-700 bg-slate-100"
                                : "border-2 bg-green-500/10 border-green-500/50"
                              : fileEntry.status === "error"
                              ? "border-2 " +
                                (isDark
                                  ? "bg-red-500/10 border-red-500/50"
                                  : "bg-red-50 border-red-300")
                              : isDark
                              ? "border-2 bg-white/5 border-border-light"
                              : "border-2 bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <File
                                className={`w-5 h-5 flex-shrink-0 ${
                                  fileEntry.status === "success"
                                    ? isRequired
                                      ? "text-slate-700 dark:text-slate-300"
                                      : "text-green-600"
                                    : fileEntry.status === "error"
                                    ? "text-red-600"
                                    : isDark
                                    ? "text-white/60"
                                    : "text-slate-600"
                                }`}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`text-sm font-medium truncate ${
                                      fileEntry.status === "success" &&
                                      isRequired
                                        ? "text-slate-900 dark:text-slate-200"
                                        : isDark
                                        ? "text-white"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {fileEntry.file.name}
                                  </p>
                                  {fileEntry.replacedPreviousFile && (
                                    <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/30 text-amber-700 dark:text-amber-300">
                                      REPLACED
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-xs ${
                                    isDark ? "text-white/50" : "text-slate-600"
                                  }`}
                                >
                                  {(fileEntry.file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <div
                                className={`flex-shrink-0 px-2 py-1 rounded hidden lg:block text-xs ${
                                  fileEntry.status === "success"
                                    ? "bg-green-500/20 text-green-700"
                                    : fileEntry.status === "error"
                                    ? "bg-red-500/20 text-red-700"
                                    : isDark
                                    ? "bg-white/10 text-white/70"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {fileEntry.type}
                              </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {fileEntry.replacedPreviousFile && (
                                <div title="This file replaced a previously uploaded file">
                                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                                </div>
                              )}
                              {fileEntry.status === "success" &&
                                !fileEntry.replacedPreviousFile && (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                )}
                              {fileEntry.status === "error" && (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              )}
                              <button
                                onClick={() =>
                                  handleRemoveFile(
                                    uploadedFiles.indexOf(fileEntry)
                                  )
                                }
                                className={`p-1 rounded transition-colors ${
                                  isDark
                                    ? "hover:bg-white/10"
                                    : "hover:bg-slate-200"
                                }`}
                              >
                                <X
                                  className={`w-4 h-4 ${
                                    isDark
                                      ? "text-white/60 hover:text-white"
                                      : "text-slate-600 hover:text-slate-900"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {/* File Description or Error Guidance */}
                          {fileEntry.status === "error" &&
                          fileEntry.errorGuidance ? (
                            <div
                              className={`text-xs p-2 rounded flex gap-2 ${
                                isDark
                                  ? "bg-red-500/10 text-red-300"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium">{fileEntry.error}</p>
                                <p className="text-xs mt-1 opacity-90">
                                  {fileEntry.errorGuidance}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p
                              className={`text-xs ${
                                isDark ? "text-white/60" : "text-slate-600"
                              }`}
                            >
                              {fileEntry.status === "success" &&
                              info.uploadedDescription
                                ? info.uploadedDescription
                                : info.description}
                            </p>
                          )}
                        </div>
                      );
                    }

                    // Show file requirement placeholder if no file uploaded
                    const isRequired = info.required;
                    return (
                      <div
                        key={key}
                        className={cn(
                          "p-2 rounded-sm text-sm transition-all",
                          isRequired
                            ? isDark
                              ? "border-4 border-slate-600 bg-slate-500/5"
                              : "border-4 border-slate-700 bg-slate-100"
                            : isDark
                            ? "border-2 border-white/10 bg-white/5"
                            : "border-2 border-slate-300 bg-slate-50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`font-medium ${
                                isRequired && !isDark
                                  ? "text-slate-900"
                                  : isRequired && isDark
                                  ? "text-slate-200"
                                  : isDark
                                  ? "text-white"
                                  : "text-slate-900"
                              }`}
                            >
                              {info.label}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            isRequired && !isDark
                              ? "text-slate-700"
                              : isRequired && isDark
                              ? "text-slate-400"
                              : isDark
                              ? "text-white/60"
                              : "text-slate-600"
                          }`}
                        >
                          {info.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 md:gap-3 pt-4 flex-shrink-0 flex-col sm:flex-row">
            {uploadedFiles.length > 0 && (
              <Button
                variant="outline"
                onClick={handleReset}
                className={
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-slate-300 text-slate-900 hover:bg-slate-100"
                }
              >
                Clear All
              </Button>
            )}
            <div className="flex-1" />
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-300 text-slate-900 hover:bg-slate-100"
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={
                uploadedFiles.length === 0 ||
                !uploadedFiles.some(
                  (f) => f.type === "watched" && f.status === "success"
                )
              }
              className="bg-slate-950 hover:bg-slate-900/95 dark:text-white dark:border dark:border-slate-700 hover:dark:bg-slate-900 rounded-sm font-semibold md:px-8 py-2 text-white"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
      </Dialog>

      {/* Profile Replacement Confirmation Dialog */}
      <ProfileReplaceConfirm
        open={showProfileConfirm}
        onOpenChange={setShowProfileConfirm}
        currentProfile={currentProfile}
        newProfile={pendingProfileFile?.profileData || null}
        onKeepOld={handleKeepOldProfile}
        onReplace={handleReplaceProfile}
        onCancel={handleCancelProfileConfirm}
      />

      {/* Sample Data Info Dialog */}
      <Dialog open={showSampleDataInfo} onOpenChange={setShowSampleDataInfo}>
        <DialogContent
          className={`${
            isDark ? "bg-slate-950 border-white/10" : "bg-white border-slate-200"
          } border`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-xl flex items-center gap-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              Try Sample Data
            </DialogTitle>
          </DialogHeader>

          <div
            className={`space-y-4 ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            <p>
              No Letterboxd account? No problem! Explore the analytics with a
              sample film collection to see what's possible.
            </p>

            {/* Profile Selector */}
            <div className="space-y-3">
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-slate-300" : "text-slate-900"
                }`}
              >
                Choose a sample profile:
              </p>
              <div className="space-y-2">
                {SAMPLE_DATASETS.map((profile) => (
                  <label
                    key={profile.id}
                    className={`flex items-start gap-3 p-3 rounded-sm border-2 cursor-pointer transition-all ${
                      selectedProfile === profile.id
                        ? isDark
                          ? "border-purple-500/50 bg-purple-500/10"
                          : "border-purple-400 bg-purple-50"
                        : isDark
                        ? "border-slate-700 hover:border-slate-600"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="profile"
                      value={profile.id}
                      checked={selectedProfile === profile.id}
                      onChange={(e) => setSelectedProfile(e.target.value)}
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-semibold text-sm ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {profile.name}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {profile.description}
                      </p>
                      <p
                        className={`text-xs mt-1.5 font-medium ${
                          isDark ? "text-slate-500" : "text-slate-500"
                        }`}
                      >
                        {profile.stats}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div
              className={`space-y-3 rounded-sm p-4 ${
                isDark
                  ? "bg-purple-500/10 border border-purple-500/20"
                  : "bg-purple-50 border border-purple-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-purple-300" : "text-purple-900"
                }`}
              >
                What you'll get:
              </p>
              <ul className="text-sm space-y-2 ml-4">
                <li>✓ All 18+ interactive charts & statistics</li>
                <li>✓ Complete analytics dashboard</li>
                <li>✓ Full exploration experience</li>
                <li>✓ No data stored or tracked</li>
              </ul>
            </div>

            <p
              className={`text-xs ${
                isDark ? "text-slate-500" : "text-slate-600"
              }`}
            >
              You can still upload your own data anytime. This is just a quick
              way to try out the platform.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSampleDataInfo(false)}
              className={
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-300 text-slate-900 hover:bg-slate-100"
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleLoadSampleData}
              disabled={isLoadingSampleData}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              {isLoadingSampleData ? "Loading..." : "Load Sample Data"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

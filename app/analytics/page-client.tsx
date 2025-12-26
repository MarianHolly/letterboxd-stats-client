"use client";

import { useState, useEffect } from "react";

import { useAnalyticsStore } from "@/hooks/use-analytics-store";
import { computeAnalytics } from "@/lib/analytics-engine";

import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { AnalyticsSidebar } from "@/components/analytics/analytics-sidebar";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { UploadModal } from "@/components/layout/upload-models";

import type { MovieDataset } from "@/lib/types";

interface AnalyticsPageClientProps {
  defaultSidebarOpen: boolean;
}

export function AnalyticsPageClient({ defaultSidebarOpen }: AnalyticsPageClientProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasData = useAnalyticsStore((state) => state.hasData());
  const clearData = useAnalyticsStore((state) => state.clearData);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleUploadComplete = (dataset: MovieDataset) => {
    // Save the merged dataset to the store
    const analytics = computeAnalytics(dataset.watched);

    // Update store state directly
    useAnalyticsStore.setState({
      dataset,
      analytics,
      uploadedFiles: [],
      lastUpdated: new Date().toISOString(),
      loading: false,
      error: null,
    });

    setIsUploadModalOpen(false);
  };

  const handleClearData = () => {
    setIsClearDialogOpen(true);
  };

  const handleConfirmClear = () => {
    clearData();
    setIsClearDialogOpen(false);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen} suppressHydrationWarning>
      <AnalyticsSidebar
        onUploadClick={() => setIsUploadModalOpen(true)}
        onClearClick={handleClearData}
      />
      <SidebarInset suppressHydrationWarning>
        <div className="flex flex-col h-screen bg-background dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 scroll-smooth" suppressHydrationWarning>
          <AnalyticsHeader
            title="Your true cinematic identity"
            description="Discover and explore your personality through Letterboxd statistics"
          />

          <AnalyticsDashboard onUploadClick={() => setIsUploadModalOpen(true)} />
        </div>
        {/* Upload Modal */}
        <UploadModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onUploadComplete={handleUploadComplete}
        />

        {/* Clear Data Confirmation Dialog */}
        <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive">Clear All Data</DialogTitle>
              <DialogDescription className="text-base">
                This will permanently delete all your uploaded Letterboxd data from this device, including:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 px-1 py-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>All movie data and statistics</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Uploaded CSV files</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Computed analytics and charts</span>
              </div>
            </div>

            <DialogDescription className="text-sm font-semibold text-foreground">
              This action cannot be undone. You will need to re-upload your Letterboxd data to continue using the analytics.
            </DialogDescription>

            <DialogFooter className="gap-3 sm:gap-2">
              <Button
                variant="outline"
                onClick={() => setIsClearDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmClear}
              >
                Clear Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}

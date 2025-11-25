"use client";

import { useState, useEffect } from "react";
import { useAnalyticsStore } from "@/hooks/use-analytics-store";
import { computeAnalytics } from "@/lib/analytics-engine";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { AnalyticsSidebar } from "@/components/analytics/analytics-sidebar";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { UploadModal } from "@/components/layout/upload-models";
import type { MovieDataset } from "@/lib/types";

export default function AnalyticsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasData = useAnalyticsStore((state) => state.hasData());

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

  if (!isHydrated) {
    return null;
  }

  return (
    <SidebarProvider>
      <AnalyticsSidebar onUploadClick={() => setIsUploadModalOpen(true)} />
      <SidebarInset>
        <div className="flex flex-col h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 scroll-smooth">
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
      </SidebarInset>
    </SidebarProvider>
  );
}

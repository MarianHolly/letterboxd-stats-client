"use client";

import { useState } from "react";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { AnalyticsSidebar } from "@/components/analytics/analytics-sidebar";
import { AnalyticsEmptyState } from "@/components/analytics/analytics-empty-state";
import { UploadModal } from "@/components/layout/upload-models";

export default function AnalyticsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const hasData = true; // Replace with actual data check

  const handleUploadComplete = () => {
    // Logic to handle after upload is complete
  };

  return (
    <SidebarProvider>
      <AnalyticsSidebar onUploadClick={() => setIsUploadModalOpen(true)} />
      <SidebarInset>
        <div className="flex flex-col h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 scroll-smooth">
          <AnalyticsHeader
            title="Your true cinematic identity"
            description="Discover and explore your personality through Letterboxd statistics"
          />

          {!hasData ? (
            <AnalyticsEmptyState
              onUploadClick={() => setIsUploadModalOpen(true)}
            />
          ) : (
            <div className="flex-1 overflow-auto scroll-smooth">
              <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full">

                {/* Section 1: Overview */}
                <section id="analytics-overview">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      At a Glance
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Your key metrics snapshot
                    </p>
                  </div>
                  <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="bg-muted/50 dark:bg-white/5 aspect-square rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 aspect-square rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 aspect-square rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 aspect-square rounded-lg" />
                  </div>
                </section>

                {/* Section 2: Your Ratings */}
                <section id="analytics-ratings">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Rating Patterns
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      How you rate the films you love
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-muted/50 dark:bg-white/5 min-h-80 rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 min-h-80 rounded-lg" />
                  </div>
                </section>

                {/* Section 3: When You Watch */}
                <section id="analytics-timeline">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Viewing Trends
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      When you watch most—discover your patterns
                    </p>
                  </div>
                  <div className="bg-muted/50 dark:bg-white/5 min-h-96 rounded-lg" />
                </section>

                {/* Section 4: Seasonal Patterns */}
                <section id="analytics-seasonal">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Seasonal Rhythms
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Monthly viewing cycles and year-over-year comparisons
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-muted/50 dark:bg-white/5 min-h-96 rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 min-h-96 rounded-lg" />
                  </div>
                </section>

                {/* Section 5: Movies by Decade */}
                <section id="analytics-decades">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Cinema Through Time
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Your taste across cinema history—from classics to today
                    </p>
                  </div>
                  <div className="bg-muted/50 dark:bg-white/5 min-h-80 rounded-lg" />
                </section>

                {/* Section 6: Genres & Directors */}
                <section id="analytics-genres">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Taste Profile
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Your favorite genres and most-watched filmmakers
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-muted/50 dark:bg-white/5 min-h-80 rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 min-h-80 rounded-lg" />
                  </div>
                </section>

                {/* Section 7: Rewatches & Favorites */}
                <section id="analytics-rewatches">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Treasured Rewatches
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Your favorite films worth watching again and again
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-muted/50 dark:bg-white/5 min-h-64 rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 min-h-64 rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 min-h-64 rounded-lg" />
                  </div>
                </section>

              </div>
            </div>
          )}
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

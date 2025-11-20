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
            <main className="flex-1 overflow-auto scroll-smooth">
              <div className="flex flex-1 flex-col gap-8 pt-8 px-8 pb-8 max-w-7xl mx-auto w-full">
                {/* Overview Section */}
                <section id="analytics-overview">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Overview
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Key statistics and metrics about your viewing habits
                    </p>
                  </div>
                  <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 dark:bg-white/5 aspect-video rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 aspect-video rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 aspect-video rounded-lg" />
                  </div>
                </section>

                {/* Release Year Analysis */}
                <section id="analytics-release-year"></section>

                <section>
                  {/* Diary Patterns */}
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Diary Patterns
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Analyze your watching habits over time
                    </p>
                  </div>

                  {/* Diary Statistics */}
                </section>

                {/* Monthly Patterns Deep Dive */}
                <section id="analytics-monthly-patterns">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Monthly Patterns Analysis
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Deep dive into your monthly viewing habits across years
                    </p>
                  </div>
                  <div className="w-full flex justify-center">
                    <div className="w-full max-w-4xl"></div>
                  </div>
                </section>

                {/* Genres & Directors Section */}
                <section id="analytics-genres">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Genres & Directors
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Genre breakdown and your favorite directors
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-muted/50 dark:bg-white/5 min-h-80 rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 min-h-80 rounded-lg" />
                  </div>
                </section>

                {/* Favorite Directors Section */}
                <section id="analytics-directors">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Favorite Directors
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Your most watched directors and their filmography
                    </p>
                  </div>
                  <div className="bg-muted/50 dark:bg-white/5 min-h-96 rounded-lg" />
                </section>

                {/* Decade Analysis Section */}
                <section id="analytics-decades">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-1">
                      Decade Analysis
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Movies by decade and era
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-muted/50 dark:bg-white/5 min-h-80 rounded-lg" />
                    <div className="bg-muted/50 dark:bg-white/5 min-h-80 rounded-lg" />
                  </div>
                </section>
              </div>
            </main>
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

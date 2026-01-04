"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Compass, Milestone, Palette } from "lucide-react";

interface RoadmapItem {
  title: string;
  description: string;
  status: "done" | "in-progress" | "planned";
}

interface RoadmapPhase {
  phase: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: RoadmapItem[];
  color: string;
}

const roadmapData: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "Foundation",
    description: "Core analytics and visualization platform",
    icon: <Milestone size={20} />,
    color: "emerald",
    items: [
      { title: "CSV file parsing", description: "Import diary, watched, ratings, and watchlist files", status: "done" },
      { title: "Viewing timeline charts", description: "Monthly and yearly viewing patterns", status: "done" },
      { title: "Release year analysis", description: "Decade and era breakdowns with interactive filters", status: "done" },
      { title: "Rating distribution", description: "Star rating patterns and averages", status: "done" },
      { title: "Watchlist comparison", description: "Planned vs watched analysis", status: "done" },
      { title: "Year in review", description: "Annual statistics and highlights", status: "done" },
      { title: "Canon list tracking", description: "Progress on essential film lists (IMDb 250, Oscars, etc.)", status: "done" },
      { title: "Dark mode", description: "Full dark theme support", status: "done" },
      { title: "Responsive design", description: "Mobile-first, works on all devices", status: "done" },
      { title: "Privacy-first architecture", description: "All processing in browser, no data sent to servers", status: "done" },
    ],
  },
  {
    phase: "Phase 2",
    title: "Data Enrichment",
    description: "Enhanced metadata and deeper insights",
    icon: <Compass size={20} />,
    color: "indigo",
    items: [
      { title: "Genre analysis", description: "Breakdown of viewing habits by genre", status: "planned" },
      { title: "Country & language stats", description: "Geographic diversity of your film choices", status: "planned" },
      { title: "Director deep-dives", description: "Your most-watched directors and their patterns", status: "planned" },
      { title: "Actor/cast tracking", description: "Discover actors you gravitate toward", status: "planned" },
      { title: "Runtime analysis", description: "Short films vs epics, viewing time totals", status: "planned" },
      { title: "Streaming service breakdown", description: "Where you watch your movies", status: "planned" },
    ],
  },
  {
    phase: "Phase 3",
    title: "AI-Powered Insights",
    description: "Intelligent analysis and personalized recommendations",
    icon: <Bot size={20} />,
    color: "purple",
    items: [
      { title: "Taste profile generation", description: "AI-generated summary of your cinematic preferences", status: "planned" },
      { title: "Smart recommendations", description: "Personalized movie suggestions based on your history", status: "planned" },
      { title: "Mood-based analysis", description: "Understand emotional patterns in your viewing", status: "planned" },
      { title: "Watchlist prioritization", description: "AI-ranked suggestions from your watchlist", status: "planned" },
      { title: "Viewing predictions", description: "What genres/eras you'll likely explore next", status: "planned" },
      { title: "Comparison insights", description: "How your taste compares to film critics and communities", status: "planned" },
    ],
  },
  {
    phase: "Future",
    title: "Long-term Vision",
    description: "Ideas we're exploring for the future",
    icon: <Palette size={20} />,
    color: "amber",
    items: [
      { title: "Social features", description: "Compare stats with friends (privacy-preserving)", status: "planned" },
      { title: "Export & sharing", description: "Generate shareable cards and reports", status: "planned" },
      { title: "Letterboxd API integration", description: "Direct sync without CSV exports", status: "planned" },
      { title: "Multi-platform support", description: "Import from IMDb, Trakt, and other services", status: "planned" },
      { title: "Mobile app", description: "Native iOS and Android applications", status: "planned" },
    ],
  },
];

const statusStyles = {
  done: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  "in-progress": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  planned: "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400",
};

const statusLabels = {
  done: "Complete",
  "in-progress": "In Progress",
  planned: "Planned",
};

const phaseColors: Record<string, string> = {
  emerald: "from-emerald-500 to-teal-500",
  indigo: "from-indigo-500 to-blue-500",
  purple: "from-purple-500 to-pink-500",
  amber: "from-amber-500 to-orange-500",
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="min-h-[66vh] flex flex-col justify-center py-28 md:py-36 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Product Roadmap
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 dark:text-foreground/60 leading-relaxed max-w-3xl mx-auto">
            Our vision for Letterboxd Stats—from current features to future possibilities. This project is open source, community-driven, and built for film lovers like you.
          </p>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-20 md:py-32 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 relative">
            {roadmapData.map((phase, phaseIndex) => (
              <div key={phase.phase} className="relative pl-16">
                {/* Vertical Connector Line */}
                {phaseIndex < roadmapData.length - 1 && (
                  <div className="hidden md:block absolute left-[31px] top-12 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
                )}

                {/* Phase Header */}
                <div className="absolute left-0 top-0 flex items-center gap-4 mb-8">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${phaseColors[phase.color]} flex items-center justify-center text-white shadow-lg`}>
                    {phase.icon}
                  </div>
                </div>

                <div className="mb-10 ml-4">
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                    {phase.phase}
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {phase.title}
                  </h2>
                  <p className="text-foreground/70 dark:text-foreground/60 text-base">
                    {phase.description}
                  </p>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                  {phase.items.map((item) => (
                    <div
                      key={item.title}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/30 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-sm">
                          {item.title}
                        </h3>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                          {statusLabels[item.status]}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 dark:text-foreground/60">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            Have an idea or feedback?
          </h2>
          <p className="text-lg text-foreground/70 dark:text-foreground/60 mb-8">
            This project is shaped by the community. We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-md px-8 py-3 font-semibold inline-flex items-center gap-2">
                Get in Touch
              </Button>
            </Link>
            <Link href="/analytics">
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700 rounded-md px-8 py-3 font-semibold inline-flex items-center gap-2"
              >
                Try Analytics <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

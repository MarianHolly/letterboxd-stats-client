"use client";

import Link from "next/link";

interface RoadmapItem {
  title: string;
  description: string;
  status: "done" | "in-progress" | "planned";
}

interface RoadmapPhase {
  phase: string;
  title: string;
  description: string;
  icon: string;
  items: RoadmapItem[];
  color: string;
}

const roadmapData: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "Foundation",
    description: "Core analytics and visualization platform",
    icon: "✓",
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
    icon: "◐",
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
    icon: "◯",
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
    icon: "✦",
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
  done: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  "in-progress": "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
  planned: "bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400",
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
    <main className="min-h-screen dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Actively Developing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Product Roadmap
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our vision for Letterboxd Stats—from current features to future possibilities.
              This project is open source and community-driven.
            </p>
          </div>

          {/* Roadmap Phases */}
          <div className="space-y-12">
            {roadmapData.map((phase, phaseIndex) => (
              <div key={phase.phase} className="relative">
                {/* Phase Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phaseColors[phase.color]} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                    {phase.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                      {phase.phase}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {phase.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-16">
                  {phase.items.map((item, itemIndex) => (
                    <div
                      key={item.title}
                      className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                          {statusLabels[item.status]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Connector line */}
                {phaseIndex < roadmapData.length - 1 && (
                  <div className="hidden md:block absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-slate-200 dark:from-white/20 to-transparent" style={{ height: 'calc(100% - 4rem)' }} />
                )}
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Have ideas or feedback?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We'd love to hear from you. This project is shaped by the community.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Try Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

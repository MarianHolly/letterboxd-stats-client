"use client";

import Link from "next/link";
import { Shield, Code2, Users, ArrowRight, Sparkles, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const coreValues = [
    {
      icon: <Shield size={24} className="text-emerald-600" />,
      title: "Privacy First",
      description:
        "All processing happens in your browser. Your data never leaves your device. No servers, no tracking, no data collection—ever.",
    },
    {
      icon: <Code2 size={24} className="text-indigo-600" />,
      title: "Open Source",
      description:
        "Fully transparent and community-driven. Inspect the code, contribute features, or fork it for your own use. No hidden algorithms.",
    },
    {
      icon: <Users size={24} className="text-rose-600" />,
      title: "User Empowerment",
      description:
        "Your data belongs to you. We provide the tools to understand it, visualize it, and discover insights—without asking for anything in return.",
    },
  ];

  const techGroups = [
    {
      groupName: "Core Framework & Language",
      technologies: [
        {
          tech: "Next.js 14 (App Router)",
          description: "React framework with server-side rendering and optimal performance",
        },
        {
          tech: "TypeScript",
          description: "Type-safe development with enhanced IDE support and fewer runtime errors",
        },
        {
          tech: "Zod",
          description: "Runtime type validation for CSV data and user inputs",
        },
      ],
    },
    {
      groupName: "Styling, UI & Visualization",
      technologies: [
        {
          tech: "Tailwind CSS",
          description: "Utility-first CSS framework for rapid UI development",
        },
        {
          tech: "shadcn/ui",
          description: "Accessible, customizable component library built on Radix UI",
        },
        {
          tech: "Framer Motion",
          description: "Production-ready motion library for smooth transitions and interactions",
        },
        {
          tech: "Lucide React",
          description: "Beautiful, consistent icon set with excellent TypeScript support",
        },
        {
          tech: "Recharts",
          description: "Composable charting library built on React components and D3",
        },
      ],
    },
    {
      groupName: "Data Processing & State",
      technologies: [
        {
          tech: "PapaParse",
          description: "Fast CSV parser running entirely in the browser",
        },
        {
          tech: "Zustand",
          description: "Lightweight state management for data persistence and analytics state",
        },
        {
          tech: "LocalStorage API",
          description: "Browser-native persistence ensuring your data stays on your device",
        },
      ],
    },
    {
      groupName: "Development & Infrastructure",
      technologies: [
        {
          tech: "Turbopack",
          description: "Next-generation bundler for lightning-fast development and builds",
        },
        {
          tech: "Vercel",
          description: "Edge network deployment with automatic previews and zero-config setup",
        },
      ],
    },
  ];

  const futureTechGroups = [
    {
      groupName: "Phase 2: Data Enrichment",
      technologies: [
        {
          tech: "TMDB API",
          description: "Movie metadata including genres, directors, countries, cast, and ratings",
        },
        {
          tech: "PostgreSQL + Prisma",
          description: "Relational database with type-safe ORM for enriched data storage",
        },
      ],
    },
    {
      groupName: "Phase 3: AI & Recommendations",
      technologies: [
        {
          tech: "OpenAI API",
          description: "GPT-4 powered insights, recommendations, and natural language analysis",
        },
        {
          tech: "Custom ML Pipeline",
          description: "Collaborative filtering and content-based algorithms for personalized suggestions",
        },
      ],
    },
    {
      groupName: "Phase 4: Social Features",
      technologies: [
        {
          tech: "NextAuth.js",
          description: "Secure authentication with multiple providers for user accounts",
        },
        {
          tech: "tRPC",
          description: "End-to-end typesafe APIs for seamless client-server communication",
        },
        {
          tech: "WebSockets / SSE",
          description: "Live synchronization for collaborative features and shared watchlists",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="min-h-[66vh] flex flex-col justify-center py-28 md:py-36 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Empowering Your Cinematic Journey
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 dark:text-foreground/60 leading-relaxed max-w-3xl mx-auto">
            Letterboxd Stats helps you discover your unique cinematic identity through data. We transform your viewing history into beautiful, interactive analytics—empowering you to understand your preferences, habits, and what makes your taste truly yours.
          </p>
        </div>
      </section>

      {/* Mission: Problem → Solution */}
      <section className="py-20 md:py-32 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* The Problem */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-medium mb-6">
                <Target size={16} />
                The Challenge
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Your Data, Hidden Away
              </h2>
              <p className="text-base text-foreground/70 dark:text-foreground/60 leading-relaxed mb-4">
                Letterboxd is incredible for tracking what you watch, but your viewing history remains just a list—static, scattered, difficult to analyze.
              </p>
              <p className="text-base text-foreground/70 dark:text-foreground/60 leading-relaxed">
                Without analytics, you miss patterns in your taste, trends in your viewing habits, and insights about your cinematic identity. The data exists, but it's locked away.
              </p>
            </div>

            {/* The Solution */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
                <Lightbulb size={16} />
                Our Solution
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Insights That Empower
              </h2>
              <p className="text-base text-foreground/70 dark:text-foreground/60 leading-relaxed mb-4">
                Letterboxd Stats unlocks your data with 26+ interactive charts revealing viewing patterns, rating tendencies, decade preferences, and temporal trends.
              </p>
              <p className="text-base text-foreground/70 dark:text-foreground/60 leading-relaxed">
                Discover which eras resonate with you, when you watch most actively, how your taste evolves—all visualized beautifully, processed privately, and completely free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              Our Principles
            </h2>
            <p className="text-lg text-foreground/60 dark:text-foreground/65 leading-relaxed max-w-2xl mx-auto">
              Three core values guide everything we build.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {coreValues.map((value, idx) => (
              <div key={idx} className="text-center">
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-foreground/70 dark:text-foreground/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack - Current */}
      <section className="py-20 md:py-32 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              Technology Stack
            </h2>
            <p className="text-lg text-foreground/60 dark:text-foreground/65 leading-relaxed mb-2">
              Pure client-side architecture powered by modern web technologies. No backend, no database, no API calls—everything runs in your browser for maximum privacy and performance.
            </p>
            <p className="text-base text-foreground/60 dark:text-foreground/65">
              This is both a showcase of technical capabilities and a demonstration of what's possible with modern web development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {techGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-4">
                  {group.groupName}
                </h3>
                {group.technologies.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-sm"
                  >
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {item.tech}
                    </p>
                    <p className="text-xs text-foreground/70 dark:text-foreground/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack - Future */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              Future Technology
            </h2>
            <p className="text-lg text-foreground/60 dark:text-foreground/65 leading-relaxed">
              Planned technologies for upcoming features. These will power data enrichment, AI recommendations, and social features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {futureTechGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-3">
                <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-4">
                  {group.groupName}
                </h3>
                {group.technologies.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white dark:bg-slate-950/50 rounded-sm border border-slate-200 dark:border-slate-800"
                  >
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {item.tech}
                    </p>
                    <p className="text-xs text-foreground/70 dark:text-foreground/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Next - Bridge to Roadmap */}
      <section className="py-20 md:py-32 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            <Sparkles size={16} />
            What's Next
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            The Future of Letterboxd Stats
          </h2>
          <p className="text-lg text-foreground/70 dark:text-foreground/60 leading-relaxed mb-8 max-w-2xl mx-auto">
            We're actively developing new features. Next up: enriched data with genre/director insights, AI-powered recommendations, and advanced analytics to help you discover films aligned with your unique taste.
          </p>
          <Link href="/roadmap">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-8 py-3 font-semibold inline-flex items-center gap-2">
              View Full Roadmap <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            Ready to Discover Your Cinematic Identity?
          </h2>
          <p className="text-lg text-foreground/70 dark:text-foreground/60 mb-8">
            Upload your data and explore your unique viewing patterns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analytics">
              <Button className="bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-md px-8 py-3 font-semibold inline-flex items-center gap-2">
                Start Exploring <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/guide">
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700 rounded-md px-8 py-3 font-semibold"
              >
                Getting Started Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

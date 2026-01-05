"use client";

import Link from "next/link";
import { Download, Upload, BarChart3, Lock, ArrowRight, FileJson, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollTrigger } from "@/components/layout/scroll-trigger";
import ChartExamples from "@/components/guide/chart-examples";

export default function GuidePage() {
  const csvFiles = [
    {
      name: "diary.csv",
      description: "Complete viewing history with ratings and dates",
      recommended: true,
    },
    {
      name: "ratings.csv",
      description: "Films you've rated",
      recommended: false,
    },
    {
      name: "films.csv",
      description: "All films watched",
      recommended: false,
    },
    {
      name: "watchlist.csv",
      description: "Films in your watchlist",
      recommended: false,
    },
  ];

  const faqItems = [
    {
      question: "What files do I need to upload?",
      answer:
        "You can upload any CSV files from your Letterboxd export. We support diary.csv, ratings.csv, films.csv, and watchlist.csv. We recommend uploading diary.csv for the most complete analytics.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes, completely safe. All processing happens in your browser. Your data never leaves your device. We don't send anything to servers, don't store anything, and don't track anything. You have full control.",
    },
    {
      question: "Can I re-upload or update my data?",
      answer:
        "Yes, anytime. Click 'Clear data' in the analytics dashboard and upload fresh CSV files. Your browser processes everything locally. You can do this as often as you watch new films.",
    },
    {
      question: "Why don't I see all the charts?",
      answer:
        "Some charts require minimum data thresholds. For example, decade breakdowns need films from multiple decades, and rating distributions need enough rated films. The more you watch and rate, the richer your analytics become.",
    },
    {
      question: "Can I use this without an account?",
      answer:
        "Yes! No login or account required. This is privacy-first by design. Upload your data, explore your analytics—that's it. Everything stays on your device.",
    },
    {
      question: "What if I have multiple Letterboxd accounts?",
      answer:
        "Export data from each account and upload all CSV files together. We'll merge them automatically, giving you unified analytics across all accounts.",
    },
  ];

  const troubleshootingItems = [
    {
      question: "I can't find the export option in Letterboxd",
      answer:
        'Visit https://letterboxd.com/settings/data/ and scroll down. You should see "Export your data" button. Make sure you\'re logged into your account.',
    },
    {
      question: "Upload says 'Invalid file format'",
      answer:
        "Ensure you're uploading CSV files (not Excel or other formats). File names should be diary.csv, ratings.csv, films.csv, or watchlist.csv. If you downloaded a ZIP, extract it first.",
    },
    {
      question: "Some watched films aren't showing",
      answer:
        "This usually means they're not in the CSV files you uploaded. Ensure you exported and uploaded diary.csv or films.csv. Some old films may not be included in Letterboxd exports.",
    },
    {
      question: "Charts look empty or incomplete",
      answer:
        "Certain charts require specific data patterns. For example, decade breakdowns need films from multiple decades. Try uploading diary.csv for the most complete data.",
    },
  ];

  const chartCategories = [
    {
      category: "Viewing Rhythm",
      description: "Timeline charts tracking when and how you watch",
      charts: ["Viewing Timeline", "Year-over-Year Comparison", "Likes Over Time"],
    },
    {
      category: "Taste & Preference",
      description: "Rating distributions and preference patterns",
      charts: ["Rating Distribution", "Favorite Rating Distribution", "Diary Stats"],
    },
    {
      category: "Decades & Eras",
      description: "Films organized by release decade and era",
      charts: ["Films by Decade", "Top-Rated Decades", "Favorite Decades", "Release by Era"],
    },
    {
      category: "Engagement Ratios",
      description: "Proportional analysis of rated, liked, and rewatched films",
      charts: ["Rated Ratio", "Liked Ratio", "Rewatch Ratio"],
    },
    {
      category: "Progress & Goals",
      description: "Watchlist progress and canon list tracking",
      charts: ["Watchlist Progress", "Canon Lists", "Watchlist by Decade"],
    },
    {
      category: "Your Year in Film",
      description: "Summary statistics and insights for the last complete year",
      charts: ["Year in Review Stats", "Monthly Activity", "Annual Summary"],
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="flex flex-col justify-center py-28 md:py-36 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            <Circle className="h-2 w-2 fill-indigo-500" />
            Getting Started Guide
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Transform Your Data Into Insights
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 dark:text-foreground/60 leading-relaxed max-w-2xl mx-auto mb-8">
            Export your Letterboxd viewing history and discover your unique cinematic identity through beautiful, interactive analytics.
          </p>

          <Link href="/analytics">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-8 py-3 font-semibold inline-flex items-center gap-2">
              Open Analytics <ArrowRight size={18} />
            </Button>
          </Link>

          <p className="text-sm text-foreground/60 mt-6">
            Less than 5 minutes to set up • Completely private
          </p>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="py-20 md:py-32 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollTrigger className="text-center mb-16" type="fadeUp">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-lg text-foreground/60 dark:text-foreground/65 leading-relaxed max-w-2xl mx-auto">
              Get your analytics up and running in three simple steps.
            </p>
          </ScrollTrigger>

          {/* Reverse Triangle Layout */}
          <div className="max-w-5xl mx-auto">
            {/* First Row: 2 columns */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-8 lg:mb-12">
              {/* Export */}
              <ScrollTrigger className="text-center" type="slideInLeft">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Export
                </h3>
                <p className="text-base text-foreground/60 dark:text-foreground/50 leading-relaxed font-light">
                  Visit{" "}
                  <a
                    href="https://letterboxd.com/settings/data/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-normal"
                  >
                    Letterboxd Settings → Data
                  </a>
                  , download your data export as a ZIP file, and extract it to access your CSV files. This contains your complete viewing history, ratings, and watchlist data.
                </p>
              </ScrollTrigger>

              {/* Upload */}
              <ScrollTrigger className="text-center" type="slideInRight">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Upload
                </h3>
                <p className="text-base text-foreground/60 dark:text-foreground/50 leading-relaxed font-light">
                  Drag and drop your extracted CSV files into the analytics dashboard. Upload one or multiple files—we'll automatically validate, merge, and process them. All processing happens locally in your browser.
                </p>
              </ScrollTrigger>
            </div>

            {/* Second Row: 1 column centered */}
            <ScrollTrigger className="max-w-md mx-auto text-center" type="scaleUp">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Explore
              </h3>
              <p className="text-base text-foreground/60 dark:text-foreground/50 leading-relaxed font-light">
                Instantly see 26+ interactive charts and statistics analyzing your cinematic identity. Discover patterns in your viewing habits, favorite decades, rating tendencies, and much more—all beautifully visualized.
              </p>
            </ScrollTrigger>
          </div>
        </div>
      </section>

      {/* CSV Files Reference */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-300 dark:border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              Understanding Your Data Export
            </h2>
            <p className="text-lg text-foreground/60 dark:text-foreground/60 leading-relaxed mb-8">
              When you export your data from{" "}
              <a
                href="https://letterboxd.com/settings/data/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Letterboxd Settings → Data
              </a>
              , you'll receive a ZIP file containing your complete viewing history. After extracting the ZIP, you'll find various CSV files and folders organized as follows:
            </p>

            {/* ZIP Contents Overview */}
            <div className="p-6 rounded-lg border border-slate-300 dark:border-border bg-white dark:bg-card mb-8">
              <h3 className="font-semibold text-foreground mb-4">ZIP File Contents:</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground/80 mb-2">📄 CSV Files:</p>
                  <p className="text-sm text-foreground/70 dark:text-foreground/60 font-mono">
                    comments.csv, diary.csv, profile.csv, ratings.csv, reviews.csv, watched.csv, watchlist.csv
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/80 mb-2">📁 Folders:</p>
                  <p className="text-sm text-foreground/70 dark:text-foreground/60 font-mono">
                    deleted/, likes/, lists/, ...
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-border">
                  <p className="text-sm text-foreground/70 dark:text-foreground/60">
                    <strong>Note:</strong> Liked films are stored in the{" "}
                    <code className="bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">likes/</code> folder as{" "}
                    <code className="bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">films.csv</code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              Supported Files for Upload
            </h3>
            <p className="text-base text-foreground/60 dark:text-foreground/60 leading-relaxed mb-6">
              You can upload any of the following CSV files. We recommend uploading{" "}
              <strong className="text-foreground">watched.csv</strong> or{" "}
              <strong className="text-foreground">diary.csv</strong> for the most complete analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="p-6 rounded-lg border border-indigo-200 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-950/10">
              <div className="flex items-start justify-between mb-2">
                <code className="text-sm font-mono font-semibold text-foreground">
                  watched.csv
                </code>
                <span className="text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                  Essential
                </span>
              </div>
              <p className="text-sm text-foreground/70 dark:text-foreground/60">
                Your complete viewing history with watch dates. This is the foundational file for all analytics.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-indigo-200 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-950/10">
              <div className="flex items-start justify-between mb-2">
                <code className="text-sm font-mono font-semibold text-foreground">
                  diary.csv
                </code>
                <span className="text-xs px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                  Recommended
                </span>
              </div>
              <p className="text-sm text-foreground/70 dark:text-foreground/60">
                Includes ratings, rewatch markers, and tags. Provides the richest data for detailed analytics.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/50">
              <code className="text-sm font-mono font-semibold text-foreground mb-2 block">
                ratings.csv
              </code>
              <p className="text-sm text-foreground/70 dark:text-foreground/60">
                Films you've rated with your ratings and rating dates.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/50">
              <code className="text-sm font-mono font-semibold text-foreground mb-2 block">
                watchlist.csv
              </code>
              <p className="text-sm text-foreground/70 dark:text-foreground/60">
                Films in your watchlist for tracking progress and goals.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/50">
              <code className="text-sm font-mono font-semibold text-foreground mb-2 block">
                likes/films.csv
              </code>
              <p className="text-sm text-foreground/70 dark:text-foreground/60">
                Films you've marked as favorites (found in the likes folder).
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/50">
              <code className="text-sm font-mono font-semibold text-foreground mb-2 block">
                profile.csv
              </code>
              <p className="text-sm text-foreground/70 dark:text-foreground/60">
                Your profile information and account details (optional).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Overview */}
      <section className="py-20 md:py-32 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-6 lg:gap-24">
            {/* Left Sticky Section */}
            <div className="top-20 col-span-2 h-fit w-fit gap-3 space-y-8 py-8 lg:sticky">
              <div className="relative w-fit">
                <h2 className="text-5xl font-semibold tracking-tight text-foreground lg:text-7xl">
                  Analytics Overview
                </h2>
              </div>
              <p className="text-foreground/60 text-base leading-relaxed max-w-md">
                Your data transforms into 26+ interactive charts organized across six analytical categories. Each category reveals different aspects of your cinematic identity.
              </p>
            </div>

            {/* Right Timeline Section */}
            <ul className="lg:pl-12 relative col-span-4 w-full">
              {chartCategories.map((cat, index) => (
                <li
                  key={index}
                  className="relative flex flex-col justify-between gap-6 border-t border-slate-300 dark:border-slate-700 py-8 md:flex-row md:gap-8 lg:py-12"
                >
                  {/* Category Number */}
                  <div className="flex items-center justify-center rounded-sm bg-slate-100 dark:bg-slate-800 h-14 w-14 flex-shrink-0 font-bold tracking-tighter text-slate-900 dark:text-slate-100 text-lg">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                      {cat.category}
                    </h3>
                    <p className="text-foreground/60 leading-relaxed text-base mb-4">
                      {cat.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cat.charts.map((chart, chartIdx) => (
                        <span
                          key={chartIdx}
                          className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground/70 border border-slate-200 dark:border-slate-700"
                        >
                          {chart}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Chart Showcase */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              See It In Action
            </h2>
            <p className="text-lg text-foreground/60 dark:text-foreground/65 leading-relaxed max-w-2xl mx-auto">
              Here's a preview of some key charts you'll see in your analytics dashboard. These examples show mock data—yours will reflect your unique viewing history.
            </p>
          </div>

          <ChartExamples />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-start gap-x-16 gap-y-10 md:gap-y-0">
            {/* Left: Accordion */}
            <div className="flex-1 w-full">
              <Accordion
                type="single"
                defaultValue="question-0"
                className="w-full"
              >
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`question-${index}`}
                    className="border-b border-slate-300 dark:border-slate-700 last:border-b-0"
                  >
                    <AccordionTrigger className="py-4 text-left text-lg font-semibold text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-base text-foreground/70 dark:text-foreground/60 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Help CTA */}
              <div className="mt-12 pt-8 border-t border-slate-300 dark:border-slate-700 flex flex-row items-center justify-between gap-4">
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Still have questions?
                </p>
                <a
                  href="/contact"
                  className="inline-flex text-slate-900 dark:text-slate-100 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 dark:hover:text-slate-300 font-semibold transition-colors py-1 px-3 border border-slate-300 dark:border-slate-700 rounded-md"
                >
                  Get in touch →
                </a>
              </div>
            </div>

            {/* Right: Title */}
            <div className="flex-shrink-0 md:min-w-96">
              <h2 className="text-4xl lg:text-5xl leading-tight font-semibold tracking-tight text-foreground">
                Frequently <br /> Asked Questions
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-20 md:py-32 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-start gap-x-16 gap-y-10 md:gap-y-0">
            {/* Left: Accordion */}
            <div className="flex-1 w-full">
              <Accordion type="single" className="w-full">
                {troubleshootingItems.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`trouble-${index}`}
                    className="border-b border-slate-300 dark:border-slate-700 last:border-b-0"
                  >
                    <AccordionTrigger className="py-4 text-left text-lg font-semibold text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-base text-foreground/70 dark:text-foreground/60 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right: Title */}
            <div className="flex-shrink-0 md:min-w-96">
              <h2 className="text-4xl lg:text-5xl leading-tight font-semibold tracking-tight text-foreground">
                Troubleshooting <br /> Common Issues
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* For Developers */}
      <section className="py-20 md:py-32 border-t border-slate-300 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900/40 dark:to-blue-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-x-16 gap-y-10 md:gap-y-0">
            {/* Left: Title and Description */}
            <div className="flex-shrink-0 md:min-w-96">
              <h2 className="text-4xl lg:text-5xl leading-tight font-semibold tracking-tight text-foreground mb-6">
                For <br /> Developers
              </h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/60">
                Want to test the upload functionality with real Letterboxd data? Download sample CSV files and try uploading them to see how robust the data handling is.
              </p>
            </div>

            {/* Right: Content */}
            <div className="flex-1 w-full space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <FileJson size={24} className="text-blue-600 dark:text-blue-400" />
                  Sample Data Files
                </h3>
                <p className="text-foreground/70 dark:text-foreground/60">
                  Test the platform with real Letterboxd data export. These CSV files come from an actual Letterboxd account and include all supported file types.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <Download size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-1">
                      Profile 01: Classic Cinema Lover
                    </h4>
                    <p className="text-sm text-foreground/60 mb-3">
                      91 watched films, complete diary with dates and ratings, watchlist items, and favorites
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="/api/sample-data/file?name=watched.csv&profile=profile_01"
                        download="watched.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        watched.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=diary.csv&profile=profile_01"
                        download="diary.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        diary.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=ratings.csv&profile=profile_01"
                        download="ratings.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        ratings.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=films.csv&profile=profile_01"
                        download="films.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        films.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=watchlist.csv&profile=profile_01"
                        download="watchlist.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        watchlist.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=profile.csv&profile=profile_01"
                        download="profile.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        profile.csv
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <Download size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-1">
                      Profile 02: Cinema Historian
                    </h4>
                    <p className="text-sm text-foreground/60 mb-3">
                      1,482 watched films, extensive watchlist, comprehensive ratings spanning cinema history
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="/api/sample-data/file?name=watched.csv&profile=profile_02"
                        download="watched.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        watched.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=diary.csv&profile=profile_02"
                        download="diary.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        diary.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=ratings.csv&profile=profile_02"
                        download="ratings.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        ratings.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=films.csv&profile=profile_02"
                        download="films.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        films.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=watchlist.csv&profile=profile_02"
                        download="watchlist.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        watchlist.csv
                      </a>
                      <a
                        href="/api/sample-data/file?name=profile.csv&profile=profile_02"
                        download="profile.csv"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Download size={14} />
                        profile.csv
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                  <strong>Tips:</strong> These files are perfect for testing CSV parsing, error handling, and data validation. Try uploading them one by one, in combinations, or even re-uploading them multiple times to see how the platform handles edge cases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-300 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
            Ready to Discover Your Cinematic Identity?
          </h2>
          <p className="text-lg text-foreground/70 dark:text-foreground/60 mb-8">
            Export your data and start exploring your unique viewing patterns.
          </p>
          <Link href="/analytics">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-8 py-3 font-semibold inline-flex items-center gap-2">
              Open Analytics <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

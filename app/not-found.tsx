"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-slate-900 dark:text-white mb-4">
          404
        </h1>

        <p className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
          Page Not Found
        </p>

        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}

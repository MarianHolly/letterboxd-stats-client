"use client";

export default function AboutPage() {
  return (
    <main className="min-h-screen dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            About Letterboxd Stats
          </h1>

          <div className="space-y-8 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
            <p>
              Letterboxd Stats transforms your movie watching history into beautiful, interactive analytics. Upload your Letterboxd CSV export and instantly see patterns in what you watch, when you watch it, and how you rate films.
            </p>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                What You Get
              </h2>
              <ul className="space-y-2 ml-4">
                <li>✓ Six interactive charts analyzing your viewing habits</li>
                <li>✓ Release year and decade breakdowns</li>
                <li>✓ Rating distribution and trends over time</li>
                <li>✓ Rewatch patterns and viewing calendar</li>
                <li>✓ All processing happens in your browser—no servers</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Why We Built This
              </h2>
              <p>
                We wanted a free, privacy-first way to explore Letterboxd data without complex setup or backend infrastructure. Everything runs locally in your browser—your data never leaves your device.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                How It Works
              </h2>
              <ol className="space-y-2 ml-4">
                <li><strong>1. Export</strong> — Download your CSV files from Letterboxd Settings</li>
                <li><strong>2. Upload</strong> — Drag files here or click to select</li>
                <li><strong>3. Analyze</strong> — Charts render instantly in your browser</li>
                <li><strong>4. Explore</strong> — Interact with visualizations, toggle dark mode</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Privacy
              </h2>
              <p>
                All data processing happens in your browser. We store nothing on our servers. Your Letterboxd data is yours alone—never shared, never analyzed externally, never sold.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Tech Stack
              </h2>
              <p className="mb-2">
                Built with React, TypeScript, Tailwind CSS, and Recharts. No backend. No database. No API calls. Pure client-side analytics.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Questions? <a href="/contact" className="text-blue-500 hover:text-blue-400">Contact us</a> or check out the <a href="https://github.com" className="text-blue-500 hover:text-blue-400">GitHub repo</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

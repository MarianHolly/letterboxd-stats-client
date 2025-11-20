"use client";

export default function GuidePage() {
  return (
    <main className="min-h-screen dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Getting Started
          </h1>

          <p className="text-lg text-slate-700 dark:text-slate-300 mb-12">
            Follow these steps to export your Letterboxd data and start exploring your viewing habits.
          </p>

          <div className="space-y-12">
            {/* Step 1: Export */}
            <div>
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    Export Your Data from Letterboxd
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Go to your Letterboxd settings and download your CSV files.
                  </p>
                  <ol className="space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li><strong>1.</strong> Visit <a href="https://letterboxd.com/settings/data/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">Letterboxd Settings → Data</a></li>
                    <li><strong>2.</strong> Click "Export your data"</li>
                    <li><strong>3.</strong> Download the ZIP file (contains diary.csv, ratings.csv, films.csv, etc.)</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Step 2: Extract */}
            <div>
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    Extract the ZIP File
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300">
                    Extract the downloaded ZIP file to access your CSV files.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Upload */}
            <div>
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    Upload to Letterboxd Stats
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Come back here and upload your CSV files.
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li>✓ Drag and drop files onto the upload area</li>
                    <li>✓ Or click to select files manually</li>
                    <li>✓ You can upload multiple files at once</li>
                    <li>✓ We'll automatically merge them</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4: Explore */}
            <div>
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    Explore Your Analytics
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Instantly see six interactive charts analyzing your viewing habits.
                  </p>
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                    <li><strong>Release Year</strong> — What years of films you watch</li>
                    <li><strong>Rating Distribution</strong> — How you rate movies</li>
                    <li><strong>Viewing Timeline</strong> — When you watched films (trends over time)</li>
                    <li><strong>Decade Breakdown</strong> — Classic vs contemporary movies</li>
                    <li><strong>Rewatch Analysis</strong> — How often you rewatch</li>
                    <li><strong>Calendar Heatmap</strong> — Your most active viewing periods</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="pt-12 border-t border-slate-300 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                Common Questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    What files do I need to upload?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    You can upload any or all of the CSV files from your Letterboxd export. We support diary.csv, ratings.csv, watched.csv, films.csv, and watchlist.csv. Upload whichever files you have—we'll merge them automatically.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Is my data safe?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Yes. All processing happens in your browser. Your data never goes to any server. We don't store anything. Once you close the page, your data remains only in your browser's local storage until you clear it.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Can I re-upload new data?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Yes. Click "Clear data" and upload fresh CSV files. Your browser will keep the new data in localStorage until you clear it.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Why don't I see all the charts?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Some charts depend on specific data. If you haven't watched many movies across different decades, or if most don't have ratings, some charts may be less informative. But all charts will still render with your available data.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Can you add more charts?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Maybe! We're always open to suggestions. Check out our <a href="/contact" className="text-blue-500 hover:text-blue-400">Contact page</a> to share ideas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

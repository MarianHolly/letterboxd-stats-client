"use client";

import { Github } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Get in Touch
          </h1>

          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
            Found a bug? Have a feature request? We'd love to hear from you.
          </p>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <Github className="h-5 w-5" />
            Open an Issue on GitHub
          </a>

          <div className="mt-16 space-y-8">
            <div className="text-left">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                Report a Bug
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                Found something broken? Head to GitHub and open an issue. Include what you were doing and what went wrong.
              </p>
            </div>

            <div className="text-left">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                Suggest a Feature
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                Have an idea? Open a GitHub discussion or issue with your suggestion. Tell us why it would be useful.
              </p>
            </div>

            <div className="text-left">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                Contributing
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                Want to contribute? Check out the GitHub repo, fork it, and submit a pull request. We welcome improvements and new features.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

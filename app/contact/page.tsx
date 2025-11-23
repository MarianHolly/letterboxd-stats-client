"use client";

import { Github } from "lucide-react";

export default function ContactPage() {
  const options = [
    {
      title: "Report a Bug",
      description:
        "Found something broken? Head to GitHub and open an issue. Include what you were doing and what went wrong.",
    },
    {
      title: "Suggest a Feature",
      description:
        "Have an idea? Open a GitHub discussion or issue with your suggestion. Tell us why it would be useful.",
    },
    {
      title: "Contributing",
      description:
        "Want to contribute? Check out the GitHub repo, fork it, and submit a pull request. We welcome improvements and new features.",
    },
  ];

  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen flex flex-col justify-center index-16">
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-foreground/70 dark:text-foreground/65 max-w-2xl mx-auto">
              Found a bug? Have a feature request? We'd love to hear from you.
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-16">
            <a
              href="https://github.com/MarianHolly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-slate-950 hover:bg-slate-900 dark:bg-slate-50 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold rounded-sm transition-colors duration-200"
            >
              <Github className="h-5 w-5" />
              Open on GitHub
            </a>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-3 gap-6 ">
            {options.map((option, idx) => (
              <a
                key={idx}
                href="https://github.com/MarianHolly"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group p-8 rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                  {option.title}
                </h2>
                <p className="text-foreground/70 dark:text-foreground/65 leading-relaxed">
                  {option.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

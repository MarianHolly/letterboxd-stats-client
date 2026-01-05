import { Download, Upload, BarChart3, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Step {
  step: string;
  title: string;
  description: string;
}

const StepsSection = () => {
  const steps: Step[] = [
    {
      step: "01",
      title: "Export Your Data",
      description:
        "Go to your Letterboxd settings and download your viewing history as CSV files. It takes just a few clicks and your data stays completely private.",
    },
    {
      step: "02",
      title: "Upload to Our App",
      description:
        "Drag and drop your CSV file into Letterboxd Stats. No account needed, no data collection. Everything happens right in your browser.",
    },
    {
      step: "03",
      title: "Instant Analysis",
      description:
        "Watch as your data transforms into beautiful visualizations. Get instant insights into your viewing patterns, favorite genres, and watching trends.",
    },
    {
      step: "04",
      title: "Explore Insights",
      description:
        "Deep dive into interactive charts and statistics. Discover patterns you never noticed and understand your unique film taste like never before.",
    },
  ];

  const Illustration = (props: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        width="22"
        height="20"
        viewBox="0 0 22 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <line
          x1="0.607422"
          y1="2.57422"
          x2="21.5762"
          y2="2.57422"
          stroke="currentColor"
          strokeWidth="4"
        />
        <line
          x1="19.5762"
          y1="19.624"
          x2="19.5762"
          y2="4.57422"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
    );
  };

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-6 lg:gap-24">
          {/* Left Sticky Section */}
          <div className="top-20 col-span-2 h-fit w-fit gap-3 space-y-8 py-8 lg:sticky">
            <div className="relative w-fit">
              <h2 className="text-5xl font-semibold tracking-tight text-foreground lg:text-7xl">
                How It Works
              </h2>
            </div>
            <p className="text-foreground/60 text-base leading-relaxed max-w-md">
              Transform your Letterboxd data into beautiful analytics in just
              four simple steps. No complicated setup, no data collection—just
              pure insights.
            </p>

            <Link href="/analytics">
              <Button
                variant="ghost"
                className="inline-flex text-foreground dark:text-slate-100 hover:text-muted-foreground hover:bg-muted dark:hover:bg-slate-800/50 dark:hover:text-slate-300 font-semibold transition-colors py-1 px-3 border border-border dark:border-border-light rounded-md"
              >
                <ArrowRight
                  className="text-foreground dark:text-slate-100"
                  size={18}
                />
                Start Analyzing
              </Button>
            </Link>
          </div>

          {/* Right Timeline Section */}
          <ul className="lg:pl-12 relative col-span-4 w-full">
            {steps.map((step, index) => (
              <li
                key={index}
                className="relative flex flex-col justify-between gap-6 border-t border-border dark:border-border-light py-8 md:flex-row md:gap-8 lg:py-12"
              >
                {/* Decorative Illustration */}
                <Illustration className="absolute right-0 top-4 text-border-medium dark:border-border-light" />

                {/* Step Number */}
                <div className="flex items-center justify-center rounded-sm bg-muted dark:bg-slate-800 h-14 w-14 flex-shrink-0 font-bold tracking-tighter text-foreground dark:text-slate-100 text-lg">
                  {step.step}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                    {step.title}
                  </h3>
                  <p className="text-foreground/60 leading-relaxed text-base">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;

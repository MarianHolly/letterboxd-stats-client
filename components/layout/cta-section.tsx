import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 md:py-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          Ready to Transform Your Letterboxd Data?
        </h2>
        <p className="mt-6 text-lg text-foreground/60 dark:text-foreground/65 mx-auto">
          Get instant insights into your viewing habits, favorite genres, and
          watching patterns. No sign-up, no data collection—just pure analytics.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/analytics">
            <Button
              size="lg"
              className="bg-slate-950 hover:bg-slate-900 text-white rounded-sm font-semibold px-8 py-6 shadow-lg border border-slate-300 dark:border-slate-700 hover:cursor-pointer"
            >
              Start Analyzing Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/guide">
            <Button
              size="lg"
              variant="outline"
              className="border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800/50 rounded-sm font-semibold px-8 py-6 hover:cursor-pointer"
            >
              Learn How It Works
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

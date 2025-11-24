"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const faqs: FAQItem[] = [
    {
      question: "Is my data safe and private?",
      answer:
        "Yes, absolutely. Letterboxd Stats is 100% client-side, meaning all processing happens on your device. Your data is never sent to our servers, never stored, and never shared with anyone. You have complete control.",
    },
    {
      question: "How do I export my Letterboxd data?",
      answer:
        "Go to your Letterboxd account settings, navigate to the 'Data' section at the bottom, and download your CSV files. You can export watched.csv, ratings.csv, diary.csv, or any other data file available.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "We support CSV files exported from Letterboxd including: watched.csv, ratings.csv, diary.csv, films.csv, and watchlist.csv. You can upload one or multiple files at once for a complete picture of your viewing habits.",
    },
    {
      question: "Can I upload my data multiple times?",
      answer:
        "Yes! You can upload your data as many times as you want. Each upload is processed independently on your device. Re-upload anytime to see updated statistics as you watch more films.",
    },
    {
      question: "Is this free?",
      answer:
        "Yes, Letterboxd Stats is completely free. We're open source and community-driven. There are no hidden costs, subscriptions, or premium features. Your privacy comes first.",
    },
    {
      question: "What if I need help or have questions?",
      answer:
        "Check out our Getting Started guide for step-by-step instructions. If you have questions, bugs to report, or feature requests, visit our Contact page or open an issue on GitHub.",
    },
  ];

  return (
    <section className="py-20 md:py-32 border-t border-slate-300 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-start gap-x-16 gap-y-10 md:gap-y-0">
          {/* Left: Accordion */}
          <div className="flex-1 w-full">
            <Accordion
              type="single"
              defaultValue="question-0"
              className="w-full"
            >
              {faqs.map(({ question, answer }, index) => (
                <AccordionItem
                  key={index}
                  value={`question-${index}`}
                  className="border-b border-slate-300 dark:border-slate-700 last:border-b-0"
                >
                  <AccordionTrigger className="py-4 text-left text-lg font-semibold text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 [&[data-state=open]>svg]:rotate-180">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-base text-foreground/70 dark:text-foreground/60 leading-relaxed">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Help CTA */}
            <div className="mt-12 pt-8 border-t border-slate-300 dark:border-slate-700 flex flex-row items-center justify-between gap-4">
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Can't find what you're looking for?
              </p>
              <a
                href="/contact"
                className="inline-flex text-slate-900 dark:text-slate-100 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 dark:hover:text-slate-300 font-semibold transition-colors py-1 px-3 border border-slate-300 dark:border-slate-700 rounded-md"
              >
                Get in touch with us →
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
  );
};

export default FAQSection;

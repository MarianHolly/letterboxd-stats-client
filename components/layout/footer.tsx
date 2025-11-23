"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Heart } from "lucide-react";
import Link from "next/link";

interface FooterLink {
  title: string;
  href: string;
  description?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { title: "Start Analyzing", href: "/analytics", description: "View your Letterboxd stats" },
      { title: "Getting Started", href: "/guide", description: "Step-by-step guide" },
      { title: "About", href: "/about", description: "Learn more about us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "FAQ", href: "/guide#faq", description: "Common questions" },
      { title: "Contact & Support", href: "/contact", description: "Report bugs & suggest features" },
      { title: "GitHub", href: "https://github.com", description: "View source code" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "#privacy", description: "Your data matters" },
      { title: "Terms of Service", href: "#terms", description: "Our terms" },
    ],
  },
];

const Footer = () => {
  const pathname = usePathname();

  // Don't show footer on analytics page
  if (pathname.startsWith("/analytics")) {
    return null;
  }

  return (
    <footer className="border-t mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="py-12 px-6 lg:px-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-rose-600 group-hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-sm text-foreground">
                    Letterboxd
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Stats
                  </span>
                </div>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Transform your Letterboxd viewing history into beautiful, interactive analytics.
                <span className="block mt-2 text-xs">
                  100% client-side processing. Your data never leaves your browser.
                </span>
              </p>
            </div>

            {/* Footer sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        href={href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          {/* Bottom footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} Letterboxd Stats. Open source &{" "}
                <span className="inline-flex items-center gap-1">
                  privacy-first <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Social links */}
              <div className="flex items-center gap-4 text-muted-foreground">
                <Link
                  href="https://github.com/yourusername/letterboxd-stats-client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors duration-200"
                  aria-label="GitHub Repository"
                  title="View source code on GitHub"
                >
                  <Github className="h-5 w-5" />
                </Link>
                <Link
                  href="mailto:hello@letterboxdstats.com"
                  className="hover:text-foreground transition-colors duration-200"
                  aria-label="Send email"
                  title="Send us an email"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </div>

              {/* Status badge */}
              <div className="text-xs text-muted-foreground px-3 py-1 bg-accent/30 rounded-full">
                Currently in <span className="font-medium">Beta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

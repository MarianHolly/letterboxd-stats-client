"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BarChart3 } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { Button } from "@/components/ui/button";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Guide", href: "/guide" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Don't show navbar on analytics page
  if (pathname.startsWith("/analytics")) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border dark:border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 pr-8 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="p-2 rounded-sm bg-gradient-to-br from-indigo-600 to-rose-600">
                <BarChart3 className="w-4 h-4 text-white" />
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
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-all duration-200 border ${
                  isActive(link.href)
                    ? "border-border-medium dark:border-border text-foreground dark:text-slate-50"
                    : "border-transparent text-muted-foreground dark:text-slate-400 hover:border-border dark:hover:border-border-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Analytics button + Theme toggle + Mobile menu button */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Analytics Button */}
            <Link href="/analytics">
              <Button
                size="sm"
                className="bg-slate-950 hover:bg-slate-900 text-white dark:bg-slate-50 dark:hover:bg-slate-100 dark:text-slate-950 font-semibold px-4 py-1.5 border-0 cursor-pointer transition-colors duration-200"
              >
                Analytics
              </Button>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-sm border border-border-medium dark:border-border text-muted-foreground dark:text-slate-400 hover:bg-secondary dark:hover:bg-slate-900/30 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border dark:border-border pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-1.5 rounded-sm text-sm font-medium transition-all duration-200 border ${
                    isActive(link.href)
                      ? "border-border-medium dark:border-border text-foreground dark:text-slate-50"
                      : "border-transparent text-muted-foreground dark:text-slate-400 hover:border-border dark:hover:border-border-light"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

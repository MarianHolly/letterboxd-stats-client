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
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Guide", href: "/guide" },
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
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 pr-8 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-rose-600">
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
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Analytics button + Theme toggle + Mobile menu button */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Analytics Button */}
            <Link href="/analytics">
              <Button variant="default" size="sm">
                Analytics
              </Button>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-foreground hover:bg-accent/10 transition-colors"
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
          <div className="md:hidden border-t border-border pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
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

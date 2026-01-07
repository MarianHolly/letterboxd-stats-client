"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  BarChart3,
  TrendingUp,
  Upload,
  LogOut,
  Home,
  Clock,
  Heart,
  ListChecks,
  CalendarDays,
  Trophy,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// Navigation data for analytics sections
const data = {
  navMain: [
    {
      title: "Your Cinematic Journey",
      href: "#",
      items: [
        {
          title: "Cinematic Timeline",
          href: "#cinematic-timeline",
          icon: <Clock className="w-5 h-5" />,
          description: "Film history explored",
        },
        {
          title: "Viewing Rhythm",
          href: "#viewing-rhythm",
          icon: <TrendingUp className="w-5 h-5" />,
          description: "Watching patterns",
        },
        {
          title: "Taste & Judgment",
          href: "#taste-judgment",
          icon: <Heart className="w-5 h-5" />,
          description: "Likes & ratings",
        },
        {
          title: "Planned vs. Watched",
          href: "#planned-watched",
          icon: <ListChecks className="w-5 h-5" />,
          description: "Watchlist analysis",
        },
        {
          title: "Your Year in Film",
          href: "#year-in-film",
          icon: <CalendarDays className="w-5 h-5" />,
          description: "Annual review",
        },
        {
          title: "The Canon",
          href: "#the-canon",
          icon: <Trophy className="w-5 h-5" />,
          description: "Essential cinema",
        }
      ],
    }
  ],
  footerNav: [
    {
      title: "Settings",
      href: "#",
      items: [
        {
          title: "Upload New Data",
          href: "/dashboard/upload",
          icon: <Upload className="w-5 h-5" />,
          description: "Upload new CSV files",
        },
        {
          title: "Clear Data",
          href: "/dashboard/clear",
          icon: <LogOut className="w-4 h-4 mr-2" />,
          description: "Clear all uploaded data",
        },
        {
          title: "Go to Home",
          href: "/#",
          icon: <Home className="w-4 h-4" />,
          description: "Return to homepage",
        },
      ],
    },
  ],
};

interface AnalyticsSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onUploadClick?: () => void;
  onClearClick?: () => void;
}

export function AnalyticsSidebar({
  onUploadClick,
  onClearClick,
  ...props
}: AnalyticsSidebarProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = React.useState<string>("#cinematic-timeline");

  // Detect which section is currently in view using Intersection Observer
  React.useEffect(() => {
    const sections = [
      "cinematic-timeline",
      "viewing-rhythm",
      "taste-judgment",
      "planned-watched",
      "year-in-film",
      "the-canon",
    ];

    // Store observer instance for cleanup
    let observerInstance: IntersectionObserver | null = null;

    // Wait for DOM to be fully rendered
    const timer = setTimeout(() => {
      // Find the scrollable container (AnalyticsDashboard div)
      const scrollContainer = document.querySelector(
        '[data-analytics-scroll-container]'
      ) as HTMLElement;

      if (!scrollContainer) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          let topMostSection: IntersectionObserverEntry | null = null;

          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (!topMostSection) {
                topMostSection = entry;
              } else if (
                entry.boundingClientRect.top <
                topMostSection.boundingClientRect.top
              ) {
                topMostSection = entry;
              }
            }
          }

          if (topMostSection) {
            setActiveSection(`#${topMostSection.target.id}`);
          }
        },
        {
          root: scrollContainer,
          rootMargin: "0px 0px -80% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      observerInstance = observer;

      // Observe all sections
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    // Cleanup both timer and observer
    return () => {
      clearTimeout(timer);
      observerInstance?.disconnect();
    };
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("#")) {
      return activeSection === href;
    }
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Handle smooth scroll to section within the custom scroll container
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;

    e.preventDefault();
    const sectionId = href.slice(1);
    const section = document.getElementById(sectionId);
    const scrollContainer = document.querySelector('[data-analytics-scroll-container]');

    if (section && scrollContainer) {
      const headerHeight = 64; // h-16 = 4rem = 64px
      const sectionTop = section.offsetTop - headerHeight;
      scrollContainer.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
      // Update URL hash without triggering navigation
      window.history.pushState(null, '', href);
    }
  };

  return (
    <Sidebar
      className="bg-background dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-r border-gray-200 dark:border-white/10"
      {...props}
    >
      <SidebarHeader className="sticky top-0 z-20 pb-2 bg-background dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 h-16 border-b border-gray-200/50 dark:border-white/5">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-rose-600">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-bold text-sm text-foreground dark:text-white">
              Letterboxd
            </span>
            <span className="text-xs text-gray-600 dark:text-white/60">
              Analytics
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto overflow-x-hidden bg-background dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-800 dark:text-white/30 uppercase tracking-wider px-3 py-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleSectionClick(e, item.href)}
                    data-active={isActive(item.href) ? "true" : "false"}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 border",
                      isActive(item.href)
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-semibold"
                        : "text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0",
                        isActive(item.href)
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-600 dark:text-white/70"
                      )}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.title}
                      </p>
                      <p
                        className={cn(
                          "text-xs truncate",
                          isActive(item.href)
                            ? "text-indigo-500 dark:text-indigo-300"
                            : "text-gray-500 dark:text-white/50"
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter className="bg-background dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-t border-gray-200 dark:border-white/10">
        {data.footerNav.map((group) => (
          <SidebarGroup key={group.title}>
            <div className="space-y-1">
              {group.items.map((item) => {
                // Special handling for "Upload New Data" to trigger modal instead of navigate
                if (item.title === "Upload New Data") {
                  return (
                    <button
                      key={item.href}
                      onClick={onUploadClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left",
                        "text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <div className="flex-shrink-0 text-gray-600 dark:text-white/70">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.title}
                        </p>
                        <p className="text-xs truncate text-gray-500 dark:text-white/50">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                }

                // Special handling for "Clear Data" to trigger clear action instead of navigate
                if (item.title === "Clear Data") {
                  return (
                    <button
                      key={item.href}
                      onClick={onClearClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left",
                        "text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <div className="flex-shrink-0 text-gray-600 dark:text-white/70">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.title}
                        </p>
                        <p className="text-xs truncate text-gray-500 dark:text-white/50">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={isActive(item.href) ? "true" : "false"}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 border",
                      isActive(item.href)
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-semibold"
                        : "text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0",
                        isActive(item.href)
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-600 dark:text-white/70"
                      )}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.title}
                      </p>
                      <p
                        className={cn(
                          "text-xs truncate",
                          isActive(item.href)
                            ? "text-indigo-500 dark:text-indigo-300"
                            : "text-gray-500 dark:text-white/50"
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </SidebarGroup>
        ))}
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  BarChart3,
  TrendingUp,
  Film,
  User2,
  Upload,
  Settings,
  PencilIcon,
  LogOut,
  Home,
  Zap,
  Star,
  Calendar,
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

import { Button } from "@/components/ui/button";

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
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("");

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

    // Wait for DOM to be fully rendered
    const timer = setTimeout(() => {
      // Find the scrollable container (SidebarInset which is <main>)
      const scrollContainer = document.querySelector(
        '[data-slot="sidebar-inset"]'
      ) as HTMLElement;

      if (!scrollContainer) return;

      const observer = new IntersectionObserver(
        (entries) => {
          // Get the topmost visible section
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
          rootMargin: "-50px 0px -80% 0px", // Trigger when section enters top of viewport
          threshold: 0,
        }
      );

      // Observe all sections
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          observer.observe(element);
        }
      });

      // Store observer for cleanup
      const observerInstance = observer;

      // Cleanup
      return () => {
        observerInstance.disconnect();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const isActive = (href: string) => {
    // Check if it's a hash link (analytics section)
    if (href.startsWith("#")) {
      return activeSection === href;
    }

    // Check if it's a regular route
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar
      className="bg-background dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border-r border-gray-200 dark:border-white/10"
      {...props}
    >
      <SidebarHeader className="pb-0 bg-background dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 h-16">
        <div className="flex items-center gap-2 px-2 py-2">
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

      <SidebarContent className="bg-background dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
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
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 scroll-smooth",
                      isActive(item.href)
                        ? "bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30"
                        : "text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
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
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 scroll-smooth text-left",
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
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 scroll-smooth text-left",
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
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 scroll-smooth",
                      isActive(item.href)
                        ? "bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30"
                        : "text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
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

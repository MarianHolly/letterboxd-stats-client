"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Safe theme hook that waits for hydration and respects the dark class on <html>
 * Prevents hydration mismatch by checking both the CSS class and the theme hook
 */
export function useThemeSafe() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDarkClass, setIsDarkClass] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if dark class exists on html element (set by layout script)
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkClass(isDark);
  }, []);

  // If not mounted, use the class-based detection (from layout script)
  // If mounted, use the theme hook
  const isDark =
    !mounted ? isDarkClass : theme === "dark" || (theme === "system" && isDarkClass);

  return {
    theme,
    setTheme,
    isDark,
    mounted,
  };
}

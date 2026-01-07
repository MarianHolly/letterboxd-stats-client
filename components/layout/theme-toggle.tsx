"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useLayoutEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // This is needed for hydration - setState in effect is intentional
  useLayoutEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="border-white/20 hover:bg-white/10 cursor-pointer rounded-full hover:border-white/40 hover:border-2"
    >
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

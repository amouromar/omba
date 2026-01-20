"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-neutral-surface/50 border border-neutral-border animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-neutral-surface border border-neutral-border hover:border-secondary-main hover:text-secondary-main transition-all duration-300 overflow-hidden group shadow-sm focus:outline-none focus:ring-1 focus:ring-secondary-main/50"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
          size={20}
        />
        <Moon
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === "dark"
              ? "-rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
          size={20}
        />
      </div>

      {/* Subtle background glow effect on hover */}
      <span className="absolute inset-0 bg-secondary-main/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
    </button>
  );
}

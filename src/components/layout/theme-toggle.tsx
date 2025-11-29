"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && (theme === "earthDark" || theme === "dark");

  return (
    <button
      type="button"
      className="btn btn-sm btn-ghost rounded-full border border-base-200/50"
      onClick={() => setTheme(isDark ? "earth" : "earthDark")}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="size-4 text-warning" />
      ) : (
        <Moon className="size-4 text-primary" />
      )}
    </button>
  );
}


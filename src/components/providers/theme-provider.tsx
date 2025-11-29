"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="earth"
      value={{
        earth: "earth",
        light: "earth",
        dark: "earthDark",
        earthDark: "earthDark",
      }}
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}


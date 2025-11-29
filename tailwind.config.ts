import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/utils/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: "#f5f7ff",
          100: "#e6ebff",
          200: "#c8d1ff",
          300: "#a8b6ff",
          400: "#8794ff",
          500: "#6470ff",
          600: "#4c55db",
          700: "#383fa8",
          800: "#242a75",
          900: "#111341",
        },
        blush: {
          100: "#ffeef4",
          200: "#ffd4e3",
          300: "#ffb0ca",
          400: "#ff8ab1",
          500: "#ff5c9a",
          600: "#db387f",
          700: "#b72467",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.12)",
        glass: "inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(15,23,42,.08)",
      },
      borderRadius: {
        "2.5xl": "1.5rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Outfit", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        slideUp: "slideUp 0.4s ease forwards",
      },
    },
  },
  daisyui: {
    themes: [
      {
        earth: {
          primary: "#3A5A40", // deep earth green
          secondary: "#A3B18A", // sage
          accent: "#588157", // moss
          neutral: "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f5f5f4",
          "base-300": "#e7e5e4",
          info: "#2563eb",
          success: "#3A5A40",
          warning: "#b45309",
          error: "#b91c1c",
        },
      },
      {
        earthDark: {
          primary: "#A3B18A",
          secondary: "#588157",
          accent: "#3A5A40",
          neutral: "#0b1220",
          "base-100": "#111827",
          "base-200": "#1f2937",
          "base-300": "#374151",
          info: "#60a5fa",
          success: "#84a98c",
          warning: "#f59e0b",
          error: "#f87171",
        },
      },
    ],
    darkTheme: "earthDark",
  },
  plugins: [daisyui],
};

export default config;


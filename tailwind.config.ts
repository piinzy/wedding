import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          gold:      "#C9A96E",
          "gold-light": "#E8D5B0",
          "gold-dark":  "#A67C45",
          blush:     "#F2D7D5",
          "blush-dark": "#E8B4B0",
          charcoal:  "#1B1B1B",
          "charcoal-light": "#4A4A4A",
          cream:     "#FAFAF8",
          "cream-dark": "#F0EDE8",
          rose:      "#C8796A",
        },
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "Arial", "Helvetica", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)",
        "hero-overlay": "linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
      },
      boxShadow: {
        "brand": "0 4px 24px rgba(201,169,110,0.18)",
        "card":  "0 2px 16px rgba(27,27,27,0.08)",
        "input": "0 1px 4px rgba(27,27,27,0.06)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

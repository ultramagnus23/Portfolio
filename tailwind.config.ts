import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        signal:  "#00FF94",
        phase:   "#5E8CDB",
        base:    "#0a0a0a",
        surface: "#111213",
        dim:     "#1e1e1e",
        muted:   "#6b7280",
      },
      fontFamily: {
        display: ["Clash Display", "sans-serif"],
        body: ["Instrument Sans", "sans-serif"],
      },
    },
  },
};

export default config;

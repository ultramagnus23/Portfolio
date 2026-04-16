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
        signal: "#00FF94",
        base: "#0a0a0a",
        muted: "#888888",
      },
      fontFamily: {
        display: ["Clash Display", "sans-serif"],
        body: ["Instrument Sans", "sans-serif"],
      },
    },
  },
};

export default config;

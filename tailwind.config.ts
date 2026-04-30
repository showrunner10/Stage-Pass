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
        border: "var(--border)",
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "#FFFFFF",
          strong: "var(--primary-strong)",
        },
        dark: "var(--charcoal)",
        offwhite: "var(--offwhite)",
        accent: {
          green: "var(--accent-green)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        editorial: ["var(--font-editorial)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        border: "var(--color-border)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        income: "var(--color-income)",
        expense: "var(--color-expense)",
        savings: "var(--color-savings)",
        debt: "var(--color-debt)",
        goal: "var(--color-goal)",
        ink: "var(--color-text-primary)",
        muted: "var(--color-text-muted)",
        secondary: "var(--color-text-secondary)",
        paper: "var(--color-surface)",
        panel: "var(--color-card)",
        line: "var(--color-border)",
        sage: "var(--color-income)",
        clay: "var(--color-debt)",
        gold: "var(--color-goal)",
      },
      boxShadow: {
        soft: "0 18px 48px rgba(0, 0, 0, 0.18)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

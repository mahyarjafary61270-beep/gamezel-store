import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#05050f",
          900: "#0a0a1c",
          800: "#10102a",
          700: "#181838",
        },
        neon: {
          purple: "#a855f7",
          violet: "#8b5cf6",
          blue: "#38bdf8",
          cyan: "#22d3ee",
          pink: "#f472b6",
        },
      },
      fontFamily: {
        sans: ["Vazirmatn", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "float-y": "float-y 5.5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

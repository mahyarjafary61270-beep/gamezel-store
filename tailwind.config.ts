import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: {
          950: "#030d09",
          900: "#061712",
          800: "#0a231b",
          700: "#0f3226",
        },
        neon: {
          green: "#34d399",
          mint: "#6ee7b7",
          emerald: "#10b981",
          lime: "#a3e635",
          teal: "#2dd4bf",
          orange: "#f97316",
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

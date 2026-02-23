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
        brand: {
          orange: "#FF7F27",
          "orange-light": "#FEEBC8",
          "orange-dark": "#E85D04",
          red: "#B23B3B",
          "red-dark": "#8B2E2E",
          "red-border": "#A03E2D",
          cream: "#FDF4DD",
          peach: "#FEEBC8",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "header-texture": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(1rem)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-1rem)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-1rem)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.7s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.7s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.7s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.7s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F6F1EB",
        primary: "#B87A6A",
        "primary-dark": "#9A5E4E",
        secondary: "#7A6B9A",
        "accent-sage": "#6A9A8A",
        "accent-gold": "#B8965A",
        "text-dark": "#1E1812",
        "text-muted": "#8A7E72",
      },
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Display', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card: "0 8px 30px rgb(0,0,0,0.05)",
        "card-hover": "0 16px 48px rgb(0,0,0,0.09)",
        "inner-soft": "inset 0 2px 4px rgba(0,0,0,0.04)",
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(160deg, #1E1812 0%, #4A2E24 50%, #B87A6A 100%)",
        "gradient-card-blush": "linear-gradient(135deg, #F2ECE6 0%, #E8D8D0 100%)",
        "gradient-card-lavender": "linear-gradient(135deg, #EAE6F0 0%, #D8D0E8 100%)",
        "gradient-card-sage": "linear-gradient(135deg, #E6EFEC 0%, #D0E4DD 100%)",
        "gradient-card-cream": "linear-gradient(135deg, #F0EBE2 0%, #E4D8C0 100%)",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

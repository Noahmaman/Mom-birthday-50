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
        background: "#FDF5F0",
        "primary-pink": "#F4A7B9",
        "primary-pink-dark": "#E8849A",
        "accent-purple": "#C9A7E8",
        "soft-green": "#A8E6CF",
        "soft-yellow": "#FFE4A0",
        "soft-blue": "#A7C7E7",
        "text-dark": "#2D2D2D",
        "text-muted": "#8E8E93",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "SF Pro Display",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card: "0 8px 30px rgb(0,0,0,0.06)",
        "card-hover": "0 12px 40px rgb(0,0,0,0.1)",
        "inner-soft": "inset 0 2px 4px rgba(0,0,0,0.04)",
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #F4A7B9 0%, #C9A7E8 100%)",
        "gradient-card-pink": "linear-gradient(135deg, #FFE4E8 0%, #F9C6D0 100%)",
        "gradient-card-purple": "linear-gradient(135deg, #EDE4F9 0%, #D9C6F0 100%)",
        "gradient-card-green": "linear-gradient(135deg, #E4F9EE 0%, #C6F0DA 100%)",
        "gradient-card-yellow": "linear-gradient(135deg, #FFF8E4 0%, #FFF0C6 100%)",
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
          "50%": { transform: "translateY(-10px)" },
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

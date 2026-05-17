import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0E4B3E", // Deep Spruce Emerald
          foreground: "#ffffff",
          50: "#f0faf7",
          100: "#dcf2ec",
          200: "#bde3d8",
          300: "#8fccb9",
          400: "#5dae98",
          500: "#12715b",
          600: "#0E4B3E",
          700: "#0a362c",
          800: "#06221c",
          900: "#03110e",
          950: "#010706",
        },
        secondary: {
          DEFAULT: "#bc9d6a", // Champagne Gold
          foreground: "#ffffff",
          50: "#fbfaf7",
          100: "#f4efdf",
          200: "#e7dcbf",
          300: "#d4c096",
          400: "#bc9d6a",
          500: "#a8854f",
          600: "#906b3a",
          700: "#78542d",
          800: "#604123",
          900: "#4f341d",
          950: "#2c1b0f",
        },
        emerald: {
          50: "#f0faf7",
          100: "#dcf2ec",
          200: "#bde3d8",
          300: "#8fccb9",
          400: "#5dae98",
          500: "#12715b",
          600: "#0E4B3E",
          700: "#0a362c",
          800: "#06221c",
          900: "#03110e",
          950: "#010706",
        },
        accent: {
          DEFAULT: "#bc9d6a", // Champagne Gold
          foreground: "#ffffff",
          50: "#fbfaf7",
          100: "#f4efdf",
          200: "#e7dcbf",
          300: "#d4c096",
          400: "#bc9d6a",
          500: "#a8854f",
          600: "#906b3a",
          700: "#78542d",
          800: "#604123",
          900: "#4f341d",
          950: "#2c1b0f",
        },
        amber: {
          50: "#fbfaf7",
          100: "#f4efdf",
          200: "#e7dcbf",
          300: "#d4c096",
          400: "#bc9d6a",
          500: "#a8854f",
          600: "#906b3a",
          700: "#78542d",
          800: "#604123",
          900: "#4f341d",
          950: "#2c1b0f",
        },
        muted: {
          DEFAULT: "#f9fafb",
          foreground: "#6b7280",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(-5%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-slow": "bounce-slow 3s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

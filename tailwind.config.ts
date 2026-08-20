import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f2faf4",
          100: "#e0f3e5",
          200: "#c2e6cb",
          300: "#96d2a7",
          400: "#65b87e",
          500: "#419c5f",
          600: "#2f7d49",
          700: "#27633c",
          800: "#224f33",
          900: "#1d422c",
        },
        peach: {
          50: "#fff8f1",
          100: "#ffedd9",
          200: "#ffd8ae",
          300: "#ffbc78",
          400: "#ff9a41",
          500: "#fb7d1c",
          600: "#ec6410",
          700: "#c34e0f",
          800: "#9b3f14",
          900: "#7d3513",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;

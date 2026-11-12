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
        // Warm cream page background used by the redesigned project pages.
        cream: {
          50: "#fbf6f0",
          100: "#fbf2e8",
          200: "#f6e7d5",
          300: "#efd9bf",
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
      boxShadow: {
        // Soft, wide, low-contrast shadows used by the redesigned pages.
        soft: "0 12px 32px -18px rgba(34, 79, 51, 0.35)",
        "soft-lg": "0 24px 56px -28px rgba(34, 79, 51, 0.42)",
        // The big mockup card: barely-there, very wide.
        card: "0 18px 40px -26px rgba(61, 48, 34, 0.30)",
        btn: "0 10px 22px -12px rgba(31, 85, 50, 0.55)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.45s ease-out both",
      },
      fontFamily: {
        // Brand fonts, opted into per page via font-inter / font-poppins so the
        // default sans stack below stays untouched.
        inter: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        caveat: ["var(--font-caveat)", "ui-serif", "cursive"],
        poppins: [
          "var(--font-poppins)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
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

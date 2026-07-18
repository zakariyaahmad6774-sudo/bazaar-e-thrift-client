/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FBFAF7",
        card: "#FFFFFF",
        ink: "#2E2A26",
        rose: { DEFAULT: "#C1685A" },
        sage: { DEFAULT: "#8B9A72" },
        gold: "#CBA046",
        red: { DEFAULT: "#9A3B3B" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Karla", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

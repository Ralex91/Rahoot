/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff9900",
        secondary: "#1a140b",
        brand: "#00679A",
        outline: "#AED7EA"
      },
    },
  },
  safelist: ["grid-cols-4", "grid-cols-3", "grid-cols-2", {
    pattern: /bg-(red|blue|yellow|green)/}],
  plugins: [],
}

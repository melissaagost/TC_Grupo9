/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "#581c1c",
          700: "#3f1212",
          800: "#2a0d0d",
        },
        gold: {
          DEFAULT: "#ffd700",
          600: "#e6c200",
        },
        cream: {
          50: "#fdfaf6",
          100: "#f8f1e8",
        },
        charcoal: {
          800: "#2e2e2e",
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}

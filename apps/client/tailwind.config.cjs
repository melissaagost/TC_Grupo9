/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/assets/styles/input.css"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#2e2e2e",
        cream: "#fdfaf6",
        gold: "#D4AF37"
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif']
      }
    }
  },
  plugins: [],
}

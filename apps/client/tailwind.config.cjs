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
        /*rojos*/
        blood: {
          100: '#A03936', // extrabright
          300: '#651F0D', // bright
          400: '#572320', // mid
          500: '#4A1A1C', // dark
          700: '#3B1206', // extradark
        },

        /*grises*/
        gray:{
          200: '#565359', // light gray
          700: '#170E10', //almost black
          charcoal: "#2e2e2e", //from loveable
        },

        /*amarillos y naranjas */
        gold:{
          100:'#FCD9B2',
          200: '#FAB245',
          300: '#FAB877',
          400: '#F69650',
          golden: "#D4AF37" //from loveable
        },

        /*blancos */
        eggshell: {
          100: '#ECF1F1', //egg
          200: '#E1E8E3', //mid
          300: '#DEE2E5', //office
          creamy: '#F3E3C4',
          cream: "#fdfaf6", //from loveable
        }

      },

      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        raleway: ['Raleway', 'sans-serif'],
      },

      animation: {
        spinOnce: "spin 1s linear",
      }

    }

  },

  plugins: [],

}

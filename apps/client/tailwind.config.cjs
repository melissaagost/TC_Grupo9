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
          300: '#B8BBAD',
          700: '#170E10', //almost black
          charcoal: "#2e2e2e", //from loveable
        },

        /*amarillos y naranjas */
        gold:{
          100:'#FCD9B2',
          200: '#FAB245',
          300: '#FAB877',
          400: '#F69650',
          mustard: '#D7B30C',
          after: '#A79510',
          golden: "#D4AF37" //from loveable
        },

        /*blancos */
        eggshell: {
          100: '#ECF1F1', //egg
          200: '#E1E8E3', //mid
          300: '#DEE2E5', //office
          400: '#F8F7ED', //form bg
          creamy: '#F3E3C4',
          whitedove: '#F0EFE7',
          wonw: '#EDEFEF',
          greekvilla: '#F0EBE3',
          cream: "#fdfaf6", //from loveable
        },

        /*rosas */
        pink: {
          100: '#FDFBFB',
        },

        /*toasts */
        toast: {
          red: '#9C1013',
          green: '#3E9A39',
          yellow: '#FAD565',
          blue: '#4C7BAF',
        }

      },


      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        raleway: ['Raleway', 'sans-serif'],
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        'slide-in': {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },

      animation: {
        'fade-in': 'fade-in 0.7s ease-out',
        'slide-in': 'slide-in 0.7s ease-out'
      },



    }

  },

  plugins: [],

}

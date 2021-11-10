module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:["'M PLUS Rounded 1c'", 'sans-serif']
      },
      width: {
        '300': '300px',
      }
    },
  },
  variants: {},
  plugins: [],
}
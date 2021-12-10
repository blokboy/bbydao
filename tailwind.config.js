module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontSize: {
        xs: ".6rem",
      },
      fontFamily: {
        sans: ["'M PLUS Rounded 1c'", "sans-serif"],
      },
      width: {
        300: "300px",
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'olive-green': '#84994F',
        'light-yellow': '#FFE797',
        'dark-yellow': '#FCB53B',
        'dark-red': '#B45253',
      }
    },
  },
  plugins: [],
}
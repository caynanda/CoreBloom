/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'brand-pink-light': '#FADADD',
        'brand-pink-dark': '#DB2777',
        'brand-green': '#D4EADF',
        'brand-beige': '#F5F1EA',
        'brand-gray': '#9CA3AF',
      }
    },
  },
  plugins: [],
} 
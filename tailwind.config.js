/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FF2D55',
        'primary-light': '#FF6B86',
        'primary-dark': '#CC0033',
      },
    },
  },
  plugins: [],
};

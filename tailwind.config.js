/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/app/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-bg-0': '#221f2e',
        'brand-bg-1': '#37324d',
        'brand-bg-2': '#343254',
        'brand-bg-3': '#37324d',
        'brand-bg-4': '#37324d',
      },
      boxShadow: {
        blue: '0 0 3px 3px #4285f4',
        gray: '0 1px 3px 0 rgba(60, 64, 67, .3)',
      },
    },
  },
  plugins: [],
};

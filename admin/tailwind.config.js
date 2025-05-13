// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'), // плагин daisyUI
  ],
  daisyui: {
    themes: ['light', 'dark'], // или другие темы daisyUI
  },
}

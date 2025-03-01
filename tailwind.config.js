/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          dark: '#CC5500',
          light: '#FF8533',
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#333333',
          dark: '#000000',
        }
      }
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        green: {
          DEFAULT: '#2d5016',
          mid:    '#4a7c2f',
          light:  '#e8f0df',
        },
        soil:   { DEFAULT: '#8b5e3c', light: '#f5ede3' },
        accent: '#c8a96e',
        cream:  '#faf6ef',
      },
    },
  },
  plugins: [],
}

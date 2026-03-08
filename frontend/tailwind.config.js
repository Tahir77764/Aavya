/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'avaya-gold': '#D4AF37',
        'avaya-teal': '#0E4D4D', // Approximate from the screenshot
        'avaya-blue': '#1E3A8A', // Deep blue from hero
        'avaya-dark': '#111827',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'], // Elegant font for headings
        sans: ['Inter', 'sans-serif'], // Clean font for body
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['"Cormorant SC"', 'serif'],
        trajan: ['TrajanPro', 'serif'],
      }
    },
  },
  plugins: [],
}

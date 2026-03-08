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
                'avaya-teal': '#0E4D4D',
                'avaya-blue': '#1E3A8A',
                'avaya-dark': '#111827',
            },
            fontFamily: {
                serif: ['TrajanPro', 'Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

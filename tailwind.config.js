/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [{ pattern: /.*/ }],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DomaineSans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

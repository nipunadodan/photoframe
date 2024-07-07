/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '3xs': ['0.5rem', {lineHeight: '0.625rem'}], // 8px
        '2xs': ['0.625rem', {lineHeight: '0.75rem'}], // 10px
      },
      colors: {
        cta: "#364462",
        cta2: "#5b89f8",
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#DE9A00',
        background: '#303030',
        button: '#243E94',
        gray: '#D9D9D9',
      },
      fontFamily: { sans: ['Vazirmatn', 'sans-serif'] },
    },
  },
  plugins: [],
}
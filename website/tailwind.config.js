/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        texas: {
          red: '#BF0A30',
          blue: '#002868',
          white: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};

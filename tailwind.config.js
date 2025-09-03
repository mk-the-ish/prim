/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#1E40AF',
          background: '#F3F4F6',
          textPrimary: '#111827',
        },
        dark: {
          primary: '#3B82F6',
          background: '#111827',
          textPrimary: '#F9FAFB',
          }
      }
    },
  },
  plugins: [],
}


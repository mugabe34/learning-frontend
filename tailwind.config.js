/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // Deep Blue
        accent: '#10B981',  // Emerald Green
        background: '#F3F4F6', // Light Grey
        error: '#EF4444', // Red
      },
    },
  },
  plugins: [],
} 
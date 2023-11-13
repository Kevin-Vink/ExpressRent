/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      gridTemplateColumns: {
        sidebar: '250px auto', // for sidebar layout
        'sidebar-collapsed': '72px auto', // for collapsed sidebar layout
      },
      animation: {
        'scroll': 'scroll 2s ease-in-out infinite',
      },
      keyframes: {
        'scroll': {
            '0%': { transform: 'translateY(0)', opacity: 1 },
            '50%': { transform: 'translateY(1rem)', opacity: 1 },
            '60%': { transform: 'translateY(1rem)', opacity: 0 },
            '75%': { transform: 'translateY(0)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}


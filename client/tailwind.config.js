/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      gridTemplateColumns: {
        sidebar: '250px auto', // for sidebar layout
        'sidebar-collapsed': '72px auto', // for collapsed sidebar layout
      },
    },
  },
  plugins: [],
}


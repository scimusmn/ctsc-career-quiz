/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'career-blue': {
          100: '#C2F2FF',
          300: '#74B1C2',
          400: '#6EB7CB',
          500: '#1A7C96',
          900: '#0A0F3A',
        },
      },

      fontFamily: {
        'GT-Walsheim': 'GT Walsheim',
      },
    },
  },
  plugins: [],
};

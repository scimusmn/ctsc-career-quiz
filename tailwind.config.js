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

      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        ticker: 'ticker 22s linear infinite',
      },
    },
  },
  plugins: [],
};

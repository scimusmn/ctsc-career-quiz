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
        'ship-yellow': {
          DEFAULT: '#ECB96D',
          dark: '#E8AA4E', // Approximately 10% darker
        },
        'ship-orange': {
          DEFAULT: '#DE5D00',
          dark: '#C85400', // Approximately 10% darker
        },
        'ship-gray': {
          DEFAULT: '#D9D9D966',
          dark: '#C3C3C366', // Approximately 10% darker
        },
        'detective-blue': {
          100: '#C2F2FF',
          200: '#2AC0F5',
          300: '#0D84B0',
          350: '#0C7BA8',
          500: '#08526F',
        },

        'wrong-answer': '#DE5D00',
        'correct-answer': '#67B935',
      },

      fontFamily: {
        'GT-Walsheim': 'GT Walsheim',
        Gugi: 'Gugi',
        Iceberg: 'Iceberg',
      },
    },
  },
  plugins: [],
};

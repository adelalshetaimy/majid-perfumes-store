/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF6EE',
          100: '#F5EDE0',
          200: '#EDE0CC',
          300: '#E2D2B8',
        },
        bronze: {
          50: '#F7F1E8',
          100: '#E8D9C2',
          200: '#D4BC97',
          300: '#B89870',
          400: '#A07E54',
          500: '#8B6F47',
          600: '#74593A',
          700: '#5E472F',
          800: '#4A3825',
        },
        ink: {
          700: '#4A3B2E',
          800: '#3A2E23',
          900: '#2A211A',
        },
      },
      fontFamily: {
        display: ['Cairo', 'sans-serif'],
        body: ['Tajawal', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(74, 56, 37, 0.08)',
        card: '0 12px 40px rgba(74, 56, 37, 0.12)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        scaleIn: 'scaleIn 0.3s ease-out forwards',
        slideIn: 'slideIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};

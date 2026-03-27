/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        forest: {
          DEFAULT: '#1B3022',
          light: '#2D4F37',
          dark: '#111E16',
          50:  '#E8F0EA',
          100: '#C5D9CA',
          200: '#9EBFAA',
          300: '#77A48A',
          400: '#4D8A6A',
          500: '#1B3022',
          600: '#162818',
          700: '#10200D',
          800: '#0A1808',
          900: '#050C04',
        },
        lime: {
          DEFAULT: '#9CFC5C',
          light: '#B8FD85',
          dark: '#7DD940',
          50:  '#F2FEEA',
          100: '#DDFDC8',
          200: '#C5FCA2',
          300: '#ADFB7C',
          400: '#9CFC5C',
          500: '#7DD940',
          600: '#63B030',
          700: '#498720',
          800: '#305E12',
          900: '#183506',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.7s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'count-up': 'countUp 2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #1B3022 0%, #2D4F37 100%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(27,48,34,0.85) 0%, rgba(27,48,34,0.4) 100%)',
        'lime-gradient': 'linear-gradient(135deg, #9CFC5C 0%, #7DD940 100%)',
      },
    },
  },
  plugins: [],
}

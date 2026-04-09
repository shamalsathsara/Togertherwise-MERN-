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
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
        'gradient-x': 'gradientX 4s ease infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #1B3022 0%, #2D4F37 100%)',
        'forest-gradient-dark': 'linear-gradient(135deg, #111E16 0%, #1B3022 50%, #2D4F37 100%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(27,48,34,0.9) 0%, rgba(27,48,34,0.5) 50%, rgba(27,48,34,0.2) 100%)',
        'lime-gradient': 'linear-gradient(135deg, #B8FD85 0%, #9CFC5C 50%, #7DD940 100%)',
        'section-gradient': 'linear-gradient(180deg, #f8faf8 0%, #ffffff 100%)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      boxShadow: {
        'lime': '0 4px 24px rgba(156, 252, 92, 0.35)',
        'lime-lg': '0 8px 40px rgba(156, 252, 92, 0.5)',
        'forest': '0 4px 24px rgba(27, 48, 34, 0.35)',
        'forest-lg': '0 8px 40px rgba(27, 48, 34, 0.5)',
        'luxury': '0 20px 60px rgba(27, 48, 34, 0.12), 0 4px 12px rgba(27, 48, 34, 0.06)',
        'luxury-hover': '0 30px 80px rgba(27, 48, 34, 0.18), 0 8px 24px rgba(156, 252, 92, 0.12)',
      },
    },
  },
  plugins: [],
}

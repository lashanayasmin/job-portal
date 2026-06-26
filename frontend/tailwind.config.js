/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf6f0',
          100: '#f8e8d8',
          200: '#f0ceb0',
          300: '#e5aa7e',
          400: '#d98650',
          500: '#cf6d33',
          600: '#c15828',
          700: '#a04522',
          800: '#813a21',
          900: '#68321e',
        },
        ink: {
          50: '#f4f6f8',
          100: '#e2e7ed',
          200: '#c8d1dd',
          300: '#a1afc3',
          400: '#7588a3',
          500: '#5a6d88',
          600: '#475673',
          700: '#3c475e',
          800: '#343d50',
          900: '#1e2535',
          950: '#0f1420',
        },
        cream: {
          50: '#fefcf9',
          100: '#fdf8f0',
          200: '#f9ede0',
          300: '#f3ddc5',
          400: '#ebc8a0',
          500: '#e0af7a',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'draw-line': 'drawLine 1.5s ease-out forwards',
        'blob': 'blob 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(2deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        drawLine: {
          from: { width: '0%' },
          to: { width: '100%' },
        },
        blob: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
      },
      boxShadow: {
        'warm': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)',
        'warm-md': '0 4px 12px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.03)',
        'warm-lg': '0 12px 32px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)',
        'warm-xl': '0 20px 48px rgba(0,0,0,0.07), 0 8px 20px rgba(0,0,0,0.03)',
      },
    },
  },
  plugins: [],
};

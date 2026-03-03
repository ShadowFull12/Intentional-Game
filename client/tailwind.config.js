/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#252525',
          600: '#333333',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
          glow: '#8b5cf680',
          blue: '#3b82f6',
        },
        neon: {
          purple: '#8b5cf6',
          blue: '#06b6d4',
          pink: '#ec4899',
          green: '#10b981',
        },
      },
      borderRadius: {
        '2xl': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(139, 92, 246, 0.15)',
        'glass-lg': '0 16px 48px 0 rgba(139, 92, 246, 0.2)',
        'neon': '0 0 20px rgba(139, 92, 246, 0.4)',
        'neon-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

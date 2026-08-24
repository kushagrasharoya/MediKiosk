import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          dark: '#1D837F',
          primary: '#3EAEB1',
          secondary: '#61BACA',
          soft: '#9CD1CE',
          light: '#9FD8E1',
          bg: '#D7EAEE',
        },
        health: {
          bg: '#F7FBFC',
          dark: '#102A43',
          card: '#FFFFFF',
          border: '#D7EAEE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'teal-glow': '0 8px 30px rgba(62, 174, 177, 0.15)',
        'card-soft': '0 4px 20px rgba(16, 42, 67, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};

export default config;

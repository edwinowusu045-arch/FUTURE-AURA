import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 40px 120px rgba(99, 102, 241, 0.14)'
      },
      colors: {
        aura: {
          950: '#020617',
          900: '#0f172a',
          700: '#334155'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;

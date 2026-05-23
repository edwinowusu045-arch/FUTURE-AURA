import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 40px 120px rgba(109, 40, 217, 0.15)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(99,102,241,0.2), transparent 45%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.18), transparent 30%)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;

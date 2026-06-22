import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FF5722',
          end: '#FF9800',
        },
        orange: {
          primary: '#FF5722',
          secondary: '#FF9800',
          light: '#FFF3EE',
        },
        status: {
          posted: '#3B6D11',
          scheduled: '#185FA5',
          pending: '#FF5722',
          draft: '#5F5E5A',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF5722, #FF9800)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      width: {
        sidebar: '200px',
      },
    },
  },
  plugins: [],
};

export default config;

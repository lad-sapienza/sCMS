/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

export default {
  content: ['./usr/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Link Tailwind colors to CSS variables for consistent theming
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: '#fef7ff',
          100: '#fce7ff',
          200: '#f9d0fe',
          300: '#f4a9fc',
          400: '#ec75f7',
          500: 'var(--color-primary)', // #fe04fc
          600: '#d946ef',
          700: '#be38d3',
          800: '#9d2fad',
          900: '#81288c',
        },
        text: 'var(--color-text)',
        background: 'var(--color-bg)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      // Add s:CMS specific design tokens
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'scms': '6px',
      },
      boxShadow: {
        'scms': '0 0 0 3px rgba(37, 99, 235, 0.1)',
        'scms-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    typography,
    forms,
  ],
}

/** 
 * User Tailwind Theme Customization Example
 * 
 * Copy this file to usr/tailwind.config.js and modify the values below
 * to customize your site's theme. These settings will extend the core
 * Tailwind configuration.
 * 
 * You can:
 * 1. Override CSS variables in usr/styles/global.css
 * 2. Extend Tailwind theme here for additional utility classes
 * 3. Use both approaches together for maximum flexibility
 */

/** @type {import('tailwindcss').Config} */
export default {
  // This extends the core tailwind.config.js
  theme: {
    extend: {
      colors: {
        // Add your custom brand colors alongside the core primary colors
        brand: {
          blue: '#0066cc',
          green: '#00a86b',
          yellow: '#ffcc00',
        },
        // Override specific primary color variants if needed
        primary: {
          // Keep core primary colors, just override specific shades
          600: '#custom-color', // Custom override
        },
        // Add semantic color names
        success: '#10b981',
        warning: '#f59e0b', 
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        // Add custom fonts while keeping core fonts available
        display: ['Inter', 'var(--font-sans)'],
        heading: ['Playfair Display', 'serif'],
      },
      spacing: {
        // Add custom spacing values
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        // Custom animations for your site
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  
  // Add custom plugins if needed
  plugins: [
    // Example: Add custom component classes
    function({ addComponents, theme }) {
      addComponents({
        // Custom button variant that uses your brand colors
        '.btn-brand': {
          backgroundColor: theme('colors.brand.blue'),
          color: theme('colors.white'),
          padding: theme('spacing.3') + ' ' + theme('spacing.6'),
          borderRadius: theme('borderRadius.scms'),
          '&:hover': {
            backgroundColor: theme('colors.brand.green'),
          },
        },
      })
    },
  ],
}
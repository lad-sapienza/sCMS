# s:CMS Theming Guide

s:CMS provides a flexible theming system that combines **CSS variables** with **Tailwind CSS** for maximum customization power.

## Architecture Overview

```
core/styles/global.css     → Framework design system & CSS variables
usr/styles/user-theme.css  → Your custom overrides & styles  
tailwind.config.js         → Core Tailwind theme with CSS variable integration
usr/tailwind.user.config.js → Example user Tailwind extensions
```

## Quick Start

### 1. Override CSS Variables
Edit `usr/styles/user-theme.css` to override core design tokens:

```css
:root {
  --color-primary: #0066cc;        /* Your brand color */
  --color-text: #2d3748;           /* Custom text color */
  --font-sans: 'Inter', sans-serif; /* Custom typography */
}
```

### 2. Use Tailwind Utilities
Thanks to CSS variable integration, you can now use:

```html
<button class="bg-primary text-white px-4 py-2">Primary Button</button>
<div class="text-primary border-primary">Brand colored content</div>
<h1 class="font-sans text-text">Styled with your custom fonts & colors</h1>
```

### 3. Extend Tailwind Theme
Copy `usr/tailwind.user.config.js` to `usr/tailwind.config.js` and customize:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: { blue: '#0066cc', green: '#00a86b' },
        success: '#10b981',
      },
      fontFamily: {
        display: ['Inter', 'var(--font-sans)'],
      }
    }
  }
}
```

## Available Design Tokens

### Colors (CSS Variables + Tailwind Classes)
| Variable | Tailwind Class | Purpose |
|----------|----------------|---------|
| `--color-primary` | `bg-primary`, `text-primary`, `border-primary` | Brand color |
| `--color-text` | `text-text` | Main text |
| `--color-bg` | `bg-background` | Background |
| `--color-border` | `border-border` | Borders |

### Typography
| Variable | Tailwind Class | Purpose |
|----------|----------------|---------|
| `--font-sans` | `font-sans` | Body text |
| `--font-mono` | `font-mono` | Code text |

### Custom Design Tokens
| Variable | Tailwind Class | Purpose |
|----------|----------------|---------|
| `--radius-base` | `rounded-scms` | Component border radius |
| `--shadow-focus` | `shadow-scms` | Focus states |

## Component Classes

s:CMS provides ready-to-use component classes that respect your theme:

### Form Elements
```html
<input class="scms-input" />        <!-- Styled input with theme colors -->
<select class="scms-select">        <!-- Styled select dropdown -->
<button class="scms-btn-primary">   <!-- Primary button -->
<button class="scms-btn-secondary"> <!-- Secondary button -->
```

### Advanced Usage
```html
<!-- Combine s:CMS classes with Tailwind utilities -->
<button class="scms-btn-primary text-lg shadow-scms-lg">
  Large primary button with custom shadow
</button>

<!-- Use CSS variables in custom styles -->
<div style="background: linear-gradient(var(--color-primary), var(--color-primary-dark))">
  Gradient using theme colors
</div>
```

## Best Practices

1. **Override CSS variables** for brand consistency across all components
2. **Use Tailwind utilities** for layout, spacing, and custom styling  
3. **Extend Tailwind theme** for additional utility classes
4. **Combine both approaches** for maximum flexibility

## Examples

### Brand Color Override
```css
/* usr/styles/user-theme.css */
:root {
  --color-primary: #7c3aed;
  --color-primary-hover: #6d28d9;
}
```

### Dark Theme
```css
:root {
  --color-text: #f9fafb;
  --color-bg: #111827;
  --color-border: #374151;
}
```

### Custom Component
```css
.my-hero {
  @apply bg-primary text-white p-8 rounded-scms;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}
```

This hybrid approach gives you the power of utility-first CSS with the consistency of a design system!
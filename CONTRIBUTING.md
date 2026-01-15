# Contributing to s:CMS Astro

Thank you for your interest in contributing to s:CMS! This guide will help you get started.

## Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/your-username/scms-astro.git
cd scms-astro
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Make your changes**

Edit files in the `core/` directory for framework improvements, or `src/` for examples and documentation.

## Project Architecture

### Core Directory (`core/`)

Contains the framework code that users shouldn't need to modify:

- **`components/`** - Reusable Astro components
- **`layouts/`** - Base layout templates
- **`utils/`** - Helper functions and utilities
- **`integrations/`** - Custom Astro integrations
- **`types/`** - TypeScript type definitions
- **`index.ts`** - Public API exports

### User Directory (`src/`)

Contains example implementations and documentation:

- **`content/`** - Content Collections (docs, blog, data)
- **`components/`** - Example custom components
- **`layouts/`** - Example layout extensions
- **`pages/`** - Page routes
- **`styles/`** - Global styles

## Coding Standards

### TypeScript

- Use TypeScript for all `.ts` files
- Define interfaces for component props
- Export types in `core/types/index.ts`

### Astro Components

- Use `.astro` extension for components
- Define Props interface in frontmatter
- Include JSDoc comments for complex components

Example:

```astro
---
/**
 * DataTable Component
 * 
 * Display data in a sortable, filterable table.
 * 
 * @example
 * <DataTable source={{ directus: { table: 'products' } }} />
 */

interface Props {
  source: DataSource;
  columns?: string[];
  sortable?: boolean;
}

const { source, columns, sortable = true } = Astro.props;
---

<div class="datatable">
  <!-- Component content -->
</div>
```

### Styles

- Use scoped styles in `.astro` components
- Use CSS custom properties for theming
- Keep global styles minimal

### Naming Conventions

- **Components**: PascalCase (e.g., `DataTable.astro`)
- **Utilities**: camelCase (e.g., `fetchFromDirectus`)
- **Types**: PascalCase (e.g., `DataSource`)
- **Files**: kebab-case for docs (e.g., `quick-start.md`)

## Testing Your Changes

1. **Test with example content**

Add test cases in `src/content/docs/`:

```markdown
---
title: "Test DataTable"
---

import { DataTable } from '@core';

<DataTable
  source={{ path2data: { path: '/data/test.json' } }}
  columns={['id', 'name']}
/>
```

2. **Test build**

```bash
npm run build
npm run preview
```

3. **Check types**

```bash
npx astro check
```

## Making a Pull Request

1. **Create a branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

Follow the coding standards above.

3. **Test thoroughly**

Ensure your changes work in both dev and production builds.

4. **Commit with clear messages**

```bash
git commit -m "Add feature: description of what you added"
```

5. **Push and create PR**

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Screenshots if UI changes
- Link to related issues

## Areas for Contribution

### High Priority

1. **Complete placeholder components**
   - MapLeaflet with full Leaflet.js integration
   - Gallery with PhotoSwipe lightbox
   - Field component with context support

2. **Add more data sources**
   - GraphQL loader
   - REST API loader
   - Supabase integration

3. **Improve documentation**
   - More examples
   - Video tutorials
   - API references

### Medium Priority

4. **Testing infrastructure**
   - Unit tests for utilities
   - E2E tests for components
   - Visual regression tests

5. **Performance optimizations**
   - Image optimization strategies
   - Bundle size analysis
   - Loading strategies

### Nice to Have

6. **Additional components**
   - Charts and visualizations
   - Forms with validation
   - Authentication flows

7. **Developer tools**
   - CLI for scaffolding
   - VS Code extension
   - Starter templates

## Component Development Guide

### Creating a New Component

1. Create component file in `core/components/YourComponent.astro`

2. Define Props interface and exports:

```astro
---
import type { DataSource } from '../types';

interface Props {
  source: DataSource;
  title?: string;
}

const { source, title } = Astro.props;
---

<div class="your-component">
  {title && <h2>{title}</h2>}
  <slot />
</div>

<style>
  .your-component {
    /* Component styles */
  }
</style>
```

3. Export in `core/index.ts`:

```typescript
export { default as YourComponent } from './components/YourComponent.astro';
```

4. Add documentation in `src/content/docs/`

5. Add example usage in documentation

### Utility Function Development

1. Create utility in appropriate file (`core/utils/`)

2. Add JSDoc comments:

```typescript
/**
 * Fetch data from a remote URL
 * 
 * @param url - The URL to fetch from
 * @returns Parsed data
 * @throws Error if fetch fails
 * 
 * @example
 * const data = await fetchRemoteData('https://api.example.com/data');
 */
export async function fetchRemoteData(url: string): Promise<any> {
  // Implementation
}
```

3. Export in `core/index.ts`

4. Add tests

## Integration Development

Custom loaders follow Astro's Content Loader API:

```typescript
import type { Loader } from 'astro/loaders';

export function customLoader(options: CustomOptions): Loader {
  return {
    name: 'custom-loader',
    load: async ({ store, logger }) => {
      // Fetch and process data
      const items = await fetchData(options);
      
      // Store in collection
      store.clear();
      for (const item of items) {
        store.set({
          id: item.id,
          data: item,
        });
      }
      
      logger.info(`Loaded ${items.length} items`);
    },
  };
}
```

## Documentation Standards

### Component Documentation

Include in doc files:

- **Purpose**: What the component does
- **Props**: All available props with types
- **Examples**: Basic and advanced usage
- **Styling**: How to customize appearance
- **Data sources**: Supported source types

### Code Comments

- Use JSDoc for functions and types
- Explain "why" not "what"
- Include examples for complex code

## Questions?

- Open an issue for discussion
- Join our community chat
- Contact LAD @Sapienza

## License

By contributing, you agree that your contributions will be licensed under the BSD-0-Clause License.

---

Thank you for contributing! 🎉

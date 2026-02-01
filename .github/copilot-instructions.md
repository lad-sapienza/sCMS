# s:CMS Astro Development Guide

## Architecture Overview

s:CMS is a static CMS built on Astro with a **strict separation between core system and user code**:

- **`core/`**: Framework components, layouts, and utilities (updateable, do not edit directly)
- **`usr/`**: User content, custom components, and configurations (edit freely)

This separation allows users to update core functionality via git pull/npm without losing customizations.

### Path Aliases

Always use these TypeScript aliases for imports:
- `@core/*` → `core/*` (framework components/utils)
- `@user/*` → `usr/*` (user code)
- `@components/*` → `usr/components/*`
- `@layouts/*` → `usr/layouts/*`
- `@content/*` → `usr/content/*`

Example: `import { DataTb } from '@core/components/DataTb'`

## Configuration System

### Merged Config Pattern
[astro.config.mjs](astro.config.mjs) merges `coreConfig` with [usr/user.config.mjs](usr/user.config.mjs). When modifying:
- Core settings go in `astro.config.mjs` (integrations, srcDir, aliases)
- User overrides go in `usr/user.config.mjs` (site URL, custom integrations)
- Arrays like `integrations` are spread-merged, not replaced

### Content Collections
[usr/content/config.ts](usr/content/config.ts) defines schemas with Zod validation. Use `glob` loader for local files, `directusLoader` for CMS data.

## Core Component Patterns

### Hybrid Rendering Architecture
Core components use a **wrapper → React client** pattern:

1. **Astro wrapper** (e.g., [core/components/DataTb/DataTb.astro](core/components/DataTb/DataTb.astro)) handles SSR data fetching
2. **React component** (e.g., [core/components/DataTb/DataTb.tsx](core/components/DataTb/DataTb.tsx)) provides interactivity
3. **MDX wrapper** (e.g., [core/components/DataTb/DataTbMdx.tsx](core/components/DataTb/DataTbMdx.tsx)) wraps React for MDX use

Example from DataTb:
```astro
---
// DataTb.astro - handles data fetching
import { DataTb as DataTbClient } from './DataTb.tsx';
const data = await fetchData(source);
---
<DataTbClient data={data} client:idle />
```

### Data Source Abstraction
[core/utils/data-fetcher.ts](core/utils/data-fetcher.ts) provides unified `fetchData()` for CSV, JSON, Directus, and APIs. All table/map components accept `SourceConfig`:

```typescript
type SourceConfig = 
  | { type: 'csv'; url: string; delimiter?: string }
  | { type: 'json'; url?: string; data?: any[] }
  | { type: 'directus'; config: { url: string; token: string; table: string } };
```

### Component Structure
Each complex component follows this directory pattern:
```
components/DataTb/
├── DataTb.astro       # SSR wrapper
├── DataTb.tsx         # React client component
├── DataTbMdx.tsx      # MDX-compatible wrapper
├── types.ts           # TypeScript interfaces
├── utils.ts           # Helper functions
├── index.ts           # Public exports
└── README.md          # Component docs
```

## Key Development Workflows

### Running the Dev Server
```bash
npm run dev              # Start dev server at localhost:4321
npm run build            # Type-check + production build
npm run preview          # Preview production build
```

### Working with Directus
1. Set environment variables in `.env` (never committed):
   ```
   DIRECTUS_URL=https://your-instance.com
   DIRECTUS_TOKEN=your-token
   ```
2. Use `directusLoader` in content collections or `SourceConfig` in components
3. Directus SDK is imported via `@directus/sdk` in [core/utils/data-fetcher.ts](core/utils/data-fetcher.ts)

### Adding New Core Components
1. Create component directory in `core/components/NewComponent/`
2. Export from [core/index.ts](core/index.ts) for user access
3. Follow hybrid pattern: `.astro` wrapper + `.tsx` client + `Mdx.tsx` variant
4. Add TypeScript types to `types.ts`, document in `README.md`

### Customizing for Users
Users override core by:
- Importing core components: `import { DataTb } from '@core'`
- Creating parallel components in `usr/components/` with same name
- Modifying `usr/layouts/` to wrap core layouts

## TypeScript Conventions

- Strict mode enabled (`strictNullChecks: true`)
- Use Zod for runtime validation in content schemas
- Export types from component `types.ts` files
- React components use `type` imports: `import type { DataTbProps } from './types'`

## Styling Approach

- Tailwind CSS via `@astrojs/tailwind` integration
- Global styles in `usr/styles/global.css` (user) and `core/styles/global.css` (framework)
- Components use Tailwind classes directly, no CSS modules
- Typography plugin enabled for prose content

## Critical Files

- [astro.config.mjs](astro.config.mjs): Main config with merge logic
- [usr/user.config.mjs](usr/user.config.mjs): User overrides (site URL, metadata)
- [usr/content/config.ts](usr/content/config.ts): Content collection schemas
- [core/index.ts](core/index.ts): Core package exports
- [core/utils/data-fetcher.ts](core/utils/data-fetcher.ts): Unified data loading

## Common Pitfalls

- **Don't edit `core/` directly** in user projects; changes will be lost on updates
- **Always use path aliases** (`@core`, `@user`) instead of relative paths
- **Wrap React components** in `<Component client:idle />` for hydration in Astro
- **Check `client:` directive** requirements; interactive components need explicit directives
- **Stringify source objects** in `useEffect` deps to prevent infinite re-renders (see [DataTb.tsx](core/components/DataTb/DataTb.tsx#L55))

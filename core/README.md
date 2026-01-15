# Core Package (optional approach)

If you want to publish the core as a separate npm package, this directory can be published independently.

## Publishing as NPM Package

1. Create a separate `package.json` in this directory:

```json
{
  "name": "@lad-sapienza/scms-astro-core",
  "version": "1.0.0",
  "description": "Core components and utilities for s:CMS Astro",
  "type": "module",
  "exports": {
    ".": "./index.ts",
    "./components/*": "./components/*",
    "./layouts/*": "./layouts/*",
    "./utils/*": "./utils/*",
    "./integrations/*": "./integrations/*",
    "./types": "./types/index.ts"
  },
  "keywords": ["astro", "cms", "components", "astro-integration"],
  "author": "LAD @Sapienza",
  "license": "BSD-0-Clause"
}
```

2. Publish to npm:

```bash
cd core
npm publish --access public
```

3. Users can then install:

```bash
npm install @lad-sapienza/scms-astro-core
```

## Git Submodule Approach

Alternatively, maintain core as a git submodule:

```bash
# In the main project
git submodule add https://github.com/lad-sapienza/scms-core.git core

# Users update core
git submodule update --remote core
```

## Local Development

For local development, keep the core directory as-is. The path aliases in `tsconfig.json` and `astro.config.mjs` will handle imports from `@core/*`.

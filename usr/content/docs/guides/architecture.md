---
title: Architecture
description: s:CMS system architecture and design patterns
order: 2
---

# Architecture

s:CMS separates **framework code** from **your site** so that framework updates never overwrite your work.

## The core / usr split

```
sCMS/
├── core/                      # Framework — do not edit
│   ├── components/            # DataTb, Map, Gallery, SEO, TableOfContents, Record, …
│   ├── integrations/          # Astro integrations (content assets, Directus loader)
│   ├── utils/                 # Directus / data-fetching helpers
│   └── types/                 # TypeScript definitions
│
├── usr/                       # Your site — always preserved
│   ├── content.config.ts      # Collection schemas (Zod)
│   ├── user.config.mjs        # Site configuration
│   ├── content/                # Your content (blog, docs, data, …)
│   ├── components/             # Your custom components
│   ├── layouts/                 # Your layouts
│   ├── pages/                   # Your routes
│   ├── public/                  # Static assets
│   └── styles/global.css        # Your stylesheet
│
├── scripts/                    # Scaffolding & update automation
├── astro.config.mjs             # Astro config — imports both core integrations and usr settings
├── tsconfig.json
└── package.json
```

- **`core/`** contains every reusable component, integration, and utility. It's what `npm run update-scms` overwrites when you pull a new s:CMS release.
- **`usr/`** contains everything specific to your site: content, pages, layouts, styling, and configuration. It is never touched by the update script.
- Components are consumed from `core/` via the `@lad-sapienza/scms-core` import alias (configured in `astro.config.mjs` / `tsconfig.json`), so your MDX files write `import { DataTb } from '@lad-sapienza/scms-core'` rather than a relative path into `core/`.

This is a convention enforced by the update tooling, not a hard technical boundary — nothing stops you from editing files inside `core/`, but doing so means your changes will be silently overwritten (or need manual reconciliation) the next time you run `npm run update-scms`. Keep all customization in `usr/`.

## Configuration

`astro.config.mjs` at the project root wires together the framework's Astro integrations (from `core/integrations/`) with your site settings from `usr/user.config.mjs`. You generally don't need to edit `astro.config.mjs` directly — site-level settings (URL, base path, metadata) belong in `usr/user.config.mjs`.

## Content collections

Collections are declared with Zod schemas in `usr/content.config.ts`. Each collection maps to a folder under `usr/content/` and gets a listing + detail route under `usr/pages/`. See [Managing Content](managing-content.md) for the full workflow, including the `npm run add-collection` / `npm run add-content` scaffolding scripts.

## Keeping the core up to date

Framework updates are pulled with `npm run update-scms`, which fetches the latest `core/` (and other shared files) from the upstream `lad-sapienza/sCMS` repository while leaving `usr/` untouched. See [Updating](updating.md) for the full mechanics, backup/rollback process, and how to handle your own npm dependencies across updates.

## Deployment

s:CMS builds to a static `dist/` folder (`npm run build`) that can be hosted anywhere — GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a plain file server. See [Deployment](deployment.md) for platform-specific instructions.

## Getting help

- [GitHub Discussions](https://github.com/lad-sapienza/sCMS/discussions)
- [Issue Tracker](https://github.com/lad-sapienza/sCMS/issues)

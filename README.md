# s:CMS - Astro Edition

A static site Content Management System developed and maintained by [LAD: Laboratorio di Archeologia Digitale alla Sapienza](https://lad.saras.uniroma1.it).

## 🚀 Features

- **📝 Content Collections**: Type-safe content management with automatic validation
- **🗺️ Interactive Maps**: Display geographical data with Leaflet integration
- **🔍 Search Functionality**: Build powerful search interfaces with custom templates
- **📊 Data Tables**: Create customizable tables from databases or static files
- **🖼️ Image Galleries**: Responsive galleries with lightbox functionality
- **🔌 Directus Integration**: Connect to Directus CMS for dynamic content
- **⚡ Lightning Fast**: Built on Astro for optimal performance
- **🎨 Fully Customizable**: Override any component or layout
- **🔄 Updateable Core**: Separate core from user files for easy updates

## 📁 Project Structure

```
scms/
├── core/                     # Core system (updateable)
│   ├── components/           # Core components (DataTb, Search, etc.)
│   ├── layouts/             # Base layouts
│   ├── utils/               # Utility functions
│   ├── integrations/        # Custom Astro integrations
│   └── types/               # TypeScript type definitions
│
├── usr/
│   ├── content/             # Your content
│   │   ├── config.ts        # Collection schemas
│   │   └── <collection>/    # One folder per content collection
│   │
│   ├── components/          # Your custom components
│   ├── layouts/             # Your custom layouts
│   ├── pages/               # Page routes
│   │   ├── index.astro      # Homepage
│   │   └── [...slug].astro  # Dynamic content pages
│   │
│   └── styles/              # Your styles
│       └── global.css
│
├── public/                  # Static assets
├── astro.config.mjs        # Astro configuration (merges core + user)
├── usr/user.config.mjs     # User configuration (edit this!)
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, pnpm, or yarn

### Installation

1. **Clone or download this repository**

```bash
git clone https://github.com/lad-sapienza/sCMS.git my-project
cd my-project
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure your site**

Edit `usr/user.config.mjs` to set your site's metadata:

```javascript
export const siteMetadata = {
  site: 'https://yourdomain.com',
  title: 'Your Site Title',
  description: 'Your site description',
  author: 'Your Name',
};
```

4. **Set up environment variables (optional)**

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` to add your Directus credentials:

```env
PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
PUBLIC_DIRECTUS_TOKEN=your-directus-token
```

5. **Start the development server**

```bash
npm run dev
```

Your site will be available at `http://localhost:4321`

## 📝 Creating Content

### Documentation Pages

Create `.md` or `.mdx` files in `usr/content/docs/`:

```markdown
---
title: "My Page"
description: "Page description"
menu_position: 1
date: 2026-01-13
---

# My Page Content

Your content here...
```

### Blog Posts

Create `.md` or `.mdx` files in `usr/content/blog/`:

```markdown
---
title: "My Blog Post"
description: "Post description"
date: 2026-01-13
author: "Your Name"
tags: ["astro", "cms"]
---

Your blog post content...
```

### Using Components

Import and use core components in your content:

```mdx
---
title: "Example Page"
---

import { DataTb, Map } from '@core';

# My Data

<DataTb 
  source={{ directus: { table: 'your_table' } }}
  columns={['id', 'name', 'description']}
  client:idle
/>
```

## 🔧 Configuration

### User Configuration

Edit `usr/user.config.mjs` to customize your site. This file is merged with the core configuration, allowing you to:

- Override site metadata
- Add custom integrations
- Modify Vite configuration
- Customize markdown settings

### Content Collections

Edit `usr/content/config.ts` to define your content schemas with Zod validation:

```typescript
import { defineCollection, z } from 'astro:content';

const myCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './usr/content/my-collection' }),
  schema: z.object({
    title: z.string(),
    // Add your fields
  }),
});
```

## 🔌 Directus Integration

### Using the Directus Loader

```typescript
// usr/content/config.ts
import { directusLoader } from '@core/integrations/directusLoader';

const products = defineCollection({
  loader: directusLoader({
    table: 'products',
    fields: ['id', 'name', 'description', 'price'],
    sort: ['-date_created'],
  }),
});
```

### Using Directus in Components

```astro
---
import { DataTb, DirectusSource } from '@core';
---

<DataTb searchable pagination client:idle>
  <DirectusSource 
    table="articles" 
    queryString="filter[status][_eq]=published" 
  />
</DataTb>
/>
```

## 🎨 Customization

### Override Core Components

Create a component with the same name in `usr/components/` to override core components.

### Extend Layouts

```astro
---
import BaseLayout from '@core/layouts/BaseLayout.astro';
---

<BaseLayout title="My Page">
  <div slot="header-extra">
    Custom header content
  </div>
  
  <slot />
</BaseLayout>
```

### Custom Styles

Add your styles to `usr/styles/global.css` or create component-specific styles.

## �️ Scaffolding Scripts

Two interactive CLI scripts help you add new content to the project without editing config files by hand. Both run with Node.js — no extra dependencies or shell required.

### `npm run add-collection`

Scaffolds a **complete new Astro content collection** from scratch:

1. Reads `usr/content/config.ts` and lists existing collections.
2. Prompts for:
   - **Collection name** — lowercase letters, numbers, and hyphens (e.g. `my-news`).
   - **Collection type** — choose one of three presets:
     | Type | Schema fields |
     |------|--------------|
     | `blog` | `title`, `description`, `date`, `author`, `tags`, `image`, `draft` |
     | `docs` | `title`, `description`, `order`, `category`, `draft` |
     | `generic` | `title`, `description`, `draft` |
3. Creates or updates the following files:

   | File | What it does |
   |------|--------------|
   | `usr/content/config.ts` | Adds the new `defineCollection` block and registers it in the exports |
   | `usr/content/<name>/sample-{post,doc,entry}.md` | A sample Markdown file with pre-filled frontmatter |
   | `usr/pages/<name>/index.astro` | Listing page for the collection |
   | `usr/pages/<name>/[...slug].astro` | Detail page for individual entries |

After running, review the generated schema in `usr/content/config.ts` — the `TODO` comment marks where you can customise the fields — and edit the page templates in `usr/pages/<name>/` to match your design.

---

### `npm run add-content`

Adds a **single new content file** to an existing collection:

1. Lists all collections that have a content directory under `usr/content/`.
2. Prompts for:
   - **Collection** — pick by name or number from the list.
   - **File format** — `md` or `mdx` (defaults to whichever is already used in the collection).
   - **Slug** — becomes both the file name and the URL path; subfolders are supported (e.g. `guides/my-topic`).
   - **Frontmatter fields** — detected automatically from the Zod schema in `usr/content/config.ts`. Each field is prompted interactively with smart defaults (`date` → today, `author` → `git config user.name`, `draft` → `true`). Optional fields can be skipped by pressing Enter.
3. Writes the file to `usr/content/<collection>/<slug>.<ext>` with:
   - A complete YAML frontmatter block
   - A `# Title` heading
   - A `<!-- Write your content here -->` placeholder

After running, open the created file, write your content, and set `draft: false` when it is ready to publish.

---

## �🚀 Building for Production

```bash
npm run build
```

The built site will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📦 Updating the Core

Run the built-in update script to pull the latest core from upstream while preserving your `usr/` customizations:

```bash
npm run update-scms
```

## 🧰 Available Components

### DataTb
Display data in sortable, filterable tables with modern React-based interface

### Map
Interactive maps with MapLibre GL JS and vector layers

### Gallery
Responsive image galleries with lightbox

See [Components Documentation](usr/content/docs/components.md) for detailed usage.

## 🗂️ Core Architecture

This starter uses a **core/user separation** pattern:

- **Core files** (`core/`) contain the framework components and utilities
- **User files** (`usr/`) contain your content and customizations
- Core can be updated without affecting your customizations
- You can override any core component by creating a file with the same name

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request on GitHub.

## 📄 License

BSD-0-Clause - see [LICENSE](LICENSE) file for details.

## 👥 Credits

Built with ♥ by [LAD @Sapienza](https://lad.saras.uniroma1.it)

- **Framework**: [Astro](https://astro.build/)
- **Original Gatsby Version**: [lad-sapienza/scms](https://github.com/lad-sapienza/scms)

## 🆘 Support

- **Documentation**: Check the [docs](usr/content/docs/)
- **GitHub Issues**: [Report bugs or request features](https://github.com/lad-sapienza/sCMS/issues)
- **Contact**: LAD @Sapienza

---

**Happy building! 🚀**

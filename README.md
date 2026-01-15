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
scms-astro/
├── core/                     # Core system (updateable)
│   ├── components/           # Core components (DataTable, Search, etc.)
│   ├── layouts/             # Base layouts
│   ├── utils/               # Utility functions
│   ├── integrations/        # Custom Astro integrations
│   └── types/               # TypeScript type definitions
│
├── src/
│   ├── content/             # Your content
│   │   ├── config.ts        # Collection schemas
│   │   ├── docs/            # Documentation pages (.md, .mdx)
│   │   ├── blog/            # Blog posts (.md, .mdx)
│   │   └── data/            # Data files (.json, .yaml, .csv)
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
├── user.config.mjs         # User configuration (edit this!)
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
git clone https://github.com/lad-sapienza/scms-astro.git my-project
cd my-project
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure your site**

Edit `user.config.mjs` to set your site's metadata:

```javascript
export const userConfig = {
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
DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_TOKEN=your-directus-token
```

5. **Start the development server**

```bash
npm run dev
```

Your site will be available at `http://localhost:4321`

## 📝 Creating Content

### Documentation Pages

Create `.md` or `.mdx` files in `src/content/docs/`:

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

Create `.md` or `.mdx` files in `src/content/blog/`:

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

import { DataTable, Search, MapLeaflet } from '@core';

# My Data

<DataTable 
  source={{ directus: { table: 'your_table' } }}
  columns={['id', 'name', 'description']}
/>
```

## 🔧 Configuration

### User Configuration

Edit `user.config.mjs` to customize your site. This file is merged with the core configuration, allowing you to:

- Override site metadata
- Add custom integrations
- Modify Vite configuration
- Customize markdown settings

### Content Collections

Edit `src/content/config.ts` to define your content schemas with Zod validation:

```typescript
import { defineCollection, z } from 'astro:content';

const myCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/my-collection' }),
  schema: z.object({
    title: z.string(),
    // Add your fields
  }),
});
```

## 🔌 Directus Integration

### Using the Directus Loader

```typescript
// src/content/config.ts
import { directusLoader } from '../core/integrations/directusLoader';

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
import { DataTable } from '@core';
---

<DataTable
  source={{
    directus: {
      table: 'articles',
      queryString: 'filter[status][_eq]=published'
    }
  }}
/>
```

## 🎨 Customization

### Override Core Components

Create a component with the same name in `src/components/` to override core components.

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

Add your styles to `src/styles/global.css` or create component-specific styles.

## 🚀 Building for Production

```bash
npm run build
```

The built site will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📦 Updating the Core

If the core is maintained as a separate package or git submodule:

```bash
# If using npm package
npm update @yourorg/scms-astro-core

# If using git submodule
git submodule update --remote core
```

## 🧰 Available Components

### DataTable
Display data in sortable, filterable tables

### Search
Full-text search with custom result templates

### MapLeaflet
Interactive maps with Leaflet.js

### VectorLayer
Add vector layers to maps

### Gallery
Responsive image galleries with lightbox

### Record & Field
Display individual record details

See [Components Documentation](src/content/docs/components.md) for detailed usage.

## 🗂️ Core Architecture

This starter uses a **core/user separation** pattern:

- **Core files** (`core/`) contain the framework components and utilities
- **User files** (`src/`) contain your content and customizations
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

- **Documentation**: Check the [docs](src/content/docs/)
- **GitHub Issues**: [Report bugs or request features](https://github.com/lad-sapienza/scms-astro/issues)
- **Contact**: LAD @Sapienza

---

**Happy building! 🚀**

# Migration Guide: Gatsby to Astro

This guide helps you understand the differences between the Gatsby version of s:CMS and the new Astro version.

## Key Changes

### 1. Framework Change

**Gatsby (Old)**
- React-based SSG
- GraphQL for data queries
- Runtime JavaScript for all pages

**Astro (New)**
- Multi-framework support (React, Vue, Svelte, etc.)
- Direct imports instead of GraphQL
- Zero JavaScript by default, opt-in for interactivity

### 2. Content Management

**Gatsby**
```javascript
// gatsby-node.js - Complex setup
const result = await graphql(`
  query {
    allMdx {
      nodes {
        frontmatter { slug, title }
      }
    }
  }
`)
```

**Astro**
```typescript
// src/content/config.ts - Simple, type-safe
import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});
```

### 3. File Structure

**Gatsby**
```
gatsby-project/
├── src/
│   ├── pages/
│   ├── templates/
│   ├── modules/       # s:CMS components
│   └── usr/
│       ├── contents/  # MDX files
│       ├── layout/
│       └── images/
├── gatsby-config.js
├── gatsby-node.js
└── gatsby-browser.js
```

**Astro**
```
astro-project/
├── core/              # Updateable core system
│   ├── components/
│   ├── layouts/
│   └── utils/
├── src/
│   ├── content/       # Content Collections
│   │   ├── config.ts
│   │   └── docs/
│   ├── components/    # User components
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
└── user.config.mjs    # User overrides
```

### 4. Component Syntax

**Gatsby (React/JSX)**
```jsx
import React from 'react';

const MyComponent = ({ title, children }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default MyComponent;
```

**Astro**
```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="my-component">
  <h2>{title}</h2>
  <slot />
</div>

<style>
  .my-component {
    /* Scoped styles */
  }
</style>
```

### 5. Data Fetching

**Gatsby**
```jsx
import { useStaticQuery, graphql } from 'gatsby';

const Component = () => {
  const data = useStaticQuery(graphql`
    query {
      allMdx {
        nodes { frontmatter { title } }
      }
    }
  `);
  
  return <div>{/* render */}</div>;
};
```

**Astro**
```astro
---
import { getCollection } from 'astro:content';

const docs = await getCollection('docs');
---

<div>
  {docs.map(doc => (
    <h2>{doc.data.title}</h2>
  ))}
</div>
```

### 6. Routing

**Gatsby**
- Uses `gatsby-node.js` to create pages
- File-based routing in `src/pages/`
- Frontmatter `slug` field required

**Astro**
- File-based routing in `src/pages/`
- Dynamic routes with `[...slug].astro`
- Automatic route generation from Content Collections

### 7. Images

**Gatsby**
```jsx
import { StaticImage } from 'gatsby-plugin-image';

<StaticImage
  src="../images/photo.jpg"
  alt="Description"
/>
```

**Astro**
```astro
---
import { Image } from 'astro:assets';
import photo from '../images/photo.jpg';
---

<Image src={photo} alt="Description" />
```

### 8. Directus Integration

**Gatsby**
- Custom services in `src/services/directus/`
- Runtime data fetching with fetch API

**Astro**
- Content Loader API for build-time data
- Runtime fetching with core utilities
- Type-safe with Zod schemas

```typescript
import { directusLoader } from '../core/integrations/directusLoader';

const products = defineCollection({
  loader: directusLoader({
    table: 'products',
  }),
});
```

## Migration Steps

### Step 1: Set Up New Project

```bash
# Create new Astro project from template
git clone https://github.com/lad-sapienza/scms-astro.git my-new-site
cd my-new-site
npm install
```

### Step 2: Migrate Configuration

**Old: `gatsby-config.js`**
```javascript
module.exports = {
  siteMetadata: {
    title: `My Site`,
    description: `Site description`,
  },
};
```

**New: `user.config.mjs`**
```javascript
export const userConfig = {
  title: 'My Site',
  description: 'Site description',
};
```

### Step 3: Migrate Content

1. **Move MDX files**:
   ```bash
   # From Gatsby
   src/usr/contents/*.mdx
   
   # To Astro
   src/content/docs/*.mdx
   ```

2. **Update frontmatter**:
   - `slug` is now optional (auto-generated from filename)
   - `menu_position` works the same way
   - Add type-safe fields defined in `src/content/config.ts`

### Step 4: Migrate Components

**Gatsby Component**
```jsx
// src/modules/myComponent.js
export const MyComponent = ({ data }) => {
  return <div>{data.title}</div>;
};
```

**Astro Component**
```astro
---
// src/components/MyComponent.astro
interface Props {
  data: { title: string };
}
const { data } = Astro.props;
---

<div>{data.title}</div>
```

Or keep it as React:
```jsx
// src/components/MyComponent.jsx
export default function MyComponent({ data }) {
  return <div>{data.title}</div>;
}
```

### Step 5: Migrate Layouts

**Gatsby**
```jsx
// src/usr/layout/layout.js
import React from 'react';
import Header from './header';
import Footer from './footer';

const Layout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);
```

**Astro**
```astro
---
// src/layouts/Layout.astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<html>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### Step 6: Update Data Queries

Replace GraphQL queries with Content Collections:

**Before (Gatsby)**
```jsx
const data = useStaticQuery(graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        frontmatter { title, date }
      }
    }
  }
`);
```

**After (Astro)**
```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const sorted = posts.sort((a, b) => 
  b.data.date.valueOf() - a.data.date.valueOf()
);
---
```

### Step 7: Interactive Components

For components that need client-side JavaScript:

```astro
---
import SearchComponent from '../components/Search.jsx';
---

<!-- Add client directive for interactivity -->
<SearchComponent client:load />
```

## Component Mapping

| Gatsby (Old) | Astro (New) | Notes |
|--------------|-------------|-------|
| `DataTb` | `DataTable` | Same functionality, new syntax |
| `MapLeaflet` | `MapLeaflet` | Use with `client:load` |
| `VectorLayer` | `VectorLayer` | Works inside `MapLeaflet` |
| `Search` | `Search` | Enhanced with better UX |
| `Record` | `Record` | Same API |
| `Field` | `Field` | Same API |
| `MyGallery` | `Gallery` | Renamed, same features |
| `Seo` | Built-in | Use Astro's `<head>` tags |

## Performance Improvements

The Astro version offers significant performance improvements:

1. **Zero JS by Default**: Only components with `client:*` directives ship JavaScript
2. **Faster Build Times**: Content Collections are pre-built and cached
3. **Better Caching**: Static assets are optimized automatically
4. **Smaller Bundle**: Only load what you need

## Common Issues

### Issue: MDX imports not working

**Solution**: Update import syntax
```astro
---
// Old (Gatsby)
import { MyComponent } from "../../modules/scms"

// New (Astro)
import { MyComponent } from '@core';
---
```

### Issue: GraphQL queries

**Solution**: Replace with Content Collections
```typescript
// No more GraphQL!
const data = await getCollection('docs');
```

### Issue: Runtime data fetching

**Solution**: Use Astro's fetch in component frontmatter
```astro
---
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---
```

## Need Help?

- Check the [Astro documentation](https://docs.astro.build)
- Review [example pages](src/content/docs/)
- Open an issue on GitHub

---

**Happy migrating! 🚀**

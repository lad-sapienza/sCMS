---
title: "Getting Started"
description: "From zero to a running site — no coding experience required."
order: 1
---

This guide walks you through everything you need — no coding experience required. By the end you will have a working website with your own content, published for free on GitHub Pages.

---

### What you will need

- A free [GitHub](https://github.com) account
- [Node.js](https://nodejs.org) installed on your computer (choose the "LTS" version)
- A code editor — [Visual Studio Code](https://code.visualstudio.com) is free and easy to use
- About 30 minutes

---

### Step 1 — Get a copy of s:CMS

1. Go to the [s:CMS repository on GitHub](https://github.com/lad-sapienza/sCMS).
2. Click the green **"Use this template"** button, then **"Create a new repository"**.
3. Give your repository a name (e.g. `my-site`), keep it **Public**, and click **"Create repository"**.
4. On your computer, open a terminal (on Mac: Terminal app; on Windows: Command Prompt or PowerShell) and run:

```bash
git clone https://github.com/YOUR-USERNAME/my-site.git
cd my-site
npm install
```

> Replace `YOUR-USERNAME` with your GitHub username and `my-site` with your repository name.

Once installation finishes, start the local preview server:

```bash
npm run dev
```

Open your browser at **http://localhost:4321** — you should see the s:CMS default homepage.

---

### Step 2 — Make the site yours

Open the file `usr/user.config.mjs` in your code editor. You will see two sections to fill in:

```js
export const userConfig = {
  site: 'https://YOUR-USERNAME.github.io/my-site', // ← your future website URL
};

export const siteMetadata = {
  title: 'My Research Site',          // ← name shown in the browser tab and header
  description: 'A short description', // ← used by search engines
  author: 'Your Name',
};
```

Save the file. The preview in your browser updates automatically.

---

### Step 3 — Add your content

All your content lives inside `usr/content/`. The folder is already organised into collections:

| Folder | What goes here |
|---|---|
| `usr/content/blog/` | Articles, news, posts |
| `usr/content/docs/` | Documentation, guides |
| `usr/content/data/` | CSV, JSON or YAML data files |

#### Creating a blog post

Create a new file, for example `usr/content/blog/my-first-post.md`, and paste this template:

```markdown
---
title: 'My First Post'
description: 'A short description of this post'
date: 2026-01-01
author: 'Your Name'
tags: ['news']
---

Write your content here in plain text.

## A section heading

More text, **bold**, *italic*, [a link](https://example.com).
```

The block between the `---` lines is called **frontmatter** — it holds the metadata for your post. Everything below it is your article text, written in plain [Markdown](https://www.markdownguide.org/basic-syntax/).

Save the file and check **http://localhost:4321/blog** — your post appears immediately.

#### Adding images

Place image files next to your content file, inside the same folder:

```
usr/content/blog/
├── my-first-post.md
└── my-first-post/
    └── photo.jpg
```

Then reference them in your post with a standard Markdown image tag:

```markdown
![Photo caption](./my-first-post/photo.jpg)
```

No extra copy steps needed — s:CMS handles the rest.

---

### Step 4 — Create a new collection (optional)

If `blog` and `docs` do not fit your needs, you can create your own collection. The following example creates a `projects` collection.

**4a.** Create the folder `usr/content/projects/` and add a Markdown file inside it, e.g. `project-one.md`:

```markdown
---
title: 'Project One'
description: 'A short description'
date: 2026-01-01
---

Project details here.
```

**4b.** Open `usr/content/config.ts` and register the new collection by adding a few lines:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './usr/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = {
  blog: blogCollection,
  docs: docsCollection,
  data: dataCollection,
  projects: projectsCollection, // ← add this line
};
```

**4c.** Create the page `usr/pages/projects/index.astro` to list all projects. Use the existing `usr/pages/blog/index.astro` as a starting point — copy it, then replace every occurrence of `'blog'` with `'projects'` and adjust the title text.

---

### Step 5 — Customise the navigation menu

Open `usr/layouts/BaseLayout.astro`. Near the top you will find a `menuItems` array — edit it to add or remove links:

```js
const menuItems = [
  { href: '/',         label: 'Home',     isActive: currentPath === '/' },
  { href: '/blog',     label: 'Blog',     isActive: currentPath.startsWith('/blog') },
  { href: '/projects', label: 'Projects', isActive: currentPath.startsWith('/projects') },
];
```

---

### Step 6 — Publish to GitHub Pages

**6a.** In your repository on GitHub, go to **Settings → Pages**. Under "Source", select **"GitHub Actions"**.

**6b.** In your code editor, create the file `.github/workflows/deploy.yml` with this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/
      - id: deployment
        uses: actions/deploy-pages@v4
```

**6c.** If your repository is not at the root of a domain (e.g. it will live at `https://username.github.io/my-site` rather than `https://username.github.io`), open `usr/user.config.mjs` and also set the `base` path:

```js
export const userConfig = {
  site: 'https://YOUR-USERNAME.github.io/my-site',
  base: '/my-site',  // ← uncomment and fill in your repository name
};
```

**6d.** Commit and push everything to GitHub:

```bash
git add .
git commit -m "Initial site setup"
git push
```

GitHub Actions will build and deploy your site automatically. After about a minute, visit `https://YOUR-USERNAME.github.io/my-site` — your site is live.

From now on, every time you push a change to the `main` branch, the site rebuilds and publishes itself.

---

### Quick reference

| Task | What to edit |
|---|---|
| Site title, description, author | `usr/user.config.mjs` |
| Navigation links | `usr/layouts/BaseLayout.astro` |
| Blog posts | `usr/content/blog/*.md` |
| Documentation pages | `usr/content/docs/*.md` |
| Register a new collection | `usr/content/config.ts` |
| Global colours and fonts | `usr/styles/global.css` |

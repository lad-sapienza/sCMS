# Deployment & Updates

## Quick Start - Deploy Your Site

s:CMS can be deployed to any static hosting platform. Choose your preferred option below.

### GitHub Pages

**Option 1: GitHub Actions (Recommended)**

1. **Configure your site URL** in `usr/user.config.mjs`:
   ```js
   export const siteMetadata = {
     siteUrl: 'https://username.github.io/repo-name',
   }
   ```

2. **Create GitHub Actions workflow**:
   Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]
  
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build with Astro
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Enable GitHub Pages** in repo settings:
   - Settings → Pages → Source: GitHub Actions

4. **Push to GitHub** - automatic deployment on every push

**Option 2: Manual Build & Deploy**

```bash
npm run build
# Upload dist/ folder to GitHub Pages via gh-pages branch
npx gh-pages -d dist
```

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

**With Environment Variables:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# Optional: Set environment variables
# DIRECTUS_URL = "https://your-directus.com"
# DIRECTUS_TOKEN = "your-token"
```

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Import your GitHub repository
2. Framework Preset: Astro
3. Deploy

**With Environment Variables:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

Add secrets in Vercel dashboard: Settings → Environment Variables

### Cloudflare Pages

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Deploy

**With Environment Variables:**
Add in Cloudflare dashboard: Settings → Environment variables

### Traditional Hosting (FTP/SSH)

```bash
# Build locally
npm run build

# Upload dist/ folder to your server
# Via FTP, rsync, or your hosting panel
```

## Managing Secrets & Environment Variables

If your site uses Directus, external APIs, or other services requiring credentials, **never commit secrets to your repository**.

### Local Development

Create `.env` file (gitignored by default):

```bash
# .env
DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_TOKEN=your_secret_token
PUBLIC_SITE_URL=http://localhost:4321
```

Access in your code:
```js
import.meta.env.DIRECTUS_URL
import.meta.env.DIRECTUS_TOKEN
import.meta.env.PUBLIC_SITE_URL // Available in client code
```

### GitHub Actions Deployment

Add secrets to your repository:

1. Go to: Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add your secrets (e.g., `DIRECTUS_TOKEN`)

Update your workflow to use secrets:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # ... other steps ...
      
      - name: Build with Astro
        run: npm run build
        env:
          DIRECTUS_URL: ${{ secrets.DIRECTUS_URL }}
          DIRECTUS_TOKEN: ${{ secrets.DIRECTUS_TOKEN }}
          PUBLIC_SITE_URL: ${{ vars.PUBLIC_SITE_URL }}
```

**Note:** Use `secrets` for sensitive data, `vars` for non-sensitive configuration.

### Platform-Specific Secrets

**Netlify:**
- Dashboard → Site settings → Environment variables
- Or via `netlify.toml`:
```toml
[context.production.environment]
  PUBLIC_SITE_URL = "https://yourdomain.com"
```

**Vercel:**
- Dashboard → Project Settings → Environment Variables
- Set for: Production, Preview, Development

**Cloudflare Pages:**
- Dashboard → Settings → Environment variables
- Separate settings for Production and Preview

### Security Best Practices

1. ✅ **Never commit `.env` files** - Already in `.gitignore`
2. ✅ **Use `PUBLIC_` prefix** for client-side variables only
3. ✅ **Rotate secrets regularly** - Especially after team changes
4. ✅ **Use different secrets per environment** - Production vs. Preview
5. ❌ **Don't log secrets** - Be careful with console.log in production
6. ❌ **Don't expose server-side secrets** - Keep them in `.env`, not in public code

### Example: Directus Integration with Secrets

**usr/content/config.ts:**
```typescript
import { defineCollection } from 'astro:content';
import { directusLoader } from '@core/integrations/directusLoader';

const articlesCollection = defineCollection({
  loader: directusLoader({
    url: import.meta.env.DIRECTUS_URL,
    token: import.meta.env.DIRECTUS_TOKEN,
    collection: 'articles',
  }),
});

export const collections = {
  articles: articlesCollection,
};
```

**Required secrets:**
- `DIRECTUS_URL` - Your Directus instance URL
- `DIRECTUS_TOKEN` - Static token with read permissions

## Custom Build Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "build:prod": "astro check && astro build",
    "build:preview": "astro build --mode preview",
    "deploy": "npm run build && npx gh-pages -d dist"
  }
}
```

## Continuous Deployment Options

### Option 1: Direct Git Push
- GitHub Pages, Netlify, Vercel auto-deploy on git push

### Option 2: GitHub Actions (Custom)
Create `.github/workflows/deploy.yml` with your platform-specific deployment

### Option 3: Platform CLI
```bash
# Netlify
npm install -g netlify-cli
netlify deploy --prod

# Vercel
npm install -g vercel
vercel --prod
```

## Troubleshooting Deployment

### Build Fails

**Check Node version:**
```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: "20"  # Match your local version
```

**Check dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Site Shows 404

**For GitHub Pages project sites**, set base in `astro.config.mjs`:
```js
export default {
  site: 'https://username.github.io',
  base: '/repo-name',
}
```

**For custom domains**, no base needed:
```js
export default {
  site: 'https://yourdomain.com',
}
```

### Environment Variables Not Working

- ✅ Restart dev server after adding `.env`
- ✅ Use `PUBLIC_` prefix for client-side access
- ✅ Check variable names match exactly (case-sensitive)
- ✅ Verify secrets are set in deployment platform

### Images Not Loading

**Check image paths:**
- Use `/images/photo.jpg` for files in `usr/public/images/`
- Use relative paths `./photo.jpg` for images next to content
- Astro optimizes images automatically

## Performance Optimization

### Build Optimization

```js
// astro.config.mjs
export default {
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
}
```

### Caching Strategy

**For GitHub Actions:**
```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: npm  # Caches node_modules
```

**For Netlify/Vercel:**
- Built-in caching enabled automatically
- Clear cache in settings if needed

## Keeping s:CMS Up-to-Date

s:CMS uses a **core/usr architecture** that keeps framework updates separate from your content.

### First Time Setup

After creating your site from the template:

```bash
npm run setup-upstream
```

This configures the connection to receive s:CMS updates.

### Updating to Latest Version

```bash
npm run update-core
```

This script will:
- Create a backup of your current code
- Fetch the latest s:CMS version
- Merge updates while **protecting your `usr/` folder**
- Install new dependencies if needed

Your content and customizations in `usr/` are **never overwritten**! 🛡️

### What Gets Updated

| Path | Status | Description |
|------|--------|-------------|
| `core/**` | ✅ Updated | Framework components & utilities |
| `usr/**` | 🛡️ Protected | Your content & customizations |
| `package.json` | ⚠️ Review | May need manual dependency merge |
| `astro.config.mjs` | ✅ Auto-merges | Uses coreConfig + userConfig pattern |

### Detailed Documentation

For complete update instructions, troubleshooting, and conflict resolution:

📖 **[Read the full Update Guide](docs/UPDATING.md)**

## Best Practices

1. **Update regularly** - Smaller updates are easier to merge
2. **Test locally** - Always run `npm run dev` after updating
3. **Read changelogs** - Review what's changing in each release
4. **Don't edit core/** - Make all customizations in `usr/`

---

Need help? Check out [docs/UPDATING.md](docs/UPDATING.md) for detailed instructions!

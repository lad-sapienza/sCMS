# s:CMS Update & Deployment System

## Overview

s:CMS uses a **core/usr separation architecture** that allows you to:
- ✅ Receive framework updates without losing customizations
- 🛡️ Keep your content and configurations protected
- 🚀 Deploy to any platform (GitHub Pages, Netlify, Vercel, etc.)

## Quick Commands

```bash
# One-time setup (after creating from template)
npm run setup-upstream

# Update to latest s:CMS version
npm run update-core

# Deploy
git push  # Auto-deploys via GitHub Actions
```

## File Structure

```
s:CMS/
├── core/              # ❌ Framework code (receives updates)
│   ├── components/    # React & Astro components
│   ├── layouts/       # Base layouts
│   └── utils/         # Framework utilities
│
├── usr/               # ✅ Your code (always protected)
│   ├── content/       # Your content (MDX, blog posts)
│   ├── pages/         # Your pages
│   ├── components/    # Your custom components
│   ├── layouts/       # Your custom layouts
│   ├── public/        # Your static assets
│   └── user.config.mjs # Your site configuration
│
├── scripts/           # Update automation scripts
│   ├── setup-upstream.sh
│   └── update-core.sh
│
├── docs/
│   ├── UPDATING.md    # Detailed update guide
│   └── DEPLOYMENT.md  # Deployment instructions
│
└── .gitattributes     # Protects usr/ during merges
```

## How It Works

### 1. Protected Folders
`.gitattributes` tells git to preserve `usr/**` during merges:
```
usr/** merge=ours
```

### 2. Update Script
`npm run update-core` automates:
1. Creates backup branch
2. Fetches latest s:CMS release
3. Merges with `usr/` protection
4. Installs new dependencies
5. Shows what changed

### 3. Merged Configs
`astro.config.mjs` combines core + user settings:
```js
import coreConfig from './core/core.config.mjs'
import userConfig from './usr/user.config.mjs'
export default merge(coreConfig, userConfig)
```

## Update Workflow

```
┌─────────────────────────────────────────┐
│ 1. Run: npm run update-core             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. Script creates backup branch         │
│    backup-before-update-TIMESTAMP       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. Fetches latest from upstream         │
│    github.com/lad-sapienza/sCMS         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 4. Shows preview of changes             │
│    You confirm to proceed               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 5. Merges updates                       │
│    • core/ updated                      │
│    • usr/ protected                     │
│    • configs merged                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 6. Installs new dependencies            │
│    npm install (if package.json changed)│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 7. Test: npm run dev                    │
│    If OK: delete backup branch          │
│    If issues: git reset --hard backup   │
└─────────────────────────────────────────┘
```

## Deployment Options

### GitHub Pages (Included)
- ✅ Workflow already configured: `.github/workflows/deploy.yml`
- ✅ Push to main → automatic deployment
- Set repo to public or GitHub Pro for private repos

### Other Platforms
- **Netlify**: Build command `npm run build`, Publish dir `dist`
- **Vercel**: Auto-detects Astro, just connect repo
- **Cloudflare Pages**: Same as Netlify
- **Traditional hosting**: Upload `dist/` folder after `npm run build`

## Configuration

### Site URL
Edit `usr/user.config.mjs`:
```js
export const siteMetadata = {
  siteUrl: 'https://yourdomain.com',
  title: 'Your Site Title',
  // ... other settings
}
```

### Astro Settings
Edit `usr/user.config.mjs`:
```js
export const userConfig = {
  integrations: [
    // Your custom integrations
  ],
  // Other Astro config overrides
}
```

## Handling Merge Conflicts

If `package.json` conflicts occur:
1. Keep your dependencies
2. Add new framework dependencies
3. Update shared dependencies to newer versions

Example merge:
```json
// Your version + upstream version = merged result
{
  "dependencies": {
    "astro": "^5.1.0",          // Updated version
    "my-package": "^1.0.0",     // Your addition
    "photoswipe": "^5.4.4"      // New framework dep
  }
}
```

## Best Practices

1. ✅ **Never edit `core/`** - Framework receives updates
2. ✅ **Customize in `usr/`** - Always protected
3. ✅ **Update regularly** - Easier than large jumps
4. ✅ **Test after updating** - Run `npm run dev`
5. ✅ **Read changelogs** - Know what's changing

## For More Details

- 📖 [Complete Update Guide](docs/UPDATING.md)
- 🚀 [Deployment Instructions](docs/DEPLOYMENT.md)
- 🔧 [Configuration Guide](usr/README.md)

## Support

- [GitHub Discussions](https://github.com/lad-sapienza/sCMS/discussions)
- [Issue Tracker](https://github.com/lad-sapienza/sCMS/issues)
- [Documentation](https://github.com/lad-sapienza/sCMS#readme)

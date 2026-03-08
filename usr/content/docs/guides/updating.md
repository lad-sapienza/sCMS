---
title: Updating
description: How to update the s:CMS core system
order: 4
---

This guide explains how to update your s:CMS installation to the latest version while preserving your customizations.

## TL;DR - Quick Update

```bash
npm run update-core
```

This automated script will:
1. Create a backup branch
2. Fetch latest changes from upstream
3. Merge updates while protecting your `usr/` folder
4. Install new dependencies if needed

## First Time Setup

If you haven't set up the update system yet:

```bash
npm run setup-upstream
```

This configures the connection to the s:CMS repository for receiving updates.

## What Gets Updated vs. What Stays Yours

### ✅ Always Updated (Framework Code)
- `core/**` - All framework components, layouts, and utilities
- Core package dependencies

### 🛡️ Always Protected (Your Content)
- `usr/**` - All your content, components, and customizations
- `usr/user.config.mjs` - Your site configuration

### ⚠️ May Need Review (Shared Files)
- `package.json` - Dependencies may need merging
- `astro.config.mjs` - Usually auto-merges correctly
- `.github/workflows/**` - Deployment configurations
- `tsconfig.json`, `tailwind.config.js` - Build configurations

## Update Process Details

### Step 1: Prepare Your Environment

Before updating, ensure:
- All changes are committed: `git status`
- Your site builds successfully: `npm run build`
- (Optional) Test your site: `npm run dev`

### Step 2: Run Update Script

```bash
npm run update-core
```

The script will:
1. **Create backup** - Saves current state to a dated branch
2. **Fetch changes** - Downloads latest s:CMS updates
3. **Show preview** - Lists what will change
4. **Ask confirmation** - You decide whether to proceed
5. **Merge updates** - Integrates changes while protecting `usr/`
6. **Install dependencies** - Updates packages if needed

### Step 3: Review and Test

After a successful update:

```bash
# Review what changed
git log HEAD~1..HEAD

# Test your site
npm run dev

# Check the production build
npm run build
```

### Step 4: Cleanup

If everything works:

```bash
# Delete the backup branch (replace with actual branch name from script output)
git branch -d backup-before-update-20260202-123456
```

If something went wrong:

```bash
# Restore from backup
git reset --hard backup-before-update-20260202-123456
```

## Handling Merge Conflicts

If the update script reports conflicts, don't panic! Here's how to resolve them:

### package.json Conflicts

**Strategy:** Keep your dependencies + add new framework dependencies

```bash
# 1. Open package.json
# 2. Look for conflict markers: <<<<<<<, =======, >>>>>>>
# 3. Merge dependencies from both sections
# 4. Remove conflict markers
# 5. Save and run:
git add package.json
npm install
git commit
```

**Example:**
```json
<<<<<<< HEAD (your version)
{
  "dependencies": {
    "astro": "^5.0.0",
    "my-custom-package": "^1.0.0"
  }
}
=======
{
  "dependencies": {
    "astro": "^5.1.0",
    "photoswipe": "^5.4.4"
  }
}
>>>>>>> upstream/scms-astro

// Resolve to:
{
  "dependencies": {
    "astro": "^5.1.0",           // Use newer version
    "my-custom-package": "^1.0.0", // Keep your addition
    "photoswipe": "^5.4.4"         // Add new framework dep
  }
}
```

### astro.config.mjs Conflicts

**Usually auto-merges** due to the coreConfig + userConfig pattern. If not:

1. Keep the merge structure
2. Ensure your `usr/user.config.mjs` imports are preserved
3. Verify the merge function is intact

### Other Config Files

Review changes and decide case-by-case:
- `.github/workflows/**` - Keep your deployment setup, review new features
- `tsconfig.json` - Usually safe to accept upstream version
- `tailwind.config.js` - Merge your customizations with new settings

## Release Notes & Migration Guides

Always check the [CHANGELOG.md](../CHANGELOG.md) after updating for:
- Breaking changes
- New features
- Manual migration steps
- Deprecated APIs

## Manual Update (Alternative)

If you prefer manual control:

```bash
# 1. Create backup
git checkout -b backup-before-update

# 2. Fetch upstream
git fetch upstream scms-astro

# 3. Merge (protecting usr/)
git merge upstream/scms-astro

# 4. Resolve any conflicts
# ... edit files ...
git add .
git commit

# 5. Install dependencies
npm install

# 6. Test
npm run dev
```

## Troubleshooting

### "Upstream remote not configured"

Run: `npm run setup-upstream`

### "You have uncommitted changes"

Commit your work first:
```bash
git add .
git commit -m "Save work before update"
```

### Update fails but you want to retry

Reset and try again:
```bash
git merge --abort
npm run update-core
```

### Completely undo an update

Restore from backup:
```bash
git reset --hard backup-before-update-YYYYMMDD-HHMMSS
```

## Best Practices

1. **Update regularly** - Smaller, frequent updates are easier than large jumps
2. **Read changelogs** - Know what's changing before you update
3. **Test locally first** - Always test after updating before deploying
4. **Keep backups** - The script creates them automatically
5. **Don't edit core/** - Make customizations in `usr/` only

## File Ownership Reference

```
.
├── core/                    # ❌ Never edit (framework code)
│   ├── components/          # Framework components
│   ├── layouts/             # Base layouts
│   └── utils/               # Framework utilities
├── usr/                     # ✅ Your code (always protected)
│   ├── content/             # Your content
│   ├── pages/               # Your pages
│   ├── components/          # Your components
│   ├── layouts/             # Your custom layouts
│   └── user.config.mjs      # Your settings
├── astro.config.mjs         # ⚠️ Merges automatically
├── package.json             # ⚠️ May need manual merge
├── tsconfig.json            # ⚠️ Review on update
└── .github/workflows/       # ⚠️ Your deployment (review updates)
```

## Getting Help

If you encounter issues:
1. Check [Discussions](https://github.com/lad-sapienza/sCMS/discussions)
2. Review [Issues](https://github.com/lad-sapienza/sCMS/issues)
3. Ask in the community

---

**Remember:** The `core/usr` separation is designed to make updates safe and painless. Your customizations in `usr/` are always protected! 🛡️

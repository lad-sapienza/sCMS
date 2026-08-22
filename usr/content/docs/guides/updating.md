---
title: Updating
description: How to update the s:CMS core system
order: 6
---

This guide explains how to update your s:CMS installation to the latest version while preserving your customizations.

## TL;DR - Quick Update

```bash
npm run update-scms
```

This automated script will:
1. Create a backup branch
2. Fetch the latest changes from upstream
3. Replace framework files with the upstream version while protecting your `usr/` folder
4. Install new dependencies if needed

## First Time Setup

If you haven't set up the update system yet:

```bash
npm run setup-upstream
```

This adds an `upstream` git remote pointing at `github.com/lad-sapienza/sCMS`, so `npm run update-scms` has something to fetch from. You only need to run it once per clone.

## What Gets Updated vs. What Stays Yours

### ✅ Always Updated (Replaced by the upstream version)
- `core/**` — all framework components, layouts, and utilities
- `scripts/**` — the update/scaffolding scripts themselves
- Shared config files: `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`
- Any other tracked file outside `usr/` and `.github/`

### 🛡️ Always Protected (Never touched by the script)
- `usr/**` — all your content, components, layouts, and customizations
- `usr/user.config.mjs` — your site configuration
- `usr/scripts/local-packages.yml` — your site-specific npm packages (see below)

### ⚠️ Partially Protected
- `.github/**` — your own workflow files (e.g. `deploy.yml`) are preserved, but `.github/copilot-instructions.md` is always taken from upstream.

Unlike a typical framework updater, `update-scms.sh` does **not** perform a `git merge` and there is no field-by-field merging of `package.json` or `astro.config.mjs` — those files are replaced outright with the upstream version. That's the reason `usr/scripts/local-packages.yml` exists (see below): it's the one place your own npm dependencies survive an update.

## Update Process Details

### Step 1: Prepare Your Environment

Before updating, ensure:
- All changes are committed: `git status` (the script refuses to run with uncommitted changes)
- Your site builds successfully: `npm run build`

### Step 2: Run Update Script

```bash
npm run update-scms
```

The script will:
1. **Create a backup branch** — `backup-before-update-<timestamp>`, so you can always roll back
2. **Fetch upstream** and show a preview of the incoming commits
3. **Ask for confirmation** before touching anything
4. **Snapshot `usr/` and `.github/`**, then check out every file from the upstream branch
5. **Restore your snapshot** of `usr/` and (mostly) `.github/` on top, so those stay yours
6. **Flag orphaned files** — anything that exists locally but was removed upstream — and offer to delete them
7. **Commit** the result
8. **Reinstall dependencies** if `package.json` changed, and reinstall your own packages from `usr/scripts/local-packages.yml`
9. **Offer to push** the update to `origin`

## Site-Specific Packages

Because `npm run update-scms` replaces `package.json` with the upstream (core) version, any packages you added manually to `package.json` would be wiped on every update.

The solution is `usr/scripts/local-packages.yml` — a YAML list of npm packages specific to your implementation. This file lives inside `usr/`, so it is **always preserved** across updates. The update script reads it and runs `npm install` for those packages automatically at the end of every update.

### Setup

Create or edit `usr/scripts/local-packages.yml`:

```yaml
# usr/scripts/local-packages.yml
- gsap
- d3
- @types/d3      # inline comments are supported
- swiper@11      # pin to a specific version
```

You can also install them manually at any time without running the full update:

```bash
# parse and install local packages directly
grep -E '^\s*-\s+[^#]' usr/scripts/local-packages.yml \
  | sed 's/^\s*-\s*//' | sed 's/\s*#.*//' \
  | xargs npm install
```

### How It Works

During `npm run update-scms` the script:
1. Replaces `package.json` with the upstream version and runs `npm install`
2. Reads `usr/scripts/local-packages.yml`
3. Runs `npm install <packages>` for every package listed there

If the file does not exist or contains no uncommented entries, this step is silently skipped.

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

## Since There's No Merge — What About Conflicts?

The scripted update never produces `git merge` conflict markers: `core/` and shared config files are simply overwritten with upstream's version, and `usr/` is simply restored from your snapshot. There is nothing to resolve by hand in the normal case.

What you *do* need to check after updating:

- **Your own npm dependencies** — make sure everything you rely on is listed in `usr/scripts/local-packages.yml` (see above), or it will be silently dropped by the next update.
- **Custom edits inside `core/`** — if you ever modified a file in `core/` directly (not recommended), those edits are lost on update. Keep customizations in `usr/` instead.
- **Orphaned files** — the script warns you about files that exist locally but were removed upstream, and asks before deleting them.

### Manual Update (Alternative)

If you prefer a real `git merge` instead of the scripted checkout/restore — for example to review changes hunk-by-hunk before accepting them — you can merge upstream directly. This is the one path where `.gitattributes`' `merge=ours` / `merge=theirs` strategies actually apply (they tell git to auto-resolve `usr/**` in your favor and `core/**` in upstream's favor during a real merge):

```bash
# 1. Create backup
git checkout -b backup-before-update

# 2. Fetch upstream
git fetch upstream main

# 3. Merge (usr/** kept via .gitattributes, core/** taken from upstream)
git merge upstream/main

# 4. Resolve any remaining conflicts
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

If you used the manual `git merge` alternative and want to abort it:
```bash
git merge --abort
```
The scripted `npm run update-scms` path doesn't leave a merge in progress — if it fails partway, restore from the backup branch it created and try again.

### Completely undo an update

Restore from backup:
```bash
git reset --hard backup-before-update-YYYYMMDD-HHMMSS
```

## Best Practices

1. **Update regularly** - Smaller, frequent updates are easier to review than large jumps
2. **Check the upstream repo's commit history / releases** before updating, to know what's changing
3. **Test locally first** - Always run `npm run dev` after updating before deploying
4. **Keep backups** - The script creates them automatically
5. **Don't edit `core/`** - Make customizations in `usr/` only

## File Ownership Reference

```
.
├── core/                    # ❌ Never edit (framework code)
│   ├── components/          # Framework components
│   ├── integrations/        # Framework Astro integrations
│   └── utils/                # Framework utilities
├── usr/                     # ✅ Your code (always protected)
│   ├── content/              # Your content
│   ├── pages/                 # Your pages
│   ├── components/            # Your components
│   ├── layouts/                # Your custom layouts
│   └── user.config.mjs         # Your settings
├── astro.config.mjs         # ❌ Replaced by upstream on every update
├── package.json              # ❌ Replaced by upstream (use local-packages.yml for your own deps)
├── tsconfig.json              # ❌ Replaced by upstream on every update
└── .github/workflows/          # 🛡️ Your deployment files (preserved)
```

## Getting Help

If you encounter issues:
1. Check [Discussions](https://github.com/lad-sapienza/sCMS/discussions)
2. Review [Issues](https://github.com/lad-sapienza/sCMS/issues)

---

**Remember:** The `core/usr` separation is designed to make updates safe and predictable. Your customizations in `usr/` are always protected!

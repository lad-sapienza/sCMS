#!/bin/bash
# Update s:CMS core to latest version while preserving user content
# This script merges changes from upstream, protecting your usr/ folder

set -e

UPSTREAM_BRANCH="scms-astro"
BACKUP_BRANCH="backup-before-update-$(date +%Y%m%d-%H%M%S)"

echo "🔄 s:CMS Core Update Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if upstream is configured
if ! git remote | grep -q "^upstream$"; then
  echo "❌ Upstream remote not configured."
  echo "Run: npm run setup-upstream"
  exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  You have uncommitted changes."
  echo "Please commit or stash your changes before updating."
  echo ""
  git status --short
  exit 1
fi

# Create backup branch
echo "💾 Creating backup branch: $BACKUP_BRANCH"
git branch "$BACKUP_BRANCH"
echo "✓ Backup created (you can delete it later if update succeeds)"
echo ""

# Fetch latest changes
echo "📥 Fetching latest changes from upstream..."
git fetch upstream "$UPSTREAM_BRANCH"
echo ""

# Show what will be updated
echo "📋 Changes in this update:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
git log HEAD..upstream/"$UPSTREAM_BRANCH" --oneline --graph --decorate --max-count=10
echo ""

# Ask for confirmation
read -p "Continue with merge? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Update cancelled"
  git branch -d "$BACKUP_BRANCH" 2>/dev/null || true
  exit 0
fi

echo ""
echo "🔀 Merging upstream changes..."
echo "Note: Your usr/ folder is protected and will not be overwritten"
echo ""

# Merge with strategy to protect usr/
if git merge upstream/"$UPSTREAM_BRANCH" --no-edit; then
  echo ""
  echo "✅ Merge successful!"
  echo ""
  
  # Check if package.json changed
  if git diff HEAD@{1} HEAD --name-only | grep -q "package.json"; then
    echo "📦 package.json was updated - installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
  fi
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ Update complete!"
  echo ""
  echo "Next steps:"
  echo "  1. Review changes: git log HEAD~1..HEAD"
  echo "  2. Test your site: npm run dev"
  echo "  3. Delete backup branch: git branch -d $BACKUP_BRANCH"
  echo ""
else
  echo ""
  echo "⚠️  Merge conflicts detected!"
  echo ""
  echo "Common conflicts and how to resolve them:"
  echo "  • package.json - Merge dependencies manually, keep yours + add new ones"
  echo "  • astro.config.mjs - Should auto-merge (coreConfig + userConfig)"
  echo "  • Other configs - Review and merge as needed"
  echo ""
  echo "To resolve:"
  echo "  1. Fix conflicts in the files listed above"
  echo "  2. git add <resolved-files>"
  echo "  3. git commit"
  echo ""
  echo "To abort:"
  echo "  git merge --abort"
  echo "  git checkout $BACKUP_BRANCH"
  echo ""
  exit 1
fi

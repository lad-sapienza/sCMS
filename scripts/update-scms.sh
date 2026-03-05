#!/bin/bash
# Update s:CMS core to latest version while preserving user content
# This script applies upstream changes directly, protecting your src/usr/ folder

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
read -p "Continue with update? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Update cancelled"
  git branch -d "$BACKUP_BRANCH" 2>/dev/null || true
  exit 0
fi

echo ""
echo "📂 Applying upstream files..."
echo "Note: Your usr/ folder will not be touched"
echo ""

# Checkout everything from upstream
git checkout upstream/"$UPSTREAM_BRANCH" -- .

# Immediately restore your usr/ folder from your own HEAD
if git ls-files --error-unmatch usr/ > /dev/null 2>&1; then
  git checkout HEAD -- usr/
  echo "✓ usr/ folder restored"
else
  echo "➡️  No usr/ folder found in index, skipping restore"
fi

echo "✓ Core files updated"
echo ""

# Check for orphaned files (exist locally but no longer in upstream)
echo "🔍 Checking for orphaned files..."
TEMP_DIR=$(mktemp -d)
git ls-files | grep -v "^usr/" | sort > "$TEMP_DIR/local_files.txt"
git ls-tree -r --name-only upstream/"$UPSTREAM_BRANCH" | sort > "$TEMP_DIR/upstream_files.txt"

ORPHANED_FILES="$TEMP_DIR/orphaned_files.txt"
comm -23 "$TEMP_DIR/local_files.txt" "$TEMP_DIR/upstream_files.txt" > "$ORPHANED_FILES"

if [ -s "$ORPHANED_FILES" ]; then
  echo ""
  echo "⚠️  Found orphaned files (deleted upstream but still exist locally):"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cat "$ORPHANED_FILES" | sed 's/^/  • /'
  echo ""

  read -p "Remove orphaned files automatically? (y/N): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing orphaned files..."
    while IFS= read -r file; do
      if [ -f "$file" ]; then
        git rm "$file" && echo "  ✓ Removed $file"
      fi
    done < "$ORPHANED_FILES"
    echo "✓ Orphaned files cleaned up"
    echo ""
  else
    echo "➡️  Orphaned files preserved (you can remove them manually later)"
    echo ""
  fi
fi

# Cleanup temp files
rm -rf "$TEMP_DIR"

# Commit the update
echo "💬 Committing update..."
git add -A
git commit -m "chore: update s:CMS core from upstream $(date +'%Y-%m-%d')"
echo "✓ Committed"
echo ""

# Check if package.json changed and reinstall dependencies
if git diff HEAD~1 HEAD --name-only | grep -q "package.json"; then
  echo "📦 package.json was updated - installing dependencies..."
  npm install
  echo "✓ Dependencies installed"
  echo ""
fi

# Push to origin
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Update complete!"
echo ""

read -p "📤 Push to origin? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  git push origin HEAD
  echo "✓ Pushed to origin"
else
  echo "➡️  Skipped push — run manually: git push origin HEAD"
fi

echo ""
echo "Next steps:"
echo "  1. Review changes: git diff $BACKUP_BRANCH HEAD"
echo "  2. Test your site: npm run dev"
echo "  3. Delete backup branch: git branch -d $BACKUP_BRANCH"
echo ""
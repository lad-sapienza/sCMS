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

# Check for orphaned core files (files deleted upstream but still exist locally)
echo "🔍 Checking for orphaned files..."
TEMP_DIR=$(mktemp -d)
git ls-files | grep -E "^(core/|scripts/|\.)" | grep -v "^usr/" | sort > "$TEMP_DIR/local_core_files.txt"
git ls-tree -r --name-only upstream/"$UPSTREAM_BRANCH" | grep -E "^(core/|scripts/|\.)" | grep -v "^usr/" | sort > "$TEMP_DIR/upstream_core_files.txt" 

ORPHANED_FILES="$TEMP_DIR/orphaned_files.txt"
comm -23 "$TEMP_DIR/local_core_files.txt" "$TEMP_DIR/upstream_core_files.txt" > "$ORPHANED_FILES"

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
    
    # Remove empty directories
    find core/ scripts/ -type d -empty -delete 2>/dev/null || true
    
    echo "✓ Orphaned files cleaned up"
    echo ""
  else
    echo "➡️  Orphaned files preserved (you can remove them manually later)"
    echo ""
  fi
fi

# Cleanup temp files
rm -rf "$TEMP_DIR"

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
echo "🔀 Attempting smart merge with conflict resolution..."

# Try merge with unrelated histories and auto-resolve core files
if git merge upstream/"$UPSTREAM_BRANCH" --allow-unrelated-histories --no-edit \
   -X ours; then
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
  echo "🔧 Auto-resolving conflicts..."
  echo ""
  
  # Auto-resolve core files (take upstream version)
  if git status --porcelain | grep -q "^AA core/"; then
    echo "📁 Taking upstream version for core/ files..."
    git checkout --theirs core/
    git add core/
  fi
  
  # Auto-resolve package files (take upstream, user can customize later)
  if git status --porcelain | grep -q "^AA package"; then
    echo "📦 Taking upstream package.json (you can customize after)..."
    git checkout --theirs package.json package-lock.json
    git add package.json package-lock.json
  fi
  
  # Auto-resolve astro.config.mjs (take upstream, uses user.config.mjs for customization)
  if git status --porcelain | grep -q "^AA astro.config.mjs"; then
    echo "⚙️  Taking upstream astro.config.mjs..."
    git checkout --theirs astro.config.mjs
    git add astro.config.mjs
  fi
  
  # Check if any conflicts remain
  if git status --porcelain | grep -q "^AA"; then
    echo ""
    echo "⚠️  Some conflicts need manual resolution:"
    git status --porcelain | grep "^AA" | while read status file; do
      echo "  • $file"
    done
    echo ""
    echo "For usr/ files, consider:"
    echo "  • Keep your changes: git checkout --ours <file>"
    echo "  • Take upstream: git checkout --theirs <file>"
    echo "  • Edit manually to merge both versions"
    echo ""
    echo "After resolving, run: git add . && git commit"
    echo "To abort: git merge --abort && git checkout $BACKUP_BRANCH"
    exit 1
  else
    echo ""
    echo "✅ All conflicts auto-resolved! Completing merge..."
    git commit --no-edit
    
    # Install updated dependencies
    echo "📦 Installing updated dependencies..."
    npm install
    echo "✓ Dependencies installed"
  fi
  echo ""
  exit 1
fi

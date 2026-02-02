#!/bin/bash
# Setup upstream remote for receiving s:CMS updates
# Run this once after creating your project from the template

set -e

UPSTREAM_REPO="https://github.com/lad-sapienza/sCMS.git"
UPSTREAM_BRANCH="scms-astro"

echo "🔧 Setting up upstream remote for s:CMS updates..."

# Check if upstream already exists
if git remote | grep -q "^upstream$"; then
  echo "✓ Upstream remote already exists"
  git remote set-url upstream "$UPSTREAM_REPO"
  echo "✓ Updated upstream URL to: $UPSTREAM_REPO"
else
  git remote add upstream "$UPSTREAM_REPO"
  echo "✓ Added upstream remote: $UPSTREAM_REPO"
fi

# Fetch upstream
echo "📥 Fetching latest changes from upstream..."
git fetch upstream "$UPSTREAM_BRANCH"

echo ""
echo "✅ Setup complete!"
echo ""
echo "You can now update to the latest s:CMS version by running:"
echo "  npm run update-core"
echo ""

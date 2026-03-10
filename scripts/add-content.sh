#!/usr/bin/env bash
# add-content.sh — Add a new content file to an existing s:CMS collection.
# Usage:  bash scripts/add-content.sh
#     or: npm run add-content

set -euo pipefail

# ─── Color helpers ─────────────────────────────────────────────────────────────
RED=$'\e[31m'; GREEN=$'\e[32m'; YELLOW=$'\e[33m'; CYAN=$'\e[36m'
BOLD=$'\e[1m'; RESET=$'\e[0m'

info()    { echo "${CYAN}${BOLD}→${RESET} $*"; }
success() { echo "${GREEN}✔${RESET}  $*"; }
warn()    { echo "${YELLOW}⚠${RESET}  $*"; }
error()   { echo "${RED}✖${RESET}  $*" >&2; exit 1; }

# ─── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$ROOT_DIR/usr/content/config.ts"
CONTENT_BASE="$ROOT_DIR/usr/content"

cd "$ROOT_DIR"

[[ -f "$CONFIG_FILE" ]] || error "Cannot find $CONFIG_FILE"
command -v python3 >/dev/null 2>&1 || error "python3 is required but not found."

# ─── Parse collections from config.ts (skip data/menu — no Markdown files) ────
ALL_COLLECTIONS=$(python3 -c "
import re
with open('$CONFIG_FILE') as f:
    content = f.read()
m = re.search(r'export const collections\s*=\s*\{([^}]+)\}', content, re.DOTALL)
if m:
    for k in re.findall(r'(\w+)\s*:', m.group(1)):
        print(k)
")

# Filter to only collections that have a content dir with Markdown loader
MARKDOWN_COLLECTIONS=""
for col in $ALL_COLLECTIONS; do
    col_dir="$CONTENT_BASE/$col"
    if [[ -d "$col_dir" ]]; then
        MARKDOWN_COLLECTIONS="$MARKDOWN_COLLECTIONS $col"
    fi
done

MARKDOWN_COLLECTIONS="${MARKDOWN_COLLECTIONS# }"  # trim leading space

echo ""
echo "${BOLD}Available collections:${RESET}"
if [[ -z "$MARKDOWN_COLLECTIONS" ]]; then
    echo "  (none found — run 'npm run add-collection' first)"
    exit 1
fi
IDX=1
declare -a COL_ARRAY
for col in $MARKDOWN_COLLECTIONS; do
    count=$(find "$CONTENT_BASE/$col" -name "*.md" -o -name "*.mdx" 2>/dev/null | wc -l | tr -d ' ')
    echo "  $IDX) $col  (${count} file(s))"
    COL_ARRAY+=("$col")
    IDX=$((IDX+1))
done
echo ""

# ─── Choose a collection ───────────────────────────────────────────────────────
while true; do
    read -rp "${BOLD}Collection${RESET} [name or number]: " COL_INPUT
    COL_INPUT="${COL_INPUT// /}"

    if [[ "$COL_INPUT" =~ ^[0-9]+$ ]]; then
        idx=$((COL_INPUT-1))
        if (( idx >= 0 && idx < ${#COL_ARRAY[@]} )); then
            COLLECTION="${COL_ARRAY[$idx]}"
            break
        else
            warn "Number out of range."
        fi
    else
        # Validate name exists
        found=false
        for c in "${COL_ARRAY[@]}"; do
            if [[ "$c" == "$COL_INPUT" ]]; then
                COLLECTION="$COL_INPUT"
                found=true
                break
            fi
        done
        if $found; then break; fi
        warn "'$COL_INPUT' is not an available collection."
    fi
done

success "Collection: $COLLECTION"

# ─── Detect the schema fields from config.ts for this collection ───────────────
SCHEMA_FIELDS=$(python3 -c "
import re
with open('$CONFIG_FILE') as f:
    src = f.read()

# Find the defineCollection block whose loader base contains the collection name
# We look for z.object({ ... }) in that block
# Strategy: find 'base' line with collection name, then extract the z.object block
# that follows in the same defineCollection call.

# Locate the defineCollection block for this collection
pattern = r'defineCollection\(\{.*?base\s*:\s*[\"\']\./usr/content/$COLLECTION[\"\']\s*,?.*?z\.object\(\{(.*?)\}\)\s*,?\s*\}\)'
m = re.search(pattern, src, re.DOTALL)
if m:
    block = m.group(1)
    for line in block.splitlines():
        line = line.strip()
        if line and not line.startswith('//'):
            print(line)
" 2>/dev/null || true)

# ─── Determine content format from existing files ─────────────────────────────
HAS_MDX=$(find "$CONTENT_BASE/$COLLECTION" -name "*.mdx" 2>/dev/null | head -1)
DEFAULT_EXT="md"
[[ -n "$HAS_MDX" ]] && DEFAULT_EXT="mdx"

echo ""
read -rp "${BOLD}File format${RESET} [md/mdx] (default: $DEFAULT_EXT): " EXT_INPUT
EXT_INPUT="${EXT_INPUT:-$DEFAULT_EXT}"
[[ "$EXT_INPUT" == "md" || "$EXT_INPUT" == "mdx" ]] || EXT_INPUT="$DEFAULT_EXT"

# ─── Ask for slug ─────────────────────────────────────────────────────────────
echo ""
echo "  Slug becomes the URL path and file name."
echo "  Use lowercase letters, numbers, and hyphens. Subfolders allowed (e.g. guides/my-topic)."
echo ""

while true; do
    read -rp "${BOLD}Slug${RESET}: " SLUG_INPUT
    SLUG_INPUT="${SLUG_INPUT// /}"             # strip spaces
    SLUG_INPUT="${SLUG_INPUT#/}"               # strip leading slash
    SLUG_INPUT="${SLUG_INPUT%/}"               # strip trailing slash

    if [[ -z "$SLUG_INPUT" ]]; then
        warn "Slug cannot be empty."
        continue
    fi
    if [[ ! "$SLUG_INPUT" =~ ^[a-z0-9/_-]+$ ]]; then
        warn "Slug must contain only lowercase letters, numbers, hyphens, underscores, and forward slashes."
        continue
    fi

    TARGET_PATH="$CONTENT_BASE/$COLLECTION/$SLUG_INPUT.$EXT_INPUT"
    if [[ -f "$TARGET_PATH" ]]; then
        warn "File already exists: usr/content/$COLLECTION/$SLUG_INPUT.$EXT_INPUT"
        continue
    fi

    break
done

# ─── Collect frontmatter field values via Python ─────────────────────────────
# NOTE: we write the helper to a temp file (not a heredoc) so that Python's
# input() can read from the real terminal stdin.
export COLLECTION SLUG_INPUT EXT_INPUT TARGET_PATH SCHEMA_FIELDS ROOT_DIR

HELPER=$(mktemp /tmp/add-content-XXXXXX.py)
trap 'rm -f "$HELPER"' EXIT

cat > "$HELPER" << 'PYEOF'
import os, re, sys
from datetime import date

collection   = os.environ['COLLECTION']
slug         = os.environ['SLUG_INPUT']
ext          = os.environ['EXT_INPUT']
target_path  = os.environ['TARGET_PATH']
schema_raw   = os.environ.get('SCHEMA_FIELDS', '')
root         = os.environ['ROOT_DIR']

today = date.today().isoformat()

# ─── Parse schema fields ──────────────────────────────────────────────────────
# Each line looks like: title: z.string(), or date: z.coerce.date(),
# or author: z.string().optional(),
fields = []
for line in schema_raw.splitlines():
    line = line.strip().rstrip(',')
    if not line:
        continue
    m = re.match(r'^(\w+)\s*:\s*(.+)$', line)
    if not m:
        continue
    name, ztype = m.group(1), m.group(2)
    optional = '.optional()' in ztype
    if 'z.array' in ztype:
        kind = 'array'
    elif 'z.number' in ztype:
        kind = 'number'
    elif 'z.boolean' in ztype:
        kind = 'boolean'
    elif 'z.coerce.date' in ztype or 'z.date' in ztype:
        kind = 'date'
    else:
        kind = 'string'
    fields.append({'name': name, 'kind': kind, 'optional': optional})

# ─── Interactive frontmatter collection ───────────────────────────────────────
print()
print('\033[1mFrontmatter fields\033[0m (press Enter to use the default value shown in brackets):')
print()

fm = {}
for field in fields:
    name     = field['name']
    kind     = field['kind']
    optional = field['optional']

    # Smart defaults
    if kind == 'date':
        default = today
    elif name == 'draft':
        default = 'true'
    elif name == 'author':
        # Try git config
        try:
            import subprocess
            default = subprocess.check_output(['git', 'config', 'user.name'],
                                              stderr=subprocess.DEVNULL).decode().strip()
        except Exception:
            default = ''
    elif kind == 'array':
        default = ''
    elif kind == 'number':
        default = ''
    else:
        default = ''

    opt_label = '  (optional)' if optional else ''
    prompt    = f'  {name}{opt_label}'
    if kind == 'array':
        prompt += ' [comma-separated]'
    if default:
        prompt += f' [{default}]'
    prompt += ': '

    try:
        value = input(prompt).strip()
    except EOFError:
        value = ''

    if not value and default:
        value = default

    if not value:
        if optional:
            continue   # skip optional fields with no value
        else:
            fm[name] = ''
            continue

    fm[name] = (value, kind)

# ─── Build YAML frontmatter ───────────────────────────────────────────────────
def yaml_value(val, kind):
    if kind == 'boolean':
        return val.lower() in ('true', 'yes', '1')
    if kind == 'number':
        try:
            return int(val) if '.' not in val else float(val)
        except ValueError:
            return val
    if kind == 'array':
        items = [s.strip() for s in val.split(',') if s.strip()]
        return items
    # string or date — quote strings, leave dates bare
    if kind == 'date':
        return val
    return val  # will be quoted below

lines = ['---']
for name, entry in fm.items():
    if isinstance(entry, tuple):
        val, kind = entry
        v = yaml_value(val, kind)
    else:
        v = entry  # empty required field

    if isinstance(v, bool):
        lines.append(f'{name}: {"true" if v else "false"}')
    elif isinstance(v, list):
        if v:
            items_str = ', '.join(f'"{i}"' for i in v)
            lines.append(f'{name}: [{items_str}]')
        else:
            lines.append(f'{name}: []')
    elif isinstance(v, (int, float)):
        lines.append(f'{name}: {v}')
    else:
        # wrap in quotes if it contains special chars or is a plain string
        if name in ('date',) or re.match(r'^\d{4}-\d{2}-\d{2}$', str(v)):
            lines.append(f'{name}: {v}')
        else:
            escaped = str(v).replace('"', '\\"')
            lines.append(f'{name}: "{escaped}"')

lines.append('---')
lines.append('')
lines.append(f'# {fm.get("title", ("", ""))[0] if isinstance(fm.get("title"), tuple) else slug}')
lines.append('')
lines.append('<!-- Write your content here -->')
lines.append('')

frontmatter = '\n'.join(lines)

# ─── Write the file ───────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(target_path), exist_ok=True)
with open(target_path, 'w') as f:
    f.write(frontmatter)

rel = os.path.relpath(target_path, root)
print()
print(f'\033[32m✔\033[0m  Created: {rel}')

PYEOF

python3 "$HELPER"

# ─── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "${GREEN}${BOLD}Done!${RESET}"
echo ""
echo "  ${BOLD}Next steps:${RESET}"
echo "    1. Open ${BOLD}usr/content/$COLLECTION/$SLUG_INPUT.$EXT_INPUT${RESET} and write your content"
echo "    2. Set ${BOLD}draft: false${RESET} when the content is ready to publish"
echo "    3. Run ${BOLD}npm run dev${RESET} and visit ${BOLD}/$COLLECTION/$SLUG_INPUT${RESET}"
echo ""

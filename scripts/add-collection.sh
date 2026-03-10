#!/usr/bin/env bash
# add-collection.sh — Scaffold a new Astro content collection in s:CMS
# Usage:  bash scripts/add-collection.sh
#     or: npm run add-collection

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

cd "$ROOT_DIR"

[[ -f "$CONFIG_FILE" ]] || error "Cannot find $CONFIG_FILE — are you running from the project root?"
command -v python3 >/dev/null 2>&1 || error "python3 is required but not found."

# ─── Parse existing collection names from config.ts ────────────────────────────
EXISTING=$(python3 -c "
import re, sys
with open('$CONFIG_FILE') as f:
    content = f.read()
m = re.search(r'export const collections\s*=\s*\{([^}]+)\}', content, re.DOTALL)
if m:
    for k in re.findall(r'(\w+)\s*:', m.group(1)):
        print(k)
")

echo ""
echo "${BOLD}Existing collections:${RESET}"
if [[ -z "$EXISTING" ]]; then
  echo "  (none)"
else
  while IFS= read -r col; do
    echo "  • $col"
  done <<< "$EXISTING"
fi
echo ""

# ─── Get and validate the new collection name ───────────────────────────────────
while true; do
  read -rp "${BOLD}New collection name${RESET} (lowercase letters, numbers, hyphens): " COL_NAME
  COL_NAME="${COL_NAME// /}"  # strip any spaces

  if [[ ! "$COL_NAME" =~ ^[a-z]([a-z0-9-]*[a-z0-9])?$ ]]; then
    warn "Name must start with a letter and contain only lowercase letters, numbers, and hyphens."
    continue
  fi

  if echo "$EXISTING" | grep -qx "$COL_NAME" 2>/dev/null; then
    warn "Collection '${COL_NAME}' already exists. Choose a different name."
    continue
  fi

  break
done

# ─── Derive camelCase variable name: my-news → myNewsCollection ─────────────────
VAR_NAME=$(python3 -c "
import sys
s = '$COL_NAME'
parts = s.split('-')
print(parts[0] + ''.join(p.capitalize() for p in parts[1:]) + 'Collection')
")

# ─── Choose collection type ─────────────────────────────────────────────────────
echo ""
echo "${BOLD}Collection type:${RESET}"
echo "  1) blog    — articles (date, author, tags, image, draft)"
echo "  2) docs    — documentation pages (order, category, draft)"
echo "  3) generic — simple entries (title, optional description, draft)"
echo ""
read -rp "Choose type [1/2/3] (default: 3): " TYPE_INPUT
TYPE_INPUT="${TYPE_INPUT:-3}"

case "$TYPE_INPUT" in
  1) COL_TYPE="blog"    ;;
  2) COL_TYPE="docs"    ;;
  *) COL_TYPE="generic" ;;
esac
success "Type: $COL_TYPE"

# ─── Delegate all file work to Python3 ─────────────────────────────────────────
# Variables are exported so the single-quoted heredoc can read them via os.environ
export COL_NAME VAR_NAME COL_TYPE ROOT_DIR CONFIG_FILE

python3 << 'PYEOF'
import os, re, sys
from datetime import date

col_name    = os.environ['COL_NAME']
var_name    = os.environ['VAR_NAME']
col_type    = os.environ['COL_TYPE']
root        = os.environ['ROOT_DIR']
config_path = os.environ['CONFIG_FILE']

content_dir = os.path.join(root, 'usr', 'content', col_name)
pages_dir   = os.path.join(root, 'usr', 'pages', col_name)
os.makedirs(content_dir, exist_ok=True)
os.makedirs(pages_dir,   exist_ok=True)

# ─── 1. Update usr/content/config.ts ───────────────────────────────────────────
schema_fields = {
    'blog': (
        '    title: z.string(),\n'
        '    description: z.string(),\n'
        '    date: z.coerce.date(),\n'
        '    author: z.string().optional(),\n'
        '    tags: z.array(z.string()).optional(),\n'
        '    image: z.string().optional(),\n'
        '    draft: z.boolean().optional(),'
    ),
    'docs': (
        '    title: z.string(),\n'
        '    description: z.string().optional(),\n'
        '    order: z.number().optional(),\n'
        '    category: z.string().optional(),\n'
        '    draft: z.boolean().optional(),'
    ),
    'generic': (
        '    title: z.string(),\n'
        '    description: z.string().optional(),\n'
        '    draft: z.boolean().optional(),'
    ),
}[col_type]

new_block = (
    f'\n// Schema for {col_name} entries  [{col_type} type]\n'
    f'// TODO: customize the schema fields to match your content structure\n'
    f'const {var_name} = defineCollection({{\n'
    f'  loader: glob({{\n'
    f"    pattern: '**/*.{{md,mdx}}',\n"
    f"    base: './usr/content/{col_name}',\n"
    f'  }}),\n'
    f'  schema: z.object({{\n'
    f'{schema_fields}\n'
    f'  }}),\n'
    f'}});\n'
)

with open(config_path) as f:
    cfg = f.read()

marker = '// Export all collections'
if marker not in cfg:
    sys.exit(f"ERROR: marker '{marker}' not found in config.ts")

cfg = cfg.replace(marker, new_block + marker)

# Append new key to the export const collections = { ... } object
export_m = re.search(
    r'(export const collections\s*=\s*\{)([^}]+)(\};)',
    cfg, re.DOTALL
)
if not export_m:
    sys.exit('ERROR: export const collections not found in config.ts')

inner     = export_m.group(2).rstrip()
new_inner = inner + f'\n  {col_name}: {var_name},\n'
cfg = (
    cfg[:export_m.start()]
    + export_m.group(1)
    + new_inner
    + export_m.group(3)
    + cfg[export_m.end():]
)

with open(config_path, 'w') as f:
    f.write(cfg)

print(f'  ✔  usr/content/config.ts updated')

# ─── 2. Sample content file ─────────────────────────────────────────────────────
today = date.today().isoformat()

sample_files = {
    'blog': (
        'sample-post.md',
        f'---\n'
        f'title: "Sample Post"\n'
        f'description: "A sample post in the {col_name} collection."\n'
        f'date: {today}\n'
        f'author: "Your Name"\n'
        f'tags: ["sample"]\n'
        f'draft: true\n'
        f'---\n\n'
        f'# Sample Post\n\n'
        f'This is a sample post. Replace this file with real content.\n'
    ),
    'docs': (
        'sample-doc.md',
        f'---\n'
        f'title: "Sample Document"\n'
        f'description: "A sample document in the {col_name} collection."\n'
        f'order: 1\n'
        f'category: "general"\n'
        f'draft: true\n'
        f'---\n\n'
        f'# Sample Document\n\n'
        f'This is a sample document. Replace this file with real content.\n'
    ),
    'generic': (
        'sample.md',
        f'---\n'
        f'title: "Sample Entry"\n'
        f'description: "A sample entry in the {col_name} collection."\n'
        f'draft: true\n'
        f'---\n\n'
        f'# Sample Entry\n\n'
        f'This is a sample entry. Replace this file with real content.\n'
    ),
}

sample_name, sample_content = sample_files[col_type]
sample_path = os.path.join(content_dir, sample_name)
with open(sample_path, 'w') as f:
    f.write(sample_content)

rel_sample = os.path.relpath(sample_path, root)
print(f'  ✔  {rel_sample}')

# ─── 3. Page templates ──────────────────────────────────────────────────────────
# __COL__ is replaced with col_name after template definition.
# Backslash-escaped template literals (\\.) are for JS regex inside Astro — they
# become \. in the final file, which is the correct JS regex escape.

INDEX = {

'blog': """\
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export const prerender = true;

// TODO: customise title and description below
const title = '__COL__';
const description = 'All entries in the __COL__ collection';

const entries = (await getCollection('__COL__'))
  .filter(e => !e.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<BaseLayout title={title} description={description}>
  <main class="container py-5">
    <div class="mb-5">
      <h1 class="mb-0">{title}</h1>
      <p class="lead">{description}</p>
    </div>

    <div class="row g-4">
      {entries.map(entry => (
        <div class="col-12 col-md-6 col-lg-4">
          <article class="card h-100 shadow-sm">
            {entry.data.image && (
              <img
                src={entry.data.image}
                alt={entry.data.title}
                class="card-img-top"
                style="height:200px;object-fit:cover;"
              />
            )}
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">
                <a
                  href={`/__COL__/${entry.id.replace(/\\.mdx?$/, '')}`}
                  class="text-decoration-none text-dark"
                >
                  {entry.data.title}
                </a>
              </h5>
              <p class="card-text text-muted small flex-grow-1">
                {entry.data.description}
              </p>
              {entry.data.tags && (
                <div class="d-flex flex-wrap gap-1 mt-2">
                  {entry.data.tags.map(tag => (
                    <span class="badge bg-primary-subtle text-primary-emphasis">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div class="card-footer text-muted small">
              <time datetime={entry.data.date.toISOString()}>
                {entry.data.date.toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </time>
              {entry.data.author && <span> · {entry.data.author}</span>}
            </div>
          </article>
        </div>
      ))}
    </div>

    {entries.length === 0 && (
      <p class="text-center text-muted mt-5">
        No entries yet — add Markdown files to{' '}
        <code>usr/content/__COL__/</code> and set <code>draft: false</code>.
      </p>
    )}
  </main>
</BaseLayout>
""",

'docs': """\
---
import { getCollection, type CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export const prerender = true;

// TODO: customise title, description, and category groupings below
const title = '__COL__';
const description = 'Documentation for __COL__';

type Entry = CollectionEntry<'__COL__'>;

const entries = (await getCollection('__COL__'))
  .filter((e: Entry) => !e.data.draft)
  .sort((a: Entry, b: Entry) => (a.data.order ?? 999) - (b.data.order ?? 999));
---

<BaseLayout title={title} description={description}>
  <main class="container py-5">
    <div class="mb-5">
      <h1 class="mb-0">{title}</h1>
      <p class="lead text-secondary">{description}</p>
    </div>

    <div class="row g-3">
      {entries.map(entry => (
        <div class="col-12 col-md-6">
          <a
            href={`/__COL__/${entry.id.replace(/\\.mdx?$/, '')}`}
            class="card p-4 h-100 text-decoration-none border shadow-sm d-block"
          >
            <h3 class="h5 fw-semibold text-body mb-2 mt-0">
              {entry.data.title}
            </h3>
            {entry.data.description && (
              <p class="text-secondary mb-0 small">{entry.data.description}</p>
            )}
            {entry.data.category && (
              <span class="badge bg-secondary-subtle text-secondary-emphasis mt-2">
                {entry.data.category}
              </span>
            )}
          </a>
        </div>
      ))}
    </div>

    {entries.length === 0 && (
      <p class="text-center text-muted mt-5">
        No entries yet — add Markdown files to{' '}
        <code>usr/content/__COL__/</code> and set <code>draft: false</code>.
      </p>
    )}
  </main>
</BaseLayout>
""",

'generic': """\
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export const prerender = true;

// TODO: customise title and description below
const title = '__COL__';
const description = 'All entries in the __COL__ collection';

const entries = (await getCollection('__COL__'))
  .filter(e => !e.data.draft);
---

<BaseLayout title={title} description={description}>
  <main class="container py-5">
    <div class="mb-5">
      <h1 class="mb-0">{title}</h1>
      <p class="lead">{description}</p>
    </div>

    <ul class="list-group list-group-flush">
      {entries.map(entry => (
        <li class="list-group-item">
          <a
            href={`/__COL__/${entry.id.replace(/\\.mdx?$/, '')}`}
            class="text-decoration-none fw-semibold"
          >
            {entry.data.title}
          </a>
          {entry.data.description && (
            <p class="mb-0 text-muted small">{entry.data.description}</p>
          )}
        </li>
      ))}
    </ul>

    {entries.length === 0 && (
      <p class="text-center text-muted mt-5">
        No entries yet — add Markdown files to{' '}
        <code>usr/content/__COL__/</code> and set <code>draft: false</code>.
      </p>
    )}
  </main>
</BaseLayout>
""",
}  # end INDEX

SLUG = {

'blog': """\
---
import { getCollection, render } from 'astro:content';
import { type CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export const prerender = true;

export async function getStaticPaths() {
  const entries = await getCollection('__COL__');
  return entries.map(entry => ({
    params: { slug: entry.id.replace(/\\.mdx?$/, '') },
    props:  { entry },
  }));
}

interface Props { entry: CollectionEntry<'__COL__'>; }

const { entry } = Astro.props;
const { Content } = await render(entry);

const formattedDate = entry.data.date.toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric',
});
---

<BaseLayout title={entry.data.title} description={entry.data.description}>
  <main class="container py-5">
    <article>
      <div class="mb-4 text-end">
        <a href="/__COL__" class="btn btn-outline-secondary btn-sm">
          ← Back to __COL__
        </a>
      </div>

      <h1 class="mb-3">{entry.data.title}</h1>
      <p class="lead text-muted mb-4">{entry.data.description}</p>

      <div class="d-flex flex-wrap align-items-center gap-3 small text-muted mb-4 pb-4 border-bottom">
        <time datetime={entry.data.date.toISOString()}>{formattedDate}</time>
        {entry.data.author && <span>· By {entry.data.author}</span>}
        {entry.data.tags && entry.data.tags.map(tag => (
          <span class="badge bg-primary-subtle text-primary-emphasis">{tag}</span>
        ))}
      </div>

      {entry.data.image && (
        <img
          src={entry.data.image}
          alt={entry.data.title}
          class="img-fluid rounded mb-5 w-100"
          style="max-height:400px;object-fit:cover;"
        />
      )}

      <div class="markdown-content">
        <Content />
      </div>
    </article>
  </main>
</BaseLayout>
""",

'docs': """\
---
import { getCollection, render } from 'astro:content';
import { type CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export const prerender = true;

export async function getStaticPaths() {
  const entries = await getCollection('__COL__');
  return entries.map(entry => ({
    params: { slug: entry.id.replace(/\\.mdx?$/, '') },
    props:  { entry },
  }));
}

interface Props { entry: CollectionEntry<'__COL__'>; }

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<BaseLayout title={entry.data.title} description={entry.data.description}>
  <main class="container py-4">
    <article>
      <div class="mb-4 text-end">
        <a href="/__COL__" class="small btn btn-outline-secondary btn-sm">
          ← Back to __COL__
        </a>
      </div>

      <h1 class="mb-2">{entry.data.title}</h1>
      {entry.data.description && (
        <p class="lead text-muted mb-4">{entry.data.description}</p>
      )}
      {entry.data.category && (
        <span class="badge bg-secondary-subtle text-secondary-emphasis mb-4 d-inline-block">
          {entry.data.category}
        </span>
      )}

      <div class="markdown-content mt-4">
        <Content />
      </div>
    </article>
  </main>
</BaseLayout>
""",

'generic': """\
---
import { getCollection, render } from 'astro:content';
import { type CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export const prerender = true;

export async function getStaticPaths() {
  const entries = await getCollection('__COL__');
  return entries.map(entry => ({
    params: { slug: entry.id.replace(/\\.mdx?$/, '') },
    props:  { entry },
  }));
}

interface Props { entry: CollectionEntry<'__COL__'>; }

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<BaseLayout title={entry.data.title} description={entry.data.description}>
  <main class="container py-5">
    <article>
      <div class="mb-4 text-end">
        <a href="/__COL__" class="btn btn-outline-secondary btn-sm">
          ← Back to __COL__
        </a>
      </div>

      <h1 class="mb-3">{entry.data.title}</h1>
      {entry.data.description && (
        <p class="lead text-muted mb-4">{entry.data.description}</p>
      )}

      <div class="markdown-content mt-4">
        <Content />
      </div>
    </article>
  </main>
</BaseLayout>
""",
}  # end SLUG

def sub(s):
    return s.replace('__COL__', col_name)

index_path = os.path.join(pages_dir, 'index.astro')
slug_path  = os.path.join(pages_dir, '[...slug].astro')

with open(index_path, 'w') as f:
    f.write(sub(INDEX[col_type]))

with open(slug_path, 'w') as f:
    f.write(sub(SLUG[col_type]))

rel_index = os.path.relpath(index_path, root)
rel_slug  = os.path.relpath(slug_path,  root)
print(f'  ✔  {rel_index}')
print(f'  ✔  {rel_slug}')

PYEOF

# ─── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "${GREEN}${BOLD}Collection '${COL_NAME}' scaffolded successfully!${RESET}"
echo ""
echo "  ${BOLD}Next steps:${RESET}"
echo "    1. Open ${BOLD}usr/content/config.ts${RESET} and review the schema for '${COL_NAME}'"
echo "    2. Edit the page files in ${BOLD}usr/pages/${COL_NAME}/${RESET} to customise the UI"
echo "    3. Replace the sample file in ${BOLD}usr/content/${COL_NAME}/${RESET} with real content"
echo "    4. Run ${BOLD}npm run dev${RESET} and visit ${BOLD}/${COL_NAME}${RESET}"
echo ""

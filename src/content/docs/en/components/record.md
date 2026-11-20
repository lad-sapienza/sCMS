---
title: Record Components
description: Build single-record detail pages against Directus or bdus5 — RecordProvider, Field, Image, RecordFetcher, useRecordFetcher, and recordStaticPaths.
order: 34
category: components
---

# Record Components

A small family of components for rendering a **single record** (Directus or bdus5) as a detail page — the kind of page a `Map` popup, a `DataTb` row, or a search result would link to. They handle fetching, loading/error states, and reading fields (including nested ones) without you having to write that boilerplate for every layout.

All are exported from `@lad-sapienza/scms-core`:

```ts
import { RecordProvider, Field, Image, RecordFetcher, useRecordFetcher, recordStaticPaths } from '@lad-sapienza/scms-core';
```

## Three ways to build a record page

Pick based on how long the project's database will stay reachable, not on habit — see "Which one?" at the end of this page.

### 1. `RecordFetcher` — Astro page, client-side fetch

`RecordFetcher` is a React component that reads `table` / `id` (and optionally `fields`) from the page's URL query string, fetches the record (Directus or bdus5 — `source` picks the backend, auto-detected from `PUBLIC_BDUS_URL` when omitted) client-side, and passes it to a `Layout` component you supply.

```astro
---
// src/pages/record.astro
import { RecordFetcher } from '@lad-sapienza/scms-core';
import MyRecordLayout from '../layouts/record/default.astro';
---

<RecordFetcher Layout={MyRecordLayout} client:load />
```

Visiting `/record?table=sites&id=42` fetches `sites/42` from Directus and renders `MyRecordLayout` with `record`, `table`, and `id` props. This is the pattern used by the built-in demo at `src/pages/record.astro` (paired with `src/layouts/record/default.astro`).

`RecordFetcherProps`:

| Prop | Type | Description |
|---|---|---|
| `Layout` | `ComponentType<{ record, table, id }>` | Required. Renders once the record has loaded. |
| `source` | `'directus' \| 'bdus'` | Which backend to fetch from. Defaults to `'bdus'` when `PUBLIC_BDUS_URL` is set, else `'directus'`. |
| `directusUrl` | `string` | Defaults to `PUBLIC_DIRECTUS_URL`. |
| `directusToken` | `string` | Defaults to `PUBLIC_DIRECTUS_TOKEN`. |
| `bdusUrl` | `string` | bdus5 only. Defaults to `PUBLIC_BDUS_URL`. |
| `bdusToken` | `string` | bdus5 only. Defaults to `PUBLIC_BDUS_TOKEN`. |
| `fields` | `string` | Directus fields query, e.g. `"*.*.*"` (default). Ignored for bdus5, whose full-record endpoint always returns every field. Overridable per-request via a `?fields=` URL param. |
| `LoadingComponent` | `ComponentType` | Optional custom loading state. |
| `ErrorComponent` | `ComponentType<{ table, id }>` | Optional custom "not found" state. |

A bdus5 record arrives already flattened (`core.<field>.val` → top-level keys), so `Field`/`Image` read it exactly like a Directus one — see the main package README's "Directus vs. bdus5" for the shape differences this normalizes away (multi-select fields, geometry, bibliography).

### 2. `useRecordFetcher` — same fetch, as a hook

If you're building your own React component instead of an Astro layout, `useRecordFetcher()` gives you the same URL-driven fetch as a hook:

```tsx
// src/components/RecordView.tsx
import { useRecordFetcher } from '@lad-sapienza/scms-core';
import { RecordProvider, Field, Image } from '@lad-sapienza/scms-core';

export default function RecordView() {
  const { record, loading, error, table, id } = useRecordFetcher();

  if (loading) return <p>Loading…</p>;
  if (error || !record) return <p>Not found: {table}/{id}</p>;

  return (
    <RecordProvider record={record}>
      <h1>{record.Site_Name}</h1>
      <Field name="Description" fallback="No description" />
      <Image fieldName="Thumbnail" />
    </RecordProvider>
  );
}
```

```astro
---
// src/pages/record.astro
import RecordView from '../components/RecordView.tsx';
---
<RecordView client:load />
```

## `RecordProvider` + `Field` + `Image`

Once you have a record (from either approach above), `RecordProvider` puts it in React context so `Field` and `Image` don't need `record={record}` repeated on every usage — though both also accept an explicit `record` prop if you'd rather not use the provider.

### `Field`

Reads one value out of the record by name — including dot-path access into nested objects/arrays — with an optional transformer and fallback.

```tsx
<Field name="Site_Name" fallback="Untitled" />

<Field
  name="Latitude"
  transformer={(lat) => `${lat}, ${record.Longitude ?? '?'}`}
/>

{/* dot-path into a relation */}
<Field name="category.name" fallback="Uncategorized" />
```

`FieldProps`: `name` (string, required, dot-path supported), `transformer?: (value) => ReactNode`, `fallback?: ReactNode` (default `null`), `record?: any` (overrides context).

### `Image`

Resolves a field to one or more `<img>` tags. Handles three shapes automatically: a plain URL string, a Directus file object, and a Directus many-files relation (`directus_files_id`).

```tsx
{/* first image in the field */}
<Image fieldName="Thumbnail" className="img-fluid rounded" alt="Site photo" />

{/* a specific index */}
<Image fieldName="Gallery" index={2} />

{/* render every image in the field */}
<Image fieldName="Gallery" index="all" />

{/* Directus transform preset or custom query string */}
<Image fieldName="Thumbnail" preset="thumbnail" />
<Image fieldName="Thumbnail" custom="width=400&quality=80" />
```

`ImageProps`: `fieldName` (required), `index?: number | 'all'` (default `0`), `dEndPoint?: string` (defaults to `PUBLIC_DIRECTUS_URL`, only needed for Directus file objects — plain URL strings ignore it), `preset?: string`, `custom?: string`, `className?: string`, `alt?: string`, `record?: any`.

## Fetching a record server-side instead

If you'd rather fetch the record at request time in an Astro frontmatter block (no client-side fetch, no loading state to handle) rather than using `RecordFetcher`/`useRecordFetcher`, use the plain async helpers from `@lad-sapienza/scms-core`:

```astro
---
import { getRecordFromParams } from '@lad-sapienza/scms-core';

const record = await getRecordFromParams(Astro); // reads table/id from Astro.params
---
{record && <h1>{record.title}</h1>}
```

`getRecord({ table, id, source?, fields?, url?, token? })` and `getRecordById(table, id)` are also available for cases where `table`/`id` don't come from `Astro.params`.

This still runs **per request**: it needs `output: 'server'` (or a hybrid route) and the backend reachable at request time, same as `RecordFetcher` — it just moves the fetch off the client. For a site that outputs fully static HTML with no server at all, see the next section.

## Static record pages (`recordStaticPaths`) — no backend at request time, ever

The three options above all assume the backend (Directus/bdus5) stays reachable indefinitely — reasonable for a site that's actively maintained, much less so for the common academic case: a research project's database gets retired once the grant ends, but the site is still expected to work (and to remain citable — deposited on [Zenodo](https://zenodo.org/) for a DOI, for instance).

`recordStaticPaths` turns a content collection's entries (any `directusLoader`/`bdusLoader`-backed collection — see [Managing Content](../guides/managing-content.md) and the main README's "Directus vs. bdus5") into `getStaticPaths`' return shape, so Astro pre-renders **one static HTML page per record at build time**. The output has zero runtime dependency on anything: no live database, no API, no server — just files.

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { bdusLoader } from '@lad-sapienza/scms-core/integrations/bdusLoader';

const sites = defineCollection({ loader: bdusLoader({ tb: 'sites', mode: 'build' }) });
export const collections = { sites };
```

```astro
---
// src/pages/record/sites/[id].astro
import { getCollection } from 'astro:content';
import { recordStaticPaths, RecordProvider, Field } from '@lad-sapienza/scms-core';
import BaseLayout from '../../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const sites = await getCollection('sites');
  return recordStaticPaths(sites); // one path per site, keyed by its id
}

const { record } = Astro.props; // the full record — no fetch, no loading state
---
<BaseLayout title={record.site_name}>
  <RecordProvider record={record}>
    <h1><Field name="site_name" /></h1>
  </RecordProvider>
</BaseLayout>
```

`RecordProvider`/`Field`/`Image` don't know or care whether `record` came from a fetch or a static collection — nothing else about them changes. `recordStaticPaths(entries, { param?, idField? })`: `param` names the URL segment (default `'id'`, matching a `[id].astro` filename); `idField` keys pages by a `data` field instead of the collection entry's own id (e.g. a readable slug).

### Archiving the result

A fully static build is just a folder of files, so "deposit it to Zenodo" is close to literal:

1. Add a `CITATION.cff` (or `.zenodo.json`) to the repo describing the project/authors — [Zenodo's GitHub guide](https://docs.github.com/en/repositories/archiving-a-github-repository/referencing-and-citing-content) covers the format.
2. Enable the repository under [zenodo.org/account/settings/github](https://zenodo.org/account/settings/github) — no custom code needed.
3. Every GitHub **Release** you cut from then on is automatically archived by Zenodo with a DOI; a later release of the same repo becomes a new *version* of the same record (one DOI for "always the latest version", one per version).

## Which one?

| | Backend must stay up | When it runs | Typical use |
|---|---|---|---|
| `RecordFetcher`/`useRecordFetcher` | Forever (per page view) | Browser, every visit | Actively maintained project, content changes without a rebuild |
| `getRecordFromParams`/`getRecord` | Forever (per request) | Server, every request | Same, but you'd rather not ship a client-side fetch |
| `recordStaticPaths` | Only at build time | Build time, once | Finished project — archive the output, no ongoing hosting dependency |

## `getValueByDotPath`

The dot-path resolver used internally by `Field` and `Image` is also exported directly, for when you need the raw value without rendering it:

```ts
import { getValueByDotPath } from '@lad-sapienza/scms-core';

const lat = getValueByDotPath(record, 'geometry.coordinates.1');
```

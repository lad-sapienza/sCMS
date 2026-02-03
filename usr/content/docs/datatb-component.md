---
title: DataTb Component
description: API reference for the DataTb component - interactive data tables with sorting, filtering, and pagination
order: 13
---

# DataTb Component

Interactive data tables with built-in sorting, filtering, pagination, and multiple data source support. Built on React and TanStack Table.

**Live Examples**: See [DataTb Demo](/datatable-demo) for working examples with output.

## Basic Usage

```mdx
import { DataTb } from '@core/components/DataTb';

<!-- Simple CSV table -->
<DataTb csv="/data/file.csv" searchable pagination client:idle />

<!-- JSON data -->
<DataTb json={dataArray} searchable client:idle />

<!-- API endpoint -->
<DataTb api="/api/data" pagination client:idle />

<!-- Directus integration -->
<DataTb directus={{ collection: "items" }} searchable pagination client:idle />
```

## Props API

### DataTbProps Interface

```typescript
interface DataTbProps {
  // Column configuration
  columns?: ColumnConfig[];
  
  // Features
  searchable?: boolean;
  pagination?: boolean | PaginationConfig;
  sortable?: boolean;
  initialSort?: { columnKey: string; direction: 'asc' | 'desc' };
  
  // Styling
  className?: string;
  
  // Data sources
  source?: SourceConfig;  // Advanced configuration
  csv?: string;           // Shorthand for CSV files
  json?: any[] | string;  // Shorthand for JSON data/URL
  api?: string;           // Shorthand for API endpoints
  directus?: DirectusShorthand;  // Shorthand for Directus
  
  // Messages
  loadingMessage?: string;
  emptyMessage?: string;
  errorMessage?: string;
}
```

### ColumnConfig Interface

```typescript
interface ColumnConfig {
  key: string;              // Data property key
  header: string;           // Display header
  sortable?: boolean;       // Enable sorting
  format?: 'date' | 'number' | 'currency' | 'percent';
  labels?: Record<string, string>;  // Value mapping
  width?: string;           // CSS width
  render?: (value: any, row: DataRow) => React.ReactNode;  // Custom renderer
}
```

### SourceConfig Union

```typescript
type SourceConfig = 
  | { type: 'csv'; url: string; delimiter?: string; skipRows?: number; }
  | { type: 'json'; data?: any[]; url?: string; }
  | { type: 'api'; url: string; method?: 'GET' | 'POST'; headers?: Record<string, string>; body?: any; transformer?: (data: any) => any[]; }
  | { type: 'directus'; config: DirectusConfig; };
```

### PaginationConfig Interface

```typescript
interface PaginationConfig {
  pageSize?: number;        // Default: 10
  showPageSize?: boolean;   // Show page size selector
  pageSizeOptions?: number[]; // Available page sizes
}
```

## Data Sources

| Source Type | Shorthand Prop | Advanced Config |
|-------------|----------------|-----------------|
| **CSV Files** | `csv="/path/file.csv"` | `source={{ type: "csv", url: "...", delimiter: ";" }}` |
| **JSON Data** | `json={array}` or `json="/path/file.json"` | `source={{ type: "json", data: [...] }}` |
| **API Endpoints** | `api="/api/endpoint"` | `source={{ type: "api", url: "...", method: "POST" }}` |
| **Directus CMS** | `directus={{ collection: "table" }}` | `source={{ type: "directus", config: {...} }}` |

## Column Formatting

```mdx
<DataTb 
  json={data}
  columns={[
    { key: "date", header: "Date", format: "date" },
    { key: "amount", header: "Price", format: "currency" },
    { key: "status", header: "Status", labels: { "1": "Active", "0": "Inactive" } }
  ]}
  client:idle 
/>
```

## Function Limitations in MDX

❌ **Functions don't work in MDX props**:
```mdx
<!-- This fails due to serialization -->
<DataTb columns={[{ key: "col", render: (val) => <span>{val}</span> }]} />
```

✅ **Use React wrapper components**:
```tsx
// usr/components/MyTable.tsx
export default function MyTable() {
  const columns = [{ key: "col", render: (val) => <span>{val}</span> }];
  return <DataTb columns={columns} json={data} client:idle />;
}
```

## Accessibility

- Keyboard navigation for sorting and pagination
- Screen reader support with proper ARIA labels
- Focus management and visual indicators
- Loading/error state announcements

## Related

- **[DataTb Demo](/datatable-demo)** - Live examples and use cases
- **[Map Component](./map-component)** - For geographic data visualization
- **[Gallery Component](./gallery-component)** - For image-based data

### Custom CSS Classes

```mdx
<DataTb 
  json={data}
  className="border-2 border-blue-300 rounded-lg shadow-lg"
  client:idle 
/>
```

### Column Widths

```mdx
<DataTb 
  json={data}
  columns={[
    { key: "id", header: "ID", width: "80px" },
    { key: "name", header: "Name", width: "200px" },
    { key: "description", header: "Description" } // Auto-width
  ]}
  client:idle 
/>
```

### CSS Variables for Theming

```css
:root {
  --datatb-border-color: #e5e7eb;
  --datatb-header-bg: #f9fafb;
  --datatb-row-hover: #f3f4f6;
  --datatb-text-color: #111827;
}
```

## Advanced Examples

### Research Data Portal

```mdx
import { DataTb } from '@core/components/DataTb';

<DataTb 
  directus={{
    collection: "archaeological_finds",
    fields: ["id", "site_name", "artifact_type", "date_found", "condition", "image_url"],
    filter: { status: { _eq: "verified" } },
    limit: 1000
  }}
  searchable
  pagination={{
    pageSize: 50,
    showPageSize: true,
    pageSizeOptions: [25, 50, 100, 200]
  }}
  columns={[
    { key: "id", header: "ID", width: "80px" },
    { key: "site_name", header: "Site", sortable: true },
    { key: "artifact_type", header: "Type", sortable: true },
    { key: "date_found", header: "Date Found", format: "date" },
    { key: "condition", header: "Condition", labels: {
      "excellent": "🟢 Excellent",
      "good": "🟡 Good", 
      "fair": "🟠 Fair",
      "poor": "🔴 Poor"
    }},
    { 
      key: "image_url", 
      header: "Image",
      render: (url, row) => url ? (
        <img src={url} alt={row.artifact_type} className="w-12 h-12 object-cover rounded" />
      ) : (
        <span className="text-gray-400">No image</span>
      )
    }
  ]}
  initialSort={{ columnKey: "date_found", direction: "desc" }}
  client:idle
/>
```

### Simple API Integration

```mdx
import { DataTb } from '@core/components/DataTb';

<!-- Simple API call (works if API returns array directly) -->
<DataTb 
  api="/api/simple-data"
  searchable
  pagination
  columns={[
    { key: "year", header: "Year", sortable: true },
    { key: "site", header: "Site" },
    { key: "artifacts_found", header: "Artifacts", format: "number" },
    { key: "budget", header: "Budget", format: "currency" },
    { key: "team_size", header: "Team Size", format: "number" }
  ]}
  client:idle
/>
```

## Error Handling

### Custom Error Messages

```mdx
<DataTb 
  csv="/data/nonexistent.csv"
  errorMessage="Unable to load research data. Please try again later."
  loadingMessage="Loading archaeological data..."
  emptyMessage="No artifacts match your search criteria."
  client:idle 
/>
```

### Error State Detection

The component automatically handles:
- **Network errors** - Failed data fetching
- **Parse errors** - Invalid CSV/JSON format  
- **Empty data** - No rows returned
- **Loading states** - Data fetching in progress

## Performance Optimization

### Large Datasets

For datasets with thousands of rows:

```mdx
<DataTb 
  csv="/data/large-dataset.csv"
  pagination={{
    pageSize: 50,
    showPageSize: true
  }}
  searchable
  client:idle 
/>
```

### Lazy Loading

```mdx
<DataTb 
  directus={{
    collection: "artifacts",
    limit: 100  // Start with subset
  }}
  pagination
  client:visible  // Load when component becomes visible
/>
```

## Accessibility Features

- ✅ **Keyboard Navigation** - Full keyboard support for sorting and pagination
- ✅ **Screen Reader Support** - Proper ARIA labels and table semantics  
- ✅ **Focus Management** - Clear focus indicators and logical tab order
- ✅ **Sort Indicators** - Visual and screen reader sort direction feedback
- ✅ **Loading States** - Accessible loading and error announcements

## Integration Patterns

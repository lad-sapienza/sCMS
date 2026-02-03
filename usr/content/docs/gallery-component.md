---
title: Gallery Component
description: API reference for the Gallery component - responsive image galleries with lightbox and filtering
order: 12
---

# Gallery Component

Responsive image galleries with lightbox modal, filtering, sorting, and multiple layout options. Supports various data sources including JSON, CSV, and Directus.

**Live Examples**: See [Gallery Demo](/gallery-demo) for working examples with output.

## Basic Usage

```mdx
import { Gallery } from '@core/components/Gallery';

<!-- Simple image gallery -->
<Gallery 
  json={[
    { src: "/images/photo1.jpg", alt: "Description", title: "Photo 1" },
    { src: "/images/photo2.jpg", alt: "Description", title: "Photo 2" }
  ]}
  columns={3}
  client:idle 
/>

<!-- CSV data source -->
<Gallery csv="/data/images.csv" lightbox client:idle />
```

## Props API

### GalleryProps Interface

```typescript
interface GalleryProps {
  // Layout
  columns?: number | ResponsiveColumns; // Default: 3
  gap?: string;                        // CSS gap value
  aspectRatio?: string;                // CSS aspect ratio
  
  // Features
  lightbox?: boolean;                  // Enable lightbox modal
  filterable?: boolean;                // Enable category filtering
  sortable?: boolean;                  // Enable sorting options
  
  // Data sources
  source?: SourceConfig;               // Advanced configuration
  json?: GalleryItem[] | string;       // JSON data or URL
  csv?: string;                        // CSV file URL
  directus?: DirectusShorthand;        // Directus collection
  
  // Customization
  className?: string;
  imageClassName?: string;
  
  // Loading states
  loadingMessage?: string;
  emptyMessage?: string;
  errorMessage?: string;
}

interface GalleryItem {
  src: string;                         // Image URL
  alt?: string;                        // Alt text
  title?: string;                      // Image title
  description?: string;                // Detailed description
  category?: string;                   // Filter category
  date?: string;                       // Date for sorting
  width?: number;                      // Original width
  height?: number;                     // Original height
}
```

## Layout Options

```mdx
<!-- Grid layouts -->
<Gallery json={images} columns={2} client:idle />      <!-- 2 columns -->
<Gallery json={images} columns={4} client:idle />      <!-- 4 columns -->

<!-- Responsive columns -->
<Gallery 
  json={images}
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  client:idle 
/>

<!-- Custom aspect ratio -->
<Gallery 
  json={images}
  aspectRatio="16/9"
  gap="1rem"
  client:idle 
/>
```

## Data Sources

| Source Type | Configuration | Description |
|-------------|---------------|-------------|
| **JSON** | `json={itemsArray}` or `json="/data/images.json"` | Inline data or JSON file |
| **CSV** | `csv="/data/images.csv"` | CSV with src, alt, title columns |
| **Directus** | `directus={{ collection: "gallery" }}` | CMS image collections |

## Features

```mdx
<!-- Full-featured gallery -->
<Gallery 
  json={images}
  lightbox                    <!-- Click to open in modal -->
  filterable                  <!-- Show category filters -->
  sortable                    <!-- Enable sort options -->
  columns={3}
  gap="0.5rem"
  className="rounded-lg overflow-hidden"
  client:idle 
/>
```

## Function Limitations in MDX

❌ **Functions don't work in MDX props**:
```mdx
<!-- This fails due to serialization -->
<Gallery onImageClick={(image) => console.log(image)} />  <!-- ❌ -->
```

✅ **Use React wrapper components**:
```tsx
// usr/components/CustomGallery.tsx
export default function CustomGallery() {
  return (
    <Gallery 
      json={images}
      onImageClick={(image) => console.log(image)}  // ✅ This works
      lightbox
      client:idle 
    />
  );
}
```

## Accessibility

- Keyboard navigation for image browsing
- Screen reader support with proper alt text
- Focus management in lightbox modal
- High contrast support

## Related

- **[Gallery Demo](/gallery-demo)** - Live examples and use cases
- **[Map Component](./map-component)** - For geographic image data
- **[DataTb Component](./datatb-component)** - For tabular image metadata
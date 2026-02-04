---
title: ZoteroGeoViewer Component
description: API reference for the ZoteroGeoViewer component - visualize Zotero group libraries with geographical coordinates on interactive maps
order: 15
---

# ZoteroGeoViewer Component

Interactive visualization of Zotero group library items with geographical coordinates. Displays items on a map with tag-based filtering, live statistics, and preview of recent additions. Perfect for research projects with geographical components.

**Live Examples**: See [Zotero Demo](/zotero-demo) and [Zotero Minimal](/zotero-minimal) for working examples with output.

## Basic Usage

```mdx
import { ZoteroGeoViewer } from '@core/components/ZoteroGeoViewer';

<!-- Minimal setup -->
<ZoteroGeoViewer groupId={336647} client:load />

<!-- Custom layout and styling -->
<ZoteroGeoViewer 
  groupId={336647}
  layout="8x4"
  mapHeight="600px"
  mapCenter="20.5,40.0,8"
  tagAutocomplete={true}
  client:load 
/>
```

## Props API

### ZoteroGeoViewerProps Interface

```typescript
interface ZoteroGeoViewerProps {
  // Required
  groupId: number;          // Zotero group library ID

  // Layout and styling
  layout?: LayoutType;      // Display layout configuration
  mapHeight?: string;       // Height of map container (default: "600px")
  mapCenter?: string;       // Map center as "lng,lat,zoom" (default: "20.5,40.0,8")
  
  // Functionality
  tagAutocomplete?: boolean; // Enable tag autocomplete (default: true)
  maxItems?: number;        // Maximum items to fetch (default: 1000)
}
```

### Layout Types

```typescript
type LayoutType = 
  | 'vertical'    // Map on top, controls below
  | 'horizontal'  // Side-by-side layout
  | '6x6'         // Equal split (50/50)
  | '8x4'         // Map emphasis (67/33) - default
  | '4x8'         // Controls emphasis (33/67)
  | '12x4';       // Full-width map with controls below
```

## Layout Options

### Grid Layouts

```mdx
<!-- Equal split layout -->
<ZoteroGeoViewer groupId={336647} layout="6x6" client:load />

<!-- Map-focused layout (default) -->
<ZoteroGeoViewer groupId={336647} layout="8x4" client:load />

<!-- Controls-focused layout -->
<ZoteroGeoViewer groupId={336647} layout="4x8" client:load />
```

### Vertical & Horizontal Layouts

```mdx
<!-- Stacked layout -->
<ZoteroGeoViewer 
  groupId={336647} 
  layout="vertical"
  mapHeight="400px"
  client:load 
/>

<!-- Side-by-side layout -->
<ZoteroGeoViewer 
  groupId={336647} 
  layout="horizontal"
  client:load 
/>
```

## Configuration Examples

### Custom Map Settings

```mdx
<ZoteroGeoViewer 
  groupId={336647}
  layout="8x4"
  mapHeight="800px"
  mapCenter="12.5,42.0,6"
  client:load 
/>
```

### Performance Tuning

```mdx
<ZoteroGeoViewer 
  groupId={336647}
  maxItems={500}
  tagAutocomplete={false}
  client:load 
/>
```

## Features

### 📍 Geographical Visualization
- **Interactive map** with location markers sized by item count
- **Popup windows** showing item details and direct links to Zotero
- **Automatic map bounds** fitting to display all data points
- **Multiple basemaps** including satellite, terrain, and standard views

### 🏷️ Tag-based Filtering
- **Real-time search** through Zotero tags with instant filtering
- **Autocomplete suggestions** for easy tag discovery
- **Client-side filtering** for responsive interaction
- **Alternative tag names** support for flexible searching

### 📊 Live Statistics
- **Total items** in the library
- **Georeferenced items** count showing mapped vs. unmapped items
- **Unique locations** count
- **Dynamic updates** as you filter by tags

### 📚 Recent Items Preview
- **Latest additions** to the library with publication details
- **Direct links** to Zotero items for quick access
- **Author and publication** information display
- **Responsive layout** adapting to available space

## Data Requirements

### Zotero Group Library
- **Public group** or accessible via API
- **Items with tags** that correspond to geographical locations
- **Coordinate data file** mapping tag names to coordinates

### Coordinate Mapping File
The component requires a GeoJSON file at `/data/zoteroTagCoordinates.geojson` with the structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Primary Tag Name",
        "altLabel": "Alternative names, separated by commas"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      }
    }
  ]
}
```

## Usage in Different Contexts

### In MDX Files

```mdx
---
title: "Research Map"
layout: '@layouts/MdxLayout.astro'
---

import { ZoteroGeoViewer } from '@core/components/ZoteroGeoViewer';

# Archaeological Sites Bibliography

<ZoteroGeoViewer 
  groupId={336647}
  layout="6x6"
  mapHeight="500px"
  client:load 
/>
```

### In Astro Components

```astro
---
import { ZoteroGeoViewer } from '@core/components/ZoteroGeoViewer';
---

<section class="research-section">
  <h2>Geographic Bibliography</h2>
  <ZoteroGeoViewer 
    groupId={336647}
    layout="8x4"
    client:idle
  />
</section>
```

### In React Components

```tsx
import { ZoteroGeoViewer } from '@core/components/ZoteroGeoViewer';

export function ResearchDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ZoteroGeoViewer
        groupId={336647}
        layout="vertical"
        mapHeight="400px"
      />
    </div>
  );
}
```

## Client Hydration

The ZoteroGeoViewer is a React component that requires client-side JavaScript. Choose the appropriate hydration strategy:

```mdx
<!-- Load immediately on page load -->
<ZoteroGeoViewer groupId={336647} client:load />

<!-- Load when component becomes visible -->
<ZoteroGeoViewer groupId={336647} client:visible />

<!-- Load when browser is idle -->
<ZoteroGeoViewer groupId={336647} client:idle />

<!-- Load only on specific media queries -->
<ZoteroGeoViewer groupId={336647} client:media="(min-width: 768px)" />
```

## Styling and Customization

### CSS Classes
The component uses Tailwind CSS classes and can be customized via:

```css
/* Custom styling in your CSS files */
.zotero-geo-viewer {
  /* Override container styles */
}

.zotero-geo-viewer .map-container {
  /* Customize map container */
}

.zotero-geo-viewer .controls-panel {
  /* Style the controls panel */
}
```

### Responsive Behavior
- **Mobile (< 768px)**: Always stacked layout regardless of layout prop
- **Tablet (768px+)**: Grid layouts become active
- **Desktop (1024px+)**: Full responsive grid system

## Performance Considerations

### Data Loading
- **Lazy loading** with `client:idle` for non-critical content
- **Progressive enhancement** with graceful loading states
- **Efficient API calls** to Zotero with error handling
- **Client-side filtering** for responsive tag search

### Optimization Tips
```mdx
<!-- Limit items for better performance -->
<ZoteroGeoViewer groupId={336647} maxItems={500} client:idle />

<!-- Disable autocomplete for large tag sets -->
<ZoteroGeoViewer groupId={336647} tagAutocomplete={false} client:load />

<!-- Use appropriate hydration strategy -->
<ZoteroGeoViewer groupId={336647} client:visible />
```

## Technical Dependencies

### Core Technologies
- **React** with hooks for state management
- **MapLibre GL** for interactive map rendering
- **Tailwind CSS** for responsive styling
- **Zotero API** for bibliographic data access

### Data Flow
1. **Fetches** Zotero group library items via public API
2. **Loads** coordinate mapping from GeoJSON file
3. **Matches** Zotero item tags to geographical coordinates
4. **Renders** interactive map with statistical dashboard
5. **Updates** display based on real-time tag filtering

## Troubleshooting

### Common Issues

**Map not showing**: Ensure group ID is correct and library is public
```mdx
<!-- Verify with a known public group -->
<ZoteroGeoViewer groupId={336647} client:load />
```

**No location markers**: Check that coordinate mapping file exists and tag names match
```bash
# Verify coordinate file exists
ls public/data/zoteroTagCoordinates.geojson
```

**Layout not responsive**: Ensure Tailwind CSS includes core directory in content configuration
```js
// tailwind.config.js
content: [
  './usr/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  './core/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
],
```

**Performance issues**: Reduce maxItems or disable autocomplete for large datasets
```mdx
<ZoteroGeoViewer 
  groupId={336647} 
  maxItems={250}
  tagAutocomplete={false}
  client:idle 
/>
```

## Migration Notes

### From Legacy ZoteroGeoViewer.js
- **React hooks** replace class-based component patterns
- **TypeScript support** with full type safety
- **Improved performance** with better data handling
- **Enhanced UX** with loading states and error handling
- **s:CMS integration** following framework component patterns

### Configuration Changes
- Props are now strongly typed with TypeScript
- Layout options use standardized grid system (6x6, 8x4, etc.)
- Client hydration directives are required for interactivity
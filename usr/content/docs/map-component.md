---
title: Map Component
description: API reference for the Map component - interactive maps with vector data visualization and search
order: 14
---

# Map Component

Interactive maps with vector tiles, GeoJSON data visualization, search capabilities, and customizable styling. Built on MapLibre GL JS.

**Live Examples**: See [Map Demo](/map-demo) for working examples with output.

## Basic Usage

```mdx
import { Map } from '@core/components/Map';

<!-- Simple map -->
<Map height="400px" center={[12.4924, 41.8902]} zoom={10} client:idle />

<!-- Map with GeoJSON data -->
<Map 
  height="500px"
  center={[12.4924, 41.8902]}
  vectorLayers={[{
    id: "sites",
    source: { type: "geojson", url: "/data/sites.geojson" },
    style: { circleColor: "#ff6b6b", circleRadius: 6 }
  }]}
  searchable
  client:idle 
/>
```

## Props API

### MapProps Interface

```typescript
interface MapProps {
  // Dimensions and viewport
  height?: string;          // Default: "400px"
  center?: [number, number]; // [lng, lat] coordinates
  zoom?: number;            // Default: 2
  
  // Styling
  mapStyle?: string | object;       // MapLibre style JSON (URL/object)
  baseLayers?: BaseLayerConfig[];   // Predefined basemaps
  
  // Data layers
  vectorLayers?: VectorLayerConfig[];
  
  // Features
  searchable?: boolean | SearchConfig;
  controls?: MapControlsConfig;
  interactive?: boolean;    // Default: true
  
  // Callbacks
  onMapLoad?: (map: MapLibreMap) => void;
}
```

### VectorLayerConfig Interface

```typescript
interface VectorLayerConfig {
  id: string;
  source: VectorSourceConfig;
  style: VectorStyleConfig;
  searchable?: boolean;
  searchFields?: string[];
  popup?: PopupConfig;
  visible?: boolean;
  minZoom?: number;
  maxZoom?: number;
}

type VectorSourceConfig = 
  | { type: 'geojson'; url: string; }
  | { type: 'geojson'; data: GeoJSON.FeatureCollection; }
  | { type: 'csv'; url: string; latField: string; lngField: string; }
  | { type: 'directus'; collection: string; geoField: string; };

interface VectorStyleConfig {
  // Point styles
  circleRadius?: number | StyleExpression;
  circleColor?: string | StyleExpression;
  circleStrokeColor?: string;
  circleStrokeWidth?: number;
  
  // Polygon styles  
  fillColor?: string | StyleExpression;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  
  // Line styles
  lineColor?: string | StyleExpression;
  lineWidth?: number;
}
```

## Data Sources

| Source Type | Configuration | Description |
|-------------|---------------|-------------|
| **GeoJSON** | `{ type: "geojson", url: "/data/file.geojson" }` | Vector geographic data |
| **CSV Points** | `{ type: "csv", url: "/data/points.csv", latField: "lat", lngField: "lng" }` | Point data from CSV |
| **Directus** | `{ type: "directus", collection: "sites", geoField: "location" }` | CMS geographic data |

## Map Styles

```mdx
<!-- MapLibre style JSON (URL or local file) -->
<Map mapStyle="https://api.maptiler.com/maps/street.json?key=KEY" />
<Map mapStyle="/data/custom-style.json" />

<!-- Style object -->
<Map mapStyle={customStyleObject} />

<!-- Use baseLayers for predefined maps -->
<Map baseLayers={['EsriSatellite']} />  <!-- Satellite imagery -->
<Map baseLayers={['OSM']} />            <!-- OpenStreetMap -->
<Map baseLayers={['GoogleTerrain']} />  <!-- Terrain -->
<Map baseLayers={['CartoDB']} />        <!-- Dark theme -->
```

## Vector Layers

```mdx
<!-- GeoJSON data -->
<Map 
  vectorLayers={[{
    id: "sites",
    source: { type: "geojson", url: "/data/sites.geojson" },
    style: { circleColor: "#ff6b6b", circleRadius: 6 },
    searchable: true,
    searchFields: ["name", "type"]
  }]}
  searchable
  client:idle 
/>

<!-- CSV point data -->
<Map 
  vectorLayers={[{
    id: "points",
    source: { type: "csv", url: "/data/points.csv", latField: "lat", lngField: "lng" },
    style: { circleColor: "#4ecdc4", circleRadius: 8 }
  }]}
/>
```

## Styling

```mdx
<!-- Data-driven styling -->
<Map 
  vectorLayers={[{
    id: "data-driven",
    source: { type: "geojson", url: "/data/sites.geojson" },
    style: {
      circleColor: [
        "match",
        ["get", "type"],
        "Roman", "#e74c3c",
        "Medieval", "#3498db",
        "#95a5a6"  // default
      ],
      circleRadius: [
        "interpolate", ["linear"], ["get", "importance"],
        1, 4,
        10, 16
      ]
    }
  }]}
/>
```

## Function Limitations in MDX

❌ **Functions don't work in MDX props**:
```mdx
<!-- This fails due to serialization -->
<Map onMapLoad={(map) => console.log(map)} />  <!-- ❌ -->
```

✅ **Use React wrapper components**:
```tsx
// usr/components/InteractiveMap.tsx
export default function InteractiveMap() {
  return (
    <Map 
      onMapLoad={(map) => console.log(map)}  // ✅ This works
      vectorLayers={layers}
      client:idle 
    />
  );
}
```

## Accessibility

- Keyboard navigation for map interaction
- Screen reader support with accessible descriptions
- Focus management for interactive elements
- High contrast and reduced motion support

## Related

- **[Map Demo](/map-demo)** - Live examples and use cases
- **[DataTb Component](./datatb-component)** - For tabular geographic data
- **[Gallery Component](./gallery-component)** - For image collections
/**
 * Map Component Types
 */

import type { SourceConfig } from '../../utils/data-fetcher';
import type { BasemapKey } from './defaultBasemaps';
import type { FilterObject } from './utils';

export type ControlPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BaseLayerConfig {
  name: string;
  url: string;
  attribution?: string;
}

export interface VectorLayerConfig {
  /** Layer name/ID */
  name: string;
  
  /** Data source configuration */
  source: SourceConfig;
  
  /** Layer style (MapLibre paint/layout properties) */
  style?: any;
  
  /** Popup template string (e.g., "<b>${Title}</b>: ${Description}") */
  popupTemplate?: string;
  
  /** Initial visibility */
  visible?: boolean;
  
  /** Fit map bounds to layer content */
  fitToContent?: boolean;
}

export interface MapProps {
  /** Map height (CSS string) */
  height?: string;
  
  /** Initial center [lng, lat, zoom] as string "lng,lat,zoom" */
  center?: string;
  
  /** MapLibre style object or URL (for full style specification) */
  mapStyle?: string | object;
  
  /** Overrides/expansions for mapStyle layers */
  styleOverrides?: {
    [layerId: string]: {
      /** Override layer paint properties */
      paint?: any;
      /** Override layer layout properties */
      layout?: any;
      /** Add popup template (expanded feature) */
      popupTemplate?: string;
      /** Fit map to layer bounds (expanded feature) */
      fitToContent?: boolean;
      /** Initial visibility (expanded feature) */
      visible?: boolean;
    };
  };
  
  /** Base layers configuration (can be array of configs or array of basemap keys) */
  baseLayers?: BaseLayerConfig[] | BasemapKey[];
  
  /** Vector layers configuration (alternative to children for hydration-safe usage) */
  vectorLayers?: VectorLayerConfig[];
  
  /** Controls positions (null/undefined to hide) */
  geolocateControl?: ControlPosition;
  fullscreenControl?: ControlPosition;
  navigationControl?: ControlPosition;
  scaleControl?: ControlPosition;
  
  /** Show layer control for basemap switching (default: true) */
  layerControl?: boolean | ControlPosition;
  
  /** Optional sprite URL */
  sprite?: string;
  
  /** GeoJSON shorthand - for simple single-layer maps */
  geojson?: string | object | {
    path: string;
    name?: string;
    style?: any;
    popup?: string;
    fitToContent?: boolean;
    filter?: FilterObject | ((feature: any) => boolean);
  };
  
  /** CSV shorthand - for simple single-layer maps */
  csv?: string | {
    path: string;
    lng: string;
    lat: string;
    name?: string;
    style?: any;
    popup?: string;
    fitToContent?: boolean;
    filter?: FilterObject | ((row: any) => boolean);
  };
  
  /** JSON shorthand - for simple single-layer maps */
  json?: any[] | string;
  
  /** Directus shorthand - for simple single-layer maps */
  directus?: {
    table: string;
    geoField?: string;
    queryString?: string;
    url?: string;
    token?: string;
    name?: string;
    style?: any;
    popup?: string;
    fitToContent?: boolean;
  };
}

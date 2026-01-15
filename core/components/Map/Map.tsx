import React, { useState, useMemo, useEffect } from 'react';
import MapLibreMap, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
  type MapRef
} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapProps } from './types';
import { RasterLayerLibre } from './RasterLayerLibre';
import { LayerControl } from './LayerControl';
import type { BaseLayerConfig } from './types';
import { defaultBasemaps, getBasemap, type BasemapKey } from './defaultBasemaps';
import { fetchData } from '../../utils/data-fetcher';
import { dataToGeoJson, parseStringTemplate } from './utils';
import type { FeatureCollection } from 'geojson';
import type { CircleLayerSpecification } from 'maplibre-gl';

// Default base layer (OSM)
const DEFAULT_BASE_LAYERS: BaseLayerConfig[] = [defaultBasemaps.OSM];

export function Map({
  height = '600px',
  center = '0,0,2',
  mapStyle,
  baseLayers = DEFAULT_BASE_LAYERS,
  vectorLayers = [],
  geolocateControl,
  fullscreenControl,
  navigationControl,
  scaleControl,
  layerControl = true,
  geojson,
  csv,
  json,
}: MapProps) {
  const [lng, lat, zoom] = center.split(',').map(Number);
  const [activeBaseLayer, setActiveBaseLayer] = useState<number>(0);
  const [layersData, setLayersData] = useState<Record<string, FeatureCollection>>({});
  const [hoveredFeature, setHoveredFeature] = useState<any>(null);
  const [vectorLayerVisibility, setVectorLayerVisibility] = useState<Record<string, boolean>>({});
  const mapRef = React.useRef<MapRef>(null);
  const loadedLayers = React.useRef<Set<string>>(new Set());

  // Resolve baseLayers - support both BaseLayerConfig[] and BasemapKey[]
  const resolvedBaseLayers = useMemo(() => {
    if (!baseLayers || baseLayers.length === 0) return DEFAULT_BASE_LAYERS;
    
    // Check if first element is a string (basemap key) or object (BaseLayerConfig)
    if (typeof baseLayers[0] === 'string') {
      // It's an array of basemap keys
      return (baseLayers as BasemapKey[])
        .map(key => getBasemap(key))
        .filter((config): config is BaseLayerConfig => config !== undefined);
    }
    
    // It's already an array of BaseLayerConfig
    return baseLayers as BaseLayerConfig[];
  }, [baseLayers]);

  // Determine implicit source configuration from shorthand props
  const implicitSource = useMemo(() => {
    if (geojson) {
      if (typeof geojson === 'string') {
        return { type: 'geojson', url: geojson } as const;
      } else if ('path' in geojson) {
        return { type: 'geojson', url: geojson.path } as const;
      } else {
        return { type: 'geojson', data: geojson } as const;
      }
    }
    if (csv) {
      if (typeof csv === 'string') {
        return { type: 'csv', url: csv } as const;
      } else {
        return { type: 'csv', url: csv.path, lng: csv.lng, lat: csv.lat } as const;
      }
    }
    if (json) return { type: 'json', data: Array.isArray(json) ? json : undefined, url: typeof json === 'string' ? json : undefined } as const;
    return null;
  }, [geojson, csv, json]);

  // Combine explicit vectorLayers with implicit source
  const allVectorLayers = useMemo(() => {
    const layers = [...vectorLayers];
    if (implicitSource) {
      let layerName = 'Default Layer';
      const layerConfig: any = {
        name: layerName,
        source: implicitSource,
        fitToContent: true,
        visible: true
      };
      
      // Add style, popup, and name from shorthand config if provided
      if (geojson && typeof geojson === 'object' && 'path' in geojson) {
        if (geojson.name) layerConfig.name = geojson.name;
        if (geojson.style) layerConfig.style = geojson.style;
        if (geojson.popup) layerConfig.popupTemplate = geojson.popup;
      }
      if (csv && typeof csv === 'object' && 'path' in csv) {
        if (csv.name) layerConfig.name = csv.name;
        if (csv.style) layerConfig.style = csv.style;
        if (csv.popup) layerConfig.popupTemplate = csv.popup;
      }
      
      layers.push(layerConfig);
    }
    return layers;
  }, [vectorLayers, implicitSource, geojson, csv]);

  // Initialize and update visibility when layers change
  useEffect(() => {
    setVectorLayerVisibility(prev => {
      const newVisibility: Record<string, boolean> = { ...prev };
      let hasChanges = false;
      
      allVectorLayers.forEach(layer => {
        const layerId = `layer-${layer.name.replace(/\s+/g, '-')}`;
        
        if (newVisibility[layerId] === undefined) {
          newVisibility[layerId] = layer.visible !== false;
          hasChanges = true;
        }
      });
      
      return hasChanges ? newVisibility : prev;
    });
  }, [allVectorLayers]);

  // Handle vector layer visibility toggle
  const handleVectorLayerToggle = (layerId: string) => {
    setVectorLayerVisibility(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  // Load data for all vector layers
  useEffect(() => {
    const loadAllLayers = async () => {
      const newLayersData: Record<string, FeatureCollection> = {};
      const layersToLoad: typeof allVectorLayers = [];
      
      // Check which layers need to be loaded
      for (const layer of allVectorLayers) {
        const layerKey = JSON.stringify(layer.source);
        if (!loadedLayers.current.has(layerKey) && layer.visible !== false) {
          layersToLoad.push(layer);
        }
      }
      
      // Only proceed if there are new layers to load
      if (layersToLoad.length === 0) return;
      
      for (const layer of layersToLoad) {
        try {
          const data = await fetchData(layer.source);
          
          // Extract custom column names from CSV source if provided
          const customLng = layer.source.type === 'csv' ? layer.source.lng : undefined;
          const customLat = layer.source.type === 'csv' ? layer.source.lat : undefined;
          
          const geoJson = dataToGeoJson(data, customLng, customLat);
          newLayersData[layer.name] = geoJson;
          
          // Mark this layer as loaded
          const layerKey = JSON.stringify(layer.source);
          loadedLayers.current.add(layerKey);
          
          // Fit bounds to first layer with fitToContent
          if (layer.fitToContent && mapRef.current && geoJson.features.length > 0) {
            const coordinates = geoJson.features.flatMap(f => {
              const geom = f.geometry;
              if (geom.type === 'Point') {
                return [geom.coordinates];
              } else if (geom.type === 'LineString') {
                return geom.coordinates;
              } else if (geom.type === 'Polygon') {
                return geom.coordinates[0];
              }
              return [];
            });
            
            if (coordinates.length > 0) {
              const lons = coordinates.map(c => c[0]);
              const lats = coordinates.map(c => c[1]);
              const bounds: [[number, number], [number, number]] = [
                [Math.min(...lons), Math.min(...lats)],
                [Math.max(...lons), Math.max(...lats)]
              ];
              mapRef.current.fitBounds(bounds, { padding: 50 });
            }
          }
        } catch (err) {
          console.error(`Failed to load layer "${layer.name}":`, err);
          // Continue loading other layers even if one fails
        }
      }
      
      // Only update state if we actually loaded new data
      if (Object.keys(newLayersData).length > 0) {
        setLayersData(prev => ({ ...prev, ...newLayersData }));
      }
    };
    
    if (allVectorLayers.length > 0 && typeof window !== 'undefined') {
      loadAllLayers();
    }
  }, [allVectorLayers]);

  return (
    <div style={{ height, position: 'relative', width: '100%' }}>
      <MapLibreMap
        ref={mapRef}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: zoom
        }}
        mapStyle={mapStyle as any}
        style={{ width: '100%', height: '100%' }}
        onClick={(e: any) => {
          // Check if any vector layer with popup was clicked
          if (e.features && e.features.length > 0) {
            // Find the layer config for this feature
            const clickedLayerId = e.features[0].layer?.id;
            const layerConfig = allVectorLayers.find(l => {
              const layerId = `layer-${l.name.replace(/\s+/g, '-')}`;
              return layerId === clickedLayerId;
            });
            
            if (layerConfig?.popupTemplate) {
              setHoveredFeature({
                feature: e.features[0],
                lngLat: e.lngLat,
                template: layerConfig.popupTemplate
              });
            }
          }
        }}
        interactiveLayerIds={allVectorLayers.map(l => `layer-${l.name.replace(/\s+/g, '-')}`)}
      >
        {/* Base Layers (only if no full mapStyle is provided) - render ALL but control visibility */}
        {!mapStyle && resolvedBaseLayers.map((layer, index) => (
          <RasterLayerLibre 
            key={`basemap-${index}`}
            id={`base-layer-${index}`}
            url={[layer.url]}
            attribution={layer.attribution}
            visible={index === activeBaseLayer}
          />
        ))}

        {/* Vector Layers from prop - render AFTER base layer so they appear on top */}
        {allVectorLayers.map((layer) => {
          const geoJson = layersData[layer.name];
          const layerId = `layer-${layer.name.replace(/\s+/g, '-')}`;
          const sourceId = `source-${layer.name}`;
          const isVisible = vectorLayerVisibility[layerId] !== false;
          
          if (!geoJson) return null;
          
          const defaultStyle: CircleLayerSpecification = {
            id: layerId,
            type: 'circle',
            source: sourceId,
            paint: {
              'circle-radius': 6,
              'circle-color': '#3b82f6',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff'
            }
          };
          
          // Merge custom style with default, ensuring id is preserved
          const layerStyle = layer.style 
            ? { ...defaultStyle, ...layer.style, id: layerId, source: sourceId }
            : defaultStyle;
          
          return (
            <Source key={sourceId} id={sourceId} type="geojson" data={geoJson}>
              <Layer 
                {...layerStyle}
                layout={{
                  ...layerStyle.layout,
                  visibility: isVisible ? 'visible' : 'none'
                }}
              />
            </Source>
          );
        })}

        {/* Controls */}
        {geolocateControl && <GeolocateControl position={geolocateControl} />}
        {fullscreenControl && <FullscreenControl position={fullscreenControl} />}
        {navigationControl && <NavigationControl position={navigationControl} />}
        {scaleControl && <ScaleControl position={scaleControl} />}

        {!mapStyle && layerControl && (
          <LayerControl 
            baseLayers={resolvedBaseLayers}
            activeBaseLayer={activeBaseLayer}
            onBaseLayerChange={setActiveBaseLayer}
            vectorLayers={allVectorLayers.map(layer => ({
              ...layer,
              id: `layer-${layer.name.replace(/\s+/g, '-')}`
            }))}
            vectorLayerVisibility={vectorLayerVisibility}
            onVectorLayerToggle={handleVectorLayerToggle}
          />
        )}

        {/* Popup */}
        {hoveredFeature && (
          <Popup
            longitude={hoveredFeature.lngLat.lng}
            latitude={hoveredFeature.lngLat.lat}
            onClose={() => setHoveredFeature(null)}
            closeOnClick={false}
          >
            <div dangerouslySetInnerHTML={{ 
              __html: parseStringTemplate(
                hoveredFeature.template, 
                hoveredFeature.feature.properties
              ) 
            }} />
          </Popup>
        )}

      </MapLibreMap>
    </div>
  );
}

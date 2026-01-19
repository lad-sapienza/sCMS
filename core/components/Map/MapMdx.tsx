/**
 * MDX-safe wrapper for Map component
 */

import React, { useMemo } from 'react';
import { Map as MapCore } from './Map';
import type { MapProps } from './types';

export function Map(props: MapProps) {
  // Memoize center prop
  const stableCenter = useMemo(() => props.center, [props.center]);
  
  // Memoize array/object props to prevent unnecessary re-renders in MDX
  const stableBaseLayers = useMemo(() => props.baseLayers, [JSON.stringify(props.baseLayers)]);
  const stableVectorLayers = useMemo(() => props.vectorLayers, [JSON.stringify(props.vectorLayers)]);
  const stableGeojson = useMemo(() => props.geojson, [JSON.stringify(props.geojson)]);
  const stableCsv = useMemo(() => props.csv, [JSON.stringify(props.csv)]);
  const stableJson = useMemo(() => props.json, [JSON.stringify(props.json)]);

  return (
    <MapCore 
      {...props} 
      center={stableCenter}
      baseLayers={stableBaseLayers}
      vectorLayers={stableVectorLayers}
      geojson={stableGeojson}
      csv={stableCsv}
      json={stableJson}
    />
  );
}

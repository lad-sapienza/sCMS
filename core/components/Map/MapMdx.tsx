/**
 * MDX-safe wrapper for Map component
 */

import React, { useMemo } from 'react';
import { Map as MapCore } from './Map';
import type { MapProps } from './types';

export function Map(props: MapProps) {
  // Memoize array/object props
  const stableCenter = useMemo(() => props.center, [props.center]);
  
  const stableSource = useMemo(() => {
    if (props.source) return props.source;
    if (props.csv) return { type: 'csv', url: props.csv } as const;
    if (props.api) return { type: 'api', url: props.api } as const;
    if (props.json) {
       if (Array.isArray(props.json)) return { type: 'json', data: props.json } as const;
       return { type: 'json', url: props.json as string } as const;
    }
    return undefined;
  }, [props.source, props.csv, props.api, JSON.stringify(props.json)]);

  return (
    <MapCore 
      {...props} 
      center={stableCenter}
      source={stableSource}
    />
  );
}

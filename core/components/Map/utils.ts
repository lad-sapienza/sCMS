/**
 * Map Utilities
 */

import type { DataRow } from '../../utils/data-fetcher';
import type { FeatureCollection, Feature, Geometry } from 'geojson';

/**
 * Tries to identify latitude and longitude fields from a data row
 */
export function getGeoFields(row: DataRow): { latField: string; lngField: string } | null {
  const keys = Object.keys(row);
  
  const latField = keys.find(k => /^(lat|latitude|y)$/i.test(k));
  const lngField = keys.find(k => /^(lng|long|longitude|x)$/i.test(k));
  
  if (latField && lngField) {
    return { latField, lngField };
  }
  
  return null;
}

/**
 * Converts generic data rows to GeoJSON FeatureCollection
 * Handles both coordinate-based data and data already containing geometry
 */
export function dataToGeoJson(
  data: DataRow[],
  customLngField?: string,
  customLatField?: string,
  geoField?: string
): FeatureCollection {
  const features: Feature[] = [];
  
  if (data.length === 0) {
    return { type: 'FeatureCollection', features: [] };
  }
  
  // Check if data already has geometry (from GeoJSON source)
  if (data[0]._geometry) {
    data.forEach((row, index) => {
      features.push({
        type: 'Feature',
        id: row._id || row.id || index,
        geometry: row._geometry,
        properties: { ...row, _geometry: undefined, _id: undefined }
      });
    });
    return { type: 'FeatureCollection', features };
  }
  
  // Check if geoField is provided (from Directus or other sources)
  if (geoField && data[0][geoField]) {
    data.forEach((row, index) => {
      let geometry = row[geoField];
      
      // Parse geometry if it's a string (JSON)
      if (typeof geometry === 'string') {
        try {
          geometry = JSON.parse(geometry);
        } catch (e) {
          console.warn(`Failed to parse geometry field "${geoField}" for row ${index}:`, e);
          return;
        }
      }
      
      // Validate geometry object
      if (geometry && typeof geometry === 'object' && geometry.type && geometry.coordinates) {
        features.push({
          type: 'Feature',
          id: row.id || index,
          geometry: geometry as Geometry,
          properties: { ...row, [geoField]: undefined }
        });
      }
    });
    return { type: 'FeatureCollection', features };
  }
  
  // If custom fields provided, use them
  let latField = customLatField;
  let lngField = customLngField;
  
  // Otherwise, try to detect lat/lng fields
  if (!latField || !lngField) {
    const geoFields = getGeoFields(data[0]);
    if (!geoFields) {
      console.warn('Map: Could not auto-detect simple lat/lng fields in data. GeoJSON conversion failed.');
      return { type: 'FeatureCollection', features: [] };
    }
    latField = latField || geoFields.latField;
    lngField = lngField || geoFields.lngField;
  }
  
  data.forEach((row, index) => {
    const lat = Number(row[latField!]);
    const lng = Number(row[lngField!]);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      features.push({
        type: 'Feature',
        id: row.id || index,
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        properties: row
      });
    }
  });
  
  return {
    type: 'FeatureCollection',
    features
  };
}

/**
 * Parses simple string templates with ${variable} syntax
 */
export function parseStringTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\$\{([^}]+)\}/g, (_, key) => {
    return data[key] !== undefined ? String(data[key]) : '';
  });
}

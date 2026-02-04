/**
 * ZoteroGeoViewer utilities
 */

import type { ZoteroItem, CoordinateData, ZoteroGeoData } from './types';

/**
 * Fetch items from a Zotero group library
 */
export async function fetchZoteroItems(groupId: number, maxItems = 1000): Promise<ZoteroItem[]> {
  const baseUrl = `https://api.zotero.org/groups/${groupId}/items`;
  const params = new URLSearchParams({
    format: 'json',
    limit: maxItems.toString(),
    sort: 'dateModified',
    direction: 'desc'
  });

  const fullUrl = `${baseUrl}?${params}`;
  console.log('Fetching Zotero items from:', fullUrl);

  try {
    const response = await fetch(fullUrl);
    console.log('Zotero API response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Zotero API error: ${response.status} ${response.statusText}`);
    }
    
    const data: ZoteroItem[] = await response.json();
    console.log('Successfully fetched', data.length, 'Zotero items');
    return data;
  } catch (error) {
    console.error('Error fetching Zotero items:', error);
    throw error;
  }
}

/**
 * Load coordinate data from GeoJSON file
 */
export async function loadCoordinateData(url = '/data/zoteroTagCoordinates.geojson'): Promise<CoordinateData[]> {
  console.log('Loading coordinate data from:', url);
  
  try {
    const response = await fetch(url);
    console.log('Coordinate data response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Failed to load coordinate data: ${response.status} ${response.statusText}`);
    }
    
    const geoJson: GeoJSON.FeatureCollection = await response.json();
    
    const coordinates = geoJson.features.map(feature => ({
      name: feature.properties?.name || '',
      altLabel: feature.properties?.altLabel,
      id: feature.properties?.id || 0,
      source: feature.properties?.source,
      coordinates: feature.geometry?.type === 'Point' 
        ? (feature.geometry.coordinates as [number, number])
        : [0, 0]
    }));
    
    console.log('Successfully loaded', coordinates.length, 'coordinate entries');
    return coordinates;
  } catch (error) {
    console.error('Error loading coordinate data:', error);
    throw error;
  }
}

/**
 * Extract all unique tags from Zotero items
 */
export function extractAllTags(items: ZoteroItem[]): string[] {
  const tagSet = new Set<string>();
  
  items.forEach(item => {
    item.data.tags?.forEach(tag => {
      if (tag.tag) {
        tagSet.add(tag.tag);
      }
    });
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Match Zotero items with geographical coordinates based on tags
 */
export function matchItemsWithCoordinates(
  items: ZoteroItem[], 
  coordinates: CoordinateData[]
): ZoteroGeoData {
  const features: ZoteroGeoData['features'] = [];
  
  // Create a map of location names to coordinates for faster lookup
  const locationMap = new Map<string, CoordinateData>();
  coordinates.forEach(coord => {
    locationMap.set(coord.name.toLowerCase(), coord);
    if (coord.altLabel) {
      // Handle multiple alternative labels separated by commas
      coord.altLabel.split(',').forEach(altLabel => {
        locationMap.set(altLabel.trim().toLowerCase(), coord);
      });
    }
  });
  
  // Group items by matching location tags
  const locationItems = new Map<string, { coord: CoordinateData, items: ZoteroItem[] }>();
  
  items.forEach(item => {
    item.data.tags?.forEach(tag => {
      const tagLower = tag.tag.toLowerCase();
      const coordinate = locationMap.get(tagLower);
      
      if (coordinate) {
        const key = `${coordinate.coordinates[0]},${coordinate.coordinates[1]}`;
        
        if (!locationItems.has(key)) {
          locationItems.set(key, {
            coord: coordinate,
            items: []
          });
        }
        
        locationItems.get(key)!.items.push(item);
      }
    });
  });
  
  // Convert to GeoJSON features
  locationItems.forEach(({ coord, items }) => {
    features.push({
      type: 'Feature',
      properties: {
        ...coord,
        zoteroItems: items
      },
      geometry: {
        type: 'Point',
        coordinates: coord.coordinates
      }
    });
  });
  
  return {
    type: 'FeatureCollection',
    features
  };
}

/**
 * Filter items by tag query
 */
export function filterItemsByTags(items: ZoteroItem[], tagQuery: string): ZoteroItem[] {
  if (!tagQuery.trim()) return items;
  
  const queryLower = tagQuery.toLowerCase();
  
  return items.filter(item => 
    item.data.tags?.some(tag => 
      tag.tag.toLowerCase().includes(queryLower)
    )
  );
}

/**
 * Generate popup content for a map feature
 */
export function generatePopupContent(feature: ZoteroGeoData['features'][0]): string {
  const { properties } = feature;
  const items = properties.zoteroItems || [];
  
  if (items.length === 0) {
    return `<div class="p-2"><strong>${properties.name}</strong></div>`;
  }
  
  const itemsHtml = items.slice(0, 5).map(item => {
    const authors = item.data.creators
      ?.map(creator => `${creator.firstName} ${creator.lastName}`.trim())
      .join(', ') || 'No author';
      
    const year = item.data.date ? new Date(item.data.date).getFullYear() : '';
    
    return `
      <div class="border-b border-gray-200 py-1 last:border-b-0">
        <div class="text-sm font-medium text-blue-600">
          <a href="${item.links.alternate.href}" target="_blank" class="hover:underline">
            ${item.data.title || 'Untitled'}
          </a>
        </div>
        <div class="text-xs text-gray-600">${authors}${year ? ` (${year})` : ''}</div>
      </div>
    `;
  }).join('');
  
  const moreText = items.length > 5 ? `<div class="text-xs text-gray-500 mt-2">...and ${items.length - 5} more items</div>` : '';
  
  return `
    <div class="p-3 max-w-xs">
      <h3 class="font-bold text-sm mb-2">${properties.name}</h3>
      <div class="text-xs text-gray-600 mb-2">${items.length} item${items.length !== 1 ? 's' : ''}</div>
      ${itemsHtml}
      ${moreText}
    </div>
  `;
}
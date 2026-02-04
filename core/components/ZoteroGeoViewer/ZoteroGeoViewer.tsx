import { useState, useEffect } from 'react';
import type { ZoteroGeoViewerProps } from './types';
import { Map } from '../Map';
import { ZoteroRecordsPreview } from './ZoteroRecordsPreview';

// Module-level cache to avoid re-fetching data
let zoteroCache: Record<string, number> | null = null;
let coordinateCache: any[] | null = null;

const COORDINATES_URL = '/data/zoteroTagCoordinates.geojson';

export function ZoteroGeoViewer(props: ZoteroGeoViewerProps) {
  // Add error handling for props
  if (!props) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-semibold text-red-800">Error loading Zotero data</h3>
        <p className="text-red-600 mt-1">Component props are undefined</p>
      </div>
    );
  }

  const {
    groupId,
    layout = '8x4',
    mapHeight = '600px',
    mapCenter = '20.5,40.0,8',
    tagAutocomplete = true,
    maxItems = 1000
  } = props;

  // Add error handling for required props
  if (!groupId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-semibold text-red-800">Error loading Zotero data</h3>
        <p className="text-red-600 mt-1">Group ID is required</p>
        <p className="text-sm text-red-500 mt-1">Group ID: {groupId}</p>
      </div>
    );
  }
  const [data, setData] = useState<Record<string, number> | null>(null);
  const [mapped, setMapped] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Array<{label: string; alts: string[]}>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<{main: string; alternatives: string[]} | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Per-instance id for namespacing globals when multiple viewers are on same page
  const [instanceId] = useState(() => Math.floor(Math.random() * 1e9));
  const handlerName = `__zotSelectTag_${instanceId}`;

  // Fetch Zotero tags
  async function fetchZoteroTagsFlattened() {
    const baseUrl = `https://api.zotero.org/groups/${groupId}/items/tags`;
    const limit = 100;
    let start = 0;
    let total = Infinity;
    const result: Record<string, number> = {};
    const headers = { Accept: 'application/json' };
    
    while (start < total) {
      const url = `${baseUrl}?start=${start}&limit=${limit}`;
      const resp = await fetch(url, { headers });
      if (!resp.ok) {
        throw new Error(`Zotero API error: ${resp.status} ${resp.statusText}`);
      }
      const items = await resp.json();
      const totalResults = resp.headers.get('Total-Results');
      if (totalResults == null) {
        throw new Error('Missing Total-Results header');
      }
      total = parseInt(totalResults, 10);
      for (const item of items) {
        if (item.tag?.startsWith('@')) {
          result[item.tag] = item.meta.numItems;
        }
      }
      start += limit;
    }
    return result;
  }

  // Fetch coordinate data
  async function fetchCoordinateData() {
    if (coordinateCache) return coordinateCache;
    
    const resp = await fetch(COORDINATES_URL);
    if (!resp.ok) throw new Error('Failed to load zoteroTagCoordinates.geojson');
    const geoJson = await resp.json();
    
    coordinateCache = geoJson.features;
    return geoJson.features;
  }

  // Main data loading effect
  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading Zotero data for group:', groupId);

        // Get Zotero data (use cache if available)
        let zotData = zoteroCache;
        if (!zotData) {
          zotData = await fetchZoteroTagsFlattened();
          zoteroCache = zotData;
        }
        if (cancelled) return;
        setData(zotData);

        console.log('Loaded', Object.keys(zotData).length, 'Zotero tags');

        // Get coordinate data
        const coordinates = await fetchCoordinateData();
        if (cancelled) return;

        console.log('Loaded', coordinates.length, 'coordinate features');

        // Map coordinates to zotero data
        const ontologyTagSet = new Set<string>();
        const mappedFeatures = coordinates.map((coord: any) => {
          const name = coord.properties?.name || '';
          let candidates = [name];
          const altLabel = coord.properties?.altLabel;
          if (altLabel) {
            const splitCandidates = altLabel
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean);
            candidates = candidates.concat(splitCandidates);
          }
          const candidateSet = new Set(candidates);

          // Add all @candidates to ontologyTagSet
          for (const term of candidateSet) {
            ontologyTagSet.add('@' + term);
          }

          // Sum zotero counts for all @candidates
          let zoteroCount = 0;
          for (const term of candidateSet) {
            const zotKey = '@' + term;
            if (zotData[zotKey]) {
              zoteroCount += zotData[zotKey];
            }
          }

          return {
            type: 'Feature',
            properties: {
              name,
              altLabel,
              zoteroCount,
            },
            geometry: coord.geometry
          };
        });

        if (cancelled) return;
        setMapped(mappedFeatures);

        console.log('Mapped', mappedFeatures.length, 'features with coordinates');

        // Create tags array for autocomplete
        const byLabel: Record<string, {label: string; alts: string[]}> = {};
        for (const f of mappedFeatures) {
          const name = f?.properties?.name;
          if (!name || typeof name !== 'string') continue;
          const key = name.toLowerCase();
          let entry = byLabel[key];
          if (!entry) {
            entry = { label: name, alts: [] };
            byLabel[key] = entry;
          }
          const altLabel = f?.properties?.altLabel;
          if (typeof altLabel === 'string' && altLabel.trim()) {
            const phrases = altLabel
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean);
            const all = new Set([...entry.alts, ...phrases]);
            entry.alts = Array.from(all);
          }
        }
        const tagsArray = Object.values(byLabel).sort((a: any, b: any) => 
          a.label.toLowerCase().localeCompare(b.label.toLowerCase())
        );
        setTags(tagsArray);

        console.log('Created', tagsArray.length, 'tag entries');

      } catch (err) {
        console.error('ZoteroGeoViewer error:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (groupId) {
      loadAll();
    } else {
      setError('No group ID provided');
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // Expose a per-instance global handler for popup buttons to select a tag
  useEffect(() => {
    const name = handlerName;
    (window as any)[name] = (tag: string, altLabels: string) => {
      try {
        if (typeof tag === 'string' && tag.length) {
          setSearchTerm(tag);
          // Include both the main tag and alt labels in the selected tag data
          setSelectedTag({
            main: tag,
            alternatives: altLabels ? altLabels.split(',').map((s: string) => s.trim()).filter(Boolean) : []
          });
        }
      } catch (e) {
        console.error('Error in popup handler:', e);
      }
    };
    return () => {
      try { 
        delete (window as any)[name]; 
      } catch (e) {
        console.error('Error cleaning up handler:', e);
      }
    };
  }, [handlerName]);

  // Filter suggestions based on search term
  const filteredSuggestions = searchTerm.trim() 
    ? tags.filter(t => {
        const v = searchTerm.toLowerCase();
        const inLabel = t.label.toLowerCase().includes(v);
        const inAlt = t.alts.some((a: string) => a.toLowerCase().includes(v));
        return inLabel || inAlt;
      }).slice(0, 10)
    : showDropdown ? tags.slice(0, 10) : []; // Show first 10 tags when focused but no search term

  // Layout configuration
  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col space-y-4';
      case 'horizontal':
        return 'flex flex-col md:flex-row gap-4';
      case '6x6':
        return 'grid grid-cols-1 md:grid-cols-12 gap-4';
      case '8x4':
        return 'grid grid-cols-1 md:grid-cols-12 gap-4';
      case '4x8':
        return 'grid grid-cols-1 md:grid-cols-12 gap-4';
      case '12x4':
        return 'flex flex-col space-y-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-12 gap-4';
    }
  };

  const getMapColSpan = () => {
    switch (layout) {
      case 'horizontal': return 'md:w-2/3';
      case '6x6': return 'md:col-span-6';
      case '8x4': return 'md:col-span-8';
      case '4x8': return 'md:col-span-4';
      case '12x4': return 'w-full';
      default: return 'md:col-span-8';
    }
  };

  const getControlsColSpan = () => {
    switch (layout) {
      case 'horizontal': return 'md:w-1/3';
      case '6x6': return 'md:col-span-6';
      case '8x4': return 'md:col-span-4';
      case '4x8': return 'md:col-span-8';
      case '12x4': return 'w-full';
      default: return 'md:col-span-4';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading Zotero library...</span>
        <div className="ml-4 text-xs text-gray-500">Group ID: {groupId}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Error loading Zotero data</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <p className="text-red-500 text-xs mt-2">Group ID: {groupId}</p>
      </div>
    );
  }

  if (!data || !mapped) {
    return <div className="p-4 text-gray-500">No data loaded</div>;
  }

  // Prepare GeoJSON for map
  const featuresWithGeometry = mapped.filter(f => f.geometry);
  const geojson = {
    type: 'FeatureCollection' as const,
    features: featuresWithGeometry,
  };

  const totalTags = Object.keys(data).length;
  const totalItems = Object.values(data).reduce((sum, count) => sum + count, 0);
  const geoItems = featuresWithGeometry.reduce((sum, f) => sum + (f.properties.zoteroCount || 0), 0);

  return (
    <div className="zotero-geo-viewer">
      <div className={getLayoutClasses()}>
        {/* Map */}
        <div className={getMapColSpan()}>
          <Map
            height={mapHeight}
            center={mapCenter}
            baseLayers={['EsriSatellite', 'GoogleTerrain', 'Imperium']}
            vectorLayers={mapCenter && geojson && geojson.features.length > 0 ? [{
              name: 'Zotero Items',
              source: { type: 'geojson', data: geojson },
              style: {
                type: 'circle',
                paint: {
                  'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['get', 'zoteroCount'],
                    0, 4,
                    1, 6,
                    5, 10,
                    20, 16,
                    50, 24
                  ],
                  'circle-color': [
                    'case',
                    ['>', ['get', 'zoteroCount'], 0],
                    '#3b82f6',
                    '#ef4444'
                  ],
                  'circle-opacity': 0.8,
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#ffffff'
                }
              },
              popupTemplate: `<h4>\${name}</h4><p>\${altLabel}</p><div class="text-sm mb-2">Items: \${zoteroCount}</div><button style="background-color: #1d4ed8; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" onmouseover="this.style.backgroundColor='#1e40af'" onmouseout="this.style.backgroundColor='#1d4ed8'" type="button" data-tag="\${name}" data-alt-labels="\${altLabel}" onclick="window['${handlerName}'] && window['${handlerName}'](this.dataset.tag, this.dataset.altLabels)">📚 Show \${zoteroCount} records</button>`,
              visible: true,
              fitToContent: true
            }] : []}
            navigationControl="top-left"
            scaleControl="bottom-left"
            layerControl="top-right"
          />
        </div>

        {/* Controls and Stats */}
        <div className={getControlsColSpan()}>
          <div className="space-bottom-4">
            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Library Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{totalItems}</div>
                  <div className="text-gray-600">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{geoItems}</div>
                  <div className="text-gray-600">Georeferenced</div>
                </div>
              </div>
            </div>

            {/* Tag Search */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Search Tags</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for locations..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {/* Simple autocomplete */}
                {showDropdown && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchTerm(tag.label);
                          setSelectedTag({
                            main: tag.label,
                            alternatives: tag.alts
                          });
                          setShowDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        <div className="font-medium">{tag.label}</div>
                        {tag.alts.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Also: {tag.alts.slice(0, 3).join(', ')}
                            {tag.alts.length > 3 && ` +${tag.alts.length - 3} more`}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag(null);
                    setShowDropdown(false);
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Selected tag info */}
            {selectedTag && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900">Selected: {selectedTag.main}</h4>
                {selectedTag.alternatives.length > 0 && (
                  <p className="text-sm text-blue-700 mt-1">
                    Also includes: {selectedTag.alternatives.join(', ')}
                  </p>
                )}
                <p className="text-xs text-blue-600 mt-2">
                  Use the map markers to explore items at this location.
                </p>
              </div>
            )}

            {/* Zotero Records Preview */}
            {selectedTag && (
              <ZoteroRecordsPreview groupId={groupId} tag={selectedTag} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
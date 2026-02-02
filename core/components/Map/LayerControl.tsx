import React, { useState, useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { Layers, Search, X } from 'lucide-react';
import type { IControl } from 'maplibre-gl';
import type { BaseLayerConfig, VectorLayerConfig, ControlPosition, SearchInFields, SearchQuery } from './types';
import { SearchUI } from './Search';

export interface LayerControlProps {
  baseLayers?: BaseLayerConfig[];
  activeBaseLayer?: number;
  onBaseLayerChange?: (index: number) => void;
  vectorLayers?: Array<VectorLayerConfig & { id: string }>;
  vectorLayerVisibility?: Record<string, boolean>;
  onVectorLayerToggle?: (layerId: string) => void;
  onLayerSearch?: (layerId: string, query: SearchQuery) => void;
  layerSearchQueries?: Record<string, SearchQuery>;
  position?: ControlPosition;
}

// Internal React component for the control UI
function LayerControlUI({ 
  baseLayers = [], 
  activeBaseLayer = 0, 
  onBaseLayerChange,
  vectorLayers = [],
  vectorLayerVisibility = {},
  onVectorLayerToggle,
  onLayerSearch,
  layerSearchQueries = {},
}: Omit<LayerControlProps, 'position'>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchModal, setSearchModal] = useState<{isOpen: boolean, layerId: string, layerName: string, fieldList: SearchInFields, currentQuery?: SearchQuery} | null>(null);
  const radioGroupId = React.useId();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const hasContent = baseLayers.length > 0 || vectorLayers.length > 0;
  if (!hasContent) return null;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  const handleSearchClick = (layerId: string, layerName: string, searchInFields: SearchInFields) => {
    setSearchModal({
      isOpen: true,
      layerId,
      layerName,
      fieldList: searchInFields,
      currentQuery: layerSearchQueries[layerId]
    });
  };

  const handleSearchClose = () => {
    setSearchModal(null);
  };

  const handleSearch = (query: SearchQuery) => {
    if (searchModal && onLayerSearch) {
      onLayerSearch(searchModal.layerId, query);
    }
    handleSearchClose();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
      <div 
        style={{ 
          padding: '8px', 
          fontWeight: 600, 
          userSelect: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '32px',
          minWidth: '32px',
          background: 'white',
          borderRadius: '4px'
        }}
      >
        {!isExpanded && <Layers className="scms-icon scms-icon-lg" />}
      </div>
      
      {isExpanded && (
        <div style={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'white',
          borderRadius: '4px',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: '8px 12px 12px 12px', 
          minWidth: 180,
          maxWidth: 250,
          zIndex: 1000,
          whiteSpace: 'nowrap'
        }}>
          
          {/* Vector Layers Section */}
          {vectorLayers.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              {vectorLayers.map((layer) => (
                <div key={layer.id} style={{ marginBottom: 6, display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id={`vector-layer-${layer.id}`}
                    checked={vectorLayerVisibility[layer.id] !== false}
                    onChange={() => onVectorLayerToggle?.(layer.id)}
                    style={{ marginRight: 8, cursor: 'pointer' }}
                  />
                  <label 
                    htmlFor={`vector-layer-${layer.id}`}
                    style={{ cursor: 'pointer', fontSize: '12px', userSelect: 'none', flex: 1 }}
                  >
                    {layer.name}
                  </label>
                  {layer.searchInFields && Object.keys(layer.searchInFields).length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSearchClick(layer.id, layer.name, layer.searchInFields!)}
                      className={`scms-btn-icon scms-btn-sm ${
                        layerSearchQueries[layer.id]?.filters?.length ? 'active' : ''
                      }`}
                      title={`Search ${layer.name}${layerSearchQueries[layer.id]?.filters?.length ? ' (Active)' : ''}`}
                    >
                      <Search className="scms-icon scms-icon-sm" />
                    </button>
                  )}
                </div>
              ))}
              {baseLayers.length > 0 && <hr style={{ margin: '8px 0', borderColor: '#eee' }} />}
            </div>
          )}

          {/* Base Layers Section */}
          {baseLayers.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', color: '#666', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>
                Base Maps
              </div>
              {baseLayers.map((layer, index) => {
                const isChecked = index === activeBaseLayer;
                return (
                  <div key={`${layer.name}-${index}`} style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                    <input
                      type="radio"
                      id={`base-layer-${radioGroupId}-${index}`}
                      name={`base-layer-select-${radioGroupId}`}
                      value={index}
                      checked={isChecked}
                      onChange={() => onBaseLayerChange?.(index)}
                      style={{ 
                        marginRight: 8, 
                        cursor: 'pointer',
                        width: '16px',
                        height: '16px',
                        accentColor: '#3b82f6'
                      }}
                    />
                    <label 
                      htmlFor={`base-layer-${radioGroupId}-${index}`}
                      style={{ cursor: 'pointer', fontSize: '12px', userSelect: 'none' }}
                    >
                      {layer.name}
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {/* Search Modal */}
      {searchModal?.isOpen && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={handleSearchClose}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-[500px] max-w-[90vw] mx-4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 flex-1 pr-2">
                <Search className="scms-icon scms-icon-md" />
                Search {searchModal.layerName}
              </h3>
              <button
                onClick={handleSearchClose}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="scms-icon scms-icon-md" />
              </button>
            </div>
            
            <div className="p-4">
              <SearchUI
                fieldList={searchModal.fieldList}
                onSearch={handleSearch}
                currentQuery={searchModal.currentQuery}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// MapLibre IControl wrapper
export class LayerControlClass implements IControl {
  private container: HTMLDivElement | undefined;
  private root: Root | undefined;
  private props: Omit<LayerControlProps, 'position'>;

  constructor(props: Omit<LayerControlProps, 'position'>) {
    this.props = props;
  }

  onAdd(): HTMLElement {
    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    
    this.root = createRoot(this.container);
    this.root.render(<LayerControlUI {...this.props} />);
    return this.container;
  }

  onRemove(): void {
    if (this.root) {
      this.root.unmount();
    }
    this.container = undefined;
  }

  updateProps(props: Omit<LayerControlProps, 'position'>): void {
    this.props = props;
    if (this.root) {
      this.root.render(<LayerControlUI {...this.props} />);
    }
  }
}

// React component wrapper for use in @vis.gl/react-maplibre
export function LayerControl(props: LayerControlProps) {
  const controlRef = useRef<LayerControlClass | null>(null);

  useEffect(() => {
    // Update props if control already exists
    if (controlRef.current) {
      const { position, ...restProps } = props;
      controlRef.current.updateProps(restProps);
    }
  }, [props]);

  // Store control instance
  if (!controlRef.current) {
    const { position, ...restProps } = props;
    controlRef.current = new LayerControlClass(restProps);
  }

  // Return a placeholder that react-maplibre can recognize
  // The actual control is added via map.addControl in Map.tsx
  return null;
}

// Export the control class for direct use
export { LayerControlClass as LayerControlIControl };

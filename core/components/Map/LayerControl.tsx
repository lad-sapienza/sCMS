import React, { useState, useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { IControl } from 'maplibre-gl';
import type { BaseLayerConfig, VectorLayerConfig, ControlPosition } from './types';

export interface LayerControlProps {
  baseLayers?: BaseLayerConfig[];
  activeBaseLayer?: number;
  onBaseLayerChange?: (index: number) => void;
  vectorLayers?: Array<VectorLayerConfig & { id: string }>;
  vectorLayerVisibility?: Record<string, boolean>;
  onVectorLayerToggle?: (layerId: string) => void;
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
}: Omit<LayerControlProps, 'position'>) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div 
        style={{ padding: '12px', fontWeight: 600, userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {!isExpanded && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20px" height="20px" fill="currentColor" className="bi bi-stack"><path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z"></path><path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z"></path></svg>}
      </div>
      
      {isExpanded && (
        <div style={{ padding: '0 10px 10px 10px', minWidth: 150 }}>
          
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
                    style={{ cursor: 'pointer', fontSize: '12px', userSelect: 'none' }}
                  >
                    {layer.name}
                  </label>
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

import React, { useState } from 'react';
import type { BaseLayerConfig, VectorLayerConfig } from './types';

export interface LayerControlProps {
  baseLayers?: BaseLayerConfig[];
  activeBaseLayer?: number;
  onBaseLayerChange?: (index: number) => void;
  vectorLayers?: Array<VectorLayerConfig & { id: string }>;
  vectorLayerVisibility?: Record<string, boolean>;
  onVectorLayerToggle?: (layerId: string) => void;
}

export function LayerControl({ 
  baseLayers = [], 
  activeBaseLayer = 0, 
  onBaseLayerChange,
  vectorLayers = [],
  vectorLayerVisibility = {},
  onVectorLayerToggle
}: LayerControlProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const radioGroupId = React.useId(); // Generate unique ID for this instance

  // Show control if there are base layers OR vector layers
  const hasContent = baseLayers.length > 0 || vectorLayers.length > 0;
  if (!hasContent) return null;

  return (
    <div 
      className="maplibregl-ctrl maplibregl-ctrl-group"
      style={{
        position: 'absolute',
        top: 10,
        right: 50, // Offset to avoid overlapping with default navigation controls usually at top-right
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: '0 0 0 2px rgba(0,0,0,0.1)'
      }}
    >
      <div 
        style={{ padding: '6px 10px', cursor: 'pointer', fontWeight: 600, userSelect: 'none' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▼' : '▶'} Layers
      </div>
      
      {isExpanded && (
        <div style={{ padding: '0 10px 10px 10px', minWidth: 150 }}>
          
          {/* Vector Layers Section */}
          {vectorLayers.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: '11px', color: '#666', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>
                Vector Layers
              </div>
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

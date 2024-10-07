import React, { useState } from "react"
import styled from "styled-components"

const ControlPanel = ({
  baseLayers,
  selectedLayer,
  onLayerChange,
  sourceLayers,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }
  return (
    <StyledControl
      className={`control-panel ${isVisible ? "visible" : "hidden"} border shadow rounded`}
      onMouseEnter={toggleVisibility}
      onMouseLeave={toggleVisibility}
    >
      <div className="text-end">
        {!isVisible && (
          <button className="btn btn-light btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-stack"
              viewBox="0 0 16 16"
            >
              <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z" />
              <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z" />
            </svg>
          </button>
        )}
      </div>

      {isVisible && (
        <div className="layer-controls">
          {Object.keys(baseLayers).map(key => (
            <div key={key} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={key}
                checked={selectedLayer === baseLayers[key].url}
                onChange={() => onLayerChange(baseLayers[key].url)}
              />
              <label htmlFor={key} className="form-check-label">
                {baseLayers[key].name}
              </label>
            </div>
          ))}
          {/* Render dei SourceLayers */}
          <h5>Source Layers</h5>
          {sourceLayers && sourceLayers.length > 0 ? (
            sourceLayers.map(sourceLayer => (
              <div key={sourceLayer.id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={sourceLayer.id}
                  checked={sourceLayer.visible}
                  onChange={() => onLayerChange(sourceLayer.id)}
                />
                <label htmlFor={sourceLayer.id} className="form-check-label">
                  {sourceLayer.name}
                </label>
              </div>
            ))
          ) : (
            <p>No source layers available.</p>
          )}
        </div>
      )}
    </StyledControl>
  )
}

//style
const StyledControl = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  max-width: 200px;
  background: #fff;
  padding: 0.5rem;
  margin: 0.5rem;
`
export default ControlPanel

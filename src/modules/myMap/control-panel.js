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
    <StyledControl className={`control-panel ${isVisible ? "visible" : "hidden"}`}>
      <button className="toggle-button" onClick={toggleVisibility}>
        {isVisible ? "Hide" : "Show"} Layers
      </button>
      {isVisible && (
        <div className="layer-controls">
          <h3>Base Layers</h3>
          {Object.keys(baseLayers).map(key => (
            <div key={key}>
              <input
                type="checkbox"
                id={key}
                checked={selectedLayer === baseLayers[key].url}
                onChange={() => onLayerChange(baseLayers[key].url)}
              />
              <label htmlFor={key}>{baseLayers[key].name}</label>
            </div>
          ))}
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    padding: .5rem;
    margin: .5rem;
    color: #6b6b76;
    text-transform: lowercase;
    font-size: 10px;
    outline: none;
    z-index: 999;
    h3 {
      font-size: .75rem
    }
`
export default ControlPanel

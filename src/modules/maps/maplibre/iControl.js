import React from "react"
import { createRoot } from "react-dom/client"

class CustomControl {
  constructor(component) {
    this._container = document.createElement("div")
    this._container.className = "maplibre-custom-control"
    this._component = component
  }

  onAdd(map) {
    this._map = map
    // Monta il componente React usando `createRoot`
    const root = createRoot(this._container)
    root.render(this._component)
    return this._container
  }

  onRemove() {
    if (this._container.parentNode) {
      this._container.parentNode.removeChild(this._container)
    }
    this._map = undefined
  }
}

export default CustomControl

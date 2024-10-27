import React from "react"
import ReactDOM from "react-dom/client"
import ControlPanel from "./controlPanel"

class SimpleControl {
  onAdd(map) {
    this.map = map
    console.log("Map instance:", this.map)
    this.container = document.createElement("div")
    this.container.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group")
    this.container.style.padding = ".5rem"
    this.container.style.margin = ".5rem"
    this.container.style.minWidth = "300px"

    // Applica stili inline per rimuovere sfondo, ombre, padding e margini
    this.container.style.background = "transparent"
    this.container.style.boxShadow = "none"
    this.container.style.border = "none"
    this.container.style.padding = "0"
    this.container.style.margin = "0"
    this.container.style.display = "flex"
    this.container.style.alignItems = "center"
    this.container.style.justifyContent = "center"

    // Crea il root per React all'interno di this.container e rendi il ControlPanel
    this.root = ReactDOM.createRoot(this.container)
    this.root.render(<ControlPanel mapInstance={this.map} />)

    return this.container
  }

  onRemove() {
    // Smonta il componente con la nuova API
    if (this.root) {
      this.root.unmount()
    }
    this.container.parentNode.removeChild(this.container)
    this.map = undefined
  }
}

export default SimpleControl

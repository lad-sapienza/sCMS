/**
 * TODO te l'ho sistemato, finisci ora
 */
import React from "react"
import ReactDOM from "react-dom"
import ControlPanel from "./controlPanel"
class SimpleControl {
  onAdd(map) {
    this.map = map
    console.log("Map instance:", this.map)
    this.container = document.createElement("div")
    this.container.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group")
    //this.container.textContent = "Semplice Controllo"
    this.container.style.padding = ".5rem"
    this.container.style.margin = ".5rem"
    this.container.style.maxWidth = "200px"

    // Usa ReactDOM per renderizzare ControlPanel all'interno di this.container
    ReactDOM.render(<ControlPanel mapInstance={this.map} />, this.container)

    return this.container
  }

  onRemove() {
    // TODO:ReactDOM.unmountComponentAtNode è deprecato.
    // Nuova API qui: https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
    ReactDOM.unmountComponentAtNode(this.container)
    this.container.parentNode.removeChild(this.container)
    this.map = undefined
  }
}

export default SimpleControl

/**
 * TODO te l'ho sistemato, finisci ora
 */
class SimpleControl {
  onAdd(map) {
    this.map = map
    this.container = document.createElement("div")
    this.container.classList.add(
      "maplibregl-ctrl",
      "maplibregl-ctrl-group",
    );
    this.container.textContent = "Semplice Controllo"
    this.container.style.padding = ".5rem"
    return this.container
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container)
    this.map = undefined
  }
}

export default SimpleControl

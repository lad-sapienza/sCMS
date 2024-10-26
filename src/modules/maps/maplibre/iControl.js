import styled from "styled-components"

const StyledControlContainer = styled.div`
  background-color: white;
  border: 2px solid #333;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin: 10px;
  z-index: 1;
`

class SimpleControl {
  onAdd(map) {
    this.map = map
    this.container = document.createElement("div")
    this.container.className = StyledControlContainer.styledComponentId
    this.container.textContent = "Semplice Controllo"

    // Applichiamo gli stili in modo inline per renderlo visibile
    this.container.style.backgroundColor = "white"
    this.container.style.border = "2px solid #333"
    this.container.style.padding = "8px"
    this.container.style.borderRadius = "4px"
    this.container.style.fontSize = "14px"
    this.container.style.fontWeight = "bold"
    this.container.style.cursor = "pointer"
    this.container.style.margin = "10px"
    this.container.style.zIndex = "1"

    return this.container
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container)
    this.map = undefined
  }
}

export default SimpleControl

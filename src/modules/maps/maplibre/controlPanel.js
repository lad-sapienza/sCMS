import React, { useState } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { Modal } from "react-bootstrap"
import { Search, Stack } from "react-bootstrap-icons"
import SearchUI from "../../search/searchUI"
import plain2maplibre from "../../../services/transformers/plain2maplibre.js"

const ControlPanel = ({
  baseLayers,
  selectedLayer,
  onLayerChange,
  sourceLayers,
  onToggleLayer,
  activeSourceLayers,
  mapRef, // Aggiunto mapRef come prop
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeLayer, setActiveLayer] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeFieldList, setActiveFieldList] = useState(null)
  const [filters, setFilters] = useState([])

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const openModal = layer => {
    setActiveLayer(layer)
    setModalIsOpen(true)

    // Verifica se fieldListProp esiste nel layer, altrimenti assegna un valore predefinito
    if (layer.fieldListProp) {
      setActiveFieldList(layer.fieldListProp)
    } else {
      console.warn(`fieldListProp is undefined for layer: ${layer.name}`)
      setActiveFieldList([]) // Assegna un array vuoto come fallback
    }
  }

  const closeModal = () => {
    setModalIsOpen(false)
    setActiveLayer(null)
  }

  // Funzione per verificare se il layer esiste nella mappa utilizzando il nome del layer
  const checkLayerExists = layerName => {
    const mapInstance = mapRef.current.getMap() // Usa getMap per ottenere l'istanza MapLibre
    const layers = mapInstance.getStyle().layers
    console.log("Verifica layer con nome:", layerName)
    console.log(
      "Lista dei nomi dei layers disponibili:",
      layers.map(layer => layer.name || layer.id),
    ) // Stampa i nomi o gli ID se il nome non è presente
    return layers.some(
      layer => layer.name === layerName || layer.id === layerName,
    ) // Verifica anche per ID se necessario
  }

  // Funzione per verificare se il layer supporta i filtri (solo alcuni tipi supportano i filtri)
  const checkLayerTypeSupportsFilter = layerId => {
    const mapInstance = mapRef.current.getMap()
    const layer = mapInstance.getLayer(layerId)
    return (
      layer &&
      (layer.type === "fill" ||
        layer.type === "line" ||
        layer.type === "circle")
    ) // Verifica se il tipo di layer supporta i filtri
  }

  // Funzione per processare i filtri e convertirli in formato compatibile con MapLibre
  const processData = (conn, inputs) => {
    const mapLibreFilters = plain2maplibre(conn, inputs)
    console.log("Filtri generati:", mapLibreFilters)
    setFilters(mapLibreFilters)

    if (mapRef && mapRef.current) {
      const mapInstance = mapRef.current.getMap() // Usa getMap per ottenere l'istanza MapLibre
      console.log("mapInstance:", mapInstance) // Verifica che l'istanza della mappa sia disponibile

      const layerExists = checkLayerExists(activeLayer.name)
      console.log(`Layer trovato? ${layerExists}`)

      if (layerExists && checkLayerTypeSupportsFilter(activeLayer.name)) {
        mapInstance.setFilter(activeLayer.name, mapLibreFilters) // Usa il nome anziché l'id
        console.log(
          `Filtri applicati al layer ${activeLayer.name}:`,
          mapLibreFilters,
        )
      } else {
        console.error(
          `Il layer ${activeLayer.name} non supporta i filtri o non esiste.`,
        )
      }
    } else {
      console.warn("MapRef non è definito o la mappa non è pronta.")
    }
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
            <Stack />
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
          {/* Sezione per i source layer */}
          <hr />
          <h5>Source Layers</h5>
          {sourceLayers.map(layer => (
            <div key={layer.name} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={layer.name}
                onChange={() => onToggleLayer(layer.name)}
              />
              <label htmlFor={layer.name} className="form-check-label">
                {layer.name}
              </label>
              <Search className="ms-4" onClick={() => openModal(layer)} />
            </div>
          ))}
        </div>
      )}
      {/* Modal per la ricerca */}
      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <Search /> {activeLayer?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeLayer && (
            <SearchUI
              fieldList={activeFieldList} // Passa il fieldListProp qui
              processData={processData} // La funzione che processa i filtri
            />
          )}
        </Modal.Body>
      </Modal>
    </StyledControl>
  )
}

// Styled component per lo stile del Control Panel
const StyledControl = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  max-width: 200px;
  background: #fff;
  padding: 0.5rem;
  margin: 0.5rem;
`

ControlPanel.propTypes = {
  baseLayers: PropTypes.array,
  selectedLayer: PropTypes.string,
  onLayerChange: PropTypes.func,
  sourceLayers: PropTypes.array,
  onToggleLayer: PropTypes.func,
  activeSourceLayers: PropTypes.array,
  mapRef: PropTypes.object, // mapRef è ora un oggetto con getMap
}

export default ControlPanel

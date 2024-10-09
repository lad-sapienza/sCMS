import React, { useState, useEffect } from "react"
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
  sourceLayers, // Aggiunto per mostrare i source layer
  onToggleLayer, // Funzione per gestire la visibilità dei source layer
  activeSourceLayers, // Lista dei sourceLayer attivi (selezionati)
  // TODO @eiacopini: perché passi questo a mano: non puoi usare mapRef (https://visgl.github.io/react-map-gl/docs/api-reference/map#methods)?
  mapInstance, // Istanze di MapLibre
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeLayer, setActiveLayer] = useState(null) // Stato per tracciare il layer attivo nel modal
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeFieldList, setActiveFieldList] = useState(null) // Nuovo stato per salvare il fieldList
  const [filters, setFilters] = useState([]) // Stato per i filtri generati

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

  // Funzione per processare i filtri e convertirli in formato compatibile con MapLibre
  const processData = (conn, inputs) => {
    const mapLibreFilters = plain2maplibre(conn, inputs) // Converte i filtri per MapLibre
    setFilters(mapLibreFilters) // Imposta i filtri generati

    // Applica i filtri ai layer attivi
    if (mapInstance && activeLayer) {
      mapInstance.setFilter(activeLayer.id, mapLibreFilters)
      console.log(
        `Filtri applicati al layer ${activeLayer.id}:`,
        mapLibreFilters,
      )
    }
  }
  // Effetto per applicare i filtri solo ai layer attivi
  useEffect(() => {
    if (mapInstance && Array.isArray(activeSourceLayers)) {
      activeSourceLayers.forEach(layerId => {
        if (filters.length > 0) {
          // Applica i filtri se ci sono
          mapInstance.setFilter(layerId, filters)
          console.log(`Filtri applicati al layer attivo ${layerId}:`, filters)
        } else {
          // Rimuove i filtri se non ci sono
          mapInstance.setFilter(layerId, null)
          console.log(`Filtri rimossi dal layer attivo ${layerId}`)
        }
      })
    }
  }, [filters, mapInstance, activeSourceLayers])

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
            <div key={layer.id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={layer.id}
                onChange={() => onToggleLayer(layer.id)}
              />
              <label htmlFor={layer.id} className="form-check-label">
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
              processData={processData}
            />
          )}
        </Modal.Body>
      </Modal>
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

ControlPanel.propTypes = {
  baseLayers : PropTypes.array,
  selectedLayer: PropTypes.string,
  onLayerChange: PropTypes.func,
  sourceLayers: PropTypes.array,
  onToggleLayer: PropTypes.func,
  activeSourceLayers: PropTypes.array,
  mapInstance: PropTypes.element,
}
export default ControlPanel

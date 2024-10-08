import React, { useState } from "react"
import styled from "styled-components"
import { Modal } from "react-bootstrap"
import { Search, Stack } from "react-bootstrap-icons"
import SearchUI from "../../search/searchUI"

const ControlPanel = ({
  baseLayers,
  selectedLayer,
  onLayerChange,
  sourceLayers, // Aggiunto per mostrare i source layer
  onToggleLayer, // Funzione per gestire la visibilità dei source layer
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeLayer, setActiveLayer] = useState(null) // Stato per tracciare il layer attivo nel modal
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const openModal = layer => {
    setActiveLayer(layer)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
    setActiveLayer(null)
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
              fieldList={activeLayer?.fieldList}
              processData={activeLayer?.processData}
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
export default ControlPanel

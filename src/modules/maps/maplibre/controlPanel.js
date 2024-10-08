import React, { useState } from "react"
import styled from "styled-components"
import { Modal } from "react-bootstrap"
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
              <svg
                onClick={() => openModal(layer)}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search ms-4"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </div>
          ))}
        </div>
      )}
      {/* Modal per la ricerca */}
      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>{" "}
            {activeLayer?.name}
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

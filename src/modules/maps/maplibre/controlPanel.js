import React, { useState } from "react"
import { useMap } from "react-map-gl/maplibre"
import styled from "styled-components"
import PropTypes from "prop-types"
import { Modal, Button } from "react-bootstrap"
import { Search, Stack } from "react-bootstrap-icons"
import SearchUI from "../../search/searchUI"
import plain2maplibre from "../../../services/transformers/plain2maplibre.js"

const ControlPanel = ({
  baseLayers,
  selectedLayer,
  onLayerChange,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeLayer, setActiveLayer] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeFieldList, setActiveFieldList] = useState(null)
  const [filters, setFilters] = useState([])

  const { current: mapRef } = useMap()
  const mapInstance = mapRef.getMap()

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const toggleLayerVisibility = lyrId => {
    const isVisible =
      mapInstance.getLayoutProperty(lyrId, "visibility") !== "none"
    mapInstance.setLayoutProperty(
      lyrId,
      "visibility",
      isVisible ? "none" : "visible",
    )
  }

  const openModal = layer => {
    setActiveLayer(layer)
    setModalIsOpen(true)

    if (layer.metadata.searchInFields) {
      setActiveFieldList(layer.metadata.searchInFields)
    } else {
      console.warn(`searchInFields is undefined for layer: ${layer.id}`)
      setActiveFieldList([])
    }
  }
  const closeModal = () => {
    setModalIsOpen(false)
    setActiveLayer(null)
  }

  const removeFilter = layerId => {
    if (mapRef) {
      console.log(`Rimuovo il filtro dal layer ${layerId}`)

      if (checkLayerExists(layerId) && checkLayerTypeSupportsFilter(layerId)) {
        mapInstance.setFilter(layerId, null)
        console.log(`Filtro rimosso dal layer ${layerId}`)
      } else {
        console.error(`Il layer ${layerId} non supporta i filtri o non esiste.`)
      }
    }
  }

  const checkLayerExists = layerId => {
    const layers = mapInstance.getStyle().layers
    console.log("Layer cercato:", layerId)
    console.log(
      "Layer disponibili:",
      layers.map(layer => layer.id),
    )
    return layers.some(layer => layer.id === layerId) // Verifica usando l'ID
  }

  const checkLayerTypeSupportsFilter = layerId => {
    const layer = mapInstance.getLayer(layerId)
    return (
      layer &&
      (layer.type === "fill" ||
        layer.type === "line" ||
        layer.type === "circle")
    )
  }

  const processData = (conn, inputs) => {
    const mapLibreFilters = plain2maplibre(conn, inputs)
    console.log("Filtri generati:", mapLibreFilters)
    setFilters(mapLibreFilters)

    if (mapRef) {
      console.log("mapInstance:", mapInstance)

      const layerExists = checkLayerExists(activeLayer.id)
      console.log(`Layer trovato? ${layerExists}`)

      if (layerExists && checkLayerTypeSupportsFilter(activeLayer.id)) {
        mapInstance.setFilter(activeLayer.id, mapLibreFilters)
        console.log(
          `Filtri applicati al layer ${activeLayer.id}:`,
          mapLibreFilters,
        )
      } else {
        console.error(
          `Il layer ${activeLayer.id} non supporta i filtri o non esiste.`,
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
          {mapInstance.getStyle().layers.map(
            (layer, k) =>
              layer.metadata && (
                <div key={k} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={layer.id}
                    defaultChecked={
                      mapInstance.getLayoutProperty(layer.id, "visibility") !==
                      "none"
                    }
                    onChange={() => toggleLayerVisibility(layer.id)}
                  />
                  <label htmlFor={layer.name} className="form-check-label">
                    {layer.metadata?.label ? layer.metadata.label : layer.id}
                  </label>
                  {/* Mostra l'icona di ricerca solo se `searchInFields` è definito */}
                  {layer.metadata?.searchInFields && (
                    <Search className="ms-4" onClick={() => openModal(layer)} />
                  )}
                </div>
              ),
          )}
          <hr />
        </div>
      )}
      {/* Modal per la ricerca */}
      <Modal show={modalIsOpen} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Search /> {activeLayer?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeLayer && (
            <SearchUI fieldList={activeFieldList} processData={processData} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Chiudi
          </Button>
          <Button variant="danger" onClick={() => removeFilter(activeLayer.id)}>
            Rimuovi Filtro
          </Button>
        </Modal.Footer>
      </Modal>
    </StyledControl>
  )
}

// Styled component per lo stile del Control Panel
// TODO @eicopini: questo controller è aggiunto in maniera brutale alla mappa e infatti non è listato tra i controller
// e va in conflitto se si aggiungono controller in top-right
// Questo perché non segue le direttive dei controller:
// https://maplibre.org/maplibre-gl-js/docs/API/interfaces/IControl/ v. anche
// https://stackoverflow.com/a/74283884
// https://stackoverflow.com/a/73333764
const StyledControl = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  max-width: 200px;
  background: #fff;
  padding: 0.5rem;
  margin: 0.5rem;
  max-height: 500px;
  overflow-y: auto;
`

ControlPanel.propTypes = {
  baseLayers: PropTypes.object,
  selectedLayer: PropTypes.string,
  onLayerChange: PropTypes.func,
  activeSourceLayers: PropTypes.array,
}

export default ControlPanel

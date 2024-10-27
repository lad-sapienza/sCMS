import React, { useState } from "react"
import { useMap } from "react-map-gl/maplibre"
import styled from "styled-components"
import { Modal } from "react-bootstrap"
import {
  FilterSquare,
  FilterSquareFill,
  Stack,
  Search,
} from "react-bootstrap-icons"
import SearchUI from "../../search/searchUI"
import plain2maplibre from "../../../services/transformers/plain2maplibre.js"

const ControlPanel = ({ mapInstance }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeLayer, setActiveLayer] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeFieldList, setActiveFieldList] = useState(null)
  const [filters, setFilters] = useState([])

  // const { current: mapRef } = useMap()
  // const mapInstance = mapRef.getMap()

  const toggleVisibility = boolVal => {
    setIsVisible(boolVal === true)
  }

  const toggleLayerVisibility = (lyrId, isRaster) => {
    if (isRaster) {
      mapInstance.getStyle().layers.forEach(lyr => {
        if (lyr.type === "raster") {
          mapInstance.setLayoutProperty(lyr.id, "visibility", "none")
        }
      })
    }
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
    if (mapInstance) {
      if (checkLayerExists(layerId) && checkLayerTypeSupportsFilter(layerId)) {
        mapInstance.setFilter(layerId, null)
      } else {
        console.error(`Il layer ${layerId} non supporta i filtri o non esiste.`)
      }
    }
    setFilters([])
  }

  const checkLayerExists = layerId => {
    const layers = mapInstance.getStyle().layers
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
    setFilters(mapLibreFilters)

    if (mapInstance) {
      const layerExists = checkLayerExists(activeLayer.id)
      if (layerExists && checkLayerTypeSupportsFilter(activeLayer.id)) {
        mapInstance.setFilter(activeLayer.id, mapLibreFilters)
      } else {
        console.error(
          `Il layer ${activeLayer.id} non supporta i filtri o non esiste.`,
        )
      }
    } else {
      console.error("mapInstance non è definito o la mappa non è pronta.")
    }
  }

  return (
    <StyledControl
      className={`control-panel ${isVisible ? "visible" : "hidden"} border shadow rounded`}
      onMouseEnter={() => toggleVisibility(true)}
      onMouseLeave={() => toggleVisibility(false)}
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
          {mapInstance.getStyle().layers.map(
            (layer, key) =>
              layer.type === "raster" && (
                <div key={key} className="form-check">
                  <label className="form-check-label">
                    <input
                      type="radio"
                      name="base-raster"
                      className="form-check-input"
                      defaultChecked={
                        mapInstance.getLayoutProperty(
                          layer.id,
                          "visibility",
                        ) !== "none"
                      }
                      onChange={() => toggleLayerVisibility(layer.id, "true")}
                    />
                    {layer.metadata.label}
                  </label>
                </div>
              ),
          )}
          {/* Sezione per i source layer */}
          <hr />
          {mapInstance.getStyle().layers.map(
            (layer, k) =>
              layer.metadata &&
              layer.metadata.label &&
              layer.type !== "raster" && (
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
                  {filters.length > 0 ? (
                    <FilterSquareFill
                      className="ms-3"
                      onClick={() => {
                        removeFilter(layer.id)
                      }}
                    />
                  ) : (
                    layer.metadata?.searchInFields && (
                      <FilterSquare
                        className="ms-3"
                        onClick={() => openModal(layer)}
                      />
                    )
                  )}
                </div>
              ),
          )}
        </div>
      )}
      {/* Modal per la ricerca */}
      <Modal show={modalIsOpen} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <Search /> {activeLayer?.metadata.label}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeLayer && (
            <SearchUI fieldList={activeFieldList} processData={processData} />
          )}
        </Modal.Body>
      </Modal>
    </StyledControl>
  )
}

// Styled component per lo stile del Control Panel
// TODO @eicopini: questo controller è aggiunto in maniera brutale alla mappa e infatti non è listato tra i controller
// e va in conflitto se si aggiungono controller in top-right
// testing
// ho provato a mettere un simplecustomcontrol con la classe icontrol e aggiungerlo onload alla mappa,
// ma comunque si sovrappone agli altri controller

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
export default ControlPanel

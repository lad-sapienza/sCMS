import React, { useState } from "react"
import styled from "styled-components"
import { Modal } from "react-bootstrap"
import {
  FilterSquare,
  FilterSquareFill,
  Stack,
  Search,
} from "react-bootstrap-icons"
import SearchUI from "../../search/searchUI.js"
import plain2maplibre from "../../../services/transformers/plain2maplibre.js"

/**
 * LayerControlPanel component
 * Provides a control panel for managing map layers and applying filters.
 *
 * @param {Object} mapInstance - The MapLibre map instance.
 */
const LayerControlPanel = ({ mapInstance }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeLayer, setActiveLayer] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [activeFieldList, setActiveFieldList] = useState(null)
  const [filters, setFilters] = useState([])

  /**
   * Toggles the visibility of the control panel.
   *
   * @param {boolean} boolVal - Whether the control panel should be visible.
   */
  const toggleVisibility = boolVal => {
    setIsVisible(boolVal === true)
  }

  /**
   * Toggles the visibility of a map layer.
   *
   * @param {string} lyrId - The ID of the layer to toggle.
   * @param {boolean} isRaster - Whether the layer is a raster layer.
   */
  const toggleLayerVisibility = (lyrId, isRaster) => {
    if (isRaster) {
      mapInstance.getStyle().layers.forEach(lyr => {
        if (lyr.type === "raster") {
          mapInstance.getMap().setLayoutProperty(lyr.id, "visibility", "none")
        }
      })
    }
    const isVisible =
      mapInstance.getLayoutProperty(lyrId, "visibility") !== "none"
    mapInstance.getMap().setLayoutProperty(
      lyrId,
      "visibility",
      isVisible ? "none" : "visible",
    )
  }

  /**
   * Opens the modal for applying filters to a layer.
   *
   * @param {Object} layer - The layer to apply filters to.
   */
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

  /**
   * Closes the modal for applying filters to a layer.
   */
  const closeModal = () => {
    setModalIsOpen(false)
    setActiveLayer(null)
  }

  /**
   * Removes the filter from a layer.
   *
   * @param {string} layerId - The ID of the layer to remove the filter from.
   */
  const removeFilter = layerId => {
    if (mapInstance) {
      if (!checkLayerExists(layerId)) {
        console.error(`Layer ${layerId} does not exist.`)
      } else if (!checkLayerTypeSupportsFilter(layerId)) {
        console.error(`Layer ${layerId} does not support filters.`)
      } else {
        mapInstance.getMap().setFilter(layerId, null)
      }
    }
    setFilters([])
  }

  /**
   * Checks if a layer exists in the map.
   *
   * @param {string} layerId - The ID of the layer to check.
   * @returns {boolean} - Whether the layer exists.
   */
  const checkLayerExists = layerId => {
    const layers = mapInstance.getStyle().layers
    return layers.some(layer => layer.id === layerId)
  }

  /**
   * Checks if a layer type supports filters.
   *
   * @param {string} layerId - The ID of the layer to check.
   * @returns {boolean} - Whether the layer type supports filters.
   */
  const checkLayerTypeSupportsFilter = layerId => {
    const layer = mapInstance.getLayer(layerId)
    return (
      layer &&
      (layer.type === "fill" ||
        layer.type === "line" ||
        layer.type === "circle" ||
        layer.type === "symbol")
    )
  }

  /**
   * Processes the data and applies filters to the active layer.
   *
   * @param {string} conn - The logical connector (_and or _or) for the filter.
   * @param {Array} inputs - The array of filter inputs.
   */
  const processData = (conn, inputs) => {
    const mapLibreFilters = plain2maplibre(conn, inputs)
    setFilters(mapLibreFilters)

    if (mapInstance) {
      if (!checkLayerExists(activeLayer.id)) {
        console.error(`Layer ${activeLayer.id} does not exist.`)
      } else if (!checkLayerTypeSupportsFilter(activeLayer.id)) {
        console.error(`Layer ${activeLayer.id} does not support filters.`)
      } else {
        mapInstance.getMap().setFilter(activeLayer.id, mapLibreFilters)
      }
    } else {
      console.error("mapInstance is not defined or the map is not ready.")
    }
  }

  return (
    <StyledControl
      className={`control-panel ${isVisible ? "visible" : "hidden"} p-2`}
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
                      onChange={() => toggleLayerVisibility(layer.id, true)}
                    />
                    {layer.metadata.label}
                  </label>
                </div>
              ),
          )}

          {mapInstance.getStyle().layers.filter(l => l.type === "raster")
            .length > 0 &&
            mapInstance.getStyle().layers.filter(l => l.type !== "raster")
              .length > 0 && <hr />}

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
                  {/* Show search icon only if `searchInFields` is defined */}
                  {filters.length > 0 ? (
                    <FilterSquareFill
                      className="ms-3"
                      onClick={() => {
                        removeFilter(layer.id)
                      }}
                    />
                  ) : (
                    layer.metadata?.searchInFields && Object.keys(layer.metadata.searchInFields).length > 0 && (
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
      {/* Modal for search */}
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

/**
 * StyledControl component
 * Provides styling for the control panel.
 */
const StyledControl = styled.div`
  max-height: 300px;
  overflow-y: auto;
`

export default LayerControlPanel

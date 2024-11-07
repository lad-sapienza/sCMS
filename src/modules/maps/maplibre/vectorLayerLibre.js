import React, { useState, useEffect, useCallback } from "react"
import { Source, Layer, useMap } from "react-map-gl/maplibre"
import PropTypes from "prop-types"
import * as bbox from "geojson-bbox"
import getDataFromSource from "../../../services/getDataFromSource" // Importa la tua funzione getData
import sourcePropTypes from "../../../services/sourcePropTypes"

const VectorLayerLibre = ({
  source,
  refId,
  style,
  name,
  searchInFields,
  fitToContent,
  checked,
  popupTemplate,
}) => {
  const [geojsonData, setGeojson] = useState(null)
  const [error, setError] = useState(false)
  const { current: mapRef } = useMap()

  if (typeof style === "undefined") {
    style = {}
  }

  if (typeof style.metadata === "undefined") {
    style.metadata = {}
  }

  if (name) {
    style.metadata.label = name
  }

  if (searchInFields) {
    style.metadata.searchInFields = searchInFields
  }

  if (popupTemplate) {
    style.metadata.popupTemplate = popupTemplate
  }

  if (checked === false) {
    if (typeof style.layout === "undefined") {
      style.layout = {}
    }
    style.layout.visibility = "none"
  }

  // Funzione per sovrascrivere lo stile di un layer, memorizzata con `useCallback`
  const updateLayerStyle = useCallback(() => {
    if (mapRef) {
      const mapInstance = mapRef.getMap()

      // Applica `styledata` per assicurarsi che le modifiche avvengano dopo il caricamento dello stile
      mapInstance.on("styledata", () => {
        const layer = mapInstance.getLayer(refId)
        if (layer) {
          // Aggiorna le proprietà layout e paint, se definite
          if (style.layout) {
            Object.keys(style.layout).forEach(key => {
              mapInstance.setLayoutProperty(refId, key, style.layout[key])
            })
          }
          if (style.paint) {
            Object.keys(style.paint).forEach(key => {
              mapInstance.setPaintProperty(refId, key, style.paint[key])
            })
          }

          // Aggiorna direttamente i metadati
          layer.metadata = {
            ...layer.metadata,
            label: name,
            searchInFields: searchInFields,
            popupTemplate: popupTemplate,
          }
        }
      })
    }
  }, [mapRef, style, refId, searchInFields, name, popupTemplate])

  const fitLayerToBounds = useCallback(() => {
    if (mapRef && geojsonData && fitToContent) {
      const mapInstance = mapRef.getMap()
      const [minLng, minLat, maxLng, maxLat] = bbox(geojsonData)
      mapInstance.fitBounds([
        [minLng, minLat],
        [maxLng, maxLat],
      ])
    }
  }, [mapRef, geojsonData, fitToContent])

  useEffect(() => {
    if (mapRef) {
      updateLayerStyle()
      fitLayerToBounds()
    }
  }, [mapRef, updateLayerStyle, fitLayerToBounds])

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        source.transType = "geojson"
        const geoJSON = await getDataFromSource(source)
        setGeojson(geoJSON) // Imposta i dati geoJSON originali
      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err)
        setError("Errore nel caricamento dei dati")
      }
    }
    if (!refId) {
      fetchGeoData() // Carica i dati quando il componente è montato
    }
  }, [refId, source])

  if (error) {
    return <div>{error}</div>
  } else if (!geojsonData) {
    return <div>Caricamento dati...</div>
  } else {
    return (
      <div>
        {/* Mostra il Source solo se ci sono dati GeoJSON */}
        <Source type="geojson" data={geojsonData}>
          <Layer {...style} />
        </Source>
      </div>
    )
  }
}

VectorLayerLibre.propTypes = {
  source: sourcePropTypes,

  /**
   * Layer name to use in the Layer control
   * Required
   */
  name: PropTypes.string.isRequired,
  /**
   * A string containing the html to render in the popup. Variable props can be injected using ${field_name} syntax
   * Optional
   */
  popupTemplate: PropTypes.string,
  /**
   * A string containing a template to use for the rendering of the pop up.
   * Variables can be included ussing the ${fieldname} syntax
   */
  pointToLayer: PropTypes.func,
  /**
   * If true, the layer will be shown (tuned on).
   */
  checked: PropTypes.bool,
  /**
   * If true, the map will be zoomed and panned to show full extents of the layer added
   */
  fitToContent: PropTypes.bool,
  /**
   * Style object relative to layer
   * For the complete documentation see: https://maplibre.org/maplibre-style-spec/layers/
   */
  style: PropTypes.object,
  /**
   * Array containing field that will be exposed to the search interface
   * If missing the layer will NOT be searcheable
   */
  searchInFields: PropTypes.object,
  /**
   * String containinf the id of the referenced layer in styles.json that is being expanded
   */
  refId: PropTypes.string,
}

export { VectorLayerLibre }

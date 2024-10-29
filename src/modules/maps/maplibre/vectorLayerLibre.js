import React, { useState, useEffect, useCallback } from "react"
import { Source, Layer, useMap } from "react-map-gl/maplibre"
import PropTypes from "prop-types"
import * as bbox from "geojson-bbox"
import getData from "../../../services/getData" // Importa la tua funzione getData

const VectorLayerLibre = ({
  refId,
  path2data,
  dEndPoint,
  dTable,
  dToken,
  dQueryString,
  geoField,
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
    style.metadata.popupTemplate = popupTemplate.toString()
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
      mapInstance.on("styledata", () => {
        const styleData = mapInstance.getStyle()

        // Trova e modifica direttamente il layer nel JSON dello stile usando il `refId`
        const layer = styleData.layers.find(layer => layer.id === refId)

        if (layer) {
          // Sovrascrivi direttamente le proprietà del layer
          Object.assign(layer, style)
          mapInstance.setStyle(styleData)
        }
      })
    }
  }, [mapRef, style, refId])

  const fitLayerToBounds = useCallback(() => {
    if (mapRef && geojsonData && fitToContent) {
      const mapInstance = mapRef.getMap()
      const [minLng, minLat, maxLng, maxLat] = bbox(geojsonData)
      
      mapInstance.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 20 },
      )
    }
  }, [mapRef, geojsonData, fitToContent])

  // Funzione per ottenere i dati da getData
  useEffect(() => {
    if (mapRef) {
      updateLayerStyle()
      fitLayerToBounds()
    }
    const fetchGeoData = async () => {
      try {
        const geoJSON = await getData({
          path2data,
          dEndPoint,
          dTable,
          dToken,
          dQueryString,
          transType: "geojson",
          geoField,
        })
        setGeojson(geoJSON) // Imposta i dati geoJSON originali
      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err)
        setError("Errore nel caricamento dei dati")
      }
    }
    if (!refId){
      fetchGeoData() // Carica i dati quando il componente è montato
    }
    

  }, [refId, mapRef, updateLayerStyle, fitLayerToBounds, path2data, dEndPoint, dTable, dToken, dQueryString, geoField])

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
  /**
   * Path to GeoJSON data: might be a local path or an URL.
   * Required if dEndPoint or dTable are not set
   */
  path2data: PropTypes.string,
  /**
   * Directus endpoint.
   * Required if either dTable (and env GATSBY_DIRECTUS_ENDPOINT) or path2data are not set
   */
  dEndPoint: PropTypes.string,
  /**
   * Directus table name, to be used if env variable GATSBY_DIRECTUS_ENDPOINT is set.
   * Required if neither path2data or dEndPoit are set
   */
  dTable: PropTypes.string,
  /**
   * Directus optional filters and other, provided as querystring compatible to Directus API
   */
  dQueryString: PropTypes.string,
  /**
   * Directus access token.
   * Required if env variable GATSBY_DIRECTUS_TOKEN is not set
   */
  dToken: PropTypes.string,
  /**
   * The property holding geographical cooercnates.
   * Required if data are in JSON format and need to be transformed in GeoJSON
   */
  geoField: PropTypes.string,
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

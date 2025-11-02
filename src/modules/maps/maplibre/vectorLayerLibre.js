import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Source, Layer, useMap } from "@vis.gl/react-maplibre"
import PropTypes from "prop-types"
import * as bbox from "geojson-bbox"
import getDataFromSource from "../../../services/getDataFromSource"
import sourcePropTypes from "../../../services/sourcePropTypes"
import fieldsPropTypes from "../../../services/fieldsPropTypes"
import plain2maplibre from "../../../services/transformers/plain2maplibre"

// Simple in-memory cache and ownership registry shared across component instances
const __vectorSourceCache = new Map() // key -> {promise, data}
const __sourceOwners = new Map() // key -> true if a component claimed ownership

/**
 * VectorLayerLibre component renders a vector layer on a map using GeoJSON data.
 * It manages the layer's style, visibility, and data fetching.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.source - Data source for the GeoJSON
 * @param {string} props.name - Name of the layer
 * @param {string} props.popupTemplate - Template for popups
 * @param {boolean} props.checked - Whether the layer is checked/visible
 * @param {boolean} props.fitToContent - Whether to fit the map to the content
 * @param {Object} props.style - Style configuration for the layer
 * @param {Array} props.searchInFields - Fields to search in
 * @param {Array} props.filter - Fields to search in
 * @returns {JSX.Element} Rendered component
 */
const VectorLayerLibre = ({
  source,
  style = {},
  name,
  searchInFields = {},
  fitToContent = false,
  checked = true,
  popupTemplate = '',
  filter = null,
}) => {
  // State to hold GeoJSON data and error messages
  const [geojsonData, setGeojson] = useState(null)
  const [error, setError] = useState(null)
  const { current: mapRef } = useMap()
  const [isSourceOwner, setIsSourceOwner] = useState(false)

  // Create a new style object with updated metadata to avoid mutating props
  const styleWithMetadata = {
    ...style,
    metadata: {
      ...style.metadata,
      label: name,
      searchInFields,
      popupTemplate,
    },
  }

  // Compute a deterministic source id based on the provided source configuration
  const sourceId = useMemo(() => {
    try {
      // Include the layer name in the key so multiple instances using the same
      // inline geojson don't collide on source id ownership.
      const sourceKeyPart = source?.path2data?.path || JSON.stringify(source) || "unknown"
      const key = `${name}::${sourceKeyPart}`
      // Simple djb2 hash to create a compact, deterministic id
      let h = 5381
      for (let i = 0; i < key.length; i++) {
        h = (h << 5) + h + key.charCodeAt(i)
      }
      const hash = (h >>> 0).toString(36)
      return `src-${hash}`
    } catch (e) {
      return "src-fallback"
    }
  }, [name, source])

  // Side effect: set filter and visibility on map when dependencies change
  useEffect(() => {
    if (!mapRef) return
    const mapInstance = mapRef.getMap()
    const layer = mapInstance.getLayer(style.id)
    if (!layer) return // Only proceed if the layer exists

    // Set filter if provided
    if (filter) {
      const mapLIbreFilter = plain2maplibre(filter.conn, filter.inputs)
      mapInstance.setFilter(style.id, mapLIbreFilter)
    }
    // Set visibility based on checked prop
    if (checked === false) {
      mapInstance.setLayoutProperty(style.id, 'visibility', 'none')
    } else {
      mapInstance.setLayoutProperty(style.id, 'visibility', 'visible')
    }
  }, [mapRef, filter, checked, style.id])

  /**
   * Updates the layer style on the map when the style or map reference changes.
   */
  const updateLayerStyle = useCallback(() => {
    if (!mapRef) return

    const mapInstance = mapRef.getMap()

    // Applica `styledata` per assicurarsi che le modifiche avvengano dopo il caricamento dello stile
    mapInstance.on("styledata", () => {
      const layer = mapInstance.getLayer(style.id)
      if (layer) {
        // Update layout properties if defined
        if (style.layout) {
          Object.keys(style.layout).forEach(key => {
            mapInstance.getMap().setLayoutProperty(style.id, key, style.layout[key])
          })
        }
        // Update paint properties if defined
        if (style.paint) {
          Object.keys(style.paint).forEach(key => {
            mapInstance.setPaintProperty(style.id, key, style.paint[key])
          })
        }

        // Update layer metadata
        layer.metadata = {
          ...layer.metadata,
          ...style.metadata,
        }
      }
    })
  }, [mapRef, style])

  /**
   * Fits the map view to the bounds of the GeoJSON data.
   */
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

  // Effect to update layer style and fit bounds when the map reference changes
  useEffect(() => {
    if (mapRef) {
      updateLayerStyle()
      fitLayerToBounds()
    }
  }, [mapRef, updateLayerStyle, fitLayerToBounds])

  // Effect to fetch GeoJSON data using a shared cache to prevent duplicate requests
  useEffect(() => {
    let cancelled = false
    const fetchGeoData = async () => {
      try {
        const cacheKey = sourceId
        const cached = __vectorSourceCache.get(cacheKey)
        if (cached?.data) {
          if (!cancelled) setGeojson(cached.data)
          return
        }
        if (cached?.promise) {
          const data = await cached.promise
          if (!cancelled) setGeojson(data)
          return
        }
        const promise = getDataFromSource(source)
          .then(data => {
            __vectorSourceCache.set(cacheKey, { promise, data })
            return data
          })
          .catch(err => {
            __vectorSourceCache.delete(cacheKey)
            throw err
          })
        __vectorSourceCache.set(cacheKey, { promise })
        const data = await promise
        if (!cancelled) setGeojson(data)
      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err)
        if (!cancelled) setError("Errore nel caricamento dei dati")
      }
    }
    if (source) {
      fetchGeoData()
    }
    return () => {
      cancelled = true
    }
  }, [sourceId, source])

  // Keep the shared source data in sync if it already exists on the map
  useEffect(() => {
    if (!mapRef || !geojsonData) return
    const mapInstance = mapRef.getMap()
    const src = mapInstance.getSource(sourceId)
    if (src && typeof src.setData === "function") {
      try {
        src.setData(geojsonData)
      } catch (e) {
        // Ignore transient errors on style reloads
      }
    }
  }, [mapRef, geojsonData, sourceId])

  // Determine a single owner per sourceId to avoid mounting multiple <Source/> components
  useEffect(() => {
    if (!sourceId) return
    if (!__sourceOwners.has(sourceId)) {
      __sourceOwners.set(sourceId, true)
      setIsSourceOwner(true)
    }
    return () => {
      if (isSourceOwner) {
        __sourceOwners.delete(sourceId)
      }
    }
  }, [sourceId, isSourceOwner])

  // Render error message if there's an error
  if (error) {
    return <div>{error}</div>
  }

  // Render loading message if GeoJSON data is not yet available
  if (!geojsonData) {
    return <div>Caricamento dati...</div>
  }

  // Render the Source and Layer components with the GeoJSON data
  return (
    <div>
      {/* Render a shared Source only by the owning component to avoid race conditions */}
      {isSourceOwner && geojsonData && (
        <Source id={sourceId} type="geojson" data={geojsonData} />
      )}
      <Layer {...styleWithMetadata} source={sourceId} />
    </div>
  )
}

// PropTypes for type checking and documentation
VectorLayerLibre.propTypes = {
  /**
   * Object with information to source data
   */
  source: sourcePropTypes,
  /**
   * Layer name to use in the Layer control
   * Required
   */
  name: PropTypes.string.isRequired,
  /**
   * The template for the popup content. It is a string and variable properties can be used using ${field_name} syntax
   */
  popupTemplate: PropTypes.string,
  /**
   * If true, the layer will be shown (turned on). Optional, default: true
   */
  checked: PropTypes.bool,
  /**
   * If true, the map will be zoomed and panned to show full extents of the layer added. Optional, default: false
   */
  fitToContent: PropTypes.bool,
  /**
   * Style object relative to layer. Optional, default: {}
   * For the complete documentation see: https://maplibre.org/maplibre-style-spec/layers/
   */
  style: PropTypes.object,
  /**
   * List of fields that will be exposed to the search interface. Optional
   * If missing the layer will NOT be searchable
   */
  searchInFields: fieldsPropTypes,
  /**
   * Filter Array to apply to the layer. Optional
   */
  filter: PropTypes.any,
}

export { VectorLayerLibre }

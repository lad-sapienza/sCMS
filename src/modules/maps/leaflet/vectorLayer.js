import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { GeoJSON, LayersControl, useMap } from "react-leaflet"
import * as bbox from "geojson-bbox"

import getDataFromSource from "../../../services/getDataFromSource"
import parseStringTemplate from "../../../services/parseStringTemplate"
import sourcePropTypes from "../../../services/sourcePropTypes"

const VectorLayer = ({
  source,
  name,
  popupTemplate = null,
  pointToLayer = null,
  filter = null,
  checked = true,
  fitToContent = false,
}) => {
  const [geojsonData, setGeojson] = useState()
  const [error, setError] = useState(false)
  const map = useMap()


  useEffect(() => {
    getDataFromSource(source)
      .then(geoJSON => {
        setGeojson(geoJSON)
      })
      .catch(err => {
        console.log(err)
        setError("Error getting data")
      })
  }, [source])

  useEffect(() => {
    if (fitToContent && geojsonData) {
      const lBb = bbox(geojsonData)
      map.fitBounds([
        [lBb[1], lBb[0]],
        [lBb[3], lBb[2]],
      ])
    }
  }, [fitToContent, geojsonData, map])

  if (error) {
    console.log(error)
    return <div className="text-danger">Error in rendering the map: {error}</div>
  } else if (!geojsonData) {
    return <div>Loading map data...</div>
  }

  // Extract popupTemplate logic
  const getOnEachFeature = () => {
    if (!popupTemplate) return null
    if (typeof popupTemplate === "string") {
      return (feature, layer) =>
        layer.bindPopup(parseStringTemplate(popupTemplate, feature.properties))
    }
    if (typeof popupTemplate === "function") {
      return (feature, layer) =>
        layer.bindPopup(popupTemplate(feature.properties))
    }
    return null
  }

  return (
    <LayersControl.Overlay name={name} checked={checked}>
      <GeoJSON
        data={geojsonData}
        pointToLayer={pointToLayer || null}
        onEachFeature={getOnEachFeature()}
        filter={filter || null}
      />
    </LayersControl.Overlay>
  )
}

VectorLayer.propTypes = {
  /**
   * Object with information to source data
   */
  source: sourcePropTypes.isRequired,
  /**
   * Layer name to use in the Layer control
   * Required
   */
  name: PropTypes.string.isRequired,
  /**
   * The template for the popup content. It can be either a string (Variable properties can be used using ${field_name} syntax, limited to whitelisted fields only) or a function receiving as parameters the properties of the clicked feature. The function must return either a string or a valid React node.
   */
  popupTemplate: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * A function defining how GeoJSON points spawn Leaflet layers. It is internally called when data is added, passing the GeoJSON point feature and its LatLng as properties. The default is to spawn a default Marker.
   * Full reference at https://leafletjs.com/reference.html#geojson-pointtolayer
   * Ref: https://leafletjs.com/reference.html#geojson-pointtolayer
   * Optional, default: null
   */
  pointToLayer: PropTypes.func,
  /**
   * A function that will be used to decide whether to include a feature or not in the current visualisation. The default is to include all features (no filter applied)
   * Optional, default: null
   */
  filter: PropTypes.func,
  /**
   * Boolean property to control the layer's default visibility in the map and control panel
   * Optional, default: true
   */
  checked: PropTypes.bool,
  /**
   * Boolean property to decide whether to zoom/pan the map to fit the layer extent or not
   * Optional, default: false
   */
  fitToContent: PropTypes.bool,
}

export { VectorLayer }

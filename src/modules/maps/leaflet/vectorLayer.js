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
  popupTemplate,
  pointToLayer,
  filter,
  checked,
  fitToContent,
}) => {
  const [geojsonData, setGeojson] = useState()
  const [error, setError] = useState(false)
  const map = useMap()

  source.transType = "geojson"

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

  if (error) {
    console.log(error)
    return <div className="text-danger">Error in rendering the map</div>
  } else if (!geojsonData) {
    return <div className="text-danger">Error in rendering the map</div>
  } else {
    if (fitToContent) {
      const lBb = bbox(geojsonData)
      map.fitBounds([
        [lBb[1], lBb[0]],
        [lBb[3], lBb[2]],
      ])
    }

    return (
      <LayersControl.Overlay name={name} checked={checked}>
        <GeoJSON
          data={geojsonData}
          pointToLayer={pointToLayer ? pointToLayer : null}
          onEachFeature={
            popupTemplate
              ? (feature, layer) =>
                  layer.bindPopup(
                    parseStringTemplate(popupTemplate, feature.properties),
                  )
              : null
          }
          filter={filter ? filter : null}
        />
      </LayersControl.Overlay>
    )
  }
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
   * A string containing the HTML to render in the popup. Variable propertirs can be used using ${field_name} syntax
   * Optional, default: null
   */
  popupTemplate: PropTypes.string,
  /**
   * A function defining how GeoJSON points spawn Leaflet layers. It is internally called when data is added, passing the GeoJSON point feature and its LatLng as properties. The default is to spawn a default Marker.
   * Full reference at https://leafletjs.com/reference.html#geojson-pointtolayer
   * Ref: https://leafletjs.com/reference.html#geojson-pointtolayer
   * Optional, default: null
   */
  pointToLayer: PropTypes.func,
  /**
   * A function that will be used to decide whether to include a feature or not in the current visualisation. The default is to include all features (no filter applied)
   * Optinal, default: null
   */
  filter: PropTypes.func,
  /**
   * Boolean property to control the layer's default visibility ion the map and control panel
   * Optional, default: true
   */
  checked: PropTypes.bool,
  /**
   * Boolean property to decide wether to zoom/pan the map to fit the layer extention or not
   * Optional, default: false
   */
  fitToContent: PropTypes.bool,
}
export { VectorLayer }

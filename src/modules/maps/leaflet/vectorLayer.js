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
                  layer.bindPopup( parseStringTemplate(popupTemplate, feature.properties))
              : null
          }
          filter={filter ? filter : null}
        />
      </LayersControl.Overlay>
    )
  }
}

VectorLayer.propTypes = {

  source: sourcePropTypes.isRequired,
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
   * A Function defining how GeoJSON points spawn Leaflet layers. It is internally called when data is added, passing the GeoJSON point feature and its LatLng. The default is to spawn a default Marker:
   * Ref: https://leafletjs.com/reference.html#geojson-pointtolayer
   */
  pointToLayer: PropTypes.func,
  /**
   * A Function that will be used to decide whether to include a feature or not. The default is to include all features
   * Default: null
   */
  filter: PropTypes.func,
  /**
   * If true, the layer will be shown (tuned on).
   */
  checked: PropTypes.bool,
  /**
   * If true, the map will be zoomed and panned to show full extents of the layer added
   */
  fitToContent: PropTypes.bool,
}
export { VectorLayer }

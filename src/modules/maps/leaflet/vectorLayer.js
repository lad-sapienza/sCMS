import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { GeoJSON, LayersControl, useMap } from "react-leaflet"
import * as bbox from "geojson-bbox"

import getData from "../../../services/getData"

const VectorLayer = ({
  path2data,
  dEndPoint,
  dTable,
  geoField,
  dQueryString,
  dToken,
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

  useEffect(() => {
    getData({
      path2data: path2data,
      dTable: dTable,
      dEndPoint: dEndPoint,
      dToken: dToken,
      dQueryString: dQueryString,
      transType: "geojson",
      geoField: geoField,
    })
      .then(geoJSON => {
        setGeojson(geoJSON)
      })
      .catch(err => {
        console.log(err)
        setError("Error getting data")
      })
  }, [path2data, dEndPoint, dTable, dQueryString, dToken, geoField])

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
                  layer.bindPopup(popupTemplate(feature.properties))
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
   * A function that takes as parameters the clicked feature and layer and returns an HTML string to show as content of the popup
   * Optional
   */
  popupTemplate: PropTypes.func,
  /**
   * A Function defining how GeoJSON points spawn Leaflet layers. It is internally called when data is added, passing the GeoJSON point feature and its LatLng. The default is to spawn a default Marker:
   * Ref: https://leafletjs.com/reference.html#geojson-pointtolayer
   */
  pointToLayer: PropTypes.func,
  /**
   * A Function that will be used to decide whether to include a feature or not. The default is to include all features
   * Default: null
   */
  filter: PropTypes.string,
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

import React, { useState, useEffect } from "react"
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

export { VectorLayer }

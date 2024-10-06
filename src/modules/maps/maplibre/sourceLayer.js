import React, { useState, useEffect } from "react"
import { Source, Layer, useMap } from "react-map-gl/maplibre"
import * as bbox from "geojson-bbox"

import getData from "../../../services/getData"

const SourceLayer = ({
  id,
  type,
  path2data,
  dEndPoint,
  dTable,
  dQueryString,
  dToken,
  fitToContent,
  geoField,
  layerstyle,
}) => {
  const [geojsonData, setGeojson] = useState()
  const [error, setError] = useState(false)
  const map = useMap()

  useEffect(() => {
    getData({
      path2data: path2data,
      dEndPoint: dEndPoint,
      dTable: dTable,
      dToken: dToken,
      dQueryString: dQueryString,
      transType: "geojson",
      geoField: geoField
    }).then(geoJSON => {
      setGeojson(geoJSON)
    }).catch(err => {
      console.log(err)
      setError("Error getting data")
    });
  }, [path2data, dEndPoint, dTable, dToken, geoField, dQueryString])

  if (error) {
    console.log(error)
    return <></>
  } else if (!geojsonData) {
    return <></>
  } else {
    if (fitToContent) {
      const lBb = bbox(geojsonData)
      map.fitBounds([
        [lBb[1], lBb[0]],
        [lBb[3], lBb[2]],
      ])
    }
    return (
      <>
        <Source id={id} type={type} data={geojsonData}>
          <Layer {...layerstyle} />
        </Source>
      </>
    )
  }
}

export { SourceLayer }

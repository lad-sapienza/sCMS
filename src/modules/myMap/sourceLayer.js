import React, { useState, useEffect } from "react"
import { Source, Layer, useMap } from "react-map-gl/maplibre"
import * as bbox from "geojson-bbox"

import getData from "../../services/getData"

const SourceLayer = ({
  id,
  type,
  path2geojson,
  dEndPoint,
  dTable,
  dFilter,
  dToken,
  filter,
  fitToContent,
  geoField,
  layerstyle,
  searchTerm, // Aggiungi searchTerm come props
}) => {
  const [geojsonData, setGeojson] = useState()
  const [filteredData, setFilteredData] = useState(null)
  const [error, setError] = useState(false)
  const map = useMap()

  useEffect(() => {
    if (path2geojson) {
      getData(path2geojson, null, "json")
        .then(geoJSON => {
          setGeojson(geoJSON)
        })
        .catch(err => {
          console.log(err)
          setError("Error getting remote data from static file")
        })
    } else {
      // Define Directus endpoint anche check all dependencies
      let endPoint
      if (dEndPoint) {
        endPoint = dEndPoint
      } else if (dTable) {
        if (!process.env.GATSBY_DIRECTUS_ENDPOINT) {
          setError(
            "Cannot calculate API end-point. Parameter dTable requires the enc variable GATSBY_DIRECTUS_ENDPOINT to be set"
          )
          return
        }
        endPoint = `${process.env.GATSBY_DIRECTUS_ENDPOINT}items/${dTable}`
      } else {
        setError(
          "Cannont calculate Directus enpoint. Please provide a full endpoint as a MyMap attribute or provide dTable attribute and set GATSBY_DIRECTUS_ENDPOINT environmental variable"
        )
        return
      }
      if (dFilter) {
        endPoint += `?${dFilter}`
      }
      // Define Directus token
      const token = dToken ? dToken : process.env.GATSBY_DIRECTUS_TOKEN
      if (!token) {
        setError(
          "Cannot calculate Directus token. Please provide it as an attribute of the MyMap component or define it as the environmnetal variable GATSBY_DIRECTUS_TOKEN"
        )
        return
      }
      getData(endPoint, token, "geojson", geoField)
        .then(geoJSON => {
          setGeojson(geoJSON)
        })
        .catch(err => {
          console.log(err)
          setError("Error getting remote data")
        })
    }
  }, [path2geojson, dEndPoint, dTable, dFilter, dToken, geoField]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  // Filtra i dati in base a searchTerm
  useEffect(() => {
    if (geojsonData) {
      const lowerCaseTerm = searchTerm ? searchTerm.toLowerCase() : ""
      const filteredFeatures = geojsonData.features.filter(feature => {
        return Object.values(feature.properties).some(prop =>
          String(prop).toLowerCase().includes(lowerCaseTerm)
        )
      })

      setFilteredData({
        ...geojsonData,
        features: filteredFeatures,
      })
    }
  }, [geojsonData, searchTerm])

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
        <Source id={id} type={type} data={filteredData || geojsonData}>
          <Layer {...layerstyle} />
        </Source>
      </>
    )
  }
}

export { SourceLayer }

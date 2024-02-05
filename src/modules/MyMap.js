import React, { useState, useEffect, Fragment } from "react"
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet"
import bbox from "geojson-bbox"

import getData from "../services/getData"

const MyMap = ({
  path2geojson,
  dEndPoint,
  dTable,
  dFilter,
  dToken,
  height,
  name,
  popupTemplate,
  baseMaps,
}) => {
  const [geojsonData, setGeojson] = useState()
  const [extent, setExtent] = useState([0, 0, 0, 0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    if (path2geojson) {
      getData(path2geojson, null, "json")
        .then(geoJSON => {
          setGeojson(geoJSON)
          setExtent(bbox(geoJSON))
          setIsLoading(false)
        })
        .catch(err => {
          console.log()
          setError({
            message: "Error getting remote data from static file",
            stack: err,
          })
          setIsLoading(false)
        })
    } else {
      // Define Drectus endpoint anche check all dependencies
      let endPoint
      if (dEndPoint) {
        endPoint = dEndPoint
      } else if (process.env.GATSBY_DIRECTUS_ENDPOINT && dTable) {
        endPoint = `${process.env.GATSBY_DIRECTUS_ENDPOINT}items/${dTable}`
      } else {
        setError({
          message:
            "Cannont calculate Directus enpoint. Please provide a full endpoint as a MyMap attribute or provide dTable attribute and set GATSBY_DIRECTUS_ENDPOINT environmental variable",
        })
        setIsLoading(false)
        return
      }
      if (dFilter) {
        endPoint += `?${dFilter}`
      }
      // Define Directus token
      const token = dToken ? dToken : process.env.GATSBY_DIRECTUS_TOKEN
      if (!token) {
        setError({
          mesage:
            "Cannot calculate Directus token. Please provide it as an attribute of the MyMap component or define it as the environmnetal variable GATSBY_DIRECTUS_TOKEN",
        })
        setIsLoading(false)
        return
      }
      getData(endPoint, token, "geojson")
        .then(geoJSON => {
          setGeojson(geoJSON)
          setExtent(bbox(geoJSON))
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
          setError({ message: "Error getting remote data", stack: err })
        })
    }
  }, [path2geojson, dEndPoint, dTable, dFilter, dToken]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  // Renderizza il componente in base agli stati di isLoading ed errore
  if (isLoading) {
    return <div className="text-info">Loading...</div>
  }

  if (error) {
    return <div className="text-danger">{error.message}</div>
  }

  return (
    <MapContainer
      style={{ height: height ? height : `800px` }}
      scrollWheelZoom={false}
      center={[0, 0]}
      zoom={8}
      whenReady={e => {
        e.target.fitBounds([
          [extent[1], extent[0]],
          [extent[3], extent[2]],
        ])
      }}
    >
      <LayersControl position="topright">
        <LayersControl.Overlay name={name} checked>
          <GeoJSON
            data={geojsonData}
            onEachFeature={(feature, layer) =>
              layer.bindPopup(popupTemplate(feature.properties))
            }
          />
        </LayersControl.Overlay>

        <LayersControl.BaseLayer checked name="Open Street Map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {baseMaps &&
            baseMaps.map((el, i) => {
              return (
                <Fragment key={i}>
                  <LayersControl.BaseLayer checked name={el.name}>
                    <TileLayer attribution={el.attribution} url={el.url} />
                  </LayersControl.BaseLayer>
                </Fragment>
              )
            })}
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  )
}

export default MyMap

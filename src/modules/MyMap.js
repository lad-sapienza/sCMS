import React, { useState, useEffect, Fragment } from "react";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";
import bbox from "geojson-bbox";

import getData from "../services/getData";

const MyMap = props => {
  const [geojsonData, setGeojson] = useState()
  const [extent, setExtent] = useState([0, 0, 0, 0])
  const [isLoading, setIsLoading] = useState(false)
  const [errore, impostaErrore] = useState(false)

  useEffect(() => {
    setIsLoading(true)

    if (props.path2geojson) {
      getData(props.path2geojson, null, 'json')
        .then(geoJSON => {
          setGeojson(geoJSON)
          setExtent(bbox(geoJSON))
          setIsLoading(false)
        })
        .catch(err => {
          console.log()
          impostaErrore({
            message: "Error getting remote data from static file",
            stack: err,
          })
          setIsLoading(false)
        })
    } else {
      // Define Drectus endpoint anche check all dependencies
      let endPoint
      if (props.dEndPoint) {
        endPoint = props.dEndPoint
      } else if (process.env.GATSBY_DIRECTUS_ENDPOINT && props.dTable) {
        endPoint = `${process.env.GATSBY_DIRECTUS_ENDPOINT}items/${props.dTable}`
      } else {
        impostaErrore({
          message:
            "Cannont calculate Directus enpoint. Please provide a full endpoint as a MyMap attribute or provide dTable attribute and set GATSBY_DIRECTUS_ENDPOINT environmental variable",
        })
        setIsLoading(false)
        return
      }
      if (props.dFilter){
        endPoint += `?${props.dFilter}`;
      }
      // Define Directus token
      const token = props.dToken
        ? props.dToken
        : process.env.GATSBY_DIRECTUS_TOKEN
      if (!token) {
        impostaErrore({
          mesage:
            "Cannot calculate Directus token. Please provide it as an attribute of the MyMap component or define it as the environmnetal variable GATSBY_DIRECTUS_TOKEN",
        })
        setIsLoading(false)
        return
      }
      getData(endPoint, token, 'geojson')
        .then(geoJSON => {
          setGeojson(geoJSON)
          setExtent(bbox(geoJSON))
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
          impostaErrore({ message: "Error getting remote data", stack: err })
        });
    }
  }, [props]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  // Renderizza il componente in base agli stati di isLoading ed errore
  if (isLoading) {
    return <div className="text-info">Loading...</div>
  }

  if (errore) {
    console.log(errore);
    return <div className="text-danger">{errore.message}</div>
  }

  return (
    <MapContainer
      style={{ height: props.height ? props.height : `800px` }}
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
        <LayersControl.Overlay name={props.name} checked>
          <GeoJSON
            data={geojsonData}
            onEachFeature={(feature, layer) =>
              layer.bindPopup(props.popupTemplate(feature.properties))
            }
          />
        </LayersControl.Overlay>

        <LayersControl.BaseLayer checked name="Open Street Map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {props.baseMaps &&
            props.baseMaps.map((el, i) => {
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

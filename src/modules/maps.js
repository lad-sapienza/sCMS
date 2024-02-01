import React, { useState, useEffect, Fragment } from "react"
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet"
import bbox from "geojson-bbox"

const Mappa = props => {
  // Client-side Runtime Data Fetching
  // Stato per memorizzare i dati ottenuti dall'API
  // in dati viene salvato il risultato di impostaDati
  const [dati, impostaDati] = useState()
  const [extent, setExtent] = useState([0, 0, 0, 0])
  // Stato per gestire lo stato di caricamento
  const [isLoading, setIsLoading] = useState(false)
  // Stato per gestire lo stato di errore
  const [errore, impostaErrore] = useState(false)

  // Dependency check
  if (!props.path2geojson && !props.dTable) {
    impostaErrore({
      message:
        "Error in building map. No source found for the data: either dTable or path2geojson parameters are required",
    })
  }

  if (props.dTable && !props.dToken) {
    impostaErrore({ message: "Directus token is missing" })
  }

  const getRemoteData = async (dTable, dToken, path2geojson) => {
    try {
      let geoJSON

      if (dTable) {
        const risposta = await fetch(dTable, {
          headers: {
            Authorization: `Bearer ${dToken}`, // Aggiungi il token all'header
          },
        })
        const risultato = await risposta.json()

        geoJSON = {
          type: "FeatureCollection",
          features: risultato.data.map(item => ({
            type: "Feature",
            properties: item,
            geometry: {
              type: "Point",
              coordinates: [
                item.coordinates.coordinates[0], // longitude
                item.coordinates.coordinates[1], // latitude
              ],
            },
          })),
        }
      } else if (path2geojson) {
        const risposta2 = await fetch(path2geojson);
        geoJSON = await risposta2.json();
      }
      // Aggiorna lo stato con i dati ottenuti
      return geoJSON
    } catch (err) {
      throw err
    }
  }

  // useEffect per ottenere dati quando il componente viene montato
  useEffect(() => {
    setIsLoading(true)
    getRemoteData(props.dTable, props.dToken, props.path2geojson)
      .then(geoJSON => {
        impostaDati(geoJSON)
        setExtent(bbox(geoJSON))
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
        impostaErrore({ message: "Error getting remote data", stack: err })
      })
  }, [props]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  // Renderizza il componente in base agli stati di isLoading ed errore
  if (isLoading) {
    return <div className="text-info">Loading...</div>
  }

  if (errore) {
    return <div className="text-danger">{errore.message}</div>
  }

  // Renderizza il componente con i dati ottenuti
  return (
    <MapContainer
      style={{ height: "800px" }}
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
            data={dati}
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

export default Mappa

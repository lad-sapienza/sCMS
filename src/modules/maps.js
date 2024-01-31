import React, { useState, useEffect, Fragment } from "react"
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet"

const Mappa = (props) => {

  // Client-side Runtime Data Fetching
  // Stato per memorizzare i dati ottenuti dall'API
  // in dati viene salvato il risultato di impostaDati
  const [dati, impostaDati] = useState([]);
  // Stato per gestire lo stato di caricamento
  const [isLoading, setIsLoading] = useState(true);
  // Stato per gestire lo stato di errore
  const [errore, impostaErrore] = useState(null);

  // Dependency check
  if (!props.path2geojson && !props.dTable) {
    impostaErrore({"message": "Error in building map. No source found for the data: either dTable or path2geojson parameters are required"});
  }

  if (props.dTable && !props.dToken){
    impostaErrore({"message": "Directus token is missing"});
  }
  if(!props.baseMaps){
    props.baseMaps = [];
  }


  // useEffect per ottenere dati quando il componente viene montato
  useEffect(() => {
    
    const getRemoteData = async () => {
      try {
        // Imposta lo stato di isLoading a true durante il recupero dei dati
        setIsLoading(true)
        // Ottieni i dati dall'API
        const risposta = await fetch(
          props.dTable,
          {
            headers: {
              Authorization: `Bearer ${props.dToken}`, // Aggiungi il token all'header
            },
          }
        )
        // Parsa la risposta JSON
        const risultato = await risposta.json()
        // Aggiorna lo stato con i dati ottenuti
        // Converti i dati in formato GeoJSON
        const geojsonData = {
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

        // Aggiorna lo stato con i dati ottenuti
        impostaDati(geojsonData)
      } catch (errore) {
        // Se si verifica un errore, aggiorna lo stato di errore
        impostaErrore(errore)
      } finally {
        // Imposta lo stato di isLoading a false quando il recupero è completato
        setIsLoading(false)
      }
    }

    if(!errore){
      // Chiama la funzione getRemoteData quando il componente viene montato
      getRemoteData()
    }
  }, [props, errore]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  // Renderizza il componente in base agli stati di isLoading ed errore
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (errore) {
    return <div className="text-danger">{errore.message}</div>
  }

  // Renderizza il componente con i dati ottenuti
  return (
    <MapContainer
      style={{ height: "800px" }}
      // @eiacopini: il centro e zoom può esere calcolato dai dati, forse
      center={[42.977538253858064, 13.35383086262221]}
      zoom={9}
      scrollWheelZoom={false}
    >
      <LayersControl position="topright">

        <LayersControl.Overlay name={props.name} checked>
          <GeoJSON data={dati} onEachFeature={(feature, layer) =>  layer.bindPopup(props.popupTemplate(feature)) } />
        </LayersControl.Overlay>
        
        <LayersControl.BaseLayer checked name="Open Street Map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { props.baseMaps.map( (el, i) => {
            return <Fragment key={i}>
              <LayersControl.BaseLayer checked name={el.name}>
                <TileLayer
                attribution={el.attribution}
                url={el.url}
              />
              </LayersControl.BaseLayer>
            </Fragment>
          })}
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  )
}

export default Mappa

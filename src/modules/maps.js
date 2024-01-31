import React, { useState, useEffect, Fragment } from "react"
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet"
import bbox from "geojson-bbox"

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


  // useEffect per ottenere dati quando il componente viene montato
  useEffect(() => {
    
    // TODO: rendere il codice spra una funziona staccata
    //    aggiungere la funziona che carica il GeoJSON statico
    //    aggiungere qui condizione che esegua l'una o l'altra funzione in base ai props
    const getRemoteData = async () => {
      try {
        // Imposta lo stato di isLoading a true durante il recupero dei dati
        setIsLoading(true)
        
        // Ottieni i dati dall'API
        let geoJSON;

        if (props.dTable){

          const risposta = await fetch(
            props.dTable,
            {
              headers: {
                Authorization: `Bearer ${props.dToken}`, // Aggiungi il token all'header
              },
            }
          )
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
        } else if (props.path2geojson){
          const response = await import("../dati/toponimi.json");
          geoJSON = response.default;
        }

        // Aggiorna lo stato con i dati ottenuti
        impostaDati(geoJSON)
      } catch (err) {
        impostaErrore(err)
      } finally {
        // Imposta lo stato di isLoading a false quando il recupero è completato
        setIsLoading(false)
      }
    }

      // Chiama la funzione getRemoteData quando il componente viene montato
      getRemoteData()
  }, [props]) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  // Renderizza il componente in base agli stati di isLoading ed errore
  if (isLoading) {
    return <div className="text-info">Loading...</div>
  }

  if (errore) {
    return <div className="text-danger">{errore.message}</div>
  }

  const extent = bbox(dati);

  // Renderizza il componente con i dati ottenuti
  return (
    <MapContainer
      style={{ height: "800px" }}
      scrollWheelZoom={false}
      center={[0,0]}
      zoom={8}
      whenReady={ e => {
        e.target.fitBounds([
          [extent[1],extent[0]],
          [extent[3], extent[2]]
        ]);
      }}
    >
      <LayersControl position="topright">

        <LayersControl.Overlay name={props.name} checked>
          <GeoJSON data={dati} onEachFeature={(feature, layer) => layer.bindPopup(props.popupTemplate(feature)) } />
        </LayersControl.Overlay>
        
        <LayersControl.BaseLayer checked name="Open Street Map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { props.baseMaps && props.baseMaps.map( (el, i) => {
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

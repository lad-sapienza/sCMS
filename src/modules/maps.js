import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"

function onEachFeature(feature, layer) {
  let popupContent =
    "<pre>" + JSON.stringify(feature.properties.toponimo, null, " ") + "</pre>"
  layer.bindPopup(popupContent)
}

const Mappa = () => {
  // Client-side Runtime Data Fetching
  // Stato per memorizzare i dati ottenuti dall'API
  // in dati viene salvato il risultato di impostaDati
  const [dati, impostaDati] = useState([])
  // Stato per gestire lo stato di caricamento
  const [caricamento, impostaCaricamento] = useState(true)
  // Stato per gestire lo stato di errore
  const [errore, impostaErrore] = useState(null)

  // useEffect per ottenere dati quando il componente viene montato
  useEffect(() => {
    const ottieniDati = async () => {
      try {
        // Imposta lo stato di caricamento a true durante il recupero dei dati
        impostaCaricamento(true)
        // Ottieni i dati dall'API
        const risposta = await fetch(
          // @eiacopini: l'URL deve essere parametrizzata
          `https://landscapearchaeology.eu/db/${process.env.GATSBY_DIRECTUS_MAP_ENDPOINT}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GATSBY_DIRECTUS_MAP_TOKEN}`, // Aggiungi il token all'header
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
            properties: {
              id: item.id,
              // Add other properties as needed
              toponimo: item.toponimo,
              provincia: item.provincia,
              comune: item.comune,
              // Add more properties here
            },
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
        // Imposta lo stato di caricamento a false quando il recupero è completato
        impostaCaricamento(false)
      }
    }

    // Chiama la funzione ottieniDati quando il componente viene montato
    ottieniDati()
  }, []) // L'array di dipendenze vuoto assicura che questo effetto venga eseguito solo una volta, simile a componentDidMount

  // Renderizza il componente in base agli stati di caricamento ed errore
  if (caricamento) {
    return <div>Caricamento...</div>
  }

  if (errore) {
    return <div>Errore: {errore.message}</div>
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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={dati} onEachFeature={onEachFeature} />
    </MapContainer>
  )
}

export default Mappa

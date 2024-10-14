import React, { useState, useEffect } from "react"
import { Source, Layer } from "react-map-gl/maplibre"
import getData from "../../../services/getData" // Importa la tua funzione getData

// Funzione per determinare il tipo in base ai dati ricevuti
const determineTypeFromData = data => {
  if (data.type === "FeatureCollection") {
    return "geojson"
  } else if (data.tiles) {
    return "vector"
  } else {
    return "unknown" // Tipo di default se non è riconosciuto
  }
}

const SourceLayer = ({
  path2data,
  dEndPoint,
  dTable,
  dToken,
  dQueryString,
  geoField,
  // TODO @eiacopini anche su questo bisogna fare una riflessione, perché non è molto intuitivo
  layerstyle,
}) => {
  const [geojsonData, setGeojson] = useState(null) // GeoJSON data
  const [type, setType] = useState("geojson") // Valore di default
  const [error, setError] = useState(false)

  // Funzione per ottenere i dati da getData (se non sono nel style.json)
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const geoJSON = await getData({
          path2data,
          dEndPoint,
          dTable,
          dToken,
          dQueryString,
          transType: "geojson",
          geoField,
        })
        const calculatedType = determineTypeFromData(geoJSON) // Calcola il tipo in base ai dati
        setGeojson(geoJSON) // Imposta i dati geoJSON originali
        setType(calculatedType) // Imposta il tipo di layer
        console.log("Dati GeoJSON caricati:", geoJSON)
      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err)
        setError("Errore nel caricamento dei dati")
      }
    }

    fetchGeoData() // Carica i dati quando il componente è montato
  }, [path2data, dEndPoint, dTable, dToken, dQueryString, geoField])

  if (error) {
    return <div>{error}</div>
  } else if (!geojsonData) {
    return <div>Caricamento dati...</div>
  } else {
    return (
      <div>
        {/* Mostra il Source solo se ci sono dati GeoJSON */}
        {geojsonData && (
          <Source type={type} data={geojsonData}>
            <Layer {...layerstyle} />
          </Source>
        )}
      </div>
    )
  }
}

export { SourceLayer }

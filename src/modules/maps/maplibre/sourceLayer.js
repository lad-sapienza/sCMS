import React, { useState, useEffect } from "react"
import { Source, Layer } from "react-map-gl/maplibre"
import getData from "../../../services/getData" // Importa la tua funzione getData

const SourceLayer = ({
  // TODO: @eiacopini deve prendere da utente parametro `name`, da usare per il controlPanel
  // TODO: @eiacopini deve prendere da utente parametro `checked` (bool), da usare per il controlPanel
  // TODO: @eiacopini deve prendere da utente parametro `fitToContent` (bool), da usare per il controlPanel
  path2data,
  dEndPoint,
  dTable,
  dToken,
  dQueryString,
  geoField,
  // TODO @eiacopini rinominarlo `style`
  layerstyle,
}) => {
  const [geojsonData, setGeojson] = useState(null) // GeoJSON data
  const [error, setError] = useState(false)

  // Funzione per ottenere i dati da getData
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

        setGeojson(geoJSON) // Imposta i dati geoJSON originali
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
        <Source type="geojson" data={geojsonData}>
          <Layer {...layerstyle} />
        </Source>
      </div>
    )
  }
}

export { SourceLayer }

import React, { useState, useEffect } from "react"
import { Source, Layer } from "react-map-gl/maplibre"
import getData from "../../../services/getData" // Importa la tua funzione getData

const VectorLayerLibre = ({
  path2data,
  dEndPoint,
  dTable,
  dToken,
  dQueryString,
  geoField,
  style,
  name,
  fieldList,
  fitToContent,
  checked,
  popupTemplate,
}) => {
  const [geojsonData, setGeojson] = useState(null) // GeoJSON data
  const [error, setError] = useState(false)

  if (typeof style === "undefined") {
    style = {}
  }

  if (typeof style.metadata === "undefined") {
    style.metadata = {}
  }

  if (name) {
    style.metadata.label = name
  }

  if (fieldList) {
    style.metadata.fieldList = fieldList
  }

  if (popupTemplate) {
    style.metadata.popupTemplate = popupTemplate.toString()
  }
  
  if (checked === false) {
    if (typeof style.layout === "undefined") {
      style.layout = {}
    }
    style.layout.visibility = "none"
  }

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
          <Layer {...style} />
        </Source>
      </div>
    )
  }
}

export { VectorLayerLibre }
